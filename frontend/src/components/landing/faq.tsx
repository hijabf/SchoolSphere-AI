"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is this a traditional school management system?",
    a: "No. SchoolSphere AI is an educational intelligence platform — analytics, early warnings, and grounded AI copilots on top of core school operations.",
  },
  {
    q: "Does the AI invent student data?",
    a: "Never. Prompts are grounded in attendance, marks, behavior, and fees from your database (or demo dataset).",
  },
  {
    q: "Which roles are supported?",
    a: "Admin (Principal), Teacher, Parent, and Student — each with a distinct dashboard and RBAC.",
  },
  {
    q: "Can parents see other children?",
    a: "No. Parents only access linked children via parent–student relationships.",
  },
  {
    q: "Do I need Supabase to try the demo?",
    a: "Not for DEMO_MODE. Demo accounts work against the FastAPI demo dataset. Connect Supabase for production persistence.",
  },
  {
    q: "Is Gemini required?",
    a: "Optional. Without a Gemini API key, grounded fallback insights still return from school metrics.",
  },
];

export function LandingFAQ() {
  return (
    <section id="faq" className="border-t border-border py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">FAQ</h2>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
