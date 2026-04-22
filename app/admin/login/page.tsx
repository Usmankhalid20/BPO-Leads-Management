"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData(event.currentTarget);
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
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-slate-950 px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">HealthPlanLocator</p>
              <p className="text-sm text-slate-300">Call Experts BPO</p>
            </div>
          </div>
          <h1 className="mt-16 max-w-lg text-5xl font-semibold tracking-tight">Admin CRM built for Medicare lead operations.</h1>
          <p className="mt-6 max-w-lg text-lg text-slate-300">Protected access for Super Admin and Admin roles. No public registration.</p>
        </div>
        <p className="text-sm text-slate-400">Only authorized admins can access this portal.</p>
      </section>
      <section className="flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Admin Login</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage leads, admins, and exports.</p>
          <div className="mt-6 space-y-4">
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Password" required />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="remember" />
              Remember me
            </label>
            {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">Only authorized admins can access this portal.</p>
        </form>
      </section>
    </main>
  );
}
