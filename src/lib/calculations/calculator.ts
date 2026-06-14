/**
 * Carbon Footprint Calculator
 *
 * Pure functions only — no side effects, no database calls, no I/O.
 * Input validation via Zod schema before calculation.
 * Results rounded to 3 decimal places to prevent floating-point artifacts.
 *
 * Uncertainty: All results are estimates. See emission-factors.ts for
 * per-category uncertainty documentation. Total uncertainty is typically
 * ±20-30% for individual calculations.
 */

import { z } from "zod";
import { EMISSION_FACTORS, WASTE_FREQUENCY_SCALE } from "./emission-factors";

// ─────────────────────────────────────────────
// Input Schema — shared between client and server
// ─────────────────────────────────────────────

const positiveNumber = (name: string, max: number = 100_000) =>
  z.preprocess(
    (val) => {
      // HTML number inputs send empty string when blank — treat as 0
      if (val === "" || val === undefined || val === null) return 0;
      if (typeof val === "number") return val;
      const n = Number(val);
      return Number.isNaN(n) ? val : n; // pass NaN-triggering strings through so Zod catches them
    },
    z
      .number({ message: `Please enter a valid number for ${name}` })
      .min(0, "Cannot be negative")
      .max(max, "That's a lot! Are you sure?")
  );

export const TransportInputSchema = z.object({
  hasCar: z.coerce.boolean().default(false),
  fuelType: z.enum(["gasoline", "diesel", "hybrid", "electric"]).default("gasoline"),
  milesPerYear: positiveNumber("miles").optional(),
  busMiles: positiveNumber("bus miles"),
  trainMiles: positiveNumber("train miles"),
  subwayMiles: positiveNumber("subway miles"),
  shortHaulFlights: positiveNumber("flights"),
  longHaulFlights: positiveNumber("flights"),
});

export const EnergyInputSchema = z.object({
  kwhPerMonth: positiveNumber("electricity usage"),
  electricitySource: z.enum(["grid", "renewable", "mixed"]).default("grid"),
  heatingType: z.enum(["naturalGas", "heatingOil", "electric", "none"]).default("none"),
  heatingAmount: positiveNumber("heating usage").default(0),
});

export const FoodInputSchema = z.object({
  dietType: z.enum(["vegan", "vegetarian", "pescatarian", "omnivore", "heavyMeat"]).default("omnivore"),
  wasteFrequency: z.enum(["rarely", "sometimes", "often", "always"]).default("sometimes"),
});

export const WasteInputSchema = z.object({
  lbsPerWeek: positiveNumber("trash generated"),
  recycling: z.coerce.boolean().default(false),
  composting: z.coerce.boolean().default(false),
});

export const CalculatorInputSchema = z.object({
  transport: TransportInputSchema,
  energy: EnergyInputSchema,
  food: FoodInputSchema,
  waste: WasteInputSchema,
}).superRefine((val, ctx) => {
  const totalMiles = 
    (val.transport.milesPerYear || 0) + 
    val.transport.busMiles + 
    val.transport.trainMiles + 
    val.transport.subwayMiles;
  
  if (totalMiles > 500_000) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Total transport miles cannot exceed 500,000",
      path: ["transport", "milesPerYear"],
    });
  }
});

export type CalculatorInput = z.infer<typeof CalculatorInputSchema>;
export type TransportInput = z.infer<typeof TransportInputSchema>;
export type EnergyInput = z.infer<typeof EnergyInputSchema>;
export type FoodInput = z.infer<typeof FoodInputSchema>;
export type WasteInput = z.infer<typeof WasteInputSchema>;

// ─────────────────────────────────────────────
// Output Types
// ─────────────────────────────────────────────

export interface CategoryBreakdown {
  transport: number;
  energy: number;
  food: number;
  waste: number;
}

export interface CalculationResult {
  /** Total annual carbon footprint in metric tons CO2e */
  totalCO2: number;
  /** Per-category breakdown in metric tons CO2e */
  breakdown: CategoryBreakdown;
}

// ─────────────────────────────────────────────
// Precision utility
// ─────────────────────────────────────────────

/** Round to 3 decimal places. Prevents floating-point display artifacts. */
function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

// ─────────────────────────────────────────────
// Per-category calculators (pure, testable)
// ─────────────────────────────────────────────

/**
 * Calculate annual transport emissions in metric tons CO2e.
 *
 * Covers personal vehicles, public transit, and aviation.
 * All inputs are in miles; output is metric tons.
 */
export function calculateTransport(input: TransportInput): number {
  const factors = EMISSION_FACTORS.transport;
  let kgCO2 = 0;

  // Personal vehicle
  if (input.hasCar && input.fuelType && input.milesPerYear) {
    kgCO2 += input.milesPerYear * factors.car[input.fuelType];
  }

  // Public transit
  kgCO2 += input.busMiles * factors.publicTransit.bus;
  kgCO2 += input.trainMiles * factors.publicTransit.train;
  kgCO2 += input.subwayMiles * factors.publicTransit.subway;

  // Aviation (round trips × avg distance per trip × factor)
  kgCO2 += input.shortHaulFlights * factors.flightDistances.shortHaul * factors.flight.shortHaul;
  kgCO2 += input.longHaulFlights * factors.flightDistances.longHaul * factors.flight.longHaul;

  // Convert kg → metric tons
  return round3(kgCO2 / 1000);
}

/**
 * Calculate annual home energy emissions in metric tons CO2e.
 *
 * Covers electricity consumption and heating fuel.
 * Electricity input is monthly kWh; heating is monthly units.
 */
export function calculateEnergy(input: EnergyInput): number {
  const factors = EMISSION_FACTORS.energy;
  let kgCO2 = 0;

  // Electricity: monthly → annual
  const electricityFactor =
    input.electricitySource === "renewable"
      ? factors.electricity.renewable
      : factors.electricity.grid;
  kgCO2 += input.kwhPerMonth * 12 * electricityFactor;

  // Heating fuel: monthly → annual
  const heatingAmount = input.heatingAmount || 0;
  if (input.heatingType === "naturalGas") {
    kgCO2 += heatingAmount * factors.naturalGas * 12;
  } else if (input.heatingType === "heatingOil") {
    kgCO2 += heatingAmount * factors.heatingOil * 12;
  }
  // "electric" heating is already captured in electricity consumption
  // "none" = no additional heating emissions

  return round3(kgCO2 / 1000);
}

/**
 * Calculate annual food-related emissions in metric tons CO2e.
 *
 * Uses diet classification as baseline, adjusted for food waste frequency.
 * Food waste adds 0–15% to baseline depending on reported frequency.
 */
export function calculateFood(input: FoodInput): number {
  const factors = EMISSION_FACTORS.food;

  const dietBaseline = factors.diet[input.dietType];
  const frequencyScale = WASTE_FREQUENCY_SCALE[input.wasteFrequency];
  const wasteAdjustment = dietBaseline * factors.wasteMultiplier * frequencyScale;

  return round3(dietBaseline + wasteAdjustment);
}

/**
 * Calculate annual household waste emissions in metric tons CO2e.
 *
 * Factor selection based on waste management approach:
 * - Composting + recycling → composted rate (best case)
 * - Recycling only → recycled rate
 * - Neither → landfill rate (worst case)
 */
export function calculateWaste(input: WasteInput): number {
  const factors = EMISSION_FACTORS.waste;
  const annualLbs = input.lbsPerWeek * 52;

  let factor: number;
  if (input.recycling && input.composting) {
    factor = factors.composted;
  } else if (input.recycling) {
    factor = factors.recycled;
  } else {
    factor = factors.landfill;
  }

  return round3((annualLbs * factor) / 1000);
}

// ─────────────────────────────────────────────
// Main calculator (pure orchestration)
// ─────────────────────────────────────────────

/**
 * Calculate total annual carbon footprint from validated inputs.
 *
 * This function is pure: no side effects, no I/O, deterministic output.
 * Input MUST be validated via CalculatorInputSchema.parse() before calling.
 *
 * @param inputs - Zod-validated calculator inputs
 * @returns Total CO2e and per-category breakdown in metric tons
 */
export function calculateFootprint(inputs: CalculatorInput): CalculationResult {
  const breakdown: CategoryBreakdown = {
    transport: calculateTransport(inputs.transport),
    energy: calculateEnergy(inputs.energy),
    food: calculateFood(inputs.food),
    waste: calculateWaste(inputs.waste),
  };

  const totalCO2 = round3(
    breakdown.transport + breakdown.energy + breakdown.food + breakdown.waste,
  );

  return { totalCO2, breakdown };
}
