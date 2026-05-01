import Link from "next/link";
import { Eye, RefreshCw, Download, Filter } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getLeads } from "@/services/lead-service";
import { LEAD_STATUSES } from "@/lib/constants";
import { formatDate, formatDateOnly, formatPhone } from "@/lib/utils";
import { CopyValue } from "@/components/copy-value";
import { LeadsFilters } from "@/components/leads-filters";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  ) as Record<string, string | undefined>;
  const { leads, total, page, limit } = await getLeads(filters);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const buildQuery = (extra: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/admin/leads" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50 sm:w-auto">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Link>
          <Link
            href={`/api/admin/leads/export?${buildQuery()}`}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Link>
        </div>
      </div>
      <Card className="mt-6 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-600" />
            <h3 className="font-semibold">Filters</h3>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <LeadsFilters values={filters} />
        </CardContent>
      </Card>
      <Card className="mt-6 overflow-hidden">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="font-semibold">Leads Table</h3>
            <p className="text-sm text-slate-500">
              Showing {start}-{end} of {total} leads
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-4 p-4 2xl:hidden">
            {leads.map((lead) => (
              <article key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Lead</p>
                    <h4 className="truncate text-lg font-semibold text-slate-900">
                      {lead.first_name} {lead.last_name}
                    </h4>
                    <p className="mt-1 truncate font-mono text-xs text-slate-500">{lead.id}</p>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700">{lead.state}</Badge>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                    <p className="break-all text-sm text-slate-700">{lead.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
                    <p className="text-sm text-slate-700">{formatPhone(lead.phone)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Zipcode</p>
                    <p className="text-sm text-slate-700">{lead.zip}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Gender</p>
                    <Badge className="bg-slate-100 text-slate-700">{lead.gender}</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">DOB</p>
                    <p className="text-sm text-slate-700">{formatDateOnly(lead.dob)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created</p>
                    <p className="text-sm text-slate-700">{formatDate(lead.createdAt)}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Jornaya Lead ID</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-700">{lead.jornaya_lead_id}</span>
                      <CopyValue value={lead.jornaya_lead_id} label="Jornaya Lead ID" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">IP Address</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-700">{lead.ip_address}</span>
                      <CopyValue value={lead.ip_address} label="IP Address" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      Add Note
                    </button>
                  </div>
                  <select className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 sm:max-w-[220px]">
                    <option value={lead.status}>{lead.status}</option>
                    {LEAD_STATUSES.filter((status) => status !== lead.status).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto 2xl:block">
            <Table>
              <Thead className="sticky top-0 z-10">
                <Tr>
                  {["ID", "First Name", "Last Name", "Email", "Phone", "Zipcode", "State", "Date of Birth", "Gender", "Date Created", "Jornaya Lead ID", "IP Address", "Actions"].map((column) => (
                    <Th key={column} className="whitespace-nowrap">
                      {column}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {leads.map((lead) => (
                  <Tr key={lead.id}>
                    <Td className="max-w-[180px] truncate font-mono text-xs">{lead.id}</Td>
                    <Td className="whitespace-nowrap">{lead.first_name}</Td>
                    <Td className="whitespace-nowrap">{lead.last_name}</Td>
                    <Td className="max-w-[220px] truncate">{lead.email || "-"}</Td>
                    <Td className="whitespace-nowrap">{formatPhone(lead.phone)}</Td>
                    <Td className="whitespace-nowrap">{lead.zip}</Td>
                    <Td>
                      <Badge className="bg-blue-50 text-blue-700">{lead.state}</Badge>
                    </Td>
                    <Td className="whitespace-nowrap">{formatDateOnly(lead.dob)}</Td>
                    <Td>
                      <Badge className="bg-slate-100 text-slate-700">{lead.gender}</Badge>
                    </Td>
                    <Td className="whitespace-nowrap">{formatDate(lead.createdAt)}</Td>
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
                        <Link href={`/admin/leads/${lead.id}`} className="inline-flex rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">
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
          </div>
        </CardContent>
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p>
            Showing {start}-{end} of {total} leads
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/leads?${buildQuery({ page: String(Math.max(page - 1, 1)) })}`}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-center hover:bg-slate-50"
            >
              Prev
            </Link>
            {[25, 50, 100].map((size) => (
              <Link
                key={size}
                href={`/admin/leads?${buildQuery({ limit: String(size) })}`}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-center hover:bg-slate-50"
              >
                {size}
              </Link>
            ))}
            <Link
              href={`/admin/leads?${buildQuery({ page: String(page + 1) })}`}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-center hover:bg-slate-50"
            >
              Next
            </Link>
          </div>
        </div>
      </Card>
    </AdminShell>
  );
}
