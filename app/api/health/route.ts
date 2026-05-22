import { getDb } from "@/lib/server/db";
import { ok, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = getDb().prepare("SELECT 1 as ok").get();
    return ok({ status: "ok", database: result ? "connected" : "unknown" });
  } catch (error) {
    return routeError(error);
  }
}
