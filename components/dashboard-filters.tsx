"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { STATES } from "@/lib/constants";

export type FilterValues = {
  range?: string;
  from?: string;
  to?: string;
  insurance_type?: string;
  state?: string;
  status?: string;
  source?: string;
};

function formatRangeLabel(value?: string) {
  switch (value) {
    case "today":
      return "Today";
    case "7d":
      return "Last 7 Days";
    case "30d":
      return "Last 30 Days";
    case "custom":
      return "Custom Range";
    default:
      return "Last 30 Days";
  }
}

function activeItems(values: FilterValues) {
  return [
    values.range && values.range !== "30d" ? { label: "Date Range", value: formatRangeLabel(values.range) } : null,
    values.from || values.to ? { label: "Custom Dates", value: `${values.from || "Start"} - ${values.to || "End"}` } : null,
    values.insurance_type && values.insurance_type !== "All" ? { label: "Insurance", value: values.insurance_type } : null,
    values.state && values.state !== "All" ? { label: "State", value: values.state } : null,
    values.status && values.status !== "All" ? { label: "Status", value: values.status } : null,
    values.source && values.source !== "All" ? { label: "Source", value: values.source } : null
  ].filter(Boolean) as Array<{ label: string; value: string }>;
}

function buildQuery(form: HTMLFormElement) {
  const params = new URLSearchParams();
  const data = new FormData(form);
  for (const [key, rawValue] of data.entries()) {
    const value = String(rawValue).trim();
    if (!value) continue;
    if (value === "All") continue;
    params.set(key, value);
  }
  const range = String(data.get("range") || "30d");
  if (!params.get("range")) params.set("range", range);
  return params;
}

export function DashboardFilters({
  values,
  action = "/admin/dashboard",
  showStatus = false,
  showSource = false
}: {
  values: FilterValues;
  action?: string;
  showStatus?: boolean;
  showSource?: boolean;
}) {
  const router = useRouter();
  const active = activeItems(values);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const params = buildQuery(form);
    const range = params.get("range");
    if (range === "custom" && !params.get("from") && !params.get("to")) {
      form.querySelector<HTMLInputElement>('input[name="from"]')?.focus();
      return;
    }
    router.push(`${action}?${params.toString()}`);
  }

  function handleReset() {
    router.push(action);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <form onSubmit={handleSubmit} className="grid gap-3 lg:grid-cols-12">
        <Select name="range" defaultValue={values.range || "30d"} className="lg:col-span-2">
          <option value="today">Today</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="custom">Custom Range</option>
        </Select>
        <Input name="from" type="date" defaultValue={values.from} className="lg:col-span-2" />
        <Input name="to" type="date" defaultValue={values.to} className="lg:col-span-2" />
        <Select name="insurance_type" defaultValue={values.insurance_type || "All"} className="lg:col-span-2">
          <option value="All">All Insurance</option>
          <option value="Medicare">Medicare</option>
          <option value="ACA">ACA</option>
        </Select>
        <Select name="state" defaultValue={values.state || "All"} className="lg:col-span-2">
          <option value="All">All States</option>
          {STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>
        {showStatus ? (
          <Select name="status" defaultValue={values.status || "All"} className="lg:col-span-2">
            <option value="All">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="INVALID">Rejected</option>
          </Select>
        ) : null}
        {showSource ? (
          <Select name="source" defaultValue={values.source || "All"} className="lg:col-span-2">
            <option value="All">All Sources</option>
            <option value="google">Google Ads</option>
            <option value="facebook">Facebook Ads</option>
            <option value="tiktok">TikTok</option>
            <option value="organic">Organic</option>
            <option value="direct">Direct</option>
          </Select>
        ) : null}
        <div className="flex gap-2 lg:col-span-2">
          <Button type="submit" className="flex-1">
            Apply Filters
          </Button>
          <Button type="button" variant="outline" className="flex-1" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Applied Filters</span>
        {active.length ? (
          active.map((item) => (
            <span key={`${item.label}:${item.value}`} className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {item.label}: {item.value}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500">No filters applied.</span>
        )}
      </div>
    </div>
  );
}
