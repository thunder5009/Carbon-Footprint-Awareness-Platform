/**
 * Dashboard Cards with Liquid Glass V2
 * 
 * Example showing all material variants in a dashboard layout
 * with staggered entry animations.
 */

import { LiquidGlassV2 } from "@/components/ui/liquid-glass-v2";
import { TrendingDown, Zap, Leaf, Trophy } from "lucide-react";

interface DashboardCardsProps {
  stats: {
    totalCalculations: number;
    avgEmissions: number;
    reduction: number;
    bestCategory: string;
  };
}

export function DashboardCardsV2({ stats }: DashboardCardsProps) {
  const cards = [
    {
      icon: Trophy,
      label: "Total Calculations",
      value: stats.totalCalculations,
      material: "thin" as const,
    },
    {
      icon: Zap,
      label: "90-Day Average",
      value: `${stats.avgEmissions.toFixed(1)}t`,
      material: "regular" as const,
    },
    {
      icon: TrendingDown,
      label: "Reduction",
      value: `${stats.reduction}%`,
      material: "regular" as const,
    },
    {
      icon: Leaf,
      label: `Best: ${stats.bestCategory}`,
      value: "🎯",
      material: "thick" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <LiquidGlassV2
          key={card.label}
          material={card.material}
          animate
          staggerDelay={index * 0.06}
          className="p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <card.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              {card.label}
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {card.value}
          </div>
        </LiquidGlassV2>
      ))}
    </div>
  );
}
