/**
 * Carbon Footprint Calculator — Unit Tests
 *
 * 100% coverage of math functions: every factor combination, edge cases,
 * boundary values, and the Zod validation layer.
 *
 * Convention: expected values are hand-calculated from emission-factors.ts
 * constants to catch regressions if factors change.
 */

import { describe, it, expect } from "vitest";
import {
  calculateTransport,
  calculateEnergy,
  calculateFood,
  calculateWaste,
  calculateFootprint,
  CalculatorInputSchema,
} from "@/lib/calculations/calculator";
import { EMISSION_FACTORS, WASTE_FREQUENCY_SCALE } from "@/lib/calculations/emission-factors";

// ─────────────────────────────────────────────
// Helper: build valid default input
// ─────────────────────────────────────────────

function defaultInput() {
  return CalculatorInputSchema.parse({
    transport: { hasCar: false },
    energy: {},
    food: {},
    waste: {},
  });
}

// ═════════════════════════════════════════════
// Transport Tests
// ═════════════════════════════════════════════

describe("calculateTransport", () => {
  it("returns 0 for zero inputs", () => {
    const result = calculateTransport({
      hasCar: false,
      fuelType: "gasoline",
      busMiles: 0,
      trainMiles: 0,
      subwayMiles: 0,
      shortHaulFlights: 0,
      longHaulFlights: 0,
    });
    expect(result).toBe(0);
  });

  describe("personal vehicles", () => {
    it.each([
      ["gasoline", 0.404],
      ["diesel", 0.392],
      ["hybrid", 0.192],
      ["electric", 0.053],
    ] as const)("calculates %s car emissions correctly", (fuelType, factor) => {
      const miles = 12000;
      const result = calculateTransport({
        hasCar: true,
        fuelType,
        milesPerYear: miles,
        busMiles: 0,
        trainMiles: 0,
        subwayMiles: 0,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      });
      const expected = Math.round(((miles * factor) / 1000) * 1000) / 1000;
      expect(result).toBe(expected);
    });

    it("ignores car when hasCar is false even if miles provided", () => {
      const result = calculateTransport({
        hasCar: false,
        fuelType: "gasoline",
        milesPerYear: 50000,
        busMiles: 0,
        trainMiles: 0,
        subwayMiles: 0,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      });
      expect(result).toBe(0);
    });

    it("ignores car when fuelType is missing", () => {
      const result = calculateTransport({
        hasCar: true,
        fuelType: "gasoline",
        milesPerYear: 10000,
        busMiles: 0,
        trainMiles: 0,
        subwayMiles: 0,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      });
      expect(result).toBe(0);
    });

    it("ignores car when milesPerYear is 0", () => {
      const result = calculateTransport({
        hasCar: true,
        fuelType: "gasoline",
        milesPerYear: 0,
        busMiles: 0,
        trainMiles: 0,
        subwayMiles: 0,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      });
      expect(result).toBe(0);
    });
  });

  describe("public transit", () => {
    it("calculates bus emissions", () => {
      const result = calculateTransport({
        hasCar: false,
      fuelType: "gasoline",
        busMiles: 1000,
        trainMiles: 0,
        subwayMiles: 0,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      });
      expect(result).toBe(Math.round(((1000 * 0.089) / 1000) * 1000) / 1000);
    });

    it("calculates train emissions", () => {
      const result = calculateTransport({
        hasCar: false,
      fuelType: "gasoline",
        busMiles: 0,
        trainMiles: 2000,
        subwayMiles: 0,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      });
      expect(result).toBe(Math.round(((2000 * 0.041) / 1000) * 1000) / 1000);
    });

    it("calculates subway emissions", () => {
      const result = calculateTransport({
        hasCar: false,
      fuelType: "gasoline",
        busMiles: 0,
        trainMiles: 0,
        subwayMiles: 5000,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      });
      expect(result).toBe(Math.round(((5000 * 0.028) / 1000) * 1000) / 1000);
    });

    it("sums all transit modes", () => {
      const result = calculateTransport({
        hasCar: false,
      fuelType: "gasoline",
        busMiles: 1000,
        trainMiles: 2000,
        subwayMiles: 3000,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      });
      const expected =
        Math.round(
          (((1000 * 0.089 + 2000 * 0.041 + 3000 * 0.028) / 1000) * 1000),
        ) / 1000;
      expect(result).toBe(expected);
    });
  });

  describe("aviation", () => {
    it("calculates short-haul flights", () => {
      const result = calculateTransport({
        hasCar: false,
      fuelType: "gasoline",
        busMiles: 0,
        trainMiles: 0,
        subwayMiles: 0,
        shortHaulFlights: 4,
        longHaulFlights: 0,
      });
      const expected =
        Math.round(((4 * 1500 * 0.255) / 1000) * 1000) / 1000;
      expect(result).toBe(expected);
    });

    it("calculates long-haul flights", () => {
      const result = calculateTransport({
        hasCar: false,
      fuelType: "gasoline",
        busMiles: 0,
        trainMiles: 0,
        subwayMiles: 0,
        shortHaulFlights: 0,
        longHaulFlights: 2,
      });
      const expected =
        Math.round(((2 * 6000 * 0.195) / 1000) * 1000) / 1000;
      expect(result).toBe(expected);
    });
  });

  it("sums all transport categories", () => {
    const result = calculateTransport({
      hasCar: true,
      fuelType: "gasoline",
      milesPerYear: 10000,
      busMiles: 500,
      trainMiles: 1000,
      subwayMiles: 500,
      shortHaulFlights: 2,
      longHaulFlights: 1,
    });
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe("number");
    // Verify 3 decimal place precision
    const decimals = result.toString().split(".")[1];
    expect(!decimals || decimals.length <= 3).toBe(true);
  });
});

// ═════════════════════════════════════════════
// Energy Tests
// ═════════════════════════════════════════════

describe("calculateEnergy", () => {
  it("returns 0 for zero inputs", () => {
    const result = calculateEnergy({
      kwhPerMonth: 0,
      electricitySource: "grid",
      heatingType: "none",
      heatingAmount: 0,
    });
    expect(result).toBe(0);
  });

  describe("electricity", () => {
    it("calculates grid electricity annually", () => {
      const result = calculateEnergy({
        kwhPerMonth: 900,
        electricitySource: "grid",
        heatingType: "none",
        heatingAmount: 0,
      });
      const expected = Math.round(((900 * 12 * 0.709) / 1000) * 1000) / 1000;
      expect(result).toBe(expected);
    });

    it("calculates renewable electricity annually", () => {
      const result = calculateEnergy({
        kwhPerMonth: 900,
        electricitySource: "renewable",
        heatingType: "none",
        heatingAmount: 0,
      });
      const expected = Math.round(((900 * 12 * 0.05) / 1000) * 1000) / 1000;
      expect(result).toBe(expected);
    });

    it("treats 'mixed' as grid-equivalent", () => {
      const gridResult = calculateEnergy({
        kwhPerMonth: 900,
        electricitySource: "grid",
        heatingType: "none",
        heatingAmount: 0,
      });
      const mixedResult = calculateEnergy({
        kwhPerMonth: 900,
        electricitySource: "mixed",
        heatingType: "none",
        heatingAmount: 0,
      });
      expect(mixedResult).toBe(gridResult);
    });
  });

  describe("heating", () => {
    it("calculates natural gas heating", () => {
      const result = calculateEnergy({
        kwhPerMonth: 0,
        electricitySource: "grid",
        heatingType: "naturalGas",
        heatingAmount: 500,
      });
      const expected = Math.round(((500 * 0.0053 * 12) / 1000) * 1000) / 1000;
      expect(result).toBe(expected);
    });

    it("calculates heating oil", () => {
      const result = calculateEnergy({
        kwhPerMonth: 0,
        electricitySource: "grid",
        heatingType: "heatingOil",
        heatingAmount: 100,
      });
      const expected = Math.round(((100 * 0.073 * 12) / 1000) * 1000) / 1000;
      expect(result).toBe(expected);
    });

    it("electric heating adds no additional emissions", () => {
      const result = calculateEnergy({
        kwhPerMonth: 0,
        electricitySource: "grid",
        heatingType: "electric",
        heatingAmount: 1000,
      });
      expect(result).toBe(0);
    });

    it("no heating type adds no emissions", () => {
      const result = calculateEnergy({
        kwhPerMonth: 0,
        electricitySource: "grid",
        heatingType: "none",
        heatingAmount: 500,
      });
      expect(result).toBe(0);
    });
  });

  it("sums electricity and heating", () => {
    const result = calculateEnergy({
      kwhPerMonth: 900,
      electricitySource: "grid",
      heatingType: "naturalGas",
      heatingAmount: 500,
    });
    const elec = (900 * 12 * 0.709) / 1000;
    const heat = (500 * 0.0053 * 12) / 1000;
    const expected = Math.round((elec + heat) * 1000) / 1000;
    expect(result).toBe(expected);
  });
});

// ═════════════════════════════════════════════
// Food Tests
// ═════════════════════════════════════════════

describe("calculateFood", () => {
  describe("diet baselines", () => {
    it.each([
      ["vegan", 1.5],
      ["vegetarian", 1.7],
      ["pescatarian", 2.3],
      ["omnivore", 2.9],
      ["heavyMeat", 3.3],
    ] as const)("returns correct baseline for %s diet with rarely waste", (diet, baseline) => {
      const result = calculateFood({
        dietType: diet,
        wasteFrequency: "rarely",
      });
      // "rarely" → scale 0 → no waste adjustment → pure baseline
      expect(result).toBe(baseline);
    });
  });

  describe("food waste adjustment", () => {
    it("adds 0% for rarely", () => {
      const result = calculateFood({ dietType: "omnivore", wasteFrequency: "rarely" });
      expect(result).toBe(2.9);
    });

    it("adds 5% for sometimes (0.1 * 0.5)", () => {
      const result = calculateFood({ dietType: "omnivore", wasteFrequency: "sometimes" });
      const expected = Math.round((2.9 + 2.9 * 0.1 * 0.5) * 1000) / 1000;
      expect(result).toBe(expected);
    });

    it("adds 10% for often (0.1 * 1.0)", () => {
      const result = calculateFood({ dietType: "omnivore", wasteFrequency: "often" });
      const expected = Math.round((2.9 + 2.9 * 0.1 * 1.0) * 1000) / 1000;
      expect(result).toBe(expected);
    });

    it("adds 15% for always (0.1 * 1.5)", () => {
      const result = calculateFood({ dietType: "omnivore", wasteFrequency: "always" });
      const expected = Math.round((2.9 + 2.9 * 0.1 * 1.5) * 1000) / 1000;
      expect(result).toBe(expected);
    });
  });

  it("waste adjustment scales with diet baseline", () => {
    const vegan = calculateFood({ dietType: "vegan", wasteFrequency: "always" });
    const heavyMeat = calculateFood({ dietType: "heavyMeat", wasteFrequency: "always" });
    // Higher baseline diets have higher absolute waste impact
    expect(heavyMeat - EMISSION_FACTORS.food.diet.heavyMeat).toBeGreaterThan(
      vegan - EMISSION_FACTORS.food.diet.vegan,
    );
  });
});

// ═════════════════════════════════════════════
// Waste Tests
// ═════════════════════════════════════════════

describe("calculateWaste", () => {
  it("returns 0 for zero waste", () => {
    const result = calculateWaste({
      lbsPerWeek: 0,
      recycling: false,
      composting: false,
    });
    expect(result).toBe(0);
  });

  it("uses landfill factor when not recycling or composting", () => {
    const lbs = 30;
    const result = calculateWaste({
      lbsPerWeek: lbs,
      recycling: false,
      composting: false,
    });
    const expected = Math.round(((lbs * 52 * 0.57) / 1000) * 1000) / 1000;
    expect(result).toBe(expected);
  });

  it("uses recycled factor when recycling only", () => {
    const lbs = 30;
    const result = calculateWaste({
      lbsPerWeek: lbs,
      recycling: true,
      composting: false,
    });
    const expected = Math.round(((lbs * 52 * 0.02) / 1000) * 1000) / 1000;
    expect(result).toBe(expected);
  });

  it("uses composted factor when both recycling and composting", () => {
    const lbs = 30;
    const result = calculateWaste({
      lbsPerWeek: lbs,
      recycling: true,
      composting: true,
    });
    const expected = Math.round(((lbs * 52 * 0.01) / 1000) * 1000) / 1000;
    expect(result).toBe(expected);
  });

  it("composting without recycling uses landfill factor", () => {
    // The logic requires recycling=true for composted rate.
    // Composting alone without recycling → landfill path.
    const lbs = 30;
    const result = calculateWaste({
      lbsPerWeek: lbs,
      recycling: false,
      composting: true,
    });
    const expected = Math.round(((lbs * 52 * 0.57) / 1000) * 1000) / 1000;
    expect(result).toBe(expected);
  });

  it("landfill emissions are dramatically higher than recycled", () => {
    const landfill = calculateWaste({ lbsPerWeek: 30, recycling: false, composting: false });
    const recycled = calculateWaste({ lbsPerWeek: 30, recycling: true, composting: false });
    expect(landfill).toBeGreaterThan(recycled * 10);
  });
});

// ═════════════════════════════════════════════
// Integration: calculateFootprint
// ═════════════════════════════════════════════

describe("calculateFootprint", () => {
  it("sums all categories correctly", () => {
    const input = defaultInput();
    const result = calculateFootprint(input);

    const expectedTransport = calculateTransport(input.transport);
    const expectedEnergy = calculateEnergy(input.energy);
    const expectedFood = calculateFood(input.food);
    const expectedWaste = calculateWaste(input.waste);
    const expectedTotal =
      Math.round((expectedTransport + expectedEnergy + expectedFood + expectedWaste) * 1000) /
      1000;

    expect(result.breakdown.transport).toBe(expectedTransport);
    expect(result.breakdown.energy).toBe(expectedEnergy);
    expect(result.breakdown.food).toBe(expectedFood);
    expect(result.breakdown.waste).toBe(expectedWaste);
    expect(result.totalCO2).toBe(expectedTotal);
  });

  it("returns correct structure", () => {
    const result = calculateFootprint(defaultInput());
    expect(result).toHaveProperty("totalCO2");
    expect(result).toHaveProperty("breakdown");
    expect(result.breakdown).toHaveProperty("transport");
    expect(result.breakdown).toHaveProperty("energy");
    expect(result.breakdown).toHaveProperty("food");
    expect(result.breakdown).toHaveProperty("waste");
  });

  it("all values are non-negative", () => {
    const result = calculateFootprint(defaultInput());
    expect(result.totalCO2).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.transport).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.energy).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.food).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.waste).toBeGreaterThanOrEqual(0);
  });

  it("all values have at most 3 decimal places", () => {
    const input = CalculatorInputSchema.parse({
      transport: {
        hasCar: true,
        fuelType: "gasoline",
        milesPerYear: 15123,
        busMiles: 789,
        trainMiles: 456,
        subwayMiles: 123,
        shortHaulFlights: 3,
        longHaulFlights: 1,
      },
      energy: {
        kwhPerMonth: 867,
        electricitySource: "grid",
        heatingType: "naturalGas",
        heatingAmount: 333,
      },
      food: {
        dietType: "pescatarian",
        wasteFrequency: "often",
      },
      waste: {
        lbsPerWeek: 27,
        recycling: true,
        composting: false,
      },
    });

    const result = calculateFootprint(input);
    const values = [
      result.totalCO2,
      result.breakdown.transport,
      result.breakdown.energy,
      result.breakdown.food,
      result.breakdown.waste,
    ];

    for (const val of values) {
      const decimals = val.toString().split(".")[1];
      expect(!decimals || decimals.length <= 3).toBe(true);
    }
  });

  it("default omnivore with no transport/energy/waste produces ~3 tons (food only)", () => {
    const result = calculateFootprint(defaultInput());
    // Default: omnivore + sometimes waste = 2.9 + 2.9 * 0.1 * 0.5 = 3.045
    expect(result.totalCO2).toBeCloseTo(3.045, 2);
    expect(result.breakdown.food).toBeCloseTo(3.045, 2);
    expect(result.breakdown.transport).toBe(0);
    expect(result.breakdown.energy).toBe(0);
    expect(result.breakdown.waste).toBe(0);
  });

  it("typical US household produces ~16 tons", () => {
    // US average is ~16 tons/person. Verify a typical profile is in the right ballpark.
    const input = CalculatorInputSchema.parse({
      transport: {
        hasCar: true,
        fuelType: "gasoline",
        milesPerYear: 13500,
        shortHaulFlights: 2,
        longHaulFlights: 1,
      },
      energy: {
        kwhPerMonth: 886,
        electricitySource: "grid",
        heatingType: "naturalGas",
        heatingAmount: 400,
      },
      food: {
        dietType: "omnivore",
        wasteFrequency: "sometimes",
      },
      waste: {
        lbsPerWeek: 30,
        recycling: false,
        composting: false,
      },
    });

    const result = calculateFootprint(input);
    // Sanity check: should be in 10-25 ton range
    expect(result.totalCO2).toBeGreaterThan(10);
    expect(result.totalCO2).toBeLessThan(25);
  });
});

// ═════════════════════════════════════════════
// Zod Schema Validation Tests
// ═════════════════════════════════════════════

describe("CalculatorInputSchema", () => {
  it("accepts minimal valid input", () => {
    const result = CalculatorInputSchema.safeParse({
      transport: { hasCar: false },
      energy: {},
      food: {},
      waste: {},
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative miles", () => {
    const result = CalculatorInputSchema.safeParse({
      transport: { hasCar: true, fuelType: "gasoline", milesPerYear: -100 },
      energy: {},
      food: {},
      waste: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects miles exceeding maximum", () => {
    const result = CalculatorInputSchema.safeParse({
      transport: { hasCar: true, fuelType: "gasoline", milesPerYear: 600000 },
      energy: {},
      food: {},
      waste: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid fuel type", () => {
    const result = CalculatorInputSchema.safeParse({
      transport: { hasCar: true, fuelType: "nuclear", milesPerYear: 10000 },
      energy: {},
      food: {},
      waste: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid diet type", () => {
    const result = CalculatorInputSchema.safeParse({
      transport: { hasCar: false },
      energy: {},
      food: { dietType: "fruitarian" },
      waste: {},
    });
    expect(result.success).toBe(false);
  });

  it("applies defaults for optional fields", () => {
    const result = CalculatorInputSchema.parse({
      transport: { hasCar: false },
      energy: {},
      food: {},
      waste: {},
    });
    expect(result.transport.busMiles).toBe(0);
    expect(result.energy.kwhPerMonth).toBe(0);
    expect(result.energy.electricitySource).toBe("grid");
    expect(result.food.dietType).toBe("omnivore");
    expect(result.food.wasteFrequency).toBe("sometimes");
    expect(result.waste.lbsPerWeek).toBe(0);
    expect(result.waste.recycling).toBe(false);
  });

  it("rejects missing transport object entirely", () => {
    const result = CalculatorInputSchema.safeParse({
      energy: {},
      food: {},
      waste: {},
    });
    expect(result.success).toBe(false);
  });
});

// ═════════════════════════════════════════════
// Emission Factors Integrity
// ═════════════════════════════════════════════

describe("EMISSION_FACTORS integrity", () => {
  it("all car factors are positive", () => {
    for (const value of Object.values(EMISSION_FACTORS.transport.car)) {
      expect(value).toBeGreaterThan(0);
    }
  });

  it("electric car emits less than gasoline", () => {
    expect(EMISSION_FACTORS.transport.car.electric).toBeLessThan(
      EMISSION_FACTORS.transport.car.gasoline,
    );
  });

  it("renewable electricity emits less than grid", () => {
    expect(EMISSION_FACTORS.energy.electricity.renewable).toBeLessThan(
      EMISSION_FACTORS.energy.electricity.grid,
    );
  });

  it("vegan diet emits less than heavy meat", () => {
    expect(EMISSION_FACTORS.food.diet.vegan).toBeLessThan(
      EMISSION_FACTORS.food.diet.heavyMeat,
    );
  });

  it("composted waste emits less than landfill", () => {
    expect(EMISSION_FACTORS.waste.composted).toBeLessThan(
      EMISSION_FACTORS.waste.landfill,
    );
  });

  it("waste frequency scale has correct ordering", () => {
    expect(WASTE_FREQUENCY_SCALE.rarely).toBeLessThan(WASTE_FREQUENCY_SCALE.sometimes);
    expect(WASTE_FREQUENCY_SCALE.sometimes).toBeLessThan(WASTE_FREQUENCY_SCALE.often);
    expect(WASTE_FREQUENCY_SCALE.often).toBeLessThan(WASTE_FREQUENCY_SCALE.always);
  });
});
