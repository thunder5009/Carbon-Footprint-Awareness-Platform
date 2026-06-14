import { describe, it, expect } from "vitest";
import {
  calculateTransport,
  calculateEnergy,
  calculateFood,
  calculateWaste,
  calculateFootprint,
} from "../calculator";
import { EMISSION_FACTORS, WASTE_FREQUENCY_SCALE } from "../emission-factors";

describe("Calculation Engine", () => {
  describe("calculateTransport", () => {
    it("returns 0 when no transport is used", () => {
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

    it("calculates car emissions based on fuel type and miles", () => {
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
      // 10000 miles * gasoline factor (approx 0.404 kg/mile) / 1000
      const expected = (10000 * EMISSION_FACTORS.transport.car.gasoline) / 1000;
      expect(result).toBeCloseTo(expected, 3);
    });

    it("calculates public transit emissions", () => {
      const result = calculateTransport({
        hasCar: false,
      fuelType: "gasoline",
        busMiles: 1000,
        trainMiles: 500,
        subwayMiles: 200,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      });
      const expected =
        (1000 * EMISSION_FACTORS.transport.publicTransit.bus +
          500 * EMISSION_FACTORS.transport.publicTransit.train +
          200 * EMISSION_FACTORS.transport.publicTransit.subway) /
        1000;
      expect(result).toBeCloseTo(expected, 3);
    });

    it("calculates aviation emissions", () => {
      const result = calculateTransport({
        hasCar: false,
      fuelType: "gasoline",
        busMiles: 0,
        trainMiles: 0,
        subwayMiles: 0,
        shortHaulFlights: 2,
        longHaulFlights: 1,
      });
      const expected =
        (2 *
          EMISSION_FACTORS.transport.flightDistances.shortHaul *
          EMISSION_FACTORS.transport.flight.shortHaul +
          1 *
            EMISSION_FACTORS.transport.flightDistances.longHaul *
            EMISSION_FACTORS.transport.flight.longHaul) /
        1000;
      expect(result).toBeCloseTo(expected, 3);
    });
    
    it("handles missing fuelType safely (returns 0 for car)", () => {
      const result = calculateTransport({
        hasCar: true,
        fuelType: "gasoline", // true but no fuelType
        milesPerYear: 10000,
        busMiles: 0,
        trainMiles: 0,
        subwayMiles: 0,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      });
      expect(result).toBe(0);
    });
  });

  describe("calculateEnergy", () => {
    it("returns 0 for no usage", () => {
      expect(
        calculateEnergy({
          kwhPerMonth: 0,
          electricitySource: "grid",
          heatingType: "none",
          heatingAmount: 0,
        })
      ).toBe(0);
    });

    it("calculates grid electricity", () => {
      const result = calculateEnergy({
        kwhPerMonth: 500,
        electricitySource: "grid",
        heatingType: "none",
        heatingAmount: 0,
      });
      const expected = (500 * 12 * EMISSION_FACTORS.energy.electricity.grid) / 1000;
      expect(result).toBeCloseTo(expected, 3);
    });

    it("calculates renewable electricity", () => {
      const result = calculateEnergy({
        kwhPerMonth: 500,
        electricitySource: "renewable",
        heatingType: "none",
        heatingAmount: 0,
      });
      const expected = (500 * 12 * EMISSION_FACTORS.energy.electricity.renewable) / 1000;
      expect(result).toBeCloseTo(expected, 3);
    });

    it("calculates heating oil", () => {
      const result = calculateEnergy({
        kwhPerMonth: 0,
        electricitySource: "grid",
        heatingType: "heatingOil",
        heatingAmount: 50,
      });
      const expected = (50 * 12 * EMISSION_FACTORS.energy.heatingOil) / 1000;
      expect(result).toBeCloseTo(expected, 3);
    });
    
    it("calculates natural gas", () => {
      const result = calculateEnergy({
        kwhPerMonth: 0,
        electricitySource: "grid",
        heatingType: "naturalGas",
        heatingAmount: 50,
      });
      const expected = (50 * 12 * EMISSION_FACTORS.energy.naturalGas) / 1000;
      expect(result).toBeCloseTo(expected, 3);
    });
    
    it("ignores electric heating amount (already in kwh)", () => {
      const result = calculateEnergy({
        kwhPerMonth: 500,
        electricitySource: "grid",
        heatingType: "electric",
        heatingAmount: 50, // Should not add extra emissions
      });
      const expected = (500 * 12 * EMISSION_FACTORS.energy.electricity.grid) / 1000;
      expect(result).toBeCloseTo(expected, 3);
    });
  });

  describe("calculateFood", () => {
    it("calculates vegan diet with rare waste", () => {
      const result = calculateFood({
        dietType: "vegan",
        wasteFrequency: "rarely",
      });
      const baseline = EMISSION_FACTORS.food.diet.vegan;
      const expected =
        baseline +
        baseline *
          EMISSION_FACTORS.food.wasteMultiplier *
          WASTE_FREQUENCY_SCALE.rarely;
      expect(result).toBeCloseTo(expected, 3);
    });

    it("calculates heavy meat diet with always waste", () => {
      const result = calculateFood({
        dietType: "heavyMeat",
        wasteFrequency: "always",
      });
      const baseline = EMISSION_FACTORS.food.diet.heavyMeat;
      const expected =
        baseline +
        baseline *
          EMISSION_FACTORS.food.wasteMultiplier *
          WASTE_FREQUENCY_SCALE.always;
      expect(result).toBeCloseTo(expected, 3);
    });
  });

  describe("calculateWaste", () => {
    it("calculates landfill waste (no recycling, no composting)", () => {
      const result = calculateWaste({
        lbsPerWeek: 10,
        recycling: false,
        composting: false,
      });
      const expected = (10 * 52 * EMISSION_FACTORS.waste.landfill) / 1000;
      expect(result).toBeCloseTo(expected, 3);
    });

    it("calculates recycled waste", () => {
      const result = calculateWaste({
        lbsPerWeek: 10,
        recycling: true,
        composting: false,
      });
      const expected = (10 * 52 * EMISSION_FACTORS.waste.recycled) / 1000;
      expect(result).toBeCloseTo(expected, 3);
    });

    it("calculates composted waste (requires both true)", () => {
      const result = calculateWaste({
        lbsPerWeek: 10,
        recycling: true,
        composting: true,
      });
      const expected = (10 * 52 * EMISSION_FACTORS.waste.composted) / 1000;
      expect(result).toBeCloseTo(expected, 3);
    });
    
    it("calculates landfill waste if only composting is true but recycling is false", () => {
      const result = calculateWaste({
        lbsPerWeek: 10,
        recycling: false,
        composting: true,
      });
      const expected = (10 * 52 * EMISSION_FACTORS.waste.landfill) / 1000;
      expect(result).toBeCloseTo(expected, 3);
    });
  });

  describe("calculateFootprint", () => {
    it("orchestrates all calculations and returns total CO2 and breakdown", () => {
      const result = calculateFootprint({
        transport: {
          hasCar: false,
      fuelType: "gasoline",
          busMiles: 0,
          trainMiles: 0,
          subwayMiles: 0,
          shortHaulFlights: 0,
          longHaulFlights: 0,
        },
        energy: {
          kwhPerMonth: 0,
          electricitySource: "grid",
          heatingType: "none",
          heatingAmount: 0,
        },
        food: {
          dietType: "vegan",
          wasteFrequency: "rarely",
        },
        waste: {
          lbsPerWeek: 0,
          recycling: false,
          composting: false,
        },
      });

      // food has a baseline even with 0 inputs
      const foodExpected = calculateFood({
        dietType: "vegan",
        wasteFrequency: "rarely",
      });

      expect(result.breakdown.transport).toBe(0);
      expect(result.breakdown.energy).toBe(0);
      expect(result.breakdown.food).toBeCloseTo(foodExpected, 3);
      expect(result.breakdown.waste).toBe(0);
      expect(result.totalCO2).toBeCloseTo(foodExpected, 3);
    });
  });
});
