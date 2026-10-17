import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "inverse";
  children: ReactNode;
};

// Square, bordered buttons keep the interface flat and box-like.
const variants = {
  primary: "border-accent bg-accent text-white hover:border-ink hover:bg-ink",
  secondary: "border-ink/20 bg-white text-ink hover:border-ink hover:bg-paper",
  tertiary: "border-transparent text-ink/60 hover:text-ink",
  danger: "border-danger/40 bg-white text-danger hover:border-danger hover:bg-danger/5",
  inverse: "border-paper/30 bg-transparent text-paper hover:border-paper hover:bg-paper/10",
};

export function Button({ variant = "primary", className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 border px-4 py-2.5 text-sm font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
