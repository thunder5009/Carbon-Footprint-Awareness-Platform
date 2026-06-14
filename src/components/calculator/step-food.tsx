"use client";

import { memo } from "react";
import { useFormContext } from "react-hook-form";
import type { CalculatorInput } from "@/lib/calculations/calculator";

export const StepFood = memo(function StepFood() {
  const { register, watch } = useFormContext<CalculatorInput>();

  const wasteFrequency = watch("food.wasteFrequency");

  return (
    <fieldset className="space-y-6 border-0 p-0 m-0">
      <legend className="text-2xl font-semibold mb-6">Food</legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            Diet Type
          </label>
          <select
            className="liquid-glass-light w-full px-4 py-3 text-foreground bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl"
            {...register("food.dietType")}
          >
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="pescatarian">Pescatarian</option>
            <option value="omnivore">Omnivore (Mixed)</option>
            <option value="heavyMeat">Heavy Meat Eater</option>
          </select>
        </div>

        <fieldset className="space-y-2 border-0 p-0 m-0">
          <legend className="text-sm font-medium text-foreground/80">
            How often do you waste food?
          </legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Food waste frequency">
            {(["rarely", "sometimes", "often", "always"] as const).map((freq) => (
              <label
                key={freq}
                className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer text-center block ${
                  wasteFrequency === freq
                    ? "bg-primary text-primary-foreground"
                    : "liquid-glass-light text-muted-foreground hover:text-foreground"
                }`}
              >
                <input
                  type="radio"
                  value={freq}
                  className="sr-only"
                  {...register("food.wasteFrequency")}
                />
                {freq}
              </label>
            ))}
          </div>
        </fieldset>

      </div>
    </fieldset>
  );
});
