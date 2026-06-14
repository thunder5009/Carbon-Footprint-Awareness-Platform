/**
 * HowItWorks — Animated 3-step process cards.
 *
 * Client component for Framer Motion viewport-triggered animations.
 */
"use client";

import { motion } from "framer-motion";
import { LiquidGlass } from "@/components/ui/liquid-glass";

const steps = [
  { step: "01", title: "Calculate", desc: "Answer simple questions about your lifestyle — transport, energy, food, and waste." },
  { step: "02", title: "Understand", desc: "See your breakdown with interactive charts and compare against national averages." },
  { step: "03", title: "Act", desc: "Get personalized, science-backed tips to reduce your highest-impact areas." },
] as const;

export function HowItWorks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {steps.map((item, i) => (
        <motion.div
          key={item.step}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 25, delay: i * 0.1 }}
        >
          <LiquidGlass className="p-8 h-full" hoverScale>
            <div className="text-5xl font-bold text-primary/30 mb-4" aria-hidden="true">
              {item.step}
            </div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </LiquidGlass>
        </motion.div>
      ))}
    </div>
  );
}
