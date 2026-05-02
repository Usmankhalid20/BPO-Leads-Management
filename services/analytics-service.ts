import { connectDB } from "@/lib/db";
import LeadModel from "@/models/Lead";

export type DashboardRange = "today" | "7d" | "30d" | "custom";

export type AnalyticsFilters = {
  range?: DashboardRange;
  from?: string;
  to?: string;
  insurance_type?: "All" | "Medicare" | "ACA";
  state?: string;
  status?: string;
  source?: string;
};

export type AnalyticsSnapshot = {
  range: DashboardRange;
  from: string;
  to: string;
  totalLeads: number;
  todayLeads: number;
  weekLeads: number;
  monthLeads: number;
  conversionRate: number;
  contactRate: number;
  comparisons: {
    totalLeads: number;
    todayLeads: number;
    weekLeads: number;
    monthLeads: number;
    conversionRate: number;
    contactRate: number;
  };
  lineSeries: Array<{ label: string; total: number; medicare: number; aca: number }>;
  typeSeries: Array<{ name: string; value: number }>;
  stateSeries: Array<{ name: string; value: number }>;
  genderSeries: Array<{ name: string; value: number }>;
  funnelSeries: Array<{ name: string; count: number }>;
  sourceSeries: Array<{ name: string; value: number }>;
  compliance: {
    withJornaya: number;
    missingJornaya: number;
    missingIp: number;
    withJornayaPct: number;
    missingJornayaPct: number;
    missingIpPct: number;
  };
  quality: {
    duplicateLeads: number;
    invalidPhones: number;
    missingDob: number;
  };
  latestLeads: Array<{
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    state: string;
    status: string;
    createdAt: string;
  }>;
};

type RangeBounds = { from: Date; to: Date; previousFrom: Date; previousTo: Date };

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function resolveBounds(filters: AnalyticsFilters): RangeBounds {
  const now = new Date();
  const range = filters.range || "30d";

  if (range === "today") {
    const from = startOfDay(now);
    const to = endOfDay(now);
    return {
      from,
      to,
      previousFrom: startOfDay(addDays(from, -1)),
      previousTo: endOfDay(addDays(to, -1))
    };
  }

  if (range === "7d") {
    const to = endOfDay(now);
    const from = startOfDay(addDays(now, -6));
    return {
      from,
      to,
      previousFrom: startOfDay(addDays(from, -7)),
      previousTo: endOfDay(addDays(to, -7))
    };
  }

  if (range === "custom" && filters.from && filters.to) {
    const from = startOfDay(new Date(filters.from));
    const to = endOfDay(new Date(filters.to));
    const days = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)) + 1);
    return {
      from,
      to,
      previousFrom: startOfDay(addDays(from, -days)),
      previousTo: endOfDay(addDays(from, -1))
    };
  }

  const to = endOfDay(now);
  const from = startOfDay(addDays(now, -29));
  return {
    from,
    to,
    previousFrom: startOfDay(addDays(from, -30)),
    previousTo: endOfDay(addDays(to, -30))
  };
}

function buildQuery(filters: AnalyticsFilters, bounds: RangeBounds) {
  const query: Record<string, unknown> = {
    createdAt: { $gte: bounds.from, $lte: bounds.to }
  };
  if (filters.insurance_type && filters.insurance_type !== "All") query.insurance_type = filters.insurance_type;
  if (filters.state && filters.state !== "All") query.state = filters.state;
  if (filters.status && filters.status !== "All") query.status = filters.status;
  if (filters.source && filters.source !== "All") {
    const source = filters.source.toLowerCase();
    if (source === "organic") {
      query.$or = [
        { utm_source: "" },
        { utm_source: null },
        { utm_source: new RegExp("organic", "i") }
      ];
    } else if (source === "direct") {
      query.$or = [{ utm_source: "" }, { utm_source: null }];
    } else {
      query.utm_source = new RegExp(source, "i");
    }
  }
  return query;
}

function comparePercent(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function normalizeSource(value: string | null | undefined) {
  const v = (value || "").trim().toLowerCase();
  if (!v) return "Direct";
  if (v.includes("google")) return "Google Ads";
  if (v.includes("facebook") || v.includes("meta")) return "Facebook Ads";
  if (v.includes("tiktok")) return "TikTok";
  if (v.includes("organic")) return "Organic";
  if (v.includes("direct")) return "Direct";
  return value || "Direct";
}

function normalizePhone(phone?: string) {
  return String(phone || "").replace(/\D/g, "");
}

function isValidPhone(phone?: string) {
  return normalizePhone(phone).length === 10;
}

function fillDateBuckets(from: Date, to: Date, leads: any[]) {
  const buckets = new Map<string, { total: number; medicare: number; aca: number }>();
  for (const lead of leads) {
    const key = new Date(lead.createdAt).toISOString().slice(0, 10);
    const current = buckets.get(key) || { total: 0, medicare: 0, aca: 0 };
    current.total += 1;
    if (lead.insurance_type === "Medicare") current.medicare += 1;
    if (lead.insurance_type === "ACA") current.aca += 1;
    buckets.set(key, current);
  }

  const series: Array<{ label: string; total: number; medicare: number; aca: number }> = [];
  const cursor = new Date(from);
  while (cursor <= to) {
    const key = cursor.toISOString().slice(0, 10);
    const entry = buckets.get(key) || { total: 0, medicare: 0, aca: 0 };
    series.push({
      label: cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      total: entry.total,
      medicare: entry.medicare,
      aca: entry.aca
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return series;
}

export async function getAnalyticsSnapshot(filters: AnalyticsFilters = {}): Promise<AnalyticsSnapshot> {
  await connectDB();
  const bounds = resolveBounds(filters);
  const currentQuery = buildQuery(filters, bounds);
  const previousBounds = { from: bounds.previousFrom, to: bounds.previousTo, previousFrom: bounds.previousFrom, previousTo: bounds.previousTo };
  const previousQuery = buildQuery(filters, previousBounds);

  const [currentLeads, previousLeads, latestLeads] = await Promise.all([
    LeadModel.find(currentQuery).sort({ createdAt: 1 }).lean(),
    LeadModel.find({ ...previousQuery }).sort({ createdAt: 1 }).lean(),
    LeadModel.find(currentQuery).sort({ createdAt: -1 }).limit(10).lean()
  ]);

  const totalLeads = currentLeads.length;
  const todayKey = startOfDay(new Date()).toISOString().slice(0, 10);
  const todayLeads = currentLeads.filter((lead) => new Date(lead.createdAt).toISOString().slice(0, 10) === todayKey).length;
  const weekLeads = currentLeads.filter((lead) => new Date(lead.createdAt) >= addDays(startOfDay(new Date()), -6)).length;
  const monthLeads = currentLeads.filter((lead) => new Date(lead.createdAt) >= addDays(startOfDay(new Date()), -29)).length;

  const convertedCount = currentLeads.filter((lead) => lead.status === "CONVERTED").length;
  const contactedCount = currentLeads.filter((lead) => lead.status === "CONTACTED" || lead.status === "CONVERTED").length;
  const conversionRate = totalLeads ? Number(((convertedCount / totalLeads) * 100).toFixed(1)) : 0;
  const contactRate = totalLeads ? Number(((contactedCount / totalLeads) * 100).toFixed(1)) : 0;

  const previousTotal = previousLeads.length;
  const previousToday = previousLeads.filter((lead) => new Date(lead.createdAt).toISOString().slice(0, 10) === todayKey).length;
  const previousWeek = previousLeads.filter((lead) => new Date(lead.createdAt) >= addDays(startOfDay(new Date()), -13) && new Date(lead.createdAt) < addDays(startOfDay(new Date()), -6)).length;
  const previousMonth = previousLeads.filter((lead) => new Date(lead.createdAt) >= addDays(startOfDay(new Date()), -59) && new Date(lead.createdAt) < addDays(startOfDay(new Date()), -29)).length;
  const previousConversion = previousLeads.length
    ? Number(((previousLeads.filter((lead) => lead.status === "CONVERTED").length / previousLeads.length) * 100).toFixed(1))
    : 0;
  const previousContact = previousLeads.length
    ? Number((((previousLeads.filter((lead) => lead.status === "CONTACTED" || lead.status === "CONVERTED").length) / previousLeads.length) * 100).toFixed(1))
    : 0;

  const lineSeries = fillDateBuckets(bounds.from, bounds.to, currentLeads);
  const typeCounts = currentLeads.reduce<Record<string, number>>((acc, lead) => {
    const key = lead.insurance_type || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const typeSeries = [
    { name: "Medicare", value: typeCounts.Medicare || 0 },
    { name: "ACA", value: typeCounts.ACA || 0 },
    { name: "Other", value: Math.max(totalLeads - ((typeCounts.Medicare || 0) + (typeCounts.ACA || 0)), 0) }
  ];

  const stateSeries = Object.entries(
    currentLeads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.state] = (acc[lead.state] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const genderSeries = Object.entries(
    currentLeads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.gender] = (acc[lead.gender] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const funnelCounts = [
    { name: "New", count: currentLeads.filter((lead) => lead.status === "NEW").length },
    { name: "Contacted", count: currentLeads.filter((lead) => lead.status === "CONTACTED").length },
    { name: "Converted", count: currentLeads.filter((lead) => lead.status === "CONVERTED").length },
    { name: "Rejected", count: currentLeads.filter((lead) => lead.status === "INVALID").length }
  ];

  const sourceCounts = currentLeads.reduce<Record<string, number>>((acc, lead) => {
    const source = normalizeSource(lead.utm_source);
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
  const sourceSeries = [
    { name: "Google Ads", value: sourceCounts["Google Ads"] || 0 },
    { name: "Facebook Ads", value: sourceCounts["Facebook Ads"] || 0 },
    { name: "TikTok", value: sourceCounts["TikTok"] || 0 },
    { name: "Organic", value: sourceCounts["Organic"] || 0 },
    { name: "Direct", value: sourceCounts["Direct"] || 0 }
  ];

  const withJornaya = currentLeads.filter((lead) => String(lead.jornayaLeadId || lead.jornaya_lead_id || "").trim()).length;
  const missingJornaya = totalLeads - withJornaya;
  const missingIp = currentLeads.filter((lead) => !String(lead.ip_address || "").trim() || lead.ip_address === "unknown").length;

  const duplicateLeads = (() => {
    const seen = new Set<string>();
    let duplicates = 0;
    for (const lead of currentLeads) {
      const key = [normalizePhone(lead.phone), String(lead.email || "").trim().toLowerCase()].join("|");
      if (seen.has(key)) duplicates += 1;
      else seen.add(key);
    }
    return duplicates;
  })();

  const invalidPhones = currentLeads.filter((lead) => !isValidPhone(lead.phone)).length;
  const missingDob = currentLeads.filter((lead) => !String(lead.dob || "").trim()).length;

  return {
    range: filters.range || "30d",
    from: bounds.from.toISOString(),
    to: bounds.to.toISOString(),
    totalLeads,
    todayLeads,
    weekLeads,
    monthLeads,
    conversionRate,
    contactRate,
    comparisons: {
      totalLeads: comparePercent(totalLeads, previousTotal),
      todayLeads: comparePercent(todayLeads, previousToday),
      weekLeads: comparePercent(weekLeads, previousWeek),
      monthLeads: comparePercent(monthLeads, previousMonth),
      conversionRate: comparePercent(conversionRate, previousConversion),
      contactRate: comparePercent(contactRate, previousContact)
    },
    lineSeries,
    typeSeries,
    stateSeries,
    genderSeries,
    funnelSeries: funnelCounts,
    sourceSeries,
    compliance: {
      withJornaya,
      missingJornaya,
      missingIp,
      withJornayaPct: totalLeads ? Number(((withJornaya / totalLeads) * 100).toFixed(1)) : 0,
      missingJornayaPct: totalLeads ? Number(((missingJornaya / totalLeads) * 100).toFixed(1)) : 0,
      missingIpPct: totalLeads ? Number(((missingIp / totalLeads) * 100).toFixed(1)) : 0
    },
    quality: {
      duplicateLeads,
      invalidPhones,
      missingDob
    },
    latestLeads: latestLeads.map((lead) => ({
      id: String(lead._id),
      first_name: String(lead.first_name || ""),
      last_name: String(lead.last_name || ""),
      phone: String(lead.phone || ""),
      state: String(lead.state || ""),
      status: String(lead.status || "NEW"),
      createdAt: lead.createdAt instanceof Date ? lead.createdAt.toISOString() : String(lead.createdAt)
    }))
  };
}
