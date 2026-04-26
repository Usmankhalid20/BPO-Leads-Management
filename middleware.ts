import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

const PROTECTED_PATHS = ["/admin/dashboard", "/admin/reports", "/admin/leads", "/admin/admin-management", "/admin/settings", "/api/admin/leads", "/api/admin/admins"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;
  const auth = await verifyAuthToken(token);
  if (!auth) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/reports/:path*", "/admin/leads/:path*", "/admin/admin-management/:path*", "/admin/settings/:path*"]
};
