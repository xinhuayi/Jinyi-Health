import { z } from "zod";
import { getDb, mapProduct } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/auth";
import { created, ok, readJson, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const productSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(1),
  subtitle: z.string().default(""),
  price: z.number().int().positive(),
  unit: z.string().default(""),
  category: z.string().default(""),
  tags: z.array(z.string()).default([]),
  storage: z.string().default(""),
  usage: z.string().default(""),
  summary: z.string().default(""),
  details: z.array(z.string()).default([]),
  compliance: z.array(z.string()).default([]),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  stock: z.number().int().min(0).default(100),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const category = searchParams.get("category");

    const clauses: string[] = [];
    const params: string[] = [];

    if (!includeInactive) {
      clauses.push("status = 'active'");
    }

    if (category) {
      clauses.push("category = ?");
      params.push(category);
    }

    const rows = getDb()
      .prepare(
        `SELECT * FROM products ${clauses.length ? `WHERE ${clauses.join(" AND ")}` : ""} ORDER BY id DESC`,
      )
      .all(...params) as Record<string, unknown>[];

    return ok(rows.map(mapProduct));
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  const auth = requireAdmin(request);

  if (auth.response) {
    return auth.response;
  }

  const parsed = await readJson(request, productSchema);

  if (parsed.error) {
    return parsed.error;
  }

  try {
    const product = parsed.data;
    const result = getDb()
      .prepare(
        `
          INSERT INTO products (
            slug, name, subtitle, price, unit, category, tags, storage, usage,
            summary, details, compliance, status, stock
          ) VALUES (
            @slug, @name, @subtitle, @price, @unit, @category, @tags, @storage, @usage,
            @summary, @details, @compliance, @status, @stock
          )
        `,
      )
      .run({
        ...product,
        tags: JSON.stringify(product.tags),
        details: JSON.stringify(product.details),
        compliance: JSON.stringify(product.compliance),
      });

    const row = getDb().prepare("SELECT * FROM products WHERE id = ?").get(result.lastInsertRowid) as Record<
      string,
      unknown
    >;

    return created(mapProduct(row));
  } catch (error) {
    return routeError(error);
  }
}
