import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: { message, details } }, { status });
}

export async function readJson<T>(request: Request, schema: ZodSchema<T>) {
  try {
    const body = await request.json();
    return { data: schema.parse(body), error: null as null };
  } catch (error) {
    if (error instanceof ZodError) {
      return { data: null, error: fail("请求参数不正确", 422, error.flatten()) };
    }

    return { data: null, error: fail("请求体必须是 JSON", 400) };
  }
}

export function routeError(error: unknown) {
  console.error(error);
  return fail("服务器处理失败", 500);
}
