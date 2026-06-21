"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { HoverRevealList } from "@/components/ui/hover-reveal-list";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  {
    label: "Transport",
    number: "01",
    image: "/transport.png",
    description: "Cars, flights, public transit — your mobility footprint.",
  },
  {
    label: "Energy",
    number: "02",
    image: "/energy.png",
    description: "Electricity, heating, and your home's energy consumption.",
  },
  {
    label: "Food",
    number: "03",
    image: "/food.png",
    description: "Diet choices and food waste contributing to emissions.",
  },
  {
    label: "Waste",
    number: "04",
    image: "/waste.png",
    description: "Household waste, recycling habits, and composting.",
  },
];

const STATS = [
  { value: "16t", label: "US Average", sublabel: "CO₂ per year" },
  { value: "2t", label: "Paris Target", sublabel: "Goal by 2030" },
  { value: "~40%", label: "Reducible", sublabel: "With lifestyle changes" },
];

const MARQUEE_ITEMS = [
  "Calculate Your Impact",
  "✦",
  "Reduce Emissions",
  "✦",
  "Track Progress",
  "✦",
  "Live Sustainably",
  "✦",
  "Make a Difference",
  "✦",
  "Start Today",
  "✦",
];

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      {/* ── Hero Section ───────────────────────────────────────── */}
      <section
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 32px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient accent */}
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-20%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,255,0,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "32px" }}
        >
          <span className="text-caption" style={{ color: "#666" }}>
            Carbon Footprint Calculator
          </span>
        </motion.div>

        <motion.h1
          className="text-massive"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: "900px", marginBottom: "40px" }}
        >
          Know your
          <br />
          <span style={{ color: "#c8ff00" }}>impact.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
            color: "#666",
            maxWidth: "500px",
            lineHeight: 1.6,
            marginBottom: "48px",
          }}
        >
          Calculate your annual carbon footprint in under 2 minutes.
          Understand what matters. Take action that counts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}
        >
          <Link href="/calculator" className="btn-primary">
            Start Calculating
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <span style={{ fontSize: "0.8125rem", color: "#444" }}>No account required</span>
        </motion.div>
      </section>

      {/* ── Marquee Band ───────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid #1a1a1a",
          borderBottom: "1px solid #1a1a1a",
          padding: "20px 0",
          overflow: "hidden",
        }}
      >
        <div className="marquee-container">
          <div className="marquee-content">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                style={{
                  padding: "0 24px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: item === "✦" ? "#c8ff00" : "#555",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Section ──────────────────────────────────────── */}
      <section style={{ padding: "80px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1px",
            background: "#1a1a1a",
            borderRadius: "20px",
            overflow: "hidden",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: "#0a0a0a",
                padding: "40px 32px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  lineHeight: 1,
                  marginBottom: "12px",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#999", marginBottom: "4px" }}>
                {stat.label}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#444" }}>
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Categories / Hover Reveal ─────────────────────────── */}
      <section style={{ padding: "40px 32px 80px" }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          <div style={{ marginBottom: "48px" }}>
            <span className="text-caption" style={{ marginBottom: "16px", display: "block" }}>
              What We Measure
            </span>
            <h2 className="text-headline" style={{ color: "#fff" }}>
              Four pillars of your
              <br />
              carbon footprint.
            </h2>
          </div>

          <HoverRevealList
            items={CATEGORIES}
            onItemClick={() => router.push("/calculator")}
          />
        </motion.div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 32px",
          borderTop: "1px solid #1a1a1a",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <h2
            className="text-display"
            style={{ marginBottom: "24px" }}
          >
            Ready to see
            <br />
            your{" "}
            <span style={{ color: "#c8ff00" }}>impact</span>?
          </h2>
          <p style={{ fontSize: "1rem", color: "#666", marginBottom: "40px", lineHeight: 1.6 }}>
            It takes 2 minutes. No signup needed. Understand your footprint
            and find the changes that matter most.
          </p>
          <Link href="/calculator" className="btn-primary" style={{ fontSize: "1rem", padding: "18px 48px" }}>
            Start Calculating
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid #1a1a1a",
          padding: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <span style={{ fontSize: "0.8125rem", color: "#444" }}>
          © {new Date().getFullYear()} CarbonTrack
        </span>
        <span style={{ fontSize: "0.75rem", color: "#333" }}>
          Built for a sustainable future
        </span>
      </footer>
    </>
  );
}
