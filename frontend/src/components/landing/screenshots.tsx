"use client";

export function LandingScreenshots() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Product</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Executive clarity at a glance
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          A principal workspace with live health scores, risk flags, and trend charts — no spreadsheet archaeology.
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-teal-950/10">
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-3 text-xs text-muted-foreground">admin.schoolsphere.ai</span>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-4">
            {[
              ["Students", "500"],
              ["Attendance", "89.4%"],
              ["At Risk", "47"],
              ["Health", "78.4"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 px-6 pb-6 md:grid-cols-2">
            <div className="h-40 rounded-xl border border-border bg-gradient-to-br from-primary/15 to-transparent p-4">
              <p className="text-xs font-medium text-muted-foreground">Attendance trend</p>
              <div className="mt-6 flex h-20 items-end gap-2">
                {[40, 55, 48, 62, 70, 66, 78].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-primary/70" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="h-40 rounded-xl border border-border bg-gradient-to-br from-slate-500/10 to-transparent p-4">
              <p className="text-xs font-medium text-muted-foreground">Subject performance</p>
              <div className="mt-4 space-y-2">
                {["Math 72%", "English 81%", "Science 76%"].map((row) => (
                  <div key={row} className="flex items-center justify-between text-xs">
                    <span>{row.split(" ")[0]}</span>
                    <div className="mx-3 h-1.5 flex-1 rounded-full bg-muted">
                      <div className="h-1.5 rounded-full bg-primary" style={{ width: row.split(" ")[1] }} />
                    </div>
                    <span className="text-muted-foreground">{row.split(" ")[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
