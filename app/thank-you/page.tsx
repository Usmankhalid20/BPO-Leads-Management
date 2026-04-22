import Link from "next/link";
import { CheckCircle2, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function ThankYouPage({ searchParams }: { searchParams: { ref?: string; jornaya?: string } }) {
  const jornayaLeadId = searchParams.jornaya || searchParams.ref || "-";
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-semibold text-slate-900">Your request has been received</h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">A licensed representative will review your Medicare request and follow up soon.</p>
        <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="grid gap-4 text-left sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Reference ID</p>
              <p className="mt-1 break-all font-mono text-sm text-slate-900">{searchParams.ref || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Jornaya Lead ID</p>
              <p className="mt-1 break-all font-mono text-sm text-slate-900">{jornayaLeadId}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600">
            <Phone className="h-4 w-4" />
            Support: {process.env.NEXT_PUBLIC_SUPPORT_PHONE || "1-800-555-0123"}
          </div>
        </div>
        <Link href="/" className="mt-8 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700">
          Return Home
        </Link>
      </div>
    </main>
  );
}
