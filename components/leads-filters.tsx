"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { STATES, GENDERS, LEAD_STATUSES, INSURANCE_TYPES } from "@/lib/constants";

type FilterValues = Record<string, string | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function activeItems(values: FilterValues) {
  return [
    values.search ? { label: "Search", value: values.search } : null,
    values.from ? { label: "From", value: values.from } : null,
    values.to ? { label: "To", value: values.to } : null,
    values.state ? { label: "State", value: values.state } : null,
    values.gender ? { label: "Gender", value: values.gender } : null,
    values.status ? { label: "Status", value: values.status } : null,
    values.insurance_type ? { label: "Insurance", value: values.insurance_type } : null
  ].filter(Boolean) as Array<{ label: string; value: string }>;
}

function buildQuery(form: HTMLFormElement) {
  const params = new URLSearchParams();
  const data = new FormData(form);

  for (const [key, rawValue] of data.entries()) {
    const value = String(rawValue).trim();
    if (!value) continue;
    params.set(key, value);
  }

  if (!params.get("limit")) {
    params.set("limit", "25");
  }

  return params;
}

export function LeadsFilters({ values, action = "/admin/leads" }: { values: FilterValues; action?: string }) {
  const router = useRouter();
  const active = activeItems(values);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const params = buildQuery(form);
    router.push(params.toString() ? `${action}?${params.toString()}` : action);
  }

  function handleReset() {
    router.push(action);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <input type="hidden" name="limit" value={firstValue(values.limit) || "25"} />
        <label className="space-y-2 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Search</span>
          <Input
            name="search"
            type="search"
            placeholder="Name, phone, email, or Jornaya ID"
            defaultValue={firstValue(values.search)}
            className="h-11"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">From</span>
          <Input name="from" type="date" defaultValue={firstValue(values.from)} className="h-11" />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">To</span>
          <Input name="to" type="date" defaultValue={firstValue(values.to)} className="h-11" />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">State</span>
          <Select name="state" defaultValue={firstValue(values.state) || ""} className="h-11">
            <option value="">All States</option>
            {STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Gender</span>
          <Select name="gender" defaultValue={firstValue(values.gender) || ""} className="h-11">
            <option value="">All Genders</option>
            {GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</span>
          <Select name="status" defaultValue={firstValue(values.status) || ""} className="h-11">
            <option value="">All Statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Insurance</span>
          <Select name="insurance_type" defaultValue={firstValue(values.insurance_type) || ""} className="h-11">
            <option value="">All Insurance</option>
            {INSURANCE_TYPES.map((insuranceType) => (
              <option key={insuranceType} value={insuranceType}>
                {insuranceType}
              </option>
            ))}
          </Select>
        </label>
        <div className="flex flex-col gap-2 sm:flex-row md:col-span-2 xl:col-span-4">
          <Button type="submit" className="w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleReset}>
            Clear Filters
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Applied filters</span>
        <span className="text-xs text-slate-400">|</span>
        <div className="flex flex-wrap gap-2">
          {active.length ? (
            active.map((item) => (
              <span
                key={`${item.label}:${item.value}`}
                className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {item.label}: {item.value}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-500">No filters applied.</span>
          )}
        </div>
      </div>
    </div>
  );
}
