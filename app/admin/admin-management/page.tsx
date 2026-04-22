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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Admin Management</h2>
          <p className="text-sm text-slate-500">Super Admin only.</p>
        </div>
        <AdminCreateModal />
      </div>
      <Card className="mt-6">
        <CardHeader><h3 className="font-semibold">Admins</h3></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <Thead>
              <Tr>
                {["Name","Email","Role","Status","Created At","Last Login","Actions"].map((x) => <Th key={x}>{x}</Th>)}
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
        </CardContent>
      </Card>
    </AdminShell>
  );
}
