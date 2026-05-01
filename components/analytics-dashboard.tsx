"use client";

import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";
import type { ElementType, ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Database, Filter, TrendingUp, Users2, Layers3, ShieldCheck, ChartColumnBig } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

const COLORS = ["#2563eb", "#14b8a6", "#f59e0b", "#8b5cf6", "#ef4444", "#10b981"];

function trendLabel(delta: number) {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta}% vs prev.`;
}

function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  hint
}: {
  label: string;
  value: string | number;
  delta: number;
  icon: ElementType;
  hint?: string;
}) {
  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          <p className={`mt-2 text-xs font-medium ${delta >= 0 ? "text-emerald-600" : "text-red-600"}`}>{trendLabel(delta)}</p>
          {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
      <Database className="h-8 w-8 text-slate-400" />
      <p className="mt-3 font-semibold text-slate-900">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
  height = "h-[320px] sm:h-[360px]"
}: {
  title: string;
  description: string;
  children: ReactNode;
  height?: string;
}) {
  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </CardHeader>
      <CardContent className={height}>{children}</CardContent>
    </Card>
  );
}

function LatestLeadsTable({ data }: { data: any }) {
  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h3 className="font-semibold text-slate-900">Latest Leads</h3>
            <p className="text-sm text-slate-500">The 10 most recent submissions.</p>
          </div>
          <Link href="/admin/leads" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All Leads
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-3 p-4 sm:hidden">
          {data.latestLeads.map((lead: any) => (
            <div key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {lead.first_name} {lead.last_name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{lead.phone}</p>
                </div>
                <Badge className="bg-blue-50 text-blue-700">{lead.state}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">{formatDate(lead.createdAt)}</span>
                <span className="font-medium text-slate-700">{lead.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">State</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.latestLeads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {lead.first_name} {lead.last_name}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{lead.phone}</td>
                  <td className="px-5 py-4">
                    <Badge className="bg-blue-50 text-blue-700">{lead.state}</Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{formatDate(lead.createdAt)}</td>
                  <td className="px-5 py-4 text-slate-600">{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryChip({ title, value, tone }: { title: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className={`mt-2 text-sm font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

export function AnalyticsDashboard({
  data,
  reports = false
}: {
  data: any;
  reports?: boolean;
}) {
  const hasData = data.totalLeads > 0;
  const topFiveStates = data.stateSeries.slice(0, 5);

  if (!reports) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <MetricCard label="Total Leads" value={data.totalLeads} delta={data.comparisons.totalLeads} icon={Users2} />
          <MetricCard label="Today Leads" value={data.todayLeads} delta={data.comparisons.todayLeads} icon={TrendingUp} />
          <MetricCard label="This Week Leads" value={data.weekLeads} delta={data.comparisons.weekLeads} icon={Filter} />
          <MetricCard label="This Month Leads" value={data.monthLeads} delta={data.comparisons.monthLeads} icon={Database} />
          <MetricCard label="Conversion Rate" value={`${data.conversionRate}%`} delta={data.comparisons.conversionRate} icon={CheckCircle2} />
          <MetricCard label="Contact Rate" value={`${data.contactRate}%`} delta={data.comparisons.contactRate} icon={AlertTriangle} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <ChartCard title="Leads Over Time" description="Summary trend for the active filters.">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.lineSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="medicare" stroke="#14b8a6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="aca" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No data found" description="No leads match the current filters yet." />
            )}
          </ChartCard>

          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-900">Compliance Snapshot</h3>
              <p className="text-sm text-slate-500">Fast health check for live submissions.</p>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>With Jornaya ID</span>
                  <span>{data.compliance.withJornayaPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${data.compliance.withJornayaPct}%` }} />
                </div>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-red-900">
                  <span>Missing IP Address</span>
                  <span>{data.compliance.missingIpPct}%</span>
                </div>
                <p className="text-xs text-red-800">{data.compliance.missingIp} leads need IP review.</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-amber-900">
                  <span>Missing Jornaya ID</span>
                  <span>{data.compliance.missingJornayaPct}%</span>
                </div>
                <p className="text-xs text-amber-800">{data.compliance.missingJornaya} leads need Jornaya review.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <ChartCard title="Top 5 States" description="Quick view of lead density by state." height="h-[320px]">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topFiveStates} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={40} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No data found" description="State volume appears once leads are present." />
            )}
          </ChartCard>

          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-900">Latest Leads</h3>
              <p className="text-sm text-slate-500">Recent submissions from the active filter set.</p>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {data.latestLeads.slice(0, 5).map((lead: any) => (
                <div key={lead.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {lead.first_name} {lead.last_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {lead.state} · {formatDate(lead.createdAt)}
                    </p>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700">{lead.status}</Badge>
                </div>
              ))}
              <Link href="/admin/leads" className="inline-flex h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
                View All Leads
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-900">Lead Quality</h3>
              <p className="text-sm text-slate-500">Duplicate and incomplete lead checks.</p>
            </CardHeader>
            <CardContent className="space-y-3 p-6 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <span>Duplicate leads detected</span>
                <span className="font-medium">{data.quality.duplicateLeads}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <span>Invalid phone numbers</span>
                <span className="font-medium">{data.quality.invalidPhones}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <span>Missing DOB leads</span>
                <span className="font-medium">{data.quality.missingDob}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-900">Quick Summary</h3>
              <p className="text-sm text-slate-500">Snapshot of the active filter window.</p>
            </CardHeader>
            <CardContent className="grid gap-3 p-6 sm:grid-cols-2">
              <SummaryChip title="Window" value={`${formatDate(data.from)} - ${formatDate(data.to)}`} tone="text-slate-900" />
              <SummaryChip title="Lead Mix" value={`${data.typeSeries[0].value} Medicare / ${data.typeSeries[1].value} ACA`} tone="text-blue-700" />
              <SummaryChip title="Compliance" value={`${data.compliance.withJornayaPct}% Jornaya coverage`} tone="text-emerald-700" />
              <SummaryChip title="Status Health" value={`${data.contactRate}% contacted`} tone="text-violet-700" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Total Leads" value={data.totalLeads} delta={data.comparisons.totalLeads} icon={Users2} />
        <MetricCard label="Today Leads" value={data.todayLeads} delta={data.comparisons.todayLeads} icon={TrendingUp} />
        <MetricCard label="This Week Leads" value={data.weekLeads} delta={data.comparisons.weekLeads} icon={Filter} />
        <MetricCard label="This Month Leads" value={data.monthLeads} delta={data.comparisons.monthLeads} icon={Database} />
        <MetricCard label="Conversion Rate" value={`${data.conversionRate}%`} delta={data.comparisons.conversionRate} icon={CheckCircle2} />
        <MetricCard label="Contact Rate" value={`${data.contactRate}%`} delta={data.comparisons.contactRate} icon={AlertTriangle} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <ChartCard title="Leads Over Time" description="Detailed trend across the active reporting window.">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.lineSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="medicare" stroke="#14b8a6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="aca" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No data found" description="No leads match the current filters yet." />
          )}
        </ChartCard>

        <ChartCard title="Lead Mix" description="Medicare, ACA, and other submissions.">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.typeSeries} dataKey="value" nameKey="name" innerRadius={72} outerRadius={120} paddingAngle={3}>
                  {data.typeSeries.map((entry: any, index: number) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No data found" description="Distribution charts appear once leads are submitted." />
          )}
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <ChartCard title="Top States" description="Top 10 states by lead volume." height="h-[340px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.stateSeries} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={50} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No data found" description="State performance will show when leads are present." />
          )}
        </ChartCard>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900">Status Breakdown</h3>
            <p className="text-sm text-slate-500">Current lead pipeline distribution.</p>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {data.funnelSeries.map((item: any) => {
              const percent = data.totalLeads ? Math.round((item.count / data.totalLeads) * 100) : 0;
              return (
                <div key={item.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-slate-500">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <LatestLeadsTable data={data} />

        <div className="space-y-6">
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-900">Compliance</h3>
              <p className="text-sm text-slate-500">Jornaya and IP capture quality.</p>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Leads with Jornaya ID</span>
                  <span>{data.compliance.withJornayaPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${data.compliance.withJornayaPct}%` }} />
                </div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-amber-900">
                  <span>Missing Jornaya ID</span>
                  <span>{data.compliance.missingJornayaPct}%</span>
                </div>
                <p className="text-xs text-amber-800">{data.compliance.missingJornaya} leads need compliance review.</p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-red-900">
                  <span>Missing IP Address</span>
                  <span>{data.compliance.missingIpPct}%</span>
                </div>
                <p className="text-xs text-red-800">{data.compliance.missingIp} leads are missing an IP capture value.</p>
              </div>
            </CardContent>
          </Card>

          <ChartCard title="Source Tracking" description="UTM / campaign performance." height="h-[300px]">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.sourceSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No data found" description="UTM source tracking will appear when tags are present." />
            )}
          </ChartCard>

          <ChartCard title="Gender Distribution" description="Compact overview of lead mix." height="h-[300px]">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.genderSeries} dataKey="value" nameKey="name" innerRadius={64} outerRadius={110}>
                    {data.genderSeries.map((entry: any, index: number) => (
                      <Cell key={entry.name} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No data found" description="Gender analytics will render once submissions exist." />
            )}
          </ChartCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900">Lead Quality</h3>
            <p className="text-sm text-slate-500">Duplicate, invalid, and incomplete leads.</p>
          </CardHeader>
          <CardContent className="space-y-3 p-6 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <span>Duplicate leads detected</span>
              <span className="font-medium">{data.quality.duplicateLeads}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <span>Invalid phone numbers</span>
              <span className="font-medium">{data.quality.invalidPhones}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <span>Missing DOB leads</span>
              <span className="font-medium">{data.quality.missingDob}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900">Summary Report</h3>
            <p className="text-sm text-slate-500">Export-ready reporting insights for the current filter set.</p>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 md:grid-cols-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Window</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatDate(data.from)} - {formatDate(data.to)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{data.totalLeads}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Conversion</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{data.conversionRate}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Compliance</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{data.compliance.withJornayaPct}% with Jornaya</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
