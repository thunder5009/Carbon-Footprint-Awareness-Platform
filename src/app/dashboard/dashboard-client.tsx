"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LiquidButton } from "@/components/ui/liquid-button";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { MetricCard } from "@/components/ui/metric-card";
import { toast } from "sonner";

interface DashboardHistoryItem {
  id: string;
  createdAt: Date;
  totalCO2: number;
  breakdown: unknown;
  inputs: unknown;
}

const TrendChart = dynamic(() => import("@/components/ui/trend-chart").then(m => m.TrendChart), { ssr: false });
const CategoryComparison = dynamic(() => import("@/components/ui/category-comparison").then(m => m.CategoryComparison), { ssr: false });

const TARGETS = {
  transport: 0.8,
  energy: 0.6,
  food: 0.4,
  waste: 0.2,
};

export function DashboardData({ history }: { history: DashboardHistoryItem[] }) {
  const router = useRouter();
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    const draft = sessionStorage.getItem("carbon_calculator_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        // Only migrate if we have a valid result (has steps and data)
        if (parsed && Object.keys(parsed).length > 0) {
          setIsMigrating(true);
          fetch("/api/footprint/calc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: draft,
          }).then((res) => {
            if (res.ok) {
              sessionStorage.removeItem("carbon_calculator_draft");
              toast.success("Migrated your anonymous calculation!");
              router.refresh();
            }
          }).finally(() => {
            setIsMigrating(false);
          });
        }
      } catch (e) {
        console.error("Failed to migrate draft", e);
      }
    }
  }, [router]);

  const totalCalculations = history.length;
  
  if (totalCalculations === 0 && !isMigrating) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold glass-text">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track history, complete targets, and visualize improvements.</p>
          </div>
        </div>

        <LiquidGlass className="p-12 text-center max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold">No history available yet</h2>
          <p className="text-muted-foreground text-sm">
            Take a 2-minute lifestyle assessment to generate your baseline score and start measuring your carbon profile.
          </p>
          <Link href="/calculator" className="inline-block">
            <LiquidButton>Take Calculator</LiquidButton>
          </Link>
        </LiquidGlass>
      </div>
    );
  }

  // Analytics Math
  const latestRecord = history[history.length - 1];
  const firstRecord = history[0];
  
  // Rolling 90-day average
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const recentHistory = history.filter((h) => new Date(h.createdAt) >= ninetyDaysAgo);
  const avg90Days = recentHistory.length > 0 
    ? recentHistory.reduce((sum, h) => sum + h.totalCO2, 0) / recentHistory.length 
    : 0;

  // Improvement %
  const improvementValue = firstRecord.totalCO2 > 0 
    ? ((latestRecord.totalCO2 - firstRecord.totalCO2) / firstRecord.totalCO2) * 100 
    : 0;

  // Best Category (lowest emissions)
  const breakdown = latestRecord.breakdown as { transport: number; energy: number; food: number; waste: number };
  const categories = Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  const bestCategory = categories.reduce((min, cat) => (cat.value < min.value ? cat : min), categories[0]);

  // Chart Formatting
  const trendData = history.map((record, index) => ({
    name: `Calc ${index + 1}`,
    date: new Date(record.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    CO2: record.totalCO2,
  }));

  const comparisonData = categories.map((cat) => ({
    name: cat.name,
    value: cat.value,
    target: TARGETS[cat.name as keyof typeof TARGETS],
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 id="dashboard-heading" className="text-4xl md:text-5xl font-bold glass-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track history, complete targets, and visualize improvements.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/calculator">
            <LiquidButton size="sm" aria-label="Start a new calculation">
              New Calculation
            </LiquidButton>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard value={totalCalculations} label="Calculations Taken" delay={0} />
        <MetricCard value={avg90Days} label="90-Day Average" unit="t" delay={100} />
        <MetricCard 
          value={Math.abs(improvementValue)} 
          label="Total Improvement" 
          unit="%" 
          delay={200}
          trend={{ direction: improvementValue > 0 ? "up" : "down", value: Math.round(improvementValue) }}
        />
        <MetricCard value={bestCategory.value} label={`Best: ${bestCategory.name}`} unit="t" delay={300} />
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section aria-labelledby="trend-heading" className="lg:col-span-2 space-y-4">
          <h2 id="trend-heading" className="text-2xl font-bold">Emissions Trend</h2>
          <TrendChart data={trendData} />
        </section>

        <section aria-labelledby="comparison-heading" className="space-y-4">
          <h2 id="comparison-heading" className="text-2xl font-bold">Category Targets</h2>
          <CategoryComparison data={comparisonData} />
        </section>
      </div>
    </div>
  );
}
