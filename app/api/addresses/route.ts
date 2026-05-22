import { z } from "zod";
import { getDb } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { created, ok, readJson, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const addressSchema = z.object({
  receiverName: z.string().min(1),
  receiverPhone: z.string().min(6),
  province: z.string().min(1),
  city: z.string().min(1),
  district: z.string().min(1),
  detail: z.string().min(3),
  isDefault: z.boolean().default(false),
});

export async function GET(request: Request) {
  const auth = requireUser(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const rows = getDb()
      .prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC")
      .all(auth.user!.id);

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

  const parsed = await readJson(request, addressSchema);

  if (parsed.error) {
    return parsed.error;
  }

  try {
    const db = getDb();

    if (parsed.data.isDefault) {
      db.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").run(auth.user!.id);
    }

    const result = db
      .prepare(
        `
          INSERT INTO addresses (
            user_id, receiver_name, receiver_phone, province, city, district, detail, is_default
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )
      .run(
        auth.user!.id,
        parsed.data.receiverName,
        parsed.data.receiverPhone,
        parsed.data.province,
        parsed.data.city,
        parsed.data.district,
        parsed.data.detail,
        parsed.data.isDefault ? 1 : 0,
      );

    return created(db.prepare("SELECT * FROM addresses WHERE id = ?").get(result.lastInsertRowid));
  } catch (error) {
    return routeError(error);
  }
}
