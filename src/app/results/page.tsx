"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { LiquidGlass } from "@/components/ui/liquid-glass";

// Code-split Recharts to prevent blocking the main thread
const LiquidChart = dynamic(() => import("@/components/ui/liquid-chart").then(mod => mod.LiquidChart), { ssr: false });
import { LiquidButton } from "@/components/ui/liquid-button";
import Link from "next/link";
import type { CalculationResult } from "@/lib/calculations/calculator";

export default function ResultsPage() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("carbonResult");
    if (stored) setResult(JSON.parse(stored));
  }, []);

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <LiquidGlass className="p-12">
          <h2 className="text-2xl font-bold mb-4">No calculation found</h2>
          <Link href="/calculator">
            <LiquidButton>Go to Calculator</LiquidButton>
          </Link>
        </LiquidGlass>
      </div>
    );
  }

  const chartData = [
    { name: "Transport", value: result.breakdown.transport, color: "hsl(var(--chart-transport))" },
    { name: "Energy", value: result.breakdown.energy, color: "hsl(var(--chart-energy))" },
    { name: "Food", value: result.breakdown.food, color: "hsl(var(--chart-food))" },
    { name: "Waste", value: result.breakdown.waste, color: "hsl(var(--chart-waste))" },
  ];

  const usAverage = 16;
  const comparison = result.totalCO2 < usAverage ? "below" : "above";
  const percentage = Math.abs(Math.round(((result.totalCO2 - usAverage) / usAverage) * 100));

  // Determine highest emission sector
  const breakdown = result.breakdown;
  const categories = Object.keys(breakdown) as Array<keyof typeof breakdown>;
  const highestCategory = categories.reduce((a, b) => 
    breakdown[a] > breakdown[b] ? a : b
  );

  const recommendations = {
    transport: [
      "Switch to public transit or bicycle/walk for local trips.",
      "Consider a hybrid or electric vehicle next time you upgrade.",
      "Minimize flight trips, or choose direct flights when traveling."
    ],
    energy: [
      "Switch to a 100% renewable electricity grid plan if available.",
      "Upgrade to smart thermostats and insulate drafty windows/doors.",
      "Ensure all light fixtures use low-power LED bulbs."
    ],
    food: [
      "Introduce vegetarian or vegan meals several days a week.",
      "Source local and organic produce to lower supply chain emissions.",
      "Commit to composting and plan meals to limit food disposal."
    ],
    waste: [
      "Establish strict sorting of paper, plastics, and metals.",
      "Reduce buying single-use bottled beverages entirely.",
      "Compost food scraps to keep organic material out of landfills."
    ]
  };

  const activeRecs = recommendations[highestCategory as keyof typeof recommendations] || recommendations.transport;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="text-center space-y-4"
      >
        <h1 id="results-heading" className="text-4xl md:text-5xl font-bold glass-text">Your Results</h1>
        <p className="text-muted-foreground text-lg">
          Your footprint is{" "}
          <span className="font-semibold text-primary">
            {result.totalCO2.toFixed(1)} tons CO₂/year
          </span>
          .
        </p>
        <p className="text-sm max-w-md mx-auto text-muted-foreground bg-white/5 py-2 px-4 rounded-full border border-white/5">
          This is{" "}
          <span className="font-semibold text-foreground">{percentage}% {comparison}</span>{" "}
          the US national average of 16 tons.
        </p>
      </motion.div>

      <section aria-labelledby="breakdown-heading" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 id="breakdown-heading" className="text-2xl font-bold">Category Breakdown</h2>
          <ul className="space-y-3" role="list" aria-label="Emissions by category">
            {chartData.map((item) => (
              <li key={item.name}>
                <LiquidGlass variant="light" className="p-4 flex items-center justify-between" hoverScale>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold tabular-nums text-foreground">
                    {item.value.toFixed(1)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">tons</span>
                  </span>
                </LiquidGlass>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <LiquidChart data={chartData} className="w-full max-w-sm" />
        </div>
      </section>

      <section aria-labelledby="actions-heading">
        <LiquidGlass variant="heavy" className="p-8 space-y-6">
          <div>
            <h2 id="actions-heading" className="text-2xl font-bold text-foreground">
              Biggest Impact:{" "}
              <span className="capitalize text-primary">{highestCategory}</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Personalized actions to achieve the biggest reduction based on your profile:
            </p>
          </div>
          <ol className="space-y-3 text-left" aria-label="Recommended actions">
            {activeRecs.map((rec, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 text-foreground/95 bg-white/5 p-4 rounded-2xl border border-white/5"
              >
                <div
                  className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  {i + 1}
                </div>
                <p className="text-sm md:text-base leading-relaxed">{rec}</p>
              </motion.li>
            ))}
          </ol>
        </LiquidGlass>
      </section>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Link href="/calculator">
          <LiquidButton variant="clear" className="w-full sm:w-auto">
            Recalculate
          </LiquidButton>
        </Link>
        <Link href="/dashboard">
          <LiquidButton className="w-full sm:w-auto">
            View Dashboard
          </LiquidButton>
        </Link>
      </div>
    </div>
  );
}
