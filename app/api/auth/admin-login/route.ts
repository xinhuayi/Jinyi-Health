import { z } from "zod";
import { authenticateAdmin, setSessionCookie } from "@/lib/server/auth";
import { fail, ok, readJson, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const adminLoginSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const parsed = await readJson(request, adminLoginSchema);

  if (parsed.error) {
    return parsed.error;
  }

  try {
    const user = authenticateAdmin(parsed.data.phone, parsed.data.password);

    if (!user) {
      return fail("管理员账号或密码不正确", 401);
    }

    return setSessionCookie(ok({ user }), user);
  } catch (error) {
    return routeError(error);
  }
}
