/**
 * LiquidButton — Primary interactive button with glassmorphic styling.
 *
 * Three visual variants:
 * - `filled`: Solid primary background (default, high emphasis)
 * - `clear`: Glassmorphic transparent background (medium emphasis)
 * - `ghost`: Fully transparent (low emphasis)
 *
 * Supports loading state via `isLoading` which:
 * - Sets `aria-busy="true"` for screen readers
 * - Shows a shimmer overlay
 * - Disables pointer events
 *
 * @example
 * ```tsx
 * <LiquidButton variant="filled" size="lg" onClick={handleSubmit}>
 *   Calculate Now
 * </LiquidButton>
 * ```
 */
"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

/** Visual variant for the button surface. */
type LiquidButtonVariant = "filled" | "clear" | "ghost";

/** Size presets controlling padding and typography. */
type LiquidButtonSize = "sm" | "md" | "lg";

interface LiquidButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  /** Explicit children typed as ReactNode to avoid MotionValue type pollution. */
  children?: ReactNode;
  /** Visual variant. Default: `"filled"`. */
  variant?: LiquidButtonVariant;
  /** Size preset controlling padding and typography. */
  size?: LiquidButtonSize;
  /** When true, shows shimmer overlay and sets `aria-busy`. */
  isLoading?: boolean;
}

const sizeClasses: Record<LiquidButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-3xl",
};

const variantClasses: Record<LiquidButtonVariant, string> = {
  filled:
    "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-cyan-400 border border-emerald-400/20",
  clear: "liquid-glass text-foreground hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  ghost: "bg-transparent text-foreground hover:bg-white/5",
};

export const LiquidButton = forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ children, className, variant = "filled", size = "md", isLoading, disabled, ...props }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative font-medium transition-all outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        whileTap={isDisabled ? undefined : { scale: 0.96 }}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        aria-disabled={isDisabled || undefined}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 shimmer-glass rounded-inherit" aria-hidden="true" />
        )}
        <span className={cn("relative z-10", isLoading && "opacity-70")}>
          {children}
        </span>
      </motion.button>
    );
  }
);
LiquidButton.displayName = "LiquidButton";
