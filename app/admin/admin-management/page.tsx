import { AdminShell } from "@/components/admin-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import { listAdmins } from "@/services/admin-service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken } from "@/lib/auth";
import { AdminCreateModal } from "@/components/admin-create-modal";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminManagementPage() {
  const token = cookies().get("admin_token")?.value;
  const auth = await verifyAuthToken(token);
  if (!auth || auth.role !== "SUPER_ADMIN") redirect("/admin/dashboard");

  const admins = await listAdmins();
  return (
    <AdminShell role="SUPER_ADMIN">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Admin Management</h2>
          <p className="text-sm text-slate-500">Super Admin only.</p>
        </div>
        <AdminCreateModal />
      </div>
      <Card className="mt-6 overflow-hidden">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold">Admins</h3>
          <p className="text-sm text-slate-500">{admins.length} total users</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-4 p-4 lg:hidden">
            {admins.map((admin: any) => (
              <article key={admin._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate text-base font-semibold text-slate-900">{admin.name}</h4>
                    <p className="mt-1 break-all text-sm text-slate-600">{admin.email}</p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{admin.role}</div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{admin.status}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Created</p>
                    <p className="mt-1 text-sm text-slate-700">{formatDate(admin.createdAt)}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Last Login</p>
                    <p className="mt-1 text-sm text-slate-700">{admin.lastLogin ? formatDate(admin.lastLogin) : "-"}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Edit
                  </button>
                  <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Disable
                  </button>
                  <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Reset Password
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto lg:block">
            <Table>
              <Thead>
                <Tr>
                  {["Name", "Email", "Role", "Status", "Created At", "Last Login", "Actions"].map((x) => <Th key={x}>{x}</Th>)}
                </Tr>
              </Thead>
              <Tbody>
                {admins.map((admin: any) => (
                  <Tr key={admin._id}>
                    <Td>{admin.name}</Td>
                    <Td>{admin.email}</Td>
                    <Td>{admin.role}</Td>
                    <Td>{admin.status}</Td>
                    <Td>{formatDate(admin.createdAt)}</Td>
                    <Td>{admin.lastLogin ? formatDate(admin.lastLogin) : "-"}</Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                          Edit
                        </button>
                        <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                          Disable
                        </button>
                        <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                          Reset Password
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
