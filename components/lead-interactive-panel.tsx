"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, BadgeCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

type Note = {
  _id: string;
  text: string;
  createdAt: string;
  admin_name: string;
};

export function LeadInteractivePanel({
  leadId,
  status,
  notes
}: {
  leadId: string;
  status: string;
  notes: Note[];
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentNotes, setCurrentNotes] = useState(notes);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  async function updateStatus(nextStatus: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });
    if (res.ok) {
      setCurrentStatus(nextStatus);
      router.refresh();
    }
    setSaving(false);
  }

  async function saveNote() {
    if (!noteText.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: noteText, admin_name: "Admin" })
    });
    if (res.ok) {
      const json = await res.json();
      const updated = json?.lead?.notes || [];
      setCurrentNotes(updated);
      setNoteText("");
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
        <Button className="w-full sm:w-auto" variant="outline" onClick={() => updateStatus("CONTACTED")} disabled={saving || currentStatus === "CONTACTED"}>
          <CheckCircle2 className="h-4 w-4" />
          Mark as Contacted
        </Button>
        <Button className="w-full sm:w-auto" variant="outline" onClick={() => updateStatus("CONVERTED")} disabled={saving || currentStatus === "CONVERTED"}>
          <BadgeCheck className="h-4 w-4" />
          Mark as Converted
        </Button>
        <Link
          href={`/api/admin/leads/export?${new URLSearchParams({ id: leadId }).toString()}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Export Lead
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="font-semibold text-slate-900">Notes</h3>
        <div className="mt-4 space-y-4">
          <Textarea placeholder="Add a note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} />
          <Button className="w-full sm:w-auto" onClick={saveNote} disabled={saving || !noteText.trim()}>
            {saving ? "Saving..." : "Save Note"}
          </Button>
          <div className="space-y-3">
            {currentNotes.map((note) => (
              <div key={note._id} className="rounded-xl border border-slate-200 p-3 text-sm">
                <p className="text-slate-900">{note.text}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {note.admin_name} · {formatDate(note.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
