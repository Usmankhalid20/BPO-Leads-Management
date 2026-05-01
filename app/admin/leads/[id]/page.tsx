import Link from "next/link";
import { ArrowLeft, BadgeCheck, CheckCircle2, Download } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLeadById } from "@/services/lead-service";
import { formatDate, formatDateOnly } from "@/lib/utils";
import { CopyValue } from "@/components/copy-value";
import { LeadInteractivePanel } from "@/components/lead-interactive-panel";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await getLeadById(params.id);
  if (!lead) {
    return (
      <AdminShell>
        <div className="text-slate-600">Lead not found.</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell role="SUPER_ADMIN">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/admin/leads" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="w-full sm:w-auto" variant="outline">
            <CheckCircle2 className="h-4 w-4" />
            Mark as Contacted
          </Button>
          <Button className="w-full sm:w-auto" variant="outline">
            <BadgeCheck className="h-4 w-4" />
            Mark as Converted
          </Button>
          <Link
            href={`/api/admin/leads/export?${new URLSearchParams({ id: lead.id }).toString()}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Export Lead
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          {lead.first_name} {lead.last_name}
        </h2>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{lead.status}</span>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Personal Info</h3>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              ["First Name", lead.first_name],
              ["Last Name", lead.last_name],
              ["DOB", formatDateOnly(lead.dob)],
              ["Gender", lead.gender],
              ["Zipcode", lead.zip],
              ["State", lead.state],
              ["Phone", lead.phone],
              ["Email", lead.email || "-"]
            ].map(([label, value]) => (
              <div key={label as string}>
                <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 font-medium text-slate-900">{value as string}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Compliance Tracking</h3>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">MongoDB Object ID</p>
              <p className="font-mono text-slate-900">{lead.id}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Jornaya Lead ID</p>
                <p className="font-mono text-slate-900">{lead.jornaya_lead_id}</p>
              </div>
              <CopyValue value={lead.jornaya_lead_id} label="Jornaya Lead ID" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">IP Address</p>
                <p className="font-mono text-slate-900">{lead.ip_address}</p>
              </div>
              <CopyValue value={lead.ip_address} label="IP Address" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Country</p>
                <p className="font-medium text-slate-900">{lead.country || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">City</p>
                <p className="font-medium text-slate-900">{lead.city || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">State / Province</p>
                <p className="font-medium text-slate-900">{lead.state_province || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">ZIP / Postal</p>
                <p className="font-medium text-slate-900">{lead.zipcode || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">ISP</p>
                <p className="font-medium text-slate-900">{lead.isp || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Timezone</p>
                <p className="font-medium text-slate-900">{lead.timezone || "-"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Timestamp</p>
              <p className="font-medium text-slate-900">{formatDate(lead.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">User Agent</p>
              <p className="text-slate-900">{lead.user_agent || "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Source Tracking</h3>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              ["UTM Source", lead.utm_source || "-"],
              ["UTM Campaign", lead.utm_campaign || "-"],
              ["Landing Page URL", lead.landing_page_url || "-"]
            ].map(([label, value]) => (
              <div key={label as string}>
                <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 break-all text-slate-900">{value as string}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <LeadInteractivePanel leadId={lead.id} status={lead.status} notes={lead.notes || []} />
      </div>
    </AdminShell>
  );
}
