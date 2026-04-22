import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { AdminRole } from "@/types";
import { cookies } from "next/headers";

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

export type AuthPayload = {
  sub: string;
  email: string;
  role: AdminRole;
  name: string;
};

export async function signAuthToken(payload: AuthPayload) {
  return new SignJWT({ email: payload.email, role: payload.role, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());
}

export async function verifyAuthToken(token?: string) {
  if (!token) return null;
  try {
    const result = await jwtVerify(token, secret());
    return {
      id: result.payload.sub as string,
      email: result.payload.email as string,
      role: result.payload.role as AdminRole,
      name: result.payload.name as string
    };
  } catch {
    return null;
  }
}

export async function getAuthFromCookies() {
  const token = cookies().get("admin_token")?.value;
  return verifyAuthToken(token);
}

export function getTokenFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
