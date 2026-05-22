import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getDb } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/auth";
import { created, fail, ok, routeError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const uploadDir = path.join(process.cwd(), "storage", "uploads");
const allowedTypes = new Set(["filing", "test_report", "certificate", "label", "other"]);

export async function GET(request: Request) {
  const auth = requireAdmin(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const rows = getDb().prepare("SELECT * FROM compliance_documents ORDER BY id DESC").all();
    return ok(rows);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  const auth = requireAdmin(request);

  if (auth.response) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "");
    const type = String(formData.get("type") ?? "other");
    const productIdValue = formData.get("productId");
    const productId = productIdValue ? Number(productIdValue) : null;

    if (!(file instanceof File)) {
      return fail("请上传文件字段 file", 422);
    }

    if (!title) {
      return fail("请填写资料标题", 422);
    }

    if (!allowedTypes.has(type)) {
      return fail("资料类型不正确", 422);
    }

    if (productId) {
      const product = getDb().prepare("SELECT id FROM products WHERE id = ?").get(productId);

      if (!product) {
        return fail("关联商品不存在", 404);
      }
    }

    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^\w.\-()\u4e00-\u9fa5]/g, "_");
    const fileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, bytes);

    const result = getDb()
      .prepare(
        `
          INSERT INTO compliance_documents (
            product_id, type, title, file_name, file_path, mime_type, size
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
      )
      .run(productId, type, title, file.name, filePath, file.type || "application/octet-stream", bytes.byteLength);

    return created(getDb().prepare("SELECT * FROM compliance_documents WHERE id = ?").get(result.lastInsertRowid));
  } catch (error) {
    return routeError(error);
  }
}
