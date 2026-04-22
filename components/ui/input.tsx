import * as React from "react";
import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-offset-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20", props.className)} />;
}
