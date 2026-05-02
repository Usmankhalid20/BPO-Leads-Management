import Link from "next/link";
import { ShieldCheck, Phone } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-soft">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Qoute Experts</p>
            {/* <p className="text-xs text-slate-500">Call Experts BPO</p> */}
          </div>
        </Link>
        {/* <a className="inline-flex items-center gap-2 text-sm font-medium text-slate-700" href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || "18005550123"}`}>
          <Phone className="h-4 w-4" />
          {process.env.NEXT_PUBLIC_SUPPORT_PHONE || "1-800-555-0123"}
        </a> */}
      </div>
    </header>
  );
}
