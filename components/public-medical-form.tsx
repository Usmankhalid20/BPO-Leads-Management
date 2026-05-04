"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
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
      {
        title: "Lead ID",
        desc: "UUID generated before submit",
      },
      {
        title: "Security",
        desc: "IP captured server-side only",
      },
      {
        title: "CRM",
        desc: "Admin lead routing included",
      },
    ],
    [],
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
      router.push(
        `/thank-you?ref=${encodeURIComponent(json.id || json.leadId)}&jornaya=${encodeURIComponent(json.jornaya_lead_id || leadId)}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const cards = [
    {
      title: "Medicare Plans",
      desc: "Let us help you find an affordable Medicare plan with additional benefits. It is important to understand the choices you have and how they can affect your health and budget. Review your Medicare plan options and check your eligibility to enroll.",
      img: "https://images.pexels.com/photos/7108257/pexels-photo-7108257.jpeg?_gl=1*1ai9cnz*_ga*NDYzNTU4ODkxLjE3Nzc3NTY0MTE.*_ga_8JE65Q40S6*czE3Nzc3NTY0MTAkbzEkZzEkdDE3Nzc3NTY0MjIkajQ4JGwwJGgw",
    },
    {
      title: "Health Insurance",
      desc: "Your health is your greatest wealth. Get covered today with affordable plans tailored to your budget. It is easier to protect your health and financial well-being with products brought to you by our partners, and you can enroll at any time of the year.",
      img: "https://images.pexels.com/photos/7108257/pexels-photo-7108257.jpeg?_gl=1*1ai9cnz*_ga*NDYzNTU4ODkxLjE3Nzc3NTY0MTE.*_ga_8JE65Q40S6*czE3Nzc3NTY0MTAkbzEkZzEkdDE3Nzc3NTY0MjIkajQ4JGwwJGgw",
    },
  ];

  const features = [
    {
      id: 1,
      text: "Our local insurance agents are ready to give you professional insurance advice customized to you and specific to where you live.",
    },
    {
      id: 2,
      text: "We will do the research and provide you with great choices available. We are trained and know about insurance.",
    },
    {
      id: 3,
      text: "Our agents can get you multiple quotes from trusted national and regional insurance partners to find the best personalized coverage for your budget, requirements, and situation.",
    },
  ];

  const faqs = [
    {
      id: 1,
      question: "What does letschooseinsurance.com do?",
      answer:
        "We are affiliated with popular companies that provide quotes about their insurance policies. We connect you with a service provider that could find a great insurance plan for you.",
    },
    {
      id: 2,
      question: "Who operates letschooseinsurance.com?",
      answer:
        "We are affiliated with popular companies that provide quotes about their insurance policies. We connect you with a service provider that could find a great insurance plan for you.",
    },
    {
      id: 3,
      question: "Is there any cost to get an insurance quote through letschooseinsurance.com?",
      answer:
        "We are affiliated with popular companies that provide quotes about their insurance policies. We connect you with a service provider that could find a great insurance plan for you.",
    },
    {
      id: 4,
      question: "Is this website connected with the government?",
      answer:
        "We are affiliated with popular companies that provide quotes about their insurance policies. We connect you with a service provider that could find a great insurance plan for you.",
    },
  ];

  const BORDER = "1px solid #4a5e80";
  const BG = "#1e2d4d";
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const CheckIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9.5" stroke="#9BAEC8" strokeWidth="1" />
      <path
        d="M6 10.5L8.5 13L14 7.5"
        stroke="#9BAEC8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-10 lg:px-8 lg:py-16">
        <div className="grid flex-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
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
                <span
                  className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-blue-600 align-[-0.15em]"
                  aria-hidden="true"
                />
              </h1>
            </div>

           
          </div>

          <div className="w-full">
            <Card className="mx-auto overflow-hidden border-slate-200/80 shadow-sm lg:mx-0">
              <CardHeader className="border-b border-slate-100 bg-white">
                <CardTitle>Get Free Medicare Quotes</CardTitle>
                <p className="mt-1 text-sm text-slate-500">
                  All required fields are needed to route your request.
                </p>
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
                      By checking this box and clicking the "Request Call Back" button, I provide my express written consent via electronic signature authorizing licensed sales agents associated with Quote Experts and up to eight (8) of its partners to contact me regarding their products or services, including final expense insurance and other health-related services, via calls or text messages using automated dialing and prerecorded/artificial voice, even if my number is a mobile number or is listed on any state, federal, or corporate Do Not Call list. I understand this request is initiated by me and is an unscheduled contact request. Consent is not required to obtain any goods or services. I also agree to the{" "}
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

                  {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}

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
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 flex flex-1 flex-col rounded-xl border  p-4 shadow-sm  sm:p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {cards.map((card) => (
              <div
                key={card.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-center text-xl font-semibold tracking-tight text-[#1e2d4d]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-center text-sm leading-7 text-slate-600 sm:text-base">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <section className="mx-auto w-full rounded-2xl bg-white px-6 py-12 sm:px-10 sm:py-16">
              <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-[#1e2d4d]">
                Why Choose Us?
              </h2>

              <p className="mb-7 max-w-3xl text-sm leading-relaxed text-gray-500">
                We are one of the most trusted companies customers choose for help finding the right insurance coverage for their needs.
              </p>

              <ul className="divide-y divide-gray-200 border-b border-gray-200">
                {features.map((feature) => (
                  <li key={feature.id} className="flex items-start gap-3.5 py-4">
                    <CheckIcon />
                    <p className="text-sm leading-relaxed text-gray-500">{feature.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-5">
            <section
              style={{
                backgroundColor: BG,
                borderRadius: "16px",
                padding: "56px 40px",
                width: "100%",
                margin: "0 auto",
                fontFamily: "inherit",
              }}
            >
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginBottom: "32px",
                  letterSpacing: "-0.5px",
                }}
              >
                FAQs
              </h2>

              <div style={{ border: BORDER, overflow: "hidden", borderRadius: "14px" }}>
                {faqs.map((faq) => {
                  const isOpen = openId === faq.id;

                  return (
                    <div
                      key={faq.id}
                      style={{ borderBottom: BORDER }}
                      className="last:border-b-0"
                    >
                      <button
                        onClick={() => toggle(faq.id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          padding: "14px 20px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                        aria-expanded={isOpen}
                      >
                        <span
                          style={{
                            flexShrink: 0,
                            width: "16px",
                            textAlign: "center",
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#ffffff",
                            lineHeight: 1,
                          }}
                        >
                          {isOpen ? "−" : "+"}
                        </span>
                        <span>{faq.question}</span>
                      </button>

                      {isOpen && faq.answer && (
                        <div
                          style={{
                            borderTop: BORDER,
                            padding: "28px 20px 28px 52px",
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              color: "#b0bdd0",
                              lineHeight: 1.7,
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
