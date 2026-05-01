import Link from "next/link";
import { LayoutDashboard, ListChecks, Settings, Users, Shield, LogOut, BarChart3 } from "lucide-react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/leads", label: "Leads", icon: ListChecks },
  { href: "/admin/admin-management", label: "Admins", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children, role }: { children: React.ReactNode; role?: string }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <div className="flex h-screen">
        <aside className="hidden h-screen w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Call Experts BPO</p>
              {/* <p className="text-xs text-slate-500">Admin CRM</p> */}
            </div>
          </div>
          <nav className="space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
            <div className="font-medium text-slate-900">{role || "Admin"}</div>
            <p className="mt-1">Only authorized admins can access this portal.</p>
          </div>
        </aside>
        <main className="min-h-screen flex-1 overflow-x-hidden">
          <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {/* <p className="text-sm text-slate-500">Call Experts BPO</p> */}
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
              </div>
              <form action="/api/admin/logout" method="post">
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 sm:w-auto">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          </div>
          <nav className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex min-w-max items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className=" p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
