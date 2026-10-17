type AuthFormHeaderProps = {
  title: string;
  description: string;
};

// Reuse the same heading style while each auth page supplies its own text.
export function AuthFormHeader({ title, description }: AuthFormHeaderProps) {
  return (
    <header>
      <h2 className="font-serif text-2xl tracking-tight text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">{description}</p>
    </header>
  );
}
