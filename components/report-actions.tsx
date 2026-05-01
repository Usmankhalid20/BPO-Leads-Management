"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export function ReportActions({ csvHref }: { csvHref: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Link href={csvHref} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto">
        <Download className="h-4 w-4" />
        Export CSV
      </Link>
      <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.print()}>
        <FileText className="h-4 w-4" />
        Download PDF
      </Button>
    </div>
  );
}
