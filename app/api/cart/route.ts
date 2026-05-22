import { z } from "zod";
import { getDb, mapProduct } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { created, fail, ok, readJson, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99),
});

export async function GET(request: Request) {
  const auth = requireUser(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    return ok({ items: getCartItems(auth.user!.id) });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  const auth = requireUser(request);

  if (auth.response) {
    return auth.response;
  }

  const parsed = await readJson(request, cartItemSchema);

  if (parsed.error) {
    return parsed.error;
  }

  try {
    const product = getDb().prepare("SELECT id FROM products WHERE id = ? AND status = 'active'").get(
      parsed.data.productId,
    );

    if (!product) {
      return fail("商品不存在或已下架", 404);
    }

    getDb()
      .prepare(
        `
          INSERT INTO cart_items (user_id, product_id, quantity)
          VALUES (?, ?, ?)
          ON CONFLICT(user_id, product_id)
          DO UPDATE SET quantity = excluded.quantity, updated_at = CURRENT_TIMESTAMP
        `,
      )
      .run(auth.user!.id, parsed.data.productId, parsed.data.quantity);

    return created({ items: getCartItems(auth.user!.id) });
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request) {
  const auth = requireUser(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (productId) {
      getDb()
        .prepare("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?")
        .run(auth.user!.id, Number(productId));
    } else {
      getDb().prepare("DELETE FROM cart_items WHERE user_id = ?").run(auth.user!.id);
    }

    return ok({ items: getCartItems(auth.user!.id) });
  } catch (error) {
    return routeError(error);
  }
}

function getCartItems(userId: number) {
  const rows = getDb()
    .prepare(
      `
        SELECT cart_items.id as cart_id, cart_items.quantity, products.*
        FROM cart_items
        JOIN products ON products.id = cart_items.product_id
        WHERE cart_items.user_id = ?
        ORDER BY cart_items.id DESC
      `,
    )
    .all(userId) as (Record<string, unknown> & { quantity: number })[];

  return rows.map((row) => ({
    id: row.cart_id,
    quantity: row.quantity,
    product: mapProduct(row),
  }));
}
