"use client";

import { useState } from "react";
import { LiquidGlass } from "./liquid-glass";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
} from "recharts";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import { cn } from "@/lib/utils";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface LiquidChartProps {
  data: ChartDataItem[];
  className?: string;
  onSegmentClick?: (name: string) => void;
}

/** Strictly typed tooltip content */
function ChartTooltip({
  active,
  payload,
  total,
}: TooltipContentProps<number, string> & { total: number }) {
  if (active && payload && payload.length > 0) {
    const item = payload[0];
    const value = (item.value as number) ?? 0;
    const name = item.name ?? "";
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
    return (
      <LiquidGlass variant="light" className="p-3 border-white/20">
        <p className="font-medium text-foreground capitalize">{name}</p>
        <p className="text-sm text-muted-foreground">
          {value.toFixed(1)} tons ({percentage}%)
        </p>
      </LiquidGlass>
    );
  }
  return null;
}

/** Custom Active Shape for hover expansion */
const renderActiveShape = (props: unknown) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props as {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
  };
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 8} // Expand slightly
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cursor="pointer"
      style={{ filter: `drop-shadow(0px 4px 12px ${fill}80)` }}
    />
  );
};

export function LiquidChart({ data, className, onSegmentClick }: LiquidChartProps) {
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  // Filter data based on legend toggles
  const visibleData = data.filter((item) => !hiddenCategories.has(item.name));
  const total = visibleData.reduce((sum, item) => sum + item.value, 0);
  const fullTotal = data.reduce((sum, item) => sum + item.value, 0);
  const hasData = data.length > 0 && fullTotal > 0;

  const toggleCategory = (name: string) => {
    setHiddenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        // Prevent hiding all categories
        if (next.size < data.length - 1) {
          next.add(name);
        }
      }
      return next;
    });
  };

  if (!hasData) {
    return (
      <LiquidGlass className={cn("p-6 flex items-center justify-center min-h-[300px]", className)}>
        <div className="text-center space-y-2">
          <p className="text-2xl font-bold text-muted-foreground">No data</p>
          <p className="text-sm text-muted-foreground">Complete a calculation to see your breakdown.</p>
        </div>
      </LiquidGlass>
    );
  }

  // Accessibility screen-reader string
  const srText = `Carbon footprint breakdown: ${visibleData
    .map((d) => `${d.name} ${d.value.toFixed(1)} tons (${((d.value / total) * 100).toFixed(0)}%)`)
    .join(", ")}. Total: ${total.toFixed(1)} tons CO₂.`;

  return (
    <LiquidGlass
      className={cn("p-6 relative", className)}
      animate
      role="region"
      aria-label="Carbon Footprint Breakdown Chart"
    >
      <div className="sr-only">{srText}</div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={visibleData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
            // @ts-expect-error Recharts typings for activeIndex are sometimes incomplete in 3.x
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
            onClick={(entry: unknown) => {
              const item = entry as { name?: string };
              if (onSegmentClick && item?.name) onSegmentClick(item.name);
            }}
          >
            {visibleData.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}-${index}`}
                fill={entry.color}
                fillOpacity={0.85}
                className="transition-all duration-300 outline-none"
                tabIndex={0}
                aria-label={`${entry.name}: ${entry.value.toFixed(1)} tons`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onSegmentClick) onSegmentClick(entry.name);
                  }
                }}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(undefined)}
              />
            ))}
          </Pie>
          <Tooltip
            content={(props) => (
              <ChartTooltip {...(props as TooltipContentProps<number, string>)} total={total} />
            )}
          />
          <Legend
            verticalAlign="bottom"
            height={40}
             content={() => {
               return (
                <div className="flex flex-wrap justify-center gap-4 mt-4" role="group" aria-label="Toggle categories">
                  {data.map((entry) => {
                    const isHidden = hiddenCategories.has(entry.name);
                    return (
                      <button
                        key={entry.name}
                        onClick={() => toggleCategory(entry.name)}
                        className={`flex items-center gap-2 text-sm transition-opacity focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-1 ${
                          isHidden ? "opacity-40" : "opacity-100 hover:opacity-80"
                        }`}
                        aria-pressed={!isHidden}
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-foreground capitalize">{entry.name}</span>
                      </button>
                    );
                  })}
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none mt-[-40px]" // Offset to center within donut above legend
        aria-hidden="true"
      >
        <div className="text-center">
          <p className="text-4xl font-bold glass-text">{total.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">tons CO₂</p>
        </div>
      </div>
    </LiquidGlass>
  );
}
