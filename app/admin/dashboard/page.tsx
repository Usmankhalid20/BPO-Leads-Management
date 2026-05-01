import { AdminShell } from "@/components/admin-shell";
import { DashboardFilters } from "@/components/dashboard-filters";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { ReportActions } from "@/components/report-actions";
import { seedOrFetchSuperAdmin } from "@/services/admin-service";
import { getAnalyticsSnapshot } from "@/services/analytics-service";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  await seedOrFetchSuperAdmin();
  const snapshot = await getAnalyticsSnapshot(searchParams);
  const csvHref = `/api/admin/leads/export?${new URLSearchParams(
    Object.entries(searchParams).filter(([, value]) => Boolean(value)) as Array<[string, string]>
  ).toString()}`;

  return (
    <AdminShell role="SUPER_ADMIN">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Call Experts BPO</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Production reporting for Medicare lead flow.</p>
        </div>
        <ReportActions csvHref={csvHref} />
      </div>

      <div className="mb-6">
        <DashboardFilters values={searchParams} action="/admin/dashboard" />
      </div>

      <AnalyticsDashboard data={snapshot} />
    </AdminShell>
  );
}
