/**
 * GET /api/tips
 *
 * Returns carbon reduction tips, optionally filtered by category.
 *
 * - Public endpoint (no authentication required).
 * - Query params: ?category=transport&limit=5
 * - Results are shuffled for variety on each request.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { TipsQuerySchema } from "@/lib/validation/schemas";
import type { TipsResponse, ApiError } from "@/lib/validation/schemas";

/**
 * Fisher-Yates shuffle. Returns a new array (does not mutate input).
 */
function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j] as T;
    result[j] = temp as T;
  }
  return result;
}

export async function GET(request: Request): Promise<NextResponse<TipsResponse | ApiError>> {
  // ── Parse query params ─────────────────────
  const { searchParams } = new URL(request.url);
  const queryResult = TipsQuerySchema.safeParse({
    category: searchParams.get("category") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  if (!queryResult.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters.",
        details: queryResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const { category, limit } = queryResult.data;

  // ── Query database ─────────────────────────
  try {
    const tips = await prisma.tip.findMany({
      where: category ? { category } : undefined,
      select: {
        id: true,
        text: true,
        category: true,
        impact: true,
      },
    });

    // Shuffle then take the requested limit
    const shuffled = shuffle(tips).slice(0, limit);

    const response: TipsResponse = {
      tips: shuffled.map((t) => ({
        id: t.id,
        text: t.text,
        category: t.category,
        impact: t.impact,
      })),
    };

    return NextResponse.json(response, {
      headers: {
        // Cache tips for 5 minutes — they change rarely
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (dbError: unknown) {
    const message = dbError instanceof Error ? dbError.message : "Unknown database error";
    console.error(`[api/tips] DB query failed: ${message}`);
    return NextResponse.json(
      { error: "Failed to fetch tips. Please try again later." },
      { status: 500 },
    );
  }
}
