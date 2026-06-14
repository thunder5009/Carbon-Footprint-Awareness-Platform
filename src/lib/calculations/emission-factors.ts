/**
 * Carbon Emission Factors
 *
 * Readonly configuration object containing emission coefficients used by
 * the calculation engine. All values sourced from EPA, IPCC AR6, and
 * US Department of Energy datasets.
 *
 * IMPORTANT: Carbon footprint calculation is estimation, not precision.
 * These factors represent US national averages. Actual emissions vary by
 * region, vehicle age, power grid mix, and individual behavior. Uncertainty
 * ranges are documented per-category below.
 *
 * @see https://www.epa.gov/ghgemissions/overview-greenhouse-gases
 * @see https://www.ipcc.ch/assessment-report/ar6/
 */
export const EMISSION_FACTORS = {
  /**
   * Transport emissions.
   * Uncertainty: ±15-25% depending on vehicle efficiency, driving patterns.
   */
  transport: {
    /** kg CO2 per mile, by fuel type */
    car: {
      gasoline: 0.404,
      diesel: 0.392,
      hybrid: 0.192,
      electric: 0.053,
    },
    /** kg CO2 per passenger mile */
    publicTransit: {
      bus: 0.089,
      train: 0.041,
      subway: 0.028,
    },
    /** kg CO2 per passenger mile */
    flight: {
      shortHaul: 0.255,
      longHaul: 0.195,
    },
    /** Average distance assumptions for round-trip flights (miles) */
    flightDistances: {
      shortHaul: 1500,
      longHaul: 6000,
    },
  },

  /**
   * Home energy emissions.
   * Uncertainty: ±10-30% depending on regional grid mix and home efficiency.
   */
  energy: {
    /** kg CO2 per kWh */
    electricity: {
      usAverage: 0.709,
      renewable: 0.05,
      grid: 0.709,
    },
    /** kg CO2 per cubic foot */
    naturalGas: 0.0053,
    /** kg CO2 per gallon */
    heatingOil: 0.073,
  },

  /**
   * Food and diet emissions.
   * Uncertainty: ±20-40%. Diet classification is broad; actual impact
   * depends heavily on specific food choices, sourcing, and preparation.
   */
  food: {
    /** Baseline metric tons CO2e per year, by diet classification */
    diet: {
      vegan: 1.5,
      vegetarian: 1.7,
      pescatarian: 2.3,
      omnivore: 2.9,
      heavyMeat: 3.3,
    },
    /**
     * Food waste adjustment factor. Applied as a percentage increase
     * to diet baseline, scaled by reported waste frequency.
     * E.g., frequent food waste adds ~10% to food emissions.
     */
    wasteMultiplier: 0.1,
  },

  /**
   * Household waste emissions.
   * Uncertainty: ±15-20%.
   */
  waste: {
    /** kg CO2 per pound of waste */
    landfill: 0.57,
    recycled: 0.02,
    composted: 0.01,
  },
} as const;

/** Type inference from the config object — no manual duplication. */
export type EmissionFactors = typeof EMISSION_FACTORS;

/**
 * Scaling factors for food waste frequency.
 * Maps user-reported waste frequency to a 0-1.5 scale that is multiplied
 * by the wasteMultiplier to determine total food waste impact.
 */
export const WASTE_FREQUENCY_SCALE = {
  rarely: 0,
  sometimes: 0.5,
  often: 1.0,
  always: 1.5,
} as const;

export type WasteFrequency = keyof typeof WASTE_FREQUENCY_SCALE;
