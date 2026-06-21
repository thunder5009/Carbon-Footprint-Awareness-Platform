"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import {
  CalculatorInputSchema,
  calculateFootprint,
} from "@/lib/calculations/calculator";
import type {
  TransportInput,
  EnergyInput,
  FoodInput,
  WasteInput,
} from "@/lib/calculations/calculator";

/* ─── Step Definitions ────────────────────────────────────── */

const STEPS = [
  { id: "transport", label: "Transport", number: "01" },
  { id: "energy", label: "Energy", number: "02" },
  { id: "food", label: "Food", number: "03" },
  { id: "waste", label: "Waste", number: "04" },
] as const;

/* ─── Default Values ──────────────────────────────────────── */

const defaultTransport: TransportInput = {
  hasCar: false,
  fuelType: "gasoline",
  milesPerYear: 0,
  busMiles: 0,
  trainMiles: 0,
  subwayMiles: 0,
  shortHaulFlights: 0,
  longHaulFlights: 0,
};

const defaultEnergy: EnergyInput = {
  kwhPerMonth: 0,
  electricitySource: "grid",
  heatingType: "none",
  heatingAmount: 0,
};

const defaultFood: FoodInput = {
  dietType: "omnivore",
  wasteFrequency: "sometimes",
};

const defaultWaste: WasteInput = {
  lbsPerWeek: 0,
  recycling: false,
  composting: false,
};

/* ─── Animation Variants ──────────────────────────────────── */

const pageVariants = {
  enter: { opacity: 0, x: 80, scale: 0.98 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -80, scale: 0.98 },
};

/* ─── Main Calculator Component ───────────────────────────── */

export default function CalculatorPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [transport, setTransport] = useState<TransportInput>(defaultTransport);
  const [energy, setEnergy] = useState<EnergyInput>(defaultEnergy);
  const [food, setFood] = useState<FoodInput>(defaultFood);
  const [waste, setWaste] = useState<WasteInput>(defaultWaste);

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleNext = useCallback(() => {
    setError(null);
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Final step — calculate and navigate to results
      const raw = { transport, energy, food, waste };
      const parsed = CalculatorInputSchema.safeParse(raw);
      if (!parsed.success) {
        setError("Please check your inputs and try again.");
        return;
      }
      const result = calculateFootprint(parsed.data);
      sessionStorage.setItem("carbonResult", JSON.stringify(result));
      sessionStorage.setItem("carbonInputs", JSON.stringify(raw));
      router.push("/results");
    }
  }, [step, transport, energy, food, waste, router]);

  const handleBack = useCallback(() => {
    setError(null);
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  return (
    <>
      <Navbar />

      <div style={{ minHeight: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
        {/* Progress bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Step indicator */}
        <div
          style={{
            padding: "32px 32px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "32px" }}>
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setStep(i); setError(null); }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: i === step ? "#fff" : i < step ? "#666" : "#333",
                  transition: "color 0.3s ease",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: "0.75rem", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {s.number}
                </span>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: i === step ? 600 : 400,
                    display: "none",
                  }}
                  className="step-label-text"
                >
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          <span style={{ fontSize: "0.75rem", color: "#444" }}>
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: "40px 32px 80px", maxWidth: "700px", margin: "0 auto", width: "100%" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 0 && (
                <TransportStep data={transport} onChange={setTransport} />
              )}
              {step === 1 && (
                <EnergyStep data={energy} onChange={setEnergy} />
              )}
              {step === 2 && (
                <FoodStep data={food} onChange={setFood} />
              )}
              {step === 3 && (
                <WasteStep data={waste} onChange={setWaste} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: "#ff4444", fontSize: "0.875rem", marginTop: "16px" }}
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* Bottom Navigation */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            padding: "24px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1a1a1a",
            background: "rgba(5, 5, 5, 0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <button
            onClick={handleBack}
            disabled={step === 0}
            style={{
              background: "none",
              border: "none",
              color: step === 0 ? "#333" : "#999",
              cursor: step === 0 ? "default" : "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "color 0.3s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <button onClick={handleNext} className="btn-primary" style={{ minWidth: "160px" }}>
            {step === STEPS.length - 1 ? "Calculate" : "Continue"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Step Components
   ═══════════════════════════════════════════════════════════════ */

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: "48px" }}>
      <h1 className="text-display" style={{ marginBottom: "16px" }}>{title}</h1>
      <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.6, maxWidth: "500px" }}>
        {subtitle}
      </p>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "12px" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function OptionGrid({ options, value, onChange }: { options: { value: string; label: string; desc?: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px" }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: "16px 20px",
            background: value === opt.value ? "#fff" : "transparent",
            color: value === opt.value ? "#000" : "#999",
            border: `1px solid ${value === opt.value ? "#fff" : "#222"}`,
            borderRadius: "12px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
        >
          <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize: "0.75rem", marginTop: "4px", opacity: 0.6 }}>{opt.desc}</div>}
        </button>
      ))}
    </div>
  );
}

/* ─── Transport Step ──────────────────────────────────────── */

function TransportStep({ data, onChange }: { data: TransportInput; onChange: (d: TransportInput) => void }) {
  const update = (patch: Partial<TransportInput>) => onChange({ ...data, ...patch });

  return (
    <>
      <StepHeader
        title="Transport"
        subtitle="How do you get around? Tell us about your daily commute and travel habits."
      />

      <FieldGroup label="Do you drive a car?">
        <OptionGrid
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          value={data.hasCar ? "yes" : "no"}
          onChange={(v) => update({ hasCar: v === "yes" })}
        />
      </FieldGroup>

      {data.hasCar && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
          <FieldGroup label="Fuel Type">
            <OptionGrid
              options={[
                { value: "gasoline", label: "Gasoline" },
                { value: "diesel", label: "Diesel" },
                { value: "hybrid", label: "Hybrid" },
                { value: "electric", label: "Electric" },
              ]}
              value={data.fuelType}
              onChange={(v) => update({ fuelType: v as TransportInput["fuelType"] })}
            />
          </FieldGroup>

          <FieldGroup label="Miles driven per year">
            <input
              type="number"
              className="input-premium"
              placeholder="12,000"
              value={data.milesPerYear || ""}
              onChange={(e) => update({ milesPerYear: Number(e.target.value) || 0 })}
            />
          </FieldGroup>
        </motion.div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <FieldGroup label="Bus miles / year">
          <input
            type="number"
            className="input-premium"
            placeholder="0"
            value={data.busMiles || ""}
            onChange={(e) => update({ busMiles: Number(e.target.value) || 0 })}
          />
        </FieldGroup>
        <FieldGroup label="Train miles / year">
          <input
            type="number"
            className="input-premium"
            placeholder="0"
            value={data.trainMiles || ""}
            onChange={(e) => update({ trainMiles: Number(e.target.value) || 0 })}
          />
        </FieldGroup>
      </div>

      <FieldGroup label="Subway miles / year">
        <input
          type="number"
          className="input-premium"
          placeholder="0"
          value={data.subwayMiles || ""}
          onChange={(e) => update({ subwayMiles: Number(e.target.value) || 0 })}
        />
      </FieldGroup>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <FieldGroup label="Short-haul flights / year">
          <input
            type="number"
            className="input-premium"
            placeholder="0"
            value={data.shortHaulFlights || ""}
            onChange={(e) => update({ shortHaulFlights: Number(e.target.value) || 0 })}
          />
        </FieldGroup>
        <FieldGroup label="Long-haul flights / year">
          <input
            type="number"
            className="input-premium"
            placeholder="0"
            value={data.longHaulFlights || ""}
            onChange={(e) => update({ longHaulFlights: Number(e.target.value) || 0 })}
          />
        </FieldGroup>
      </div>
    </>
  );
}

/* ─── Energy Step ─────────────────────────────────────────── */

function EnergyStep({ data, onChange }: { data: EnergyInput; onChange: (d: EnergyInput) => void }) {
  const update = (patch: Partial<EnergyInput>) => onChange({ ...data, ...patch });

  return (
    <>
      <StepHeader
        title="Energy"
        subtitle="Your home energy usage — electricity consumption and heating sources."
      />

      <FieldGroup label="Electricity usage (kWh / month)">
        <input
          type="number"
          className="input-premium"
          placeholder="900"
          value={data.kwhPerMonth || ""}
          onChange={(e) => update({ kwhPerMonth: Number(e.target.value) || 0 })}
        />
      </FieldGroup>

      <FieldGroup label="Electricity source">
        <OptionGrid
          options={[
            { value: "grid", label: "Grid", desc: "Standard" },
            { value: "renewable", label: "Renewable", desc: "Solar/Wind" },
            { value: "mixed", label: "Mixed", desc: "Combination" },
          ]}
          value={data.electricitySource}
          onChange={(v) => update({ electricitySource: v as EnergyInput["electricitySource"] })}
        />
      </FieldGroup>

      <FieldGroup label="Heating type">
        <OptionGrid
          options={[
            { value: "none", label: "None" },
            { value: "naturalGas", label: "Natural Gas" },
            { value: "heatingOil", label: "Heating Oil" },
            { value: "electric", label: "Electric" },
          ]}
          value={data.heatingType}
          onChange={(v) => update({ heatingType: v as EnergyInput["heatingType"] })}
        />
      </FieldGroup>

      {data.heatingType !== "none" && data.heatingType !== "electric" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <FieldGroup label="Heating usage (units / month)">
            <input
              type="number"
              className="input-premium"
              placeholder="50"
              value={data.heatingAmount || ""}
              onChange={(e) => update({ heatingAmount: Number(e.target.value) || 0 })}
            />
          </FieldGroup>
        </motion.div>
      )}
    </>
  );
}

/* ─── Food Step ───────────────────────────────────────────── */

function FoodStep({ data, onChange }: { data: FoodInput; onChange: (d: FoodInput) => void }) {
  const update = (patch: Partial<FoodInput>) => onChange({ ...data, ...patch });

  return (
    <>
      <StepHeader
        title="Food"
        subtitle="Your diet has a significant impact on emissions. What best describes your eating habits?"
      />

      <FieldGroup label="Diet type">
        <OptionGrid
          options={[
            { value: "vegan", label: "Vegan", desc: "No animal products" },
            { value: "vegetarian", label: "Vegetarian", desc: "No meat" },
            { value: "pescatarian", label: "Pescatarian", desc: "Fish only" },
            { value: "omnivore", label: "Omnivore", desc: "Mixed diet" },
            { value: "heavyMeat", label: "Heavy Meat", desc: "Daily meat" },
          ]}
          value={data.dietType}
          onChange={(v) => update({ dietType: v as FoodInput["dietType"] })}
        />
      </FieldGroup>

      <FieldGroup label="How often do you waste food?">
        <OptionGrid
          options={[
            { value: "rarely", label: "Rarely", desc: "Almost never" },
            { value: "sometimes", label: "Sometimes", desc: "Occasionally" },
            { value: "often", label: "Often", desc: "Frequently" },
            { value: "always", label: "Always", desc: "Very often" },
          ]}
          value={data.wasteFrequency}
          onChange={(v) => update({ wasteFrequency: v as FoodInput["wasteFrequency"] })}
        />
      </FieldGroup>
    </>
  );
}

/* ─── Waste Step ──────────────────────────────────────────── */

function WasteStep({ data, onChange }: { data: WasteInput; onChange: (d: WasteInput) => void }) {
  const update = (patch: Partial<WasteInput>) => onChange({ ...data, ...patch });

  return (
    <>
      <StepHeader
        title="Waste"
        subtitle="How much household waste do you produce, and do you recycle or compost?"
      />

      <FieldGroup label="Trash produced (lbs / week)">
        <input
          type="number"
          className="input-premium"
          placeholder="20"
          value={data.lbsPerWeek || ""}
          onChange={(e) => update({ lbsPerWeek: Number(e.target.value) || 0 })}
        />
      </FieldGroup>

      <FieldGroup label="Do you recycle?">
        <OptionGrid
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          value={data.recycling ? "yes" : "no"}
          onChange={(v) => update({ recycling: v === "yes" })}
        />
      </FieldGroup>

      <FieldGroup label="Do you compost?">
        <OptionGrid
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          value={data.composting ? "yes" : "no"}
          onChange={(v) => update({ composting: v === "yes" })}
        />
      </FieldGroup>
    </>
  );
}
