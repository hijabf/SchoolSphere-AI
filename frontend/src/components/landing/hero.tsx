"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* Full-bleed atmospheric plane */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(13,148,136,0.28),transparent_50%),radial-gradient(ellipse_at_80%_10%,rgba(15,23,42,0.55),transparent_45%),linear-gradient(165deg,#07111a_0%,#0f1720_45%,#0b3d38_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-24 pt-28 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          SchoolSphere AI
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="mt-5 max-w-2xl text-xl font-medium leading-snug text-teal-50/95 sm:text-2xl md:text-3xl"
        >
          Empowering Schools Through Intelligent Digital Transformation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
        >
          An AI-powered educational intelligence platform that helps principals decide, teachers teach,
          parents understand, and students grow — built for low-resource schools.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.32 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button size="lg" className="h-12 px-6 text-base" asChild>
            <Link href="/login">
              Explore Platform <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-white/20 bg-white/5 px-6 text-base text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <a href="#features">View Demo</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
