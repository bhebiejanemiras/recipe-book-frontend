import type { TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto border border-ink/10 bg-white">
      <table
        className={cn(
          "w-full text-left text-sm [&_th]:px-5 [&_th]:py-3.5 [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-ink/50 [&_td]:px-5 [&_td]:py-4 [&_thead]:border-b [&_thead]:border-ink/10 [&_tbody_tr+tr]:border-t [&_tbody_tr+tr]:border-ink/10 [&_tbody_tr:hover]:bg-paper",
          className,
        )}
        {...props}
      />
    </div>
  );
}
