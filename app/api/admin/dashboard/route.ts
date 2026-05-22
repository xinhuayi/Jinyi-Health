import { getDb } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/auth";
import { ok, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = requireAdmin(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const db = getDb();
    const metrics = {
      todayOrders: scalar("SELECT COUNT(*) FROM orders WHERE date(created_at) = date('now')"),
      pendingShipment: scalar("SELECT COUNT(*) FROM orders WHERE status = 'paid'"),
      productCount: scalar("SELECT COUNT(*) FROM products WHERE status != 'archived'"),
      pendingDocuments: scalar("SELECT COUNT(*) FROM products") * 3 - scalar("SELECT COUNT(*) FROM compliance_documents"),
      users: scalar("SELECT COUNT(*) FROM users WHERE role = 'customer'"),
      revenue: scalar("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'paid'"),
    };
    const recentOrders = db.prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 8").all();
    const recentDocuments = db.prepare("SELECT * FROM compliance_documents ORDER BY id DESC LIMIT 8").all();

    return ok({ metrics, recentOrders, recentDocuments });
  } catch (error) {
    return routeError(error);
  }
}

function scalar(sql: string) {
  const row = getDb().prepare(sql).get() as Record<string, number>;
  return Number(Object.values(row)[0] ?? 0);
}
