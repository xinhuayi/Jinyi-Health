import { z } from "zod";
import { getDb } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { fail, ok, readJson, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AddressRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

const addressPatchSchema = z
  .object({
    receiverName: z.string().min(1),
    receiverPhone: z.string().min(6),
    province: z.string().min(1),
    city: z.string().min(1),
    district: z.string().min(1),
    detail: z.string().min(3),
    isDefault: z.boolean(),
  })
  .partial();

export async function PATCH(request: Request, { params }: AddressRouteProps) {
  const auth = requireUser(request);

  if (auth.response) {
    return auth.response;
  }

  const parsed = await readJson(request, addressPatchSchema);

  if (parsed.error) {
    return parsed.error;
  }

  try {
    const id = Number((await params).id);
    const db = getDb();
    const existing = db
      .prepare("SELECT * FROM addresses WHERE id = ? AND user_id = ?")
      .get(id, auth.user!.id) as Record<string, unknown> | undefined;

    if (!existing) {
      return fail("地址不存在", 404);
    }

    if (parsed.data.isDefault) {
      db.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").run(auth.user!.id);
    }

    const fieldMap = {
      receiverName: "receiver_name",
      receiverPhone: "receiver_phone",
      province: "province",
      city: "city",
      district: "district",
      detail: "detail",
      isDefault: "is_default",
    } as const;

    const updates = Object.entries(parsed.data).map(([key, value]) => [
      fieldMap[key as keyof typeof fieldMap],
      typeof value === "boolean" ? (value ? 1 : 0) : value,
    ]);

    if (updates.length > 0) {
      db.prepare(
        `
          UPDATE addresses
          SET ${updates.map(([key]) => `${key} = ?`).join(", ")}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND user_id = ?
        `,
      ).run(...updates.map(([, value]) => value), id, auth.user!.id);
    }

    return ok(db.prepare("SELECT * FROM addresses WHERE id = ?").get(id));
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request, { params }: AddressRouteProps) {
  const auth = requireUser(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const result = getDb()
      .prepare("DELETE FROM addresses WHERE id = ? AND user_id = ?")
      .run(Number((await params).id), auth.user!.id);

    if (result.changes === 0) {
      return fail("地址不存在", 404);
    }

    return ok({ deleted: true });
  } catch (error) {
    return routeError(error);
  }
}
