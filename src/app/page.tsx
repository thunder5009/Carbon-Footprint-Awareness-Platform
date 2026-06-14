/**
 * Landing Page — Server Component
 *
 * This is a pure Server Component. All animation and interactivity is
 * isolated into child Client Components (HeroSection, HowItWorks).
 * This gives us SSR HTML, optimal FCP, and full SEO crawlability.
 *
 * Sections:
 * 1. Hero — animated gradient mesh + headline + CTA
 * 2. Stats — 3 MetricCards (US avg, Paris target, reduction potential)
 * 3. How It Works — 3 animated step cards
 * 4. CTA — contrasting glass panel
 */
import { MetricCard } from "@/components/ui/metric-card";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { LiquidButton } from "@/components/ui/liquid-button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CarbonTrack — Calculate and Reduce Your Carbon Footprint",
  description:
    "Free, science-backed carbon footprint calculator. Understand your transport, energy, food, and waste emissions. Get personalized tips to reduce your impact.",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CarbonTrack",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free, science-backed carbon footprint calculator.",
  };

  return (
    <div className="space-y-20 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Stats bar ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="stats-heading"
        className="px-4 max-w-6xl mx-auto"
      >
        <h2 id="stats-heading" className="sr-only">
          Carbon footprint benchmarks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard value={16} label="US Average (tons/year)" unit="t" delay={0} />
          <MetricCard value={2} label="Paris Agreement Target" unit="t" delay={150} />
          <MetricCard value={40} label="Potential Reduction" unit="%" prefix="~" delay={300} />
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section
        aria-labelledby="how-heading"
        className="px-4 max-w-6xl mx-auto"
      >
        <h2
          id="how-heading"
          className="font-bold text-center mb-12 glass-text"
          style={{ fontSize: "var(--text-heading)" }}
        >
          How It Works
        </h2>
        <HowItWorks />
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section
        aria-labelledby="cta-heading"
        className="px-4 max-w-4xl mx-auto text-center"
      >
        <LiquidGlass variant="heavy" className="p-12 md:p-16">
          <h2
            id="cta-heading"
            className="font-bold mb-4 glass-text"
            style={{ fontSize: "var(--text-heading)" }}
          >
            Ready to See Your Impact?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto text-balance">
            It takes 2 minutes. No account required. Understand your footprint
            and find the changes that matter most.
          </p>
          <Link href="/calculator">
            <LiquidButton size="lg">Start Calculating</LiquidButton>
          </Link>
        </LiquidGlass>
      </section>
    </div>
  );
}
