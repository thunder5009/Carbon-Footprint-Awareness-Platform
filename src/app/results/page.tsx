"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import type { CalculationResult } from "@/lib/calculations/calculator";

const CATEGORY_META: Record<string, { label: string; icon: string; color: string }> = {
  transport: { label: "Transport", icon: "🚗", color: "#3b82f6" },
  energy: { label: "Energy", icon: "⚡", color: "#f59e0b" },
  food: { label: "Food", icon: "🥗", color: "#22c55e" },
  waste: { label: "Waste", icon: "♻️", color: "#a855f7" },
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("carbonResult");
    if (!stored) {
      router.push("/calculator");
      return;
    }
    try {
      setResult(JSON.parse(stored));
    } catch {
      router.push("/calculator");
    }
  }, [router]);

  if (!result) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "32px", height: "32px", border: "2px solid #333", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </>
    );
  }

  const { totalCO2, breakdown } = result;
  const categories = Object.entries(breakdown).sort(([, a], [, b]) => b - a);
  const maxCategoryValue = Math.max(...Object.values(breakdown));

  // Rating
  let rating = "High";
  let ratingColor = "#ff4444";
  if (totalCO2 < 4) {
    rating = "Excellent";
    ratingColor = "#22c55e";
  } else if (totalCO2 < 8) {
    rating = "Good";
    ratingColor = "#c8ff00";
  } else if (totalCO2 < 14) {
    rating = "Average";
    ratingColor = "#f59e0b";
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "60px 32px 80px", maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <span className="text-caption" style={{ marginBottom: "24px", display: "block" }}>
            Your Results
          </span>

          {/* Big Number */}
          <div
            style={{
              fontSize: "clamp(5rem, 15vw, 12rem)",
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: "-0.05em",
              marginBottom: "16px",
            }}
          >
            {totalCO2.toFixed(1)}
          </div>
          <div style={{ fontSize: "1.125rem", color: "#666", marginBottom: "24px" }}>
            metric tons CO₂e per year
          </div>

          {/* Rating badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "100px",
              border: `1px solid ${ratingColor}30`,
              background: `${ratingColor}10`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: ratingColor,
              }}
            />
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: ratingColor }}>
              {rating}
            </span>
          </div>
        </motion.div>

        {/* Comparison bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "32px",
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "24px" }}>
            How You Compare
          </div>

          {[
            { label: "Your Footprint", value: totalCO2, color: "#fff" },
            { label: "US Average", value: 16, color: "#666" },
            { label: "Paris Target", value: 2, color: "#c8ff00" },
          ].map((item, i) => (
            <div key={item.label} style={{ marginBottom: i < 2 ? "20px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.875rem", color: item.color, fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: "0.875rem", color: item.color, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {item.value.toFixed(1)}t
                </span>
              </div>
              <div style={{ height: "4px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((item.value / 20) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: "100%", background: item.color, borderRadius: "2px" }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            background: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "32px",
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "32px" }}>
            Breakdown by Category
          </div>

          {categories.map(([key, value], i) => {
            const meta = CATEGORY_META[key];
            const percentage = totalCO2 > 0 ? ((value / totalCO2) * 100).toFixed(0) : "0";
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px 0",
                  borderTop: i > 0 ? "1px solid #1a1a1a" : "none",
                }}
              >
                <span style={{ fontSize: "1.5rem", width: "36px" }}>{meta.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#fff" }}>
                      {meta.label}
                    </span>
                    <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                      {value.toFixed(2)}t <span style={{ color: "#666", fontWeight: 400 }}>({percentage}%)</span>
                    </span>
                  </div>
                  <div style={{ height: "3px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: maxCategoryValue > 0 ? `${(value / maxCategoryValue) * 100}%` : "0%" }}
                      transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: "100%", background: meta.color, borderRadius: "2px" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/calculator" className="btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Recalculate
          </Link>
          <Link href="/" className="btn-primary">
            Back Home
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
