import { AdminShell } from "@/components/admin-shell";
import { SettingsPanel } from "@/components/settings-panel";

export default function SettingsPage() {
  return (
    <AdminShell role="SUPER_ADMIN">
      <div className="max-w-5xl">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Control portal preferences and admin behavior.</p>
      </div>
      <SettingsPanel />
    </AdminShell>
  );
}
