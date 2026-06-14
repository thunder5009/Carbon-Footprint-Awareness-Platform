"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { LiquidButton } from "@/components/ui/liquid-button";
import { CalculatorInputSchema } from "@/lib/calculations/calculator";
import type { CalculationResult } from "@/lib/calculations/calculator";
import { useRouter } from "next/navigation";
import { Car, Zap, Salad, Trash2, ChevronRight, ChevronLeft, AlertCircle, ChevronDown } from "lucide-react";

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

// Helper function to recursively collect all nested error messages
function getErrorMessages(errors: FieldErrors<CalculatorFormValues>): { path: string; message: string }[] {
  const result: { path: string; message: string }[] = [];
  
  const recurse = (obj: unknown, currentPath = "") => {
    if (!obj || typeof obj !== "object") return;
    
    // Check if it's a FieldError (has message property)
    if ("message" in obj && typeof (obj as { message?: unknown }).message === "string") {
      result.push({
        path: currentPath,
        message: (obj as { message: string }).message,
      });
      return;
    }
    
    // Otherwise recurse into its properties
    const record = obj as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      const val = record[key];
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      recurse(val, newPath);
    }
  };
  
  recurse(errors);
  return result;
}

export default function CalculatorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<number>(0);
  const [realtimeResult, setRealtimeResult] = useState<CalculationResult | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const methods = useForm<CalculatorFormValues>({
    resolver: zodResolver(CalculatorInputSchema),
    defaultValues: defaultFormData,
    mode: "onBlur", // Only validate when field loses focus
    reValidateMode: "onChange", // Re-validate on change after first validation
    shouldFocusError: true, // Accessibility focus management
  });

  const { handleSubmit, control, formState: { errors }, reset } = methods;
  const formData = useWatch({ control });

  // Debug: Log form data changes
  useEffect(() => {
    console.log("Form data changed:", formData);
  }, [formData]);

  // ── Restore from SessionStorage on mount ──
  useEffect(() => {
    const saved = sessionStorage.getItem("carbonInputs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        reset(parsed);
      } catch (e) {
        console.error("Failed to restore session data", e);
      }
    }
  }, [reset]);

  // ── Debounced Auto-save & Web Worker Calc ──
  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL('@/lib/calculations/calculator.worker.ts', import.meta.url));
    workerRef.current.onmessage = (e) => {
      if (e.data.type === "SUCCESS") {
        setRealtimeResult(e.data.result);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    // 5-second debounced auto-save
    const autoSaveTimer = setTimeout(() => {
      sessionStorage.setItem("carbonInputs", JSON.stringify(formData));
      console.log("Auto-saved form data:", formData);
    }, 5000);

    // Send to worker for real-time calculation if valid
    const parsed = CalculatorInputSchema.safeParse(formData);
    console.log("Form validation result:", parsed.success ? "VALID" : "INVALID", parsed);
    if (parsed.success && workerRef.current) {
      console.log("Sending to worker for calculation:", parsed.data);
      workerRef.current.postMessage(parsed.data);
    } else if (!parsed.success) {
      console.log("Form validation errors:", parsed.error.errors);
    }

    return () => clearTimeout(autoSaveTimer);
  }, [formData]);

  const onSubmit = useCallback((data: CalculatorFormValues) => {
    // Final validation passed, we can calculate (or use the last realtime result) and redirect
    const worker = new Worker(new URL('@/lib/calculations/calculator.worker.ts', import.meta.url));
    worker.onmessage = (e) => {
      if (e.data.type === "SUCCESS") {
        const calculated = e.data.result;
        sessionStorage.setItem("carbonResult", JSON.stringify(calculated));
        sessionStorage.setItem("carbonInputs", JSON.stringify(data));
        
        // Save to history
        const rawHistory = localStorage.getItem("carbonHistory");
        const history: unknown[] = rawHistory ? JSON.parse(rawHistory) : [];
        history.push({
          id: Math.random().toString(36).substring(2, 11),
          createdAt: new Date().toISOString(),
          totalCO2: calculated.totalCO2,
          breakdown: calculated.breakdown,
          inputs: data,
        });
        localStorage.setItem("carbonHistory", JSON.stringify(history));

        router.push("/results");
      }
      worker.terminate();
    };
    worker.postMessage(data);
  }, [router]);

  const onError = useCallback(() => {
    // Trigger generic shake or scroll-to-top behavior for accessibility if needed
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNext = async () => {
    // Validate the entire step section instead of individual fields
    // This allows Zod's superRefine and conditional logic to work correctly
    let sectionToValidate: "transport" | "energy" | "food" | "waste";
    
    if (currentStep === 0) sectionToValidate = "transport";
    else if (currentStep === 1) sectionToValidate = "energy";
    else if (currentStep === 2) sectionToValidate = "food";
    else sectionToValidate = "waste";

    const isValid = await methods.trigger(sectionToValidate);
    
    console.log(`Validating ${sectionToValidate}:`, isValid);
    console.log("Current form values:", methods.getValues());
    console.log("Errors:", methods.formState.errors);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      // Scroll to top to show error messages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleBack = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* ── Main Form Area ────────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-1 glass-text">
            Carbon Calculator
          </h1>
          <p className="text-muted-foreground">
            Complete the sections below to estimate your annual footprint.
          </p>
        </motion.div>

        {/* Error Summary */}
        {hasErrors && (
          <LiquidGlass variant="light" className="p-4 border-destructive bg-destructive/10 text-destructive" role="alert">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Please fix the following errors:</h3>
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  {getErrorMessages(errors).map(({ path, message }) => (
                    <li key={path}>
                      <span className="font-medium capitalize">{path.replace(/\./g, " > ")}</span>: {message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </LiquidGlass>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            
            {/* Desktop Stepper */}
            <div className="hidden md:block">
              <nav aria-label="Calculator progress" className="mb-8">
                <ol className="flex items-center gap-0">
                  {steps.map((step, i) => {
                    const Icon = step.icon;
                    const isComplete = i < currentStep;
                    const isCurrent = i === currentStep;
                    return (
                      <li key={step.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                              isComplete
                                ? "bg-primary text-primary-foreground"
                                : isCurrent
                                ? "bg-primary/20 text-primary border-2 border-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                            aria-current={isCurrent ? "step" : undefined}
                          >
                            <Icon className="w-4 h-4" aria-hidden="true" />
                          </div>
                          <span className={`text-xs font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </div>
                        {i < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 mt-[-16px] transition-colors ${
                              isComplete ? "bg-primary" : "bg-muted"
                            }`}
                            aria-hidden="true"
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <LiquidGlass className="p-8">
                {steps.map((step, index) => (
                  <div key={step.id} className={index === currentStep ? "block" : "hidden"}>
                    <step.Component />
                  </div>
                ))}
              </LiquidGlass>

              <div className="flex justify-between mt-8">
                <LiquidButton
                  type="button"
                  variant="clear"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  aria-label="Go to previous step"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
                  Back
                </LiquidButton>
                {currentStep < steps.length - 1 ? (
                  <LiquidButton type="button" onClick={handleNext} aria-label="Go to next step">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </LiquidButton>
                ) : (
                  <LiquidButton type="submit" aria-label="Calculate my carbon footprint">
                    Calculate
                  </LiquidButton>
                )}
              </div>
            </div>

            {/* Mobile Accordion */}
            <div className="md:hidden space-y-4">
              {steps.map((step, index) => {
                const isActive = activeAccordion === index;
                const Icon = step.icon;
                return (
                  <LiquidGlass key={step.id} className="overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setActiveAccordion(index)}
                      className="w-full p-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
                      aria-expanded={isActive}
                      aria-controls={`accordion-content-${step.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold">{step.label}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          id={`accordion-content-${step.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 pt-2"
                        >
                          <step.Component />
                          {index === steps.length - 1 ? (
                            <LiquidButton type="submit" className="w-full mt-6">
                              Calculate Results
                            </LiquidButton>
                          ) : (
                            <LiquidButton
                              type="button"
                              className="w-full mt-6"
                              onClick={() => setActiveAccordion(index + 1)}
                            >
                              Continue to {steps[index + 1].label}
                            </LiquidButton>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </LiquidGlass>
                );
              })}
            </div>
          </form>
        </FormProvider>
      </div>

      {/* ── Sticky Real-time Sidebar ────────────────────────────── */}
      <div className="hidden lg:block lg:sticky lg:top-24 space-y-4">
        <LiquidGlass variant="heavy" className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Live Estimate</h2>
            <p className="text-sm text-muted-foreground">Updates as you type</p>
          </div>
          
          <div aria-live="polite" aria-atomic="true">
            {realtimeResult ? (
              <div className="space-y-6">
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="block text-4xl font-bold text-primary">
                    {realtimeResult.totalCO2.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">tons CO₂ / year</span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Breakdown</h3>
                  {Object.entries(realtimeResult.breakdown).map(([category, value]) => {
                    const maxCatValue = Math.max(...Object.values(realtimeResult.breakdown));
                    const percentage = maxCatValue > 0 ? (value / maxCatValue) * 100 : 0;
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
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Enter values to see your footprint.</p>
              </div>
            )}
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
}
