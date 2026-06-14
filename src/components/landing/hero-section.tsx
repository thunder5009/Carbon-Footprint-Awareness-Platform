/**
 * HeroSection — Aurora animated hero with rich gradient effects.
 */
"use client";

import { motion } from "framer-motion";
import { LiquidButton } from "@/components/ui/liquid-button";
import Link from "next/link";
import { Leaf, ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center px-4"
      aria-labelledby="hero-heading"
    >
      {/* Clean subtle gradient - professional look */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Clean badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
          style={{
            background: "hsl(var(--muted) / 0.3)",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Science-backed carbon calculator · 100% Free
        </motion.div>

        {/* Clean professional headline with highlighted word */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.12 }}
          className="font-bold leading-[1.1] tracking-tight text-foreground"
          style={{
            fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
          }}
        >
          Measure Your Impact.{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Reduce</span>
            <span 
              className="absolute inset-0 bg-emerald-500/20 -skew-y-1 rounded-lg"
              style={{ transform: "translateY(25%) scaleY(0.6)" }}
              aria-hidden="true"
            />
          </span>{" "}
          Your Footprint.
        </motion.h1>

        {/* Clean sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-muted-foreground"
        >
          Track your transport, energy, food, and waste emissions in under 2 minutes.
          Get personalized insights and see exactly where to make a difference.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.32 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link href="/calculator">
            <LiquidButton size="lg" className="text-base px-8 gap-2 group">
              Calculate My Footprint
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </LiquidButton>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            View Dashboard →
          </Link>
        </motion.div>

        {/* Trust badges - clean */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 text-sm pt-8 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>No account needed</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Data stays private</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span>Results in 2 minutes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
