import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus:border-brand-500 focus:outline-none",
        props.className
      )}
    />
  );
}
