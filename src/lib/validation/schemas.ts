/**
 * Shared Zod Validation Schemas
 *
 * Single source of truth for input/output validation across client and server.
 * Schemas are co-located here so that API routes and form components import
 * from the same module — no schema drift.
 */

import { z } from "zod";

// Re-export calculator schemas (they are the canonical input definitions)
export {
  CalculatorInputSchema,
  TransportInputSchema,
  EnergyInputSchema,
  FoodInputSchema,
  WasteInputSchema,
} from "../calculations/calculator";

export type {
  CalculatorInput,
  TransportInput,
  EnergyInput,
  FoodInput,
  WasteInput,
  CalculationResult,
  CategoryBreakdown,
} from "../calculations/calculator";

// ─────────────────────────────────────────────
// API Response Schemas
// ─────────────────────────────────────────────

/** Schema for the category breakdown object */
export const CategoryBreakdownSchema = z.object({
  transport: z.number(),
  energy: z.number(),
  food: z.number(),
  waste: z.number(),
});

/** Response from POST /api/footprint/calc */
export const CalcResponseSchema = z.object({
  totalCO2: z.number(),
  breakdown: CategoryBreakdownSchema,
  recordId: z.string().optional(),
});
export type CalcResponse = z.infer<typeof CalcResponseSchema>;

/** Single history record */
export const HistoryRecordSchema = z.object({
  id: z.string(),
  createdAt: z.string(), // ISO 8601
  totalCO2: z.number(),
  breakdown: CategoryBreakdownSchema,
  inputs: z.record(z.string(), z.unknown()), // raw JSON
});
export type HistoryRecord = z.infer<typeof HistoryRecordSchema>;

/** Response from GET /api/footprint/history */
export const HistoryResponseSchema = z.object({
  records: z.array(HistoryRecordSchema),
  nextCursor: z.string().nullable(),
});
export type HistoryResponse = z.infer<typeof HistoryResponseSchema>;

/** Query params for GET /api/footprint/history */
export const HistoryQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
});

// ─────────────────────────────────────────────
// Tips Schemas
// ─────────────────────────────────────────────

export const TipCategorySchema = z.enum(["transport", "energy", "food", "waste", "general"]);
export type TipCategory = z.infer<typeof TipCategorySchema>;

/** Single tip */
export const TipSchema = z.object({
  id: z.string(),
  text: z.string(),
  category: z.string(),
  impact: z.number().nullable(),
});
export type Tip = z.infer<typeof TipSchema>;

/** Query params for GET /api/tips */
export const TipsQuerySchema = z.object({
  category: TipCategorySchema.optional(),
  limit: z.coerce.number().min(1).max(50).default(5),
});

/** Response from GET /api/tips */
export const TipsResponseSchema = z.object({
  tips: z.array(TipSchema),
});
export type TipsResponse = z.infer<typeof TipsResponseSchema>;

// ─────────────────────────────────────────────
// Error Response
// ─────────────────────────────────────────────

export const ApiErrorSchema = z.object({
  error: z.string(),
  details: z.unknown().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
