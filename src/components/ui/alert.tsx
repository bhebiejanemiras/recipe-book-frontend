import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AlertProps = {
  tone?: "success" | "error" | "info";
  children: ReactNode;
  className?: string;
};

const tones = {
  error: "border-danger/30 bg-danger/5 text-danger",
  success: "border-accent/30 bg-accent/5 text-accent",
  info: "border-ink/15 bg-paper text-ink/70",
};

export function Alert({ tone = "info", children, className }: AlertProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn("border px-4 py-3 text-sm font-medium", tones[tone], className)}
    >
      {children}
    </p>
  );
}
