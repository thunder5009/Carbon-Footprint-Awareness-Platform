"use client";

import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { LiquidInput } from "@/components/ui/liquid-input";
import type { CalculatorInput } from "@/lib/calculations/calculator";

export const StepWaste = memo(function StepWaste() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CalculatorInput>();

  return (
    <fieldset className="space-y-6 border-0 p-0 m-0">
      <legend className="text-2xl font-semibold mb-6">Waste</legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <LiquidInput
          label="Trash generated (lbs/week)"
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter lbs per week"
          min={0}
          helperText="Average US household: 30 lbs/week"
          error={errors.waste?.lbsPerWeek?.message}
          {...register("waste.lbsPerWeek")}
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground/80">Waste reduction habits</p>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("waste.recycling")}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              I recycle paper, plastic, and metal
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("waste.composting")}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              I compost food scraps
            </span>
          </label>
        </div>

      </div>
    </fieldset>
  );
});
