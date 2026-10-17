import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AlertTone = "success" | "error" | "info";

type AlertProps = {
  tone?: AlertTone;
  children: ReactNode;
  className?: string;
};

const tones: Record<AlertTone, string> = {
  success: "border-emerald-600/30 bg-emerald-50 text-emerald-900",
  error: "border-rose-600/30 bg-rose-50 text-rose-700",
  info: "border-sky-600/30 bg-sky-50 text-sky-900",
};

// Shared feedback message. Errors are announced immediately as alerts,
// while success and info messages use the polite status role.
export function Alert({ tone = "info", children, className }: AlertProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-xl border px-4 py-3 text-sm", tones[tone], className)}
    >
      {children}
    </p>
  );
}
