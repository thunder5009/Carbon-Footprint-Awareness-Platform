"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";
import "@/lib/utils/liquid-glass-manager";

/**
 * iOS 26 Liquid Glass — 6-layer optical material
 *
 * Layer 0: Host (isolation + translateZ)
 * Layer 1: Refraction (backdrop-filter + SVG ::before)
 * Layer 2: Substrate tint
 * Layer 3: Specular highlights (cursor-tracked via LiquidGlassManager)
 * Layer 4: Chromatic border
 * Layer 5: Inner glow
 * Layer 6: Content (crisp text, zero filters)
 */

export type LiquidGlassMaterial =
  | "ultraThin"
  | "thin"
  | "regular"
  | "thick"
  | "chromatic";

export interface LiquidGlassV2Props {
  children?: ReactNode;
  className?: string;
  /** Material variant — maps to data-lg attribute */
  material?: LiquidGlassMaterial;
  /** Entry spring animation with optional stagger via staggerDelay */
  animate?: boolean;
  /** Stagger delay in seconds (multiply index × 0.06) */
  staggerDelay?: number;
  /** Press scale interaction + pointer cursor */
  interactive?: boolean;
  onPress?: () => void;
  role?: string;
  "aria-label"?: string;
  style?: CSSProperties;
}

export const LiquidGlassV2 = forwardRef<HTMLDivElement, LiquidGlassV2Props>(
  (
    {
      children,
      className,
      material = "regular",
      animate = false,
      staggerDelay = 0,
      interactive = false,
      onPress,
      role,
      "aria-label": ariaLabel,
      style,
    },
    ref
  ) => {
    const hostRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const element = hostRef.current;
      if (!element) return;

      window.liquidGlassManager?.register(element);
      return () => window.liquidGlassManager?.unregister(element);
    }, []);

    const isInteractive = interactive || !!onPress;

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          hostRef.current = node;
        }}
        className={cn("lg-host", className)}
        data-lg={material}
        data-lg-animate={animate ? "true" : undefined}
        data-lg-interactive={isInteractive ? "true" : undefined}
        style={
          {
            ...style,
            "--lg-stagger-delay": `${staggerDelay}s`,
          } as CSSProperties
        }
        role={role}
        aria-label={ariaLabel}
        onClick={onPress}
        onKeyDown={
          isInteractive && onPress
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPress();
                }
              }
            : undefined
        }
        tabIndex={isInteractive && onPress ? 0 : undefined}
      >
        <div className="lg-layer lg-refraction" aria-hidden="true" />
        <div className="lg-layer lg-substrate" aria-hidden="true" />
        <div className="lg-layer lg-specular" aria-hidden="true">
          <div className="lg-specular-main" />
          <div className="lg-specular-corner-tl" />
          <div className="lg-specular-corner-tr" />
          <div className="lg-specular-bounce" />
        </div>
        <div className="lg-layer lg-border" aria-hidden="true" />
        <div className="lg-layer lg-inner-glow" aria-hidden="true" />
        <div className="lg-content">{children}</div>
      </div>
    );
  }
);

LiquidGlassV2.displayName = "LiquidGlassV2";
