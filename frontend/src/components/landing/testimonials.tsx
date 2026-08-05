const testimonials = [
  {
    quote:
      "For the first time I can see which classes need intervention before midterms — not after the damage.",
    name: "Principal Farooq Malik",
    role: "Al-Noor Progressive School, Lahore",
  },
  {
    quote:
      "AI comments grounded in marks and attendance save me entire evenings during report season.",
    name: "Ms. Ayesha Siddiqui",
    role: "Mathematics Teacher",
  },
  {
    quote:
      "I finally understand my daughter’s progress in plain language, not just percentage columns.",
    name: "Mr. Imran Khan",
    role: "Parent",
  },
];

export function LandingTestimonials() {
  return (
    <section className="border-t border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Trusted by educators</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="border-t border-primary/30 pt-6">
              <p className="text-sm leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
