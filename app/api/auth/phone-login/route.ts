import { z } from "zod";
import { getDb } from "@/lib/server/db";
import { setSessionCookie, type SessionUser } from "@/lib/server/auth";
import { fail, ok, readJson, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const phoneLoginSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入国内手机号"),
  code: z.string().min(4).max(8),
  name: z.string().min(1).max(30).optional(),
});

export async function POST(request: Request) {
  const parsed = await readJson(request, phoneLoginSchema);

  if (parsed.error) {
    return parsed.error;
  }

  const expectedCode = process.env.DEV_LOGIN_CODE ?? "123456";

  if (parsed.data.code !== expectedCode) {
    return fail("验证码不正确。开发环境默认验证码为 123456", 401);
  }

  try {
    const db = getDb();
    const existing = db
      .prepare("SELECT id, phone, name, role FROM users WHERE phone = ?")
      .get(parsed.data.phone) as SessionUser | undefined;

    const user =
      existing ??
      ({
        id: Number(
          db
            .prepare("INSERT INTO users (phone, name, role) VALUES (?, ?, 'customer')")
            .run(parsed.data.phone, parsed.data.name ?? "商城用户").lastInsertRowid,
        ),
        phone: parsed.data.phone,
        name: parsed.data.name ?? "商城用户",
        role: "customer",
      } satisfies SessionUser);

    return setSessionCookie(ok({ user }), user);
  } catch (error) {
    return routeError(error);
  }
}
