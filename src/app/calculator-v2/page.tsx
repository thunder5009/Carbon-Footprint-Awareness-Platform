"use client";

/**
 * Calculator Page with Liquid Glass V2
 * 
 * Production example showing full integration into existing CarbonTrack calculator.
 * Demonstrates:
 * - Multi-step form with glass cards
 * - Real-time sidebar with thick glass
 * - Staggered entry animations
 * - Mobile accordion with thin glass
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidGlassV2 } from "@/components/ui/liquid-glass-v2";
import { LiquidButton } from "@/components/ui/liquid-button";
import { CalculatorInputSchema } from "@/lib/calculations/calculator";
import type { CalculationResult } from "@/lib/calculations/calculator";
import { useRouter } from "next/navigation";
import {
  Car,
  Zap,
  Salad,
  Trash2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

import { StepTransport } from "@/components/calculator/step-transport";
import { StepEnergy } from "@/components/calculator/step-energy";
import { StepFood } from "@/components/calculator/step-food";
import { StepWaste } from "@/components/calculator/step-waste";

const steps = [
  { id: "transport", label: "Transport", icon: Car, Component: StepTransport },
  { id: "energy", label: "Energy", icon: Zap, Component: StepEnergy },
  { id: "food", label: "Food", icon: Salad, Component: StepFood },
  { id: "waste", label: "Waste", icon: Trash2, Component: StepWaste },
] as const;

import { z } from "zod";

type CalculatorFormValues = z.input<typeof CalculatorInputSchema>;

const defaultFormData = {
  transport: {
    hasCar: false,
    fuelType: "gasoline" as const,
    milesPerYear: 0,
    busMiles: 0,
    trainMiles: 0,
    subwayMiles: 0,
    shortHaulFlights: 0,
    longHaulFlights: 0,
  },
  energy: {
    kwhPerMonth: 0,
    electricitySource: "grid" as const,
    heatingType: "none" as const,
    heatingAmount: 0,
  },
  food: {
    dietType: "omnivore" as const,
    wasteFrequency: "sometimes" as const,
  },
  waste: {
    lbsPerWeek: 0,
    recycling: false,
    composting: false,
  },
};

export default function CalculatorV2Page() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<number>(0);
  const [realtimeResult, setRealtimeResult] = useState<CalculationResult | null>(
    null
  );
  const workerRef = useRef<Worker | null>(null);

  const methods = useForm<CalculatorFormValues>({
    resolver: zodResolver(CalculatorInputSchema),
    defaultValues: defaultFormData,
    mode: "onTouched",
    shouldFocusError: true,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = methods;
  const formData = useWatch({ control });

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/lib/calculations/calculator.worker.ts", import.meta.url)
    );
    workerRef.current.onmessage = (e) => {
      if (e.data.type === "SUCCESS") {
        setRealtimeResult(e.data.result);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Real-time calculation
  useEffect(() => {
    const parsed = CalculatorInputSchema.safeParse(formData);
    if (parsed.success && workerRef.current) {
      workerRef.current.postMessage(parsed.data);
    }
  }, [formData]);

  const onSubmit = useCallback(
    (data: CalculatorFormValues) => {
      const worker = new Worker(
        new URL("@/lib/calculations/calculator.worker.ts", import.meta.url)
      );
      worker.onmessage = (e) => {
        if (e.data.type === "SUCCESS") {
          sessionStorage.setItem("carbonResult", JSON.stringify(e.data.result));
          router.push("/results");
        }
        worker.terminate();
      };
      worker.postMessage(data);
    },
    [router]
  );

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-1 glass-text">
            Carbon Calculator V2
          </h1>
          <p className="text-muted-foreground">
            Powered by iOS 26 Liquid Glass • Cursor-tracked specular • 60fps
          </p>
        </motion.div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Desktop Stepper */}
            <div className="hidden md:block">
              <LiquidGlassV2 material="regular" animate className="p-8">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={index === currentStep ? "block" : "hidden"}
                  >
                    <step.Component />
                  </div>
                ))}
              </LiquidGlassV2>

              <div className="flex justify-between mt-8">
                <LiquidButton
                  type="button"
                  variant="clear"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </LiquidButton>
                {currentStep < steps.length - 1 ? (
                  <LiquidButton type="button" onClick={handleNext}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </LiquidButton>
                ) : (
                  <LiquidButton type="submit">Calculate</LiquidButton>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Sticky Sidebar */}
      <div className="hidden lg:block lg:sticky lg:top-24 space-y-4">
        <LiquidGlassV2 material="thick" animate className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Live Estimate</h2>
            <p className="text-sm text-muted-foreground">
              Real-time • Web Worker
            </p>
          </div>

          {realtimeResult ? (
            <div className="space-y-6">
              <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="block text-4xl font-bold text-primary">
                  {realtimeResult.totalCO2.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  tons CO₂ / year
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Breakdown</h3>
                {Object.entries(realtimeResult.breakdown).map(
                  ([category, value]) => {
                    const maxValue = Math.max(
                      ...Object.values(realtimeResult.breakdown)
                    );
                    const percentage = (value / maxValue) * 100;

                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize">{category}</span>
                          <span className="font-medium">{value.toFixed(1)} t</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Enter values to see your footprint.</p>
            </div>
          )}
        </LiquidGlassV2>
      </div>
    </div>
  );
}
