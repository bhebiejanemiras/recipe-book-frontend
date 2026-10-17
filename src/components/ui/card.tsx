import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
type CardProps = { children: ReactNode; className?: string };
export function Card({ children, className }: CardProps) {
  return <div className={cn("border border-ink/10 bg-white", className)}>{children}</div>;
}
