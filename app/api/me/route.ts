import { getCurrentUser } from "@/lib/server/auth";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return ok({ user: getCurrentUser(request) });
}
