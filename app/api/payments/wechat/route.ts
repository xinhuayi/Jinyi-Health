import { z } from "zod";
import { getDb } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { created, fail, readJson, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const wechatPaySchema = z.object({
  orderId: z.number().int().positive(),
});

export async function POST(request: Request) {
  const auth = requireUser(request);

  if (auth.response) {
    return auth.response;
  }

  const parsed = await readJson(request, wechatPaySchema);

  if (parsed.error) {
    return parsed.error;
  }

  try {
    const db = getDb();
    const order = db
      .prepare("SELECT * FROM orders WHERE id = ? AND (user_id = ? OR ? = 'admin')")
      .get(parsed.data.orderId, auth.user!.id, auth.user!.role) as
      | { id: number; order_no: string; total_amount: number; payment_status: string }
      | undefined;

    if (!order) {
      return fail("订单不存在", 404);
    }

    if (order.payment_status === "paid") {
      return fail("订单已支付", 409);
    }

    const prepayId = `mock_wechat_${order.order_no}_${Date.now()}`;
    const payload = {
      provider: "wechat",
      mode: "mock",
      message: "这是微信支付占位接口。接入正式商户号后替换为微信支付 V3 下单结果。",
      paymentUrl: `/checkout?order=${order.id}&prepay=${prepayId}`,
    };

    const result = db
      .prepare(
        `
          INSERT INTO payments (order_id, provider, status, prepay_id, amount, payload)
          VALUES (?, 'wechat', 'mock_created', ?, ?, ?)
        `,
      )
      .run(order.id, prepayId, order.total_amount, JSON.stringify(payload));

    return created({
      payment: db.prepare("SELECT * FROM payments WHERE id = ?").get(result.lastInsertRowid),
      wechat: payload,
    });
  } catch (error) {
    return routeError(error);
  }
}
