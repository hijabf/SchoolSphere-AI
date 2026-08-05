const tiers = [
  { name: "Starter", price: "Coming Soon", desc: "Single campus essentials" },
  { name: "Growth", price: "Coming Soon", desc: "AI suite + analytics" },
  { name: "District", price: "Coming Soon", desc: "Multi-school intelligence" },
];

export function LandingPricing() {
  return (
    <section id="pricing" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Pricing</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Coming Soon</h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          We are finalizing accessible pricing for low-resource schools across Pakistan.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className="rounded-2xl border border-dashed border-border bg-card/50 p-8 opacity-80">
              <h3 className="font-display text-xl font-semibold">{t.name}</h3>
              <p className="mt-2 text-2xl font-semibold text-primary">{t.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
