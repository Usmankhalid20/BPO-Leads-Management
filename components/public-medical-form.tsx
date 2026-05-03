"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ShieldCheck, FileCheck2, LockKeyhole, Loader2, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { STATES, GENDERS } from "@/lib/constants";

function generateJornayaLeadId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `leadid_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

export function PublicMedicalForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [landingPageUrl, setLandingPageUrl] = useState("");
  const [jornayaLeadId, setJornayaLeadId] = useState("");
  const [typedHeading, setTypedHeading] = useState("");
  const [utmSource] = useState("");
  const [utmCampaign] = useState("");
  const headingText = "Compare Medicare plans with a clean, secure quote form.";

  useEffect(() => {
    setLandingPageUrl(window.location.href);
    setJornayaLeadId(generateJornayaLeadId());
  }, []);

  useEffect(() => {
    let index = 0;
    let deleting = false;
    let timer: number | undefined;

    const tick = () => {
      if (!deleting) {
        index += 1;
        setTypedHeading(headingText.slice(0, index));
        if (index >= headingText.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1400);
          return;
        }
      } else {
        index -= 1;
        setTypedHeading(headingText.slice(0, index));
        if (index <= 0) {
          deleting = false;
          timer = window.setTimeout(tick, 450);
          return;
        }
      }
      timer = window.setTimeout(tick, deleting ? 24 : 28);
    };

    tick();

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const trustItems = useMemo(
    () => [
      { title: "Lead ID", desc: "UUID generated before submit" },
      { title: "Security", desc: "IP captured server-side only" },
      { title: "CRM", desc: "Admin lead routing included" }
    ],
    []
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
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
      const leadId = jornayaLeadId || generateJornayaLeadId();
      setJornayaLeadId(leadId);

      const formData = new FormData(form);
      formData.set("jornaya_lead_id", leadId);
      formData.set("jornayaLeadId", leadId);

      const res = await fetch("/api/leads", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Unable to submit lead");
      router.push(`/thank-you?ref=${encodeURIComponent(json.id || json.leadId)}&jornaya=${encodeURIComponent(json.jornaya_lead_id || leadId)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }
const cards = [
  {
    // badge: "Medicare Plans",
    title: "Medicare Plans",
    desc: "Let us help you find an affordable Medicare plan with additional benefits. It’s important to understand the choices you have in plans and how those choices can affect your health and budget. Review your Medicare plan options and check your eligibility to enroll.",
    img: "https://images.pexels.com/photos/7108257/pexels-photo-7108257.jpeg?_gl=1*1ai9cnz*_ga*NDYzNTU4ODkxLjE3Nzc3NTY0MTE.*_ga_8JE65Q40S6*czE3Nzc3NTY0MTAkbzEkZzEkdDE3Nzc3NTY0MjIkajQ4JGwwJGgw",
  },
  {
    // badge: "Health Insurance",
    title: "Health Insurance",
    desc: "First wealth is health, get it covered today with affordable plans tailored according to your budget. It’s easier to care for your health and financial well-being with products brought to you by our partners. They’re perfect and you can enroll at any time of the year.",
    img: "https://images.pexels.com/photos/7108257/pexels-photo-7108257.jpeg?_gl=1*1ai9cnz*_ga*NDYzNTU4ODkxLjE3Nzc3NTY0MTE.*_ga_8JE65Q40S6*czE3Nzc3NTY0MTAkbzEkZzEkdDE3Nzc3NTY0MjIkajQ4JGwwJGgw",
  },
];
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="text-center lg:sticky lg:top-8 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            Medicare quote request compliant lead capture
          </div>
          <div className="relative mx-auto mt-6 max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 text-left shadow-[0_20px_70px_-28px_rgba(15,23,42,0.35)] backdrop-blur lg:mx-0 lg:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(239,246,255,0.82)_35%,rgba(224,242,254,0.68)_100%)]" />
            <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.10),transparent_28%)]" />
            <h1 className="relative mx-auto text-4xl font-semibold tracking-tight text-slate-900 lg:mx-0 lg:text-5xl">
              <span>{typedHeading || "\u00A0"}</span>
              <span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-blue-600 align-[-0.15em]" aria-hidden="true" />
            </h1>
          </div>
        </div>

        <div className="w-full">
          <Card className="mx-auto overflow-hidden border-slate-200/80 shadow-sm lg:mx-0">
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
                  <label className="text-sm font-medium text-slate-700">
                    Email address <span className="text-slate-400">(optional)</span>
                  </label>
                  <Input name="email" type="email" placeholder="you@example.com" />
                </div>
              </div>

              <input type="hidden" name="jornaya_lead_id" value={jornayaLeadId} readOnly />
              <input type="hidden" name="jornayaLeadId" value={jornayaLeadId} readOnly />
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
                By checking this box and clicking the “Request Call Back” button, I provide my express written consent via electronic signature authorizing licensed sales agents associated with Quote Experts and up to eight (8) of its partners to contact me regarding their products or services, including final expense insurance and other health-related services, via calls or text messages using automated dialing and prerecorded/artificial voice, even if my number is a mobile number or is listed on any state, federal, or corporate Do Not Call list. I understand this request is initiated by me and is an unscheduled contact request. Consent is not required to obtain any goods or services.I also agree to the{" "}
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
                  "Request Call Back"
                )}
              </Button>

              {/* <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 sm:grid-cols-3">
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
              </div> */}
            </form>
          </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16 rounded-2xl borde  p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="rounded-xl border ...">
            <img src={card.img} alt={card.title} />
            <div className="p-5">
              {/* <span className="badge">{card.badge}</span> */}
              <h3 className="mt-2 text-lg font-semibold text-center">{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
