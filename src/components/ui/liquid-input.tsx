/**
 * LiquidInput — Form input with glassmorphic styling and accessibility.
 *
 * Associates `<label>` with `<input>` via auto-generated `id` (React `useId`).
 * When `error` is provided:
 * - Sets `aria-invalid="true"` on the input
 * - Sets `aria-describedby` pointing to the error message element
 * - Renders error text with an animated entrance
 *
 * Optional `helperText` renders below the input with its own `aria-describedby`.
 *
 * @example
 * ```tsx
 * <LiquidInput
 *   label="Electricity (kWh/month)"
 *   type="number"
 *   placeholder="900"
 *   error={errors.kwhPerMonth}
 *   helperText="Your monthly electricity consumption"
 * />
 * ```
 */
"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { forwardRef, InputHTMLAttributes, useId } from "react";

interface LiquidInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text rendered above the input. Associated via `htmlFor`. */
  label?: string;
  /** Error message. When present, sets `aria-invalid` and shows error text. */
  error?: string;
  /** Helper text rendered below the input for additional context. */
  helperText?: string;
}

export const LiquidInput = forwardRef<HTMLInputElement, LiquidInputProps>(
  ({ className, label, error, helperText, id: externalId, ...props }, ref) => {
    const autoId = useId();
    const inputId = externalId ?? autoId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Build aria-describedby from available descriptors
    const describedBy = [
      error ? errorId : null,
      helperText && !error ? helperId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground/80"
          >
            {label}
          </label>
        )}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "liquid-glass-light w-full px-4 py-3 text-foreground",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              error && "border-destructive focus:ring-destructive/50",
              className
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...props}
          />
        </motion.div>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
LiquidInput.displayName = "LiquidInput";
