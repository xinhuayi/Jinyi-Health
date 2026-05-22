import { NextResponse } from "next/server";
import { getDb } from "./db";
import { fail } from "./http";
import { signPayload, verifyPassword, verifySignedPayload } from "./crypto";

export type SessionUser = {
  id: number;
  phone: string | null;
  name: string | null;
  role: "customer" | "admin";
};

type SessionPayload = {
  userId: number;
  role: "customer" | "admin";
  exp: number;
};

const sessionCookieName = "jinyi_session";
const sessionMaxAge = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.AUTH_SECRET ?? "local-dev-secret-change-before-production";
}

export function setSessionCookie(response: NextResponse, user: SessionUser) {
  const token = signPayload(
    {
      userId: user.id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + sessionMaxAge,
    },
    getSessionSecret(),
  );

  response.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAge,
  });

  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export function getCurrentUser(request: Request): SessionUser | null {
  const token = parseCookie(request.headers.get("cookie") ?? "")[sessionCookieName];

  if (!token) {
    return null;
  }

  const payload = verifySignedPayload<SessionPayload>(token, getSessionSecret());

  if (!payload || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  const user = getDb()
    .prepare("SELECT id, phone, name, role FROM users WHERE id = ?")
    .get(payload.userId) as SessionUser | undefined;

  if (!user) {
    return null;
  }

  return user;
}

export function requireUser(request: Request) {
  const user = getCurrentUser(request);

  if (!user) {
    return { user: null, response: fail("请先登录", 401) };
  }

  return { user, response: null };
}

export function requireAdmin(request: Request) {
  const auth = requireUser(request);

  if (auth.response) {
    return auth;
  }

  if (auth.user?.role !== "admin") {
    return { user: null, response: fail("需要管理员权限", 403) };
  }

  return auth;
}

export function authenticateAdmin(phone: string, password: string) {
  const user = getDb()
    .prepare("SELECT id, phone, name, role, password_hash FROM users WHERE phone = ? AND role = 'admin'")
    .get(phone) as (SessionUser & { password_hash: string | null }) | undefined;

  if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
    return null;
  }

  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role,
  } satisfies SessionUser;
}

function parseCookie(header: string) {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...value] = part.split("=");
        return [key, decodeURIComponent(value.join("="))];
      }),
  );
}
