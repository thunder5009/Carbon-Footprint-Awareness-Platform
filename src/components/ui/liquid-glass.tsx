/**
 * LiquidGlass — Glassmorphic container with backdrop blur and caustic effects.
 * Uses Tailwind CSS utilities defined in globals.css.
 */
"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { forwardRef } from "react";

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "heavy" | "light" | "modal";
  animate?: boolean;
  hoverScale?: boolean;
  role?: string;
  "aria-label"?: string;
}

export const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(
  ({ children, className, variant = "default", animate = false, hoverScale = false, role, "aria-label": ariaLabel }, ref) => {
    
    // Map variant to corresponding CSS utility class
    const variantClass = {
      default: "liquid-glass",
      heavy: "liquid-glass-heavy",
      light: "liquid-glass-light",
      modal: "liquid-glass-modal",
    }[variant];

    return (
      <motion.div
        ref={ref}
        className={cn(
          variantClass,
          "transition-all duration-300",
          className
        )}
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={animate ? { opacity: 1, y: 0 } : false}
        whileHover={hoverScale ? { scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 30 } } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
        role={role}
        aria-label={ariaLabel}
      >
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);
LiquidGlass.displayName = "LiquidGlass";
