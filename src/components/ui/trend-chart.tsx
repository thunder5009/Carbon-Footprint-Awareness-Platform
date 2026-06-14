"use client";

import { LiquidGlass } from "./liquid-glass";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import { cn } from "@/lib/utils";

interface TrendDataPoint {
  name: string; // Used for X-axis display if needed, but we use date
  date: string;
  CO2: number;
}

interface TrendChartProps {
  data: TrendDataPoint[];
  className?: string;
}

function TrendTooltip({ active, payload }: TooltipContentProps<number, string>) {
  if (active && payload && payload.length > 0) {
    const current = payload[0];
    const value = (current.value as number) ?? 0;
    
    // Attempt to calculate difference from previous point if payload has historical context
    // Recharts Tooltip doesn't pass the full array index natively, but we can look it up if we passed it in data
    // For simplicity, we just show the current value and date
    const dateStr = current.payload.date;
    const diffStr = current.payload.diffPercent; // We will inject this into the data before passing to chart

    return (
      <LiquidGlass variant="light" className="p-3 border-white/20">
        <p className="text-xs text-muted-foreground">{dateStr}</p>
        <p className="font-semibold text-foreground text-lg">{value.toFixed(1)} tons CO₂</p>
        {diffStr !== undefined && (
          <p className={cn("text-xs font-medium mt-1", diffStr > 0 ? "text-destructive" : diffStr < 0 ? "text-primary" : "text-muted-foreground")}>
            {diffStr > 0 ? "↑" : diffStr < 0 ? "↓" : ""}{Math.abs(diffStr).toFixed(1)}% vs previous
          </p>
        )}
      </LiquidGlass>
    );
  }
  return null;
}

export function TrendChart({ data, className }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <LiquidGlass className={cn("p-6 flex items-center justify-center min-h-[320px]", className)}>
        <div className="text-center space-y-2">
          <p className="text-2xl font-bold text-muted-foreground">No history yet</p>
          <p className="text-sm text-muted-foreground">Complete your first calculation to start tracking your trend!</p>
        </div>
      </LiquidGlass>
    );
  }

  // Pre-process data to add diffPercent
  const processedData = data.map((item, index) => {
    if (index === 0) return { ...item, diffPercent: 0 };
    const prev = data[index - 1].CO2;
    const diff = prev > 0 ? ((item.CO2 - prev) / prev) * 100 : 0;
    return { ...item, diffPercent: diff };
  });

  return (
    <LiquidGlass
      className={cn("p-6", className)}
      role="region"
      aria-label={`Emissions trend line chart over ${data.length} records`}
    >
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={processedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="currentColor" 
            opacity={0.5} 
            style={{ fontSize: "12px" }}
            tickMargin={10}
          />
          <YAxis 
            stroke="currentColor" 
            opacity={0.5} 
            style={{ fontSize: "12px" }} 
            tickFormatter={(val) => `${val}t`}
            width={40}
          />
          <Tooltip
            content={(props) => (
              <TrendTooltip {...(props as unknown as TooltipContentProps<number, string>)} />
            )}
          />
          
          <ReferenceLine y={16} stroke="hsl(var(--destructive))" strokeDasharray="3 3" opacity={0.5}>
             {/* <Label value="National Avg" position="insideTopLeft" fill="currentColor" fontSize={10} /> */}
          </ReferenceLine>
          <ReferenceLine y={2} stroke="hsl(var(--primary))" strokeDasharray="3 3" opacity={0.5} />
          
          <Line
            type="monotone"
            dataKey="CO2"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
            activeDot={{ r: 6, stroke: "hsl(var(--background))", strokeWidth: 2 }}
            animationDuration={1500}
          />
          {processedData.length > 5 && (
            <Brush 
              dataKey="date" 
              height={30} 
              stroke="hsl(var(--primary))" 
              fill="transparent"
              tickFormatter={() => ""}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </LiquidGlass>
  );
}
