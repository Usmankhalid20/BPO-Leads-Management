import { NextResponse } from "next/server";
import { adminCreateSchema } from "@/lib/validators";
import { createAdmin, listAdmins } from "@/services/admin-service";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await verifyAuthToken(getTokenFromRequest(request));
  if (!auth || auth.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const admins = await listAdmins();
  return NextResponse.json({ admins });
}

export async function POST(request: Request) {
  const auth = await verifyAuthToken(getTokenFromRequest(request));
  if (!auth || auth.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const parsed = adminCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid payload" }, { status: 400 });
  }
  const admin = await createAdmin(parsed.data);
  return NextResponse.json({ admin });
}
