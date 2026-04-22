import { NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validators";
import { getAdminByEmail, seedOrFetchSuperAdmin } from "@/services/admin-service";
import AdminModel from "@/models/Admin";
import { verifyPassword, signAuthToken } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = adminLoginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  await seedOrFetchSuperAdmin();
  const admin = await getAdminByEmail(parsed.data.email);
  if (!admin || admin.status !== "ACTIVE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const valid = await verifyPassword(parsed.data.password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await AdminModel.findByIdAndUpdate(admin._id, { lastLogin: new Date().toISOString() });

  const token = await signAuthToken({
    sub: admin._id.toString(),
    email: admin.email,
    role: admin.role,
    name: admin.name
  });

  const res = NextResponse.json({ ok: true, redirectTo: "/admin/dashboard" });
  res.cookies.set("admin_token", token, { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 12 });
  return res;
}
