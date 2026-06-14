/**
 * GET /api/footprint/history
 *
 * Returns paginated history of carbon footprint calculations.
 *
 * - Authentication required (NextAuth session).
 * - Cursor-based pagination: pass `?cursor=<lastRecordId>&limit=10`.
 * - Results ordered by createdAt descending (most recent first).
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { HistoryQuerySchema } from "@/lib/validation/schemas";
import type { HistoryResponse, ApiError } from "@/lib/validation/schemas";

export async function GET(request: Request): Promise<NextResponse<HistoryResponse | ApiError>> {
  // ── Auth check ─────────────────────────────
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required. Please sign in to view your history." },
      { status: 401 },
    );
  }

  // ── Parse query params ─────────────────────
  const { searchParams } = new URL(request.url);
  const queryResult = HistoryQuerySchema.safeParse({
    cursor: searchParams.get("cursor") ?? undefined,
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

  const { cursor, limit } = queryResult.data;

  // ── Query database ─────────────────────────
  try {
    // Fetch limit + 1 to determine if there's a next page
    const records = await prisma.footprintRecord.findMany({
      where: { userId: session.user!.id },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        createdAt: true,
        totalCO2: true,
        breakdown: true,
        inputs: true,
      },
    });

    // Determine pagination
    const hasMore = records.length > limit;
    const pageRecords = hasMore ? records.slice(0, limit) : records;
    const lastRecord = pageRecords[pageRecords.length - 1];
    const nextCursor = hasMore && lastRecord ? lastRecord.id : null;

    const response: HistoryResponse = {
      records: pageRecords.map((r) => ({
        id: r.id,
        createdAt: r.createdAt.toISOString(),
        totalCO2: r.totalCO2,
        breakdown: r.breakdown as { transport: number; energy: number; food: number; waste: number },
        inputs: r.inputs as Record<string, unknown>,
      })),
      nextCursor,
    };

    return NextResponse.json(response);
  } catch (dbError: unknown) {
    const message = dbError instanceof Error ? dbError.message : "Unknown database error";
    console.error(`[api/footprint/history] DB query failed: ${message}`);
    return NextResponse.json(
      { error: "Failed to fetch history. Please try again later." },
      { status: 500 },
    );
  }
}
