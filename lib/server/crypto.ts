import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const encoder = new TextEncoder();

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const digest = createHmac("sha256", salt).update(password).digest("hex");
  return `${salt}:${digest}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, digest] = storedHash.split(":");

  if (!salt || !digest) {
    return false;
  }

  const candidate = hashPassword(password, salt).split(":")[1];
  return safeEqual(candidate, digest);
}

export function signPayload(payload: Record<string, unknown>, secret: string) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifySignedPayload<T>(token: string, secret: string): T | null {
  const [body, signature] = token.split(".");

  if (!body || !signature) {
    return null;
  }

  const expected = createHmac("sha256", secret).update(body).digest("base64url");

  if (!safeEqual(signature, expected)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function safeEqual(left: string, right: string) {
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);

  if (leftBytes.length !== rightBytes.length) {
    return false;
  }

  return timingSafeEqual(leftBytes, rightBytes);
}
