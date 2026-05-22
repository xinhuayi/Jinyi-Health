import { z } from "zod";
import { getDb, mapProduct } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/auth";
import { fail, ok, readJson, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProductRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

const productPatchSchema = z
  .object({
    slug: z.string().min(2),
    name: z.string().min(1),
    subtitle: z.string(),
    price: z.number().int().positive(),
    unit: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    storage: z.string(),
    usage: z.string(),
    summary: z.string(),
    details: z.array(z.string()),
    compliance: z.array(z.string()),
    status: z.enum(["active", "draft", "archived"]),
    stock: z.number().int().min(0),
  })
  .partial();

export async function GET(_request: Request, { params }: ProductRouteProps) {
  try {
    const row = findProduct((await params).id);

    if (!row) {
      return fail("商品不存在", 404);
    }

    return ok(mapProduct(row));
  } catch (error) {
    return routeError(error);
  }
}

export async function PATCH(request: Request, { params }: ProductRouteProps) {
  const auth = requireAdmin(request);

  if (auth.response) {
    return auth.response;
  }

  const parsed = await readJson(request, productPatchSchema);

  if (parsed.error) {
    return parsed.error;
  }

  try {
    const id = (await params).id;
    const existing = findProduct(id);

    if (!existing) {
      return fail("商品不存在", 404);
    }

    const updates = Object.entries(parsed.data).map(([key, value]) => [
      key,
      Array.isArray(value) ? JSON.stringify(value) : value,
    ]);

    if (updates.length === 0) {
      return ok(mapProduct(existing));
    }

    getDb()
      .prepare(
        `
          UPDATE products
          SET ${updates.map(([key]) => `${key} = ?`).join(", ")}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
      )
      .run(...updates.map(([, value]) => value), existing.id);

    const row = getDb().prepare("SELECT * FROM products WHERE id = ?").get(existing.id) as Record<string, unknown>;
    return ok(mapProduct(row));
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request, { params }: ProductRouteProps) {
  const auth = requireAdmin(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const existing = findProduct((await params).id);

    if (!existing) {
      return fail("商品不存在", 404);
    }

    getDb().prepare("UPDATE products SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
      existing.id,
    );

    return ok({ deleted: true });
  } catch (error) {
    return routeError(error);
  }
}

function findProduct(idOrSlug: string) {
  const numericId = Number(idOrSlug);

  if (Number.isInteger(numericId)) {
    return getDb().prepare("SELECT * FROM products WHERE id = ?").get(numericId) as
      | (Record<string, unknown> & { id: number })
      | undefined;
  }

  return getDb().prepare("SELECT * FROM products WHERE slug = ?").get(idOrSlug) as
    | (Record<string, unknown> & { id: number })
    | undefined;
}
