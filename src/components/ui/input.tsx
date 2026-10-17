import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div>
      <input
        className={cn(
          "w-full border bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-accent focus:ring-2 focus:ring-accent/15",
          error ? "border-danger" : "border-ink/15",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
