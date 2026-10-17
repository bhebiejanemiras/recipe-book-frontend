import type { ReactNode } from "react";

type PageHeaderProps = {
  children?: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

// A solid ink panel gives each page a strong, boxed header.
export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-6 border border-ink/10 bg-ink px-6 py-8 text-paper sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:py-10">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/45">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/60">{description}</p>
      </div>
      {children}
    </header>
  );
}
