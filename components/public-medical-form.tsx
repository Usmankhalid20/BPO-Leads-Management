"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ShieldCheck, FileCheck2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { STATES, GENDERS } from "@/lib/constants";

export function PublicMedicalForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [landingPageUrl, setLandingPageUrl] = useState("");
  const [utmSource] = useState("");
  const [utmCampaign] = useState("");

  useEffect(() => {
    setLandingPageUrl(window.location.href);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData(event.currentTarget);
      const res = await fetch("/api/leads", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Unable to submit lead");
      router.push(`/thank-you?ref=${encodeURIComponent(json.id || json.leadId)}&jornaya=${encodeURIComponent(json.jornaya_lead_id || "")}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <ShieldCheck className="h-4 w-4" />
          Medicare quote request compliant lead capture
        </div>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">
          Compare Medicare plans with a fast, professional quote experience.
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Built for ad traffic, Jornaya compliance, and secure lead routing to the admin CRM.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Jornaya", "LeadiD auto-capture"],
            ["Security", "Server-side IP logging"],
            ["CRM", "Admin dashboard included"]
          ].map(([title, desc]) => (
            <Card key={title}>
              <CardContent className="p-4">
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="text-sm text-slate-500">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Get Free Medicare Quotes</CardTitle>
          <p className="mt-1 text-sm text-slate-500">All fields marked required are needed to route your request.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="first_name" placeholder="First name" required />
              <Input name="last_name" placeholder="Last name" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="dob" type="date" placeholder="Date of birth" required />
              <Input name="zip" placeholder="ZIP code" maxLength={5} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select name="state" required defaultValue="">
                <option value="" disabled>
                  Select state
                </option>
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
              <Select name="gender" required defaultValue="">
                <option value="" disabled>
                  Select gender
                </option>
                {GENDERS.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="phone" placeholder="Phone number" required />
              <Input name="email" type="email" placeholder="Email address (optional)" />
            </div>
            <input type="hidden" name="jornaya_lead_id" id="leadid_token" />
            <input type="hidden" name="insurance_type" value="Medicare" />
            <input type="hidden" name="landing_page_url" value={landingPageUrl} />
            <input type="hidden" name="utm_source" value={utmSource} />
            <input type="hidden" name="utm_campaign" value={utmCampaign} />

            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <input
                type="checkbox"
                name="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
                required
              />
              <span>
                By clicking "Get Free Quotes", I agree to be contacted by licensed insurance agents regarding Medicare plans. I acknowledge TCPA consent, and agree to the{" "}
                <a className="text-blue-600 underline" href="/terms-of-use">
                  Terms of Use
                </a>{" "}
                and{" "}
                <a className="text-blue-600 underline" href="/privacy-policy">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

            <Button type="submit" size="lg" className="w-full" disabled={loading || !consent}>
              {loading ? "Submitting..." : "Get Free Quotes"}
            </Button>

            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-green-600" />
                Secure lead capture
              </div>
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-blue-600" />
                Backend IP logging
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-orange-500" />
                Timestamped submission
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
