"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LandingContact() {
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent (demo). We'll be in touch!");
      (e.target as HTMLFormElement).reset();
    }, 600);
  }

  return (
    <section id="contact" className="border-t border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Contact</h2>
        <p className="mt-3 text-muted-foreground">Tell us about your school — we respond within 2 business days.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@school.edu.pk" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              required
              rows={4}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="How can we help?"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
