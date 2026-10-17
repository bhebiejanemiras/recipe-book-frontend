import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
type TagProps = { children: ReactNode; className?: string };
export function Tag({ children, className }: TagProps) {
  return (
    <span className={cn("inline-block border border-ink/15 bg-paper px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-ink/65", className)}>
      {children}
    </span>
  );
}
