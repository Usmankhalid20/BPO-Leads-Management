import Link from "next/link";
import { CheckCircle2, Phone, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function ThankYouPage() {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 py-16">
        <div className="w-full rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.28)] sm:p-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              Submission received
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Your request has been received
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              A licensed representative will review your Medicare request and follow up soon.
            </p>

            <div className="mt-8 grid w-full gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left sm:grid-cols-2 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What happens next</p>
                <p className="mt-1 text-sm text-slate-700">Our team will review your submission and contact you during business hours.</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Privacy</p>
                <p className="mt-1 text-sm text-slate-700">Your information is routed securely into the admin CRM for processing.</p>
              </div>
            </div>

            {/* <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600">
              <Phone className="h-4 w-4" />
              Support: {process.env.NEXT_PUBLIC_SUPPORT_PHONE || "1-800-555-0123"}
            </div> */}

            <Link
              href="/"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
