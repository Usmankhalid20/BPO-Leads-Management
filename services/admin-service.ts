import { connectDB } from "@/lib/db";
import AdminModel from "@/models/Admin";
import { hashPassword } from "@/lib/auth";
import type { AdminUser } from "@/types";

function normalizeAdmin(doc: any): AdminUser {
  const admin = doc?.toObject ? doc.toObject() : doc;
  return admin
    ? {
        ...admin,
        _id: String(admin._id),
        createdAt: admin.createdAt instanceof Date ? admin.createdAt.toISOString() : String(admin.createdAt),
        lastLogin: admin.lastLogin ? (admin.lastLogin instanceof Date ? admin.lastLogin.toISOString() : String(admin.lastLogin)) : undefined
      }
    : admin;
}

export async function seedOrFetchSuperAdmin() {
  await connectDB();
  const admin = await AdminModel.findOne({ role: "SUPER_ADMIN" }).lean();
  if (admin) return normalizeAdmin(admin);

  const passwordHash = await hashPassword("Admin@12345");
  const created = await AdminModel.create({
    name: "Super Admin",
    email: "admin@healthplanlocator.com",
    passwordHash,
    role: "SUPER_ADMIN",
    status: "ACTIVE"
  });
  return normalizeAdmin(created);
}

export async function listAdmins() {
  await connectDB();
  const admins = await AdminModel.find().sort({ createdAt: -1 }).lean();
  return admins.map((admin) => normalizeAdmin(admin));
}

export async function createAdmin(data: { name: string; email: string; password: string; role: "SUPER_ADMIN" | "ADMIN"; status: "ACTIVE" | "DISABLED" }) {
  await connectDB();
  const passwordHash = await hashPassword(data.password);
  const admin = await AdminModel.create({ ...data, passwordHash });
  return normalizeAdmin(admin);
}

export async function getAdminByEmail(email: string) {
  await connectDB();
  const admin = await AdminModel.findOne({ email }).lean();
  return admin ? normalizeAdmin(admin) : null;
}

export async function getAdminById(id: string) {
  await connectDB();
  const admin = await AdminModel.findById(id).lean();
  return admin ? normalizeAdmin(admin) : null;
}
