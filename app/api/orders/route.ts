import { z } from "zod";
import { getDb } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { created, fail, ok, readJson, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const orderSchema = z.object({
  addressId: z.number().int().positive().optional(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .optional(),
});

type OrderProduct = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export async function GET(request: Request) {
  const auth = requireUser(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const rows = getDb()
      .prepare(
        `
          SELECT * FROM orders
          WHERE user_id = ? OR ? = 'admin'
          ORDER BY id DESC
        `,
      )
      .all(auth.user!.id, auth.user!.role);

    return ok(rows);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  const auth = requireUser(request);

  if (auth.response) {
    return auth.response;
  }

  const parsed = await readJson(request, orderSchema);

  if (parsed.error) {
    return parsed.error;
  }

  try {
    const db = getDb();
    const products = parsed.data.items?.length
      ? resolveRequestedItems(parsed.data.items)
      : resolveCartItems(auth.user!.id);

    if (!products) {
      return fail("订单中存在不存在或已下架的商品", 422);
    }

    if (products.length === 0) {
      return fail("订单至少需要一个商品", 422);
    }

    const address = parsed.data.addressId
      ? (db
          .prepare("SELECT * FROM addresses WHERE id = ? AND user_id = ?")
          .get(parsed.data.addressId, auth.user!.id) as Record<string, unknown> | undefined)
      : null;

    if (parsed.data.addressId && !address) {
      return fail("收货地址不存在", 404);
    }

    const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNo = `JY${Date.now()}${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;

    const createOrder = db.transaction(() => {
      const orderResult = db
        .prepare(
          `
            INSERT INTO orders (order_no, user_id, address_id, total_amount, receiver_snapshot)
            VALUES (?, ?, ?, ?, ?)
          `,
        )
        .run(orderNo, auth.user!.id, parsed.data.addressId ?? null, totalAmount, JSON.stringify(address ?? {}));

      const orderId = Number(orderResult.lastInsertRowid);
      const insertItem = db.prepare(
        `
          INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
      );

      for (const item of products) {
        insertItem.run(orderId, item.id, item.name, item.price, item.quantity, item.price * item.quantity);
      }

      if (!parsed.data.items?.length) {
        db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(auth.user!.id);
      }

      return orderId;
    });

    const orderId = createOrder();
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
    const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(orderId);

    return created({ order, items });
  } catch (error) {
    return routeError(error);
  }
}

function resolveRequestedItems(items: { productId: number; quantity: number }[]) {
  const db = getDb();
  const resolved: OrderProduct[] = [];

  for (const item of items) {
    const product = db
      .prepare("SELECT id, name, price FROM products WHERE id = ? AND status = 'active'")
      .get(item.productId) as Omit<OrderProduct, "quantity"> | undefined;

    if (!product) {
      return null;
    }

    resolved.push({ ...product, quantity: item.quantity });
  }

  return resolved;
}

function resolveCartItems(userId: number) {
  return getDb()
    .prepare(
      `
        SELECT products.id, products.name, products.price, cart_items.quantity
        FROM cart_items
        JOIN products ON products.id = cart_items.product_id
        WHERE cart_items.user_id = ? AND products.status = 'active'
      `,
    )
    .all(userId) as OrderProduct[];
}
