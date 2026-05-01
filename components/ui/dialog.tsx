import * as React from "react";

export function Dialog({ open, children }: { open: boolean; children: React.ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 sm:items-center">{children}</div>;
}
