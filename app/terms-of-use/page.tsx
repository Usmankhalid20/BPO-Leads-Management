import { SiteHeader } from "@/components/site-header";

export default function TermsPage() {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-slate-900">Terms of Use</h1>
        <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 shadow-soft">
          <p>By submitting a form you authorize contact regarding Medicare products and acknowledge that the system may log compliance metadata.</p>
          <p>Admins are managed internally and access is restricted to authorized users.</p>
          <p>Replace this draft with your official terms before launch.</p>
        </div>
      </div>
    </main>
  );
}
