/**
 * MetricCard — Large number display with count-up animation.
 *
 * Animates from 0 to `value` using exponential ease-out (1500ms)
 * when the card scrolls into the viewport. Respects
 * `prefers-reduced-motion` — skips animation and shows final value.
 *
 * Generates a descriptive `aria-label` combining prefix, value, unit,
 * and label (e.g., "~40% Potential Reduction").
 *
 * @example
 * ```tsx
 * <MetricCard value={16} label="US Average (tons/year)" unit="t" delay={0} />
 * <MetricCard value={40} label="Potential Reduction" unit="%" prefix="~" delay={300} />
 * ```
 */
"use client";

import { LiquidGlass } from "./liquid-glass";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  /** Numeric value to display and animate toward. */
  value: number | string;
  /** Descriptive label rendered below the number. */
  label: string;
  /** Unit displayed after the number (e.g., "t", "%", " kg"). */
  unit?: string;
  /** Prefix displayed before the number (e.g., "~"). */
  prefix?: string;
  /** Stagger delay in ms before animation starts. Default: `0`. */
  delay?: number;
  /** Trend indicator object (e.g., { direction: "up", value: 5 }) */
  trend?: { direction: "up" | "down"; value: number };
  /** Additional CSS classes. */
  className?: string;
}

export function MetricCard({ value, label, unit, prefix, delay = 0, trend, className }: MetricCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const prefersReducedMotion = useReducedMotion();
  const numericValue = typeof value === "number" ? value : parseFloat(value as string);
  const [displayValue, setDisplayValue] = useState(
    prefersReducedMotion ? numericValue : 0
  );

  useEffect(() => {
    if (!isInView || isNaN(numericValue) || prefersReducedMotion) return;

    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Exponential ease-out: 1 - 2^(-10x)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.round(numericValue * eased * 100) / 100);

      if (progress < 1) requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => requestAnimationFrame(animate), delay);
    return () => clearTimeout(timer);
  }, [isInView, numericValue, delay, prefersReducedMotion]);

  // Build accessible label: "~40% Potential Reduction"
  const ariaLabel = `${prefix ?? ""}${isNaN(numericValue) ? value : numericValue}${unit ?? ""} ${label}`;

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 25, delay: delay / 1000 }}
      aria-label={ariaLabel}
    >
      <LiquidGlass className={cn("p-6 text-center h-full flex flex-col justify-center", className)} hoverScale>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="text-4xl md:text-5xl font-bold glass-text tabular-nums" aria-hidden="true">
              {prefix}
              {isNaN(numericValue)
                ? value
                : displayValue.toFixed(
                    typeof value === "number" && value % 1 !== 0 ? 1 : 0
                  )}
              {unit && <span className="text-2xl md:text-3xl ml-1">{unit}</span>}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            {trend && (
              <span 
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-semibold",
                  trend.direction === "down" 
                    ? "bg-primary/20 text-primary" // Good (emissions down)
                    : "bg-destructive/20 text-destructive" // Bad (emissions up)
                )}
                aria-label={`${trend.direction === "down" ? "Decreased" : "Increased"} by ${trend.value}%`}
              >
                {trend.direction === "down" ? "↓" : "↑"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
      </LiquidGlass>
    </motion.div>
  );
}
