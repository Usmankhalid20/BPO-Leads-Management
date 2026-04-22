import { BarChart3, TrendingUp, Users2, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { getLeadMetrics } from "@/services/lead-service";
import { seedOrFetchSuperAdmin } from "@/services/admin-service";
import { AdminCharts } from "@/components/admin-charts";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await seedOrFetchSuperAdmin();
  const metrics = await getLeadMetrics();

  return (
    <AdminShell role="SUPER_ADMIN">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Leads", value: metrics.total, icon: Users2 },
          { label: "Today's Leads", value: metrics.todayLeads, icon: TrendingUp },
          { label: "Medicare Leads", value: metrics.medicareLeads, icon: ShieldCheck },
          { label: "ACA Leads", value: metrics.acaLeads, icon: BarChart3 }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <AdminCharts byDay={metrics.dayBuckets} byState={metrics.stateBuckets} />
    </AdminShell>
  );
}
