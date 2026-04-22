import { SiteHeader } from "@/components/site-header";

export default function PrivacyPolicyPage() {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-slate-900">Privacy Policy</h1>
        <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 shadow-soft">
          <p>We collect form data, Jornaya Lead ID, IP address, timestamp, and related lead routing metadata to process Medicare requests.</p>
          <p>We do not publicly expose admin accounts and we use server-side controls for protected operations.</p>
          <p>Update this page with your final legal copy before production launch.</p>
        </div>
      </div>
    </main>
  );
}
