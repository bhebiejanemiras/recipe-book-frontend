type AuthHeaderProps = {
  tone?: "light" | "dark";
};

// Shared branding for the sign-in screens. The dark tone is used on the
// marketing panel, the light tone on the compact mobile header.
export function AuthHeader({ tone = "light" }: AuthHeaderProps) {
  const dark = tone === "dark";
  const title = dark ? "text-paper" : "text-ink";
  const muted = dark ? "text-paper/55" : "text-ink/55";
  const border = dark ? "border-paper/20" : "border-ink/15";

  return (
    <header>
      <span className={`inline-flex items-center gap-2 border ${border} px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${muted}`}>
        <span className="h-1.5 w-1.5 bg-accent" />
        Your kitchen companion
      </span>
      <h1 className={`mt-6 font-serif text-4xl leading-none tracking-tight sm:text-5xl ${title}`}>Recipe Book</h1>
      <p className={`mt-4 max-w-sm text-sm leading-relaxed ${muted}`}>Keep your favourite meals in one place.</p>
    </header>
  );
}
