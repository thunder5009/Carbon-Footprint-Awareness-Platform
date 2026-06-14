"use client";

/**
 * SVG Filter Mount for Liquid Glass Refraction
 * 
 * CRITICAL: This must be mounted ONCE at document root.
 * The filter is shared across all glass instances.
 */
export function LiquidGlassSVGFilter() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 0,
        height: 0,
        overflow: "hidden",
        position: "absolute",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <defs>
        <filter
          id="liquid-glass-refraction"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.022"
            numOctaves={4}
            seed={2}
            stitchTiles="stitch"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              values="0.018 0.022;0.022 0.018;0.018 0.022"
              dur="14s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="0.35" />
        </filter>
      </defs>
    </svg>
  );
}
