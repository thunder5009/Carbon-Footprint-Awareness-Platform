/**
 * Migration Example: Calculator Results Card
 * 
 * Shows how to migrate from old LiquidGlass to new LiquidGlassV2
 * with all iOS 26 physics features enabled.
 */

import { LiquidGlassV2 } from "@/components/ui/liquid-glass-v2";
import type { CalculationResult } from "@/lib/calculations/calculator";

interface ResultsCardProps {
  result: CalculationResult;
}

export function ResultsCardV2({ result }: ResultsCardProps) {
  return (
    <LiquidGlassV2
      material="thick"
      animate
      className="p-8 space-y-6"
      role="region"
      aria-label="Carbon footprint results"
    >
      {/* Total */}
      <div className="text-center space-y-2">
        <div className="text-6xl font-bold text-primary">
          {result.totalCO2.toFixed(1)}
        </div>
        <div className="text-sm text-muted-foreground">
          metric tons CO₂ / year
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Category Breakdown</h3>
        {Object.entries(result.breakdown).map(([category, value]) => (
          <div
            key={category}
            className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5"
          >
            <span className="capitalize text-sm text-foreground">{category}</span>
            <span className="font-bold text-foreground">
              {value.toFixed(1)} t
            </span>
          </div>
        ))}
      </div>
    </LiquidGlassV2>
  );
}

/**
 * OLD VERSION (for comparison):
 * 
 * import { LiquidGlass } from "@/components/ui/liquid-glass";
 * 
 * <LiquidGlass variant="heavy" className="p-8 space-y-6">
 *   {same content}
 * </LiquidGlass>
 * 
 * NEW VERSION BENEFITS:
 * - Cursor-tracked specular highlights
 * - Animated entry with spring easing
 * - Chromatic fringe at borders
 * - SVG refraction displacement
 * - 60fps performance
 * - Proper dark mode material character
 */
