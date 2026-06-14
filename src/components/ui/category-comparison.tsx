"use client";

import { LiquidGlass } from "./liquid-glass";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import { cn } from "@/lib/utils";

interface CategoryData {
  name: string;
  value: number;
  target: number;
}

interface CategoryComparisonProps {
  data: CategoryData[];
  className?: string;
}

function ComparisonTooltip({ active, payload }: TooltipContentProps<number, string>) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as CategoryData;
    const diff = data.value - data.target;
    const percentDiff = data.target > 0 ? (diff / data.target) * 100 : 0;
    
    return (
      <LiquidGlass variant="light" className="p-3 border-white/20">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{data.name}</p>
        <p className="font-semibold text-foreground">{data.value.toFixed(1)} tons</p>
        <p className="text-xs text-muted-foreground mt-1">
          Target: {data.target.toFixed(1)}t
        </p>
        <p className={cn("text-xs font-medium mt-1", diff > 0 ? "text-destructive" : "text-primary")}>
          {diff > 0 ? "+" : ""}{percentDiff.toFixed(0)}% {diff > 0 ? "above target" : "below target"}
        </p>
      </LiquidGlass>
    );
  }
  return null;
}

export function CategoryComparison({ data, className }: CategoryComparisonProps) {
  if (!data || data.length === 0) return null;

  // Color coding: below target (primary/green), near target (yellow), above target (destructive/red)
  const getCellColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio <= 1.05) return "hsl(var(--primary))"; // Green (or close enough)
    if (ratio <= 1.25) return "#eab308"; // Yellow (Tailwind yellow-500)
    return "hsl(var(--destructive))"; // Red
  };

  return (
    <LiquidGlass
      className={cn("p-6", className)}
      role="region"
      aria-label="Horizontal bar chart comparing your categories to targets"
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={true} vertical={true} />
          <XAxis type="number" stroke="currentColor" opacity={0.5} style={{ fontSize: "12px" }} tickFormatter={(val) => `${val}t`} />
          <YAxis type="category" dataKey="name" stroke="currentColor" opacity={0.8} style={{ fontSize: "12px", textTransform: "capitalize" }} width={80} />
          <Tooltip
            cursor={{ fill: "currentColor", opacity: 0.05 }}
            content={(props) => (
              <ComparisonTooltip {...(props as unknown as TooltipContentProps<number, string>)} />
            )}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1500}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCellColor(entry.value, entry.target)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </LiquidGlass>
  );
}
