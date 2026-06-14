import { describe, it, expect } from "vitest";
import {
  TransportInputSchema,
  EnergyInputSchema,
  CalculatorInputSchema,
  HistoryQuerySchema,
} from "../schemas";

describe("Validation Schemas", () => {
  describe("TransportInputSchema", () => {
    it("requires fuelType and milesPerYear if hasCar is true", () => {
      const result = TransportInputSchema.safeParse({ hasCar: true });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Please specify fuel type");
      }
    });

    it("passes if hasCar is false and car fields are omitted", () => {
      const result = TransportInputSchema.safeParse({
        hasCar: false,
        busMiles: 10,
        trainMiles: 0,
        subwayMiles: 0,
        shortHaulFlights: 0,
        longHaulFlights: 0,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("EnergyInputSchema", () => {
    it("rejects negative usage", () => {
      const result = EnergyInputSchema.safeParse({
        kwhPerMonth: -10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Cannot be negative");
      }
    });

    it("rejects absurdly high values", () => {
      const result = EnergyInputSchema.safeParse({
        kwhPerMonth: 1_000_000,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("CalculatorInputSchema", () => {
    it("rejects if total transport miles exceed 500,000", () => {
      const result = CalculatorInputSchema.safeParse({
        transport: {
          hasCar: false,
          busMiles: 200_000,
          trainMiles: 300_000,
          subwayMiles: 10_000,
          shortHaulFlights: 0,
          longHaulFlights: 0,
        },
        energy: { kwhPerMonth: 0, electricitySource: "grid", heatingType: "none", heatingAmount: 0 },
        food: { dietType: "vegan", wasteFrequency: "rarely" },
        waste: { lbsPerWeek: 0, recycling: false, composting: false },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes("Total transport miles cannot exceed 500,000"))).toBe(true);
      }
    });
  });

  describe("HistoryQuerySchema", () => {
    it("defaults limit to 10 and maxes at 50", () => {
      const empty = HistoryQuerySchema.safeParse({});
      expect(empty.success && empty.data.limit).toBe(10);

      const high = HistoryQuerySchema.safeParse({ limit: 100 });
      expect(high.success).toBe(false); // Max is 50
    });
  });
});
