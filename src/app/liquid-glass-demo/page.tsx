"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { LiquidGlassV2, type LiquidGlassMaterial } from "@/components/ui/liquid-glass-v2";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const MATERIALS: Array<{
  variant: LiquidGlassMaterial;
  title: string;
  description: string;
}> = [
  {
    variant: "ultraThin",
    title: "Ultra Thin",
    description: "20px blur · rgba(255,255,255,0.04) · border 0.15 — video overlays",
  },
  {
    variant: "thin",
    title: "Thin",
    description: "28px blur · secondary chrome · subtle structure",
  },
  {
    variant: "regular",
    title: "Regular",
    description: "40px blur · cards, modals, sheets — default material",
  },
  {
    variant: "thick",
    title: "Thick",
    description: "56px blur · tab bars · navigation chrome",
  },
  {
    variant: "chromatic",
    title: "Chromatic",
    description: "Regular + 8s iridescent border-image cycle — hero only",
  },
];

function SpecularProbe() {
  const probeRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState({ x: "50%", y: "-10%", intensity: "1" });

  useEffect(() => {
    let raf = 0;

    const read = () => {
      const el = probeRef.current;
      if (el) {
        setValues({
          x: el.style.getPropertyValue("--lg-specular-x") || "50%",
          y: el.style.getPropertyValue("--lg-specular-y") || "-10%",
          intensity: el.style.getPropertyValue("--lg-specular-intensity") || "1",
        });
      }
      raf = requestAnimationFrame(read);
    };

    raf = requestAnimationFrame(read);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <LiquidGlassV2
      ref={probeRef}
      material="thick"
      animate
      className="p-10 text-center"
    >
      <p className="text-sm uppercase tracking-widest opacity-60 mb-4">
        Live specular (CSS custom properties)
      </p>
      <div className="grid grid-cols-3 gap-4 font-mono text-sm">
        <div>
          <div className="opacity-50 mb-1">--lg-specular-x</div>
          <div className="text-lg font-semibold">{values.x}</div>
        </div>
        <div>
          <div className="opacity-50 mb-1">--lg-specular-y</div>
          <div className="text-lg font-semibold">{values.y}</div>
        </div>
        <div>
          <div className="opacity-50 mb-1">--lg-specular-intensity</div>
          <div className="text-lg font-semibold">{values.intensity}</div>
        </div>
      </div>
      <p className="mt-6 text-sm opacity-70">
        Move cursor near this panel — values update via rAF, zero layout thrash
      </p>
    </LiquidGlassV2>
  );
}

export default function LiquidGlassDemoPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <>
      {/* Colorful mesh — proves refraction over saturated content */}
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{
            background: isDark
              ? `
                  radial-gradient(ellipse 80% 60% at 20% 30%, rgba(236, 72, 153, 0.35) 0%, transparent 50%),
                  radial-gradient(ellipse 70% 50% at 80% 70%, rgba(99, 102, 241, 0.35) 0%, transparent 50%),
                  radial-gradient(ellipse 60% 40% at 50% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 60%),
                  linear-gradient(135deg, #0a0a14 0%, #1a1a2e 50%, #16213e 100%)
                `
              : `
                  radial-gradient(ellipse 80% 60% at 15% 25%, rgba(236, 72, 153, 0.45) 0%, transparent 55%),
                  radial-gradient(ellipse 70% 50% at 85% 75%, rgba(99, 102, 241, 0.4) 0%, transparent 55%),
                  radial-gradient(ellipse 60% 45% at 50% 50%, rgba(16, 185, 129, 0.35) 0%, transparent 60%),
                  radial-gradient(ellipse 50% 40% at 70% 20%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
                  linear-gradient(135deg, #f0f4ff 0%, #e8f5f0 40%, #fdf2f8 100%)
                `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <main className="min-h-screen py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Header + theme toggle */}
          <header className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm opacity-60">
                {isDark ? "Dark material · 48px blur · 85% brightness" : "Light material · 40px blur · 108% brightness"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              iOS 26 Liquid Glass
            </h1>
            <p className="text-lg opacity-70 max-w-2xl text-balance">
              Refraction · cursor-tracked specular · chromatic fringe · Apple spring entry
            </p>
          </header>

          {/* All 5 variants with staggered entry */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-center">Material Variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MATERIALS.map((m, i) => (
                <LiquidGlassV2
                  key={m.variant}
                  material={m.variant}
                  animate
                  staggerDelay={i * 0.06}
                  className="p-8 min-h-[220px] flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold mb-2">{m.title}</h3>
                    <p className="text-sm opacity-75 leading-relaxed">{m.description}</p>
                  </div>
                  <code className="text-xs opacity-50 font-mono mt-4">
                    data-lg=&quot;{m.variant}&quot;
                  </code>
                </LiquidGlassV2>
              ))}
            </div>
          </section>

          {/* Refraction proof */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Refraction (Layer 1)</h2>
            <LiquidGlassV2 material="thick" animate className="p-12 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-6 left-6 w-36 h-36 rounded-full bg-pink-500 blur-2xl opacity-50" />
                <div className="absolute bottom-6 right-6 w-44 h-44 rounded-full bg-indigo-500 blur-2xl opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-emerald-400 blur-3xl opacity-40" />
              </div>
              <div className="relative text-center space-y-3 max-w-lg mx-auto">
                <h3 className="text-xl font-bold">SVG feDisplacementMap</h3>
                <p className="text-sm opacity-75">
                  backdrop-filter on Layer 1 · filter url(#liquid-glass-refraction) on ::before only.
                  Background orbs warp through the glass — strongest at edges.
                </p>
              </div>
            </LiquidGlassV2>
          </section>

          {/* Chromatic fringe */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Chromatic Fringe (Layer 4)</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <LiquidGlassV2 material="regular" animate className="p-8 text-center">
                <div className="text-4xl mb-3">🔴</div>
                <h3 className="font-bold">Red +0.5px</h3>
                <p className="text-sm opacity-70 mt-2">inset shadow shifted right at top rim</p>
              </LiquidGlassV2>
              <LiquidGlassV2 material="regular" animate staggerDelay={0.06} className="p-8 text-center">
                <div className="text-4xl mb-3">🔵</div>
                <h3 className="font-bold">Blue −0.5px</h3>
                <p className="text-sm opacity-70 mt-2">inset shadow shifted left at top rim</p>
              </LiquidGlassV2>
            </div>
          </section>

          {/* Specular + live probe */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Specular Engine (Layer 3)</h2>
            <SpecularProbe />
          </section>

          {/* Entry animation + press */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Entry &amp; Press</h2>
            <p className="text-center text-sm opacity-60">
              Spring: cubic-bezier(0.34, 1.56, 0.64, 1) · Press: scale(0.97) in 0.12s
            </p>
            <LiquidGlassV2
              material="regular"
              animate
              interactive
              onPress={() => {}}
              role="button"
              aria-label="Press demo"
              className="p-10 text-center max-w-md mx-auto"
            >
              <p className="font-semibold">Interactive — click to feel press scale</p>
              <p className="text-sm opacity-60 mt-2">data-lg-interactive=&quot;true&quot;</p>
            </LiquidGlassV2>
          </section>

          {/* Layer stack reference */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-center">6-Layer Stack</h2>
            <LiquidGlassV2 material="thin" animate className="p-8">
              <ol className="space-y-2 text-sm font-mono opacity-80">
                <li>0 · .lg-host — isolation + translateZ(0)</li>
                <li>1 · .lg-refraction — backdrop-filter + SVG ::before</li>
                <li>2 · .lg-substrate — tint</li>
                <li>3 · .lg-specular — 4 radial gradients</li>
                <li>4 · .lg-border — chromatic box-shadow</li>
                <li>5 · .lg-inner-glow — top edge gradient</li>
                <li>6 · .lg-content — crisp text, z-index 5</li>
              </ol>
            </LiquidGlassV2>
          </section>

          <footer className="text-center text-sm opacity-50 space-y-1 pb-8">
            <p>Safari 18+ gold standard · prefers-reduced-motion freezes animation + rAF</p>
            <p>Filter mounted once in root layout · LiquidGlassManager singleton</p>
          </footer>
        </div>
      </main>
    </>
  );
}
