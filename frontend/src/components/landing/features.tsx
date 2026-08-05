"use client";

import { motion } from "framer-motion";
import { Brain, LineChart, Shield, Users } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "For Principals",
    body: "Executive dashboards, early warnings, and an AI copilot grounded in your school’s real data.",
  },
  {
    icon: Users,
    title: "For Teachers",
    body: "Attendance, marking, lesson plans, and AI comments that reclaim hours every week.",
  },
  {
    icon: LineChart,
    title: "For Parents",
    body: "Clear progress stories — grades, attendance, behavior, and fees — for your children only.",
  },
  {
    icon: Brain,
    title: "For Students",
    body: "Track GPA, plan study weeks, unlock career guidance, and own your growth.",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Platform</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Four roles. One intelligent school OS.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Role-based workspaces designed like modern SaaS — fast, minimal, and focused on decisions that matter.
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08 }}
              className="border-l-2 border-primary/40 pl-5"
            >
              <item.icon className="mb-3 size-5 text-primary" />
              <h3 className="font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
