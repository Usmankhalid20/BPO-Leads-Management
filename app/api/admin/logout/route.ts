import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", request.url));
  res.cookies.set("admin_token", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
