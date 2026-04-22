"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const tabs = ["General Settings", "Lead Status Settings", "Export Settings", "Account Settings"] as const;

export function SettingsPanel() {
  const [active, setActive] = useState<(typeof tabs)[number]>("General Settings");

  return (
    <div className="mt-6">
      <div className="inline-flex rounded-xl bg-slate-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${active === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <Card className="mt-4">
        <CardHeader>
          <h3 className="font-semibold">{active}</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {active === "General Settings" ? (
            <>
              <p className="text-sm text-slate-600">Branding, lead routing, and portal preferences.</p>
              <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm">
                Dark mode toggle
                <input type="checkbox" />
              </label>
            </>
          ) : null}
          {active === "Lead Status Settings" ? <p className="text-sm text-slate-600">Manage default lead statuses and display order.</p> : null}
          {active === "Export Settings" ? <p className="text-sm text-slate-600">Choose which fields appear in CSV exports and whether to include notes.</p> : null}
          {active === "Account Settings" ? <p className="text-sm text-slate-600">Update profile, security, and notification preferences.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
