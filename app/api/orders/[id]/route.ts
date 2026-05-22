import { getDb } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { fail, ok, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OrderRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: OrderRouteProps) {
  const auth = requireUser(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const id = Number((await params).id);
    const order = getDb()
      .prepare("SELECT * FROM orders WHERE id = ? AND (user_id = ? OR ? = 'admin')")
      .get(id, auth.user!.id, auth.user!.role);

    if (!order) {
      return fail("订单不存在", 404);
    }

    const items = getDb().prepare("SELECT * FROM order_items WHERE order_id = ?").all(id);
    const payments = getDb().prepare("SELECT * FROM payments WHERE order_id = ? ORDER BY id DESC").all(id);

    return ok({ order, items, payments });
  } catch (error) {
    return routeError(error);
  }
}
