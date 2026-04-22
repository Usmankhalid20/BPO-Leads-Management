import { AdminShell } from "@/components/admin-shell";
import { SettingsPanel } from "@/components/settings-panel";

export default function SettingsPage() {
  return (
    <AdminShell role="SUPER_ADMIN">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <SettingsPanel />
    </AdminShell>
  );
}
