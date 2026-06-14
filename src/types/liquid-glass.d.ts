/**
 * TypeScript Type Declarations for Liquid Glass System
 */

declare global {
  interface Window {
    /**
     * Global singleton manager for cursor-tracked specular highlights.
     * Automatically initialized on first import.
     */
    liquidGlassManager?: {
      register: (element: HTMLElement) => void;
      unregister: (element: HTMLElement) => void;
      destroy: () => void;
    };
  }

  interface CSSStyleDeclaration {
    /**
     * Liquid Glass CSS Custom Properties
     */
    "--lg-blur"?: string;
    "--lg-saturate"?: string;
    "--lg-brightness"?: string;
    "--lg-tint"?: string;
    "--lg-border-opacity"?: string;
    "--lg-inner-glow"?: string;
    "--lg-radius"?: string;
    "--lg-specular-x"?: string;
    "--lg-specular-y"?: string;
    "--lg-specular-intensity"?: string;
    "--lg-stagger-delay"?: string;
  }
}

/**
 * Material variants for Liquid Glass
 */
export type LiquidGlassMaterial =
  | "ultraThin" // 20px blur - video overlays
  | "thin" // 28px blur - secondary chrome
  | "regular" // 40px blur - cards, modals (default)
  | "thick" // 56px blur - navigation, tab bars
  | "chromatic"; // animated iridescent border

/**
 * Props for LiquidGlassV2 component
 */
export interface LiquidGlassV2Props {
  /** Content to render inside the glass */
  children?: React.ReactNode;

  /** Additional CSS classes */
  className?: string;

  /** Material variant (default: "regular") */
  material?: LiquidGlassMaterial;

  /** Enable entry animation with spring easing */
  animate?: boolean;

  /** Stagger delay for sequential animations (in seconds) */
  staggerDelay?: number;

  /** Click handler */
  onPress?: () => void;

  /** ARIA role */
  role?: string;

  /** ARIA label */
  "aria-label"?: string;
}

/**
 * Internal state for specular tracking
 */
export interface SpecularState {
  x: number; // percentage (10-90)
  y: number; // percentage (-40 to +20)
  intensity: number; // 0-1
}

export {};
