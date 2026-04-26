"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ShieldCheck, FileCheck2, LockKeyhole, Loader2, BadgeCheck } from "lucide-react";
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

  const trustItems = useMemo(
    () => [
      { title: "Jornaya", desc: "Auto-fills LeadiD at submit time" },
      { title: "Security", desc: "IP captured server-side only" },
      { title: "CRM", desc: "Admin lead routing included" }
    ],
    []
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const jornaya = String(new FormData(form).get("jornaya_lead_id") || "").trim();
    if (!form.checkValidity()) {
      form.reportValidity();
      setError("Please complete the highlighted fields.");
      return;
    }
    if (!consent) {
      setError("Please confirm the consent checkbox to continue.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData(form);
      const res = await fetch("/api/leads", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Unable to submit lead");
      router.push(`/thank-you?ref=${encodeURIComponent(json.id || json.leadId)}&jornaya=${encodeURIComponent(json.jornaya_lead_id || jornaya)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:py-16">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <ShieldCheck className="h-4 w-4" />
          Medicare quote request compliant lead capture
        </div>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">
          Compare Medicare plans with a clean, secure quote form.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 lg:text-lg">
          Built for ad traffic, Jornaya compliance, and secure server-side lead routing into the admin CRM.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="grid gap-4 md:grid-cols-3">
          {trustItems.map((item) => (
            <Card key={item.title} className="border-slate-200/80 shadow-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mx-auto mt-6 max-w-3xl overflow-hidden border-slate-200/80 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-white">
            <CardTitle>Get Free Medicare Quotes</CardTitle>
            <p className="mt-1 text-sm text-slate-500">All required fields are needed to route your request.</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">First name</label>
                  <Input name="first_name" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Last name</label>
                  <Input name="last_name" placeholder="Doe" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Date of birth</label>
                  <Input name="dob" type="date" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">ZIP code</label>
                  <Input name="zip" placeholder="10001" maxLength={5} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">State</label>
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
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Gender</label>
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
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Phone number</label>
                  <Input name="phone" placeholder="5551234567" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email address <span className="text-slate-400">(optional)</span></label>
                  <Input name="email" type="email" placeholder="you@example.com" />
                </div>
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
                  By clicking "Get Free Quotes", I agree to be contacted by licensed insurance agents regarding Medicare plans.
                  I acknowledge TCPA consent, and agree to the{" "}
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
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Get Free Quotes"
                )}
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
    </div>
  );
}
