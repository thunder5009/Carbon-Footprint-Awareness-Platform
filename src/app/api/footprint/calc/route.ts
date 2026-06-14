/**
 * POST /api/footprint/calc
 *
 * Calculates carbon footprint from user inputs.
 *
 * - Anonymous requests: returns calculation result only.
 */

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { CalculatorInputSchema, calculateFootprint } from "@/lib/calculations/calculator";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { checkRateLimit, getClientIp } from "@/lib/utils/rate-limit";
import type { CalcResponse, ApiError } from "@/lib/validation/schemas";

const MINUTE_MS = 60 * 1000;

export async function POST(request: Request): Promise<NextResponse<CalcResponse | ApiError>> {
  // ── Rate limiting ──────────────────────────
  const ip = getClientIp(request);
  const session = await auth();

  const rateLimitKey = session?.user?.id ? `auth:${session.user.id}` : `ip:${ip}`;
  const rateLimitMax = session?.user?.id ? 100 : 10;
  const rateCheck = checkRateLimit(rateLimitKey, rateLimitMax, MINUTE_MS);

  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateCheck.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // ── Parse request body ─────────────────────
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // ── Validate inputs ────────────────────────
  const parseResult = CalculatorInputSchema.safeParse(rawBody);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        details: parseResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  const inputs = parseResult.data;

  // ── Calculate ──────────────────────────────
  const result = calculateFootprint(inputs);

  // ── Persist if authenticated ───────────────
  let recordId: string | undefined;

  if (session) {
    try {
      const record = await prisma.footprintRecord.create({
        data: {
          userId: session?.user?.id,
          inputs: inputs as unknown as Prisma.InputJsonValue,
          totalCO2: result.totalCO2,
          breakdown: result.breakdown as unknown as Prisma.InputJsonValue,
        },
      });
      recordId = record.id;
      revalidatePath("/dashboard");
    } catch (dbError: unknown) {
      // Database save failure should NOT block the calculation response.
      // Log the error but return the calculation result.
      // In production, this would go to Sentry / structured logging.
      const message = dbError instanceof Error ? dbError.message : "Unknown database error";
      console.error(`[api/footprint/calc] DB save failed: ${message}`);
    }
  }

  // ── Response ───────────────────────────────
  const response: CalcResponse = {
    totalCO2: result.totalCO2,
    breakdown: result.breakdown,
    ...(recordId ? { recordId } : {}),
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      "X-RateLimit-Remaining": String(rateCheck.remaining),
    },
  });
}
