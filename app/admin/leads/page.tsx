import Link from "next/link";
import { Eye, Filter, RefreshCw, Download } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getLeads } from "@/services/lead-service";
import { STATES, GENDERS, LEAD_STATUSES, INSURANCE_TYPES } from "@/lib/constants";
import { formatDate, formatDateOnly, formatPhone } from "@/lib/utils";
import { CopyValue } from "@/components/copy-value";

export const dynamic = "force-dynamic";

export default async function LeadsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const { leads, total, page, limit } = await getLeads(searchParams);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const buildQuery = (extra: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && !(key === "page" && extra.limit)) params.set(key, value);
    });
    Object.entries(extra).forEach(([key, value]) => params.set(key, value));
    return params.toString();
  };

  return (
    <AdminShell role="SUPER_ADMIN">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Leads Management</h2>
          <p className="text-sm text-slate-500">Manage Medicare submissions.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/leads" className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Link>
          <Link
            href={`/api/admin/leads/export?${buildQuery()}`}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Link>
        </div>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <h3 className="font-semibold">Filters</h3>
          </div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 lg:grid-cols-4" action="/admin/leads" method="get">
            <input type="hidden" name="limit" value={searchParams.limit || "25"} />
            <Input name="search" placeholder="Search by name, phone, email, Jornaya ID" defaultValue={searchParams.search} />
            <Input name="from" type="date" defaultValue={searchParams.from} />
            <Input name="to" type="date" defaultValue={searchParams.to} />
            <Select name="state" defaultValue={searchParams.state || ""}>
              <option value="">All States</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select name="gender" defaultValue={searchParams.gender || ""}>
              <option value="">All Genders</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
            <Select name="status" defaultValue={searchParams.status || ""}>
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select name="insurance_type" defaultValue={searchParams.insurance_type || ""}>
              <option value="">All Insurance</option>
              {INSURANCE_TYPES.map((i) => <option key={i} value={i}>{i}</option>)}
            </Select>
            <div className="flex gap-2">
              <Button type="submit"><Filter className="h-4 w-4" />Apply Filters</Button>
              <Link href="/admin/leads" className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50">
                Clear Filters
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="mt-6 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="font-semibold">Leads Table</h3>
            <p className="text-sm text-slate-500">Showing {start}-{end} of {total} leads</p>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <Thead className="sticky top-0 z-10">
              <Tr>
                {["ID","First Name","Last Name","Email","Phone","Zipcode","State","Date of Birth","Gender","Date Created","Jornaya Lead ID","IP Address","Actions"].map((column) => <Th key={column}>{column}</Th>)}
              </Tr>
            </Thead>
            <Tbody>
              {leads.map((lead) => (
                <Tr key={lead._id}>
                  <Td className="font-mono text-xs">{lead.id || lead._id?.slice(-8)}</Td>
                  <Td>{lead.first_name}</Td>
                  <Td>{lead.last_name}</Td>
                  <Td>{lead.email || "-"}</Td>
                  <Td>{formatPhone(lead.phone)}</Td>
                  <Td>{lead.zip}</Td>
                  <Td><Badge className="bg-blue-50 text-blue-700">{lead.state}</Badge></Td>
                  <Td>{formatDateOnly(lead.dob)}</Td>
                  <Td><Badge className="bg-slate-100 text-slate-700">{lead.gender}</Badge></Td>
                  <Td>{formatDate(lead.createdAt)}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="max-w-[220px] truncate font-mono text-xs">{lead.jornaya_lead_id}</span>
                      <CopyValue value={lead.jornaya_lead_id} label="Jornaya Lead ID" />
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="max-w-[180px] truncate font-mono text-xs">{lead.ip_address}</span>
                      <CopyValue value={lead.ip_address} label="IP Address" />
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/leads/${lead._id}`} className="inline-flex rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Add Note
                      </button>
                      <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700">
                        <option value={lead.status}>{lead.status}</option>
                        {LEAD_STATUSES.filter((status) => status !== lead.status).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardContent>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm text-slate-600">
          <p>Showing {start}-{end} of {total} leads</p>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/leads?${buildQuery({ page: String(Math.max(page - 1, 1)) })}`}
              className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
            >
              Prev
            </Link>
            {[25, 50, 100].map((size) => (
              <Link
                key={size}
                href={`/admin/leads?${buildQuery({ limit: String(size) })}`}
                className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
              >
                {size}
              </Link>
            ))}
            <Link
              href={`/admin/leads?${buildQuery({ page: String(page + 1) })}`}
              className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
            >
              Next
            </Link>
          </div>
        </div>
      </Card>
    </AdminShell>
  );
}
