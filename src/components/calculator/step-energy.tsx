"use client";

import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { LiquidInput } from "@/components/ui/liquid-input";
import type { CalculatorInput } from "@/lib/calculations/calculator";

export const StepEnergy = memo(function StepEnergy() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CalculatorInput>();

  const heatingType = watch("energy.heatingType");

  return (
    <fieldset className="space-y-6 border-0 p-0 m-0">
      <legend className="text-2xl font-semibold mb-6">Energy</legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LiquidInput
          label="Electricity (kWh/month)"
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter monthly kWh"
          min={0}
          helperText="Check your utility bill"
          error={errors.energy?.kwhPerMonth?.message}
          {...register("energy.kwhPerMonth")}
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            Electricity Source
          </label>
          <select
            className="liquid-glass-light w-full px-4 py-3 text-foreground bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl"
            {...register("energy.electricitySource")}
          >
            <option value="grid">Grid (Average mix)</option>
            <option value="renewable">100% Renewable</option>
            <option value="mixed">Partial renewable</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            Home Heating Type
          </label>
          <select
            className="liquid-glass-light w-full px-4 py-3 text-foreground bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl"
            {...register("energy.heatingType")}
          >
            <option value="none">No separate heating</option>
            <option value="naturalGas">Natural Gas</option>
            <option value="heatingOil">Heating Oil</option>
            <option value="electric">Electric (captured above)</option>
          </select>
        </div>

        {heatingType !== "none" && heatingType !== "electric" && (
          <LiquidInput
            label="Heating usage (units/month)"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter monthly usage"
            min={0}
            helperText="Therms for gas, gallons for oil"
            error={errors.energy?.heatingAmount?.message}
            {...register("energy.heatingAmount")}
          />
        )}
      </div>
    </fieldset>
  );
});
