"use client";

import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { LiquidInput } from "@/components/ui/liquid-input";
import type { CalculatorInput } from "@/lib/calculations/calculator";

export const StepTransport = memo(function StepTransport() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CalculatorInput>();

  const hasCar = watch("transport.hasCar");

  return (
    <fieldset className="space-y-6 border-0 p-0 m-0">
      <legend className="text-2xl font-semibold mb-6">Transport</legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="md:col-span-2 space-y-3">
          <p className="text-sm font-medium text-foreground/80">Do you drive a car?</p>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("transport.hasCar")}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Yes, I drive a car regularly
            </span>
          </label>
        </div>

        {hasCar && (
          <>
            <LiquidInput
              label="Car miles per year"
              type="number"
              inputMode="numeric"
              placeholder="Enter car miles"
              error={errors.transport?.milesPerYear?.message}
              {...register("transport.milesPerYear")}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                Fuel Type
              </label>
              <select
                className="liquid-glass-light w-full px-4 py-3 text-foreground bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl"
                {...register("transport.fuelType")}
                aria-invalid={errors.transport?.fuelType ? "true" : undefined}
              >
                <option value="gasoline">Gasoline</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </div>
          </>
        )}

        <LiquidInput
          label="Bus miles per year"
          type="number"
          inputMode="numeric"
          placeholder="Enter bus miles"
          error={errors.transport?.busMiles?.message}
          {...register("transport.busMiles")}
        />
        <LiquidInput
          label="Train miles per year"
          type="number"
          inputMode="numeric"
          placeholder="Enter train miles"
          error={errors.transport?.trainMiles?.message}
          {...register("transport.trainMiles")}
        />
        <LiquidInput
          label="Subway miles per year"
          type="number"
          inputMode="numeric"
          placeholder="Enter subway miles"
          error={errors.transport?.subwayMiles?.message}
          {...register("transport.subwayMiles")}
        />
        <LiquidInput
          label="Short-haul flights"
          type="number"
          inputMode="numeric"
          placeholder="Enter number of flights"
          helperText="Under ~3 hours flight time (round trips)"
          error={errors.transport?.shortHaulFlights?.message}
          {...register("transport.shortHaulFlights")}
        />
        <LiquidInput
          label="Long-haul flights"
          type="number"
          inputMode="numeric"
          placeholder="Enter number of flights"
          helperText="Over ~3 hours flight time (round trips)"
          error={errors.transport?.longHaulFlights?.message}
          {...register("transport.longHaulFlights")}
        />
      </div>
    </fieldset>
  );
});
