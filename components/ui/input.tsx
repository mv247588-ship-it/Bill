import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none",
        props.className
      )}
    />
  );
}
