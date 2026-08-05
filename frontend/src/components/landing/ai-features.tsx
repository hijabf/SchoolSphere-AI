"use client";

const aiItems = [
  "AI Report Card Comments",
  "Parent Progress Summaries",
  "Early Warning System",
  "Dropout Risk Prediction",
  "Principal AI Copilot",
  "Lesson & Question Generators",
  "School Health Score",
  "SDG & Equity Insights",
];

export function LandingAI() {
  return (
    <section id="ai" className="border-t border-border bg-muted/40 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Intelligence</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            AI that reads your school — never invents it.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every insight is grounded in attendance, marks, behavior, and fees. Hallucinations are not a feature.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {aiItems.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
