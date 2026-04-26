"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData(form);
      const res = await fetch("/api/admin/login", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || "Login failed");
        setLoading(false);
        return;
      }
      router.push(json.redirectTo || "/admin/dashboard");
    } catch {
      setError("Unable to reach the server");
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex flex-col justify-between border-b border-slate-200 bg-white px-6 py-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-16">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">HealthPlanLocator</p>
              <p className="text-sm text-slate-500">Call Experts BPO</p>
            </div>
          </div>
          <h1 className="mt-10 text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">
            Secure admin access for Medicare lead operations.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
            Manage leads, compliance, exports, and admin users from a protected CRM portal designed for daily operations.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Lead routing", "Role-based access", "CSV exports"].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 text-sm text-slate-500">Only authorized admins can access this portal.</p>
      </section>

      <section className="flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-600">Admin Portal</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use your assigned admin credentials to continue.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input name="email" type="email" placeholder="admin@healthplanlocator.com" className="pl-9" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input name="password" type="password" placeholder="Enter your password" className="pl-9" required />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300" />
              Remember me
            </label>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">Only authorized admins can access this portal.</p>
        </form>
      </section>
    </main>
  );
}
