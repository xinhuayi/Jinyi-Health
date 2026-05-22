import { clearSessionCookie } from "@/lib/server/auth";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return clearSessionCookie(ok({ loggedOut: true }));
}
