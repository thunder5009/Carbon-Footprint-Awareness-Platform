import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { POST } from "../calc/route";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";

// Mock NextAuth
vi.mock("@/lib/auth/config", () => ({
  auth: vi.fn(),
  handlers: {},
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

const mockAuth = auth as unknown as {
  mockResolvedValue: (value: unknown) => void;
  mockResolvedValueOnce: (value: unknown) => void;
};

describe("POST /api/footprint/calc", () => {
  const validInputs = {
    transport: {
      hasCar: false,
      busMiles: 100,
      trainMiles: 0,
      subwayMiles: 0,
      shortHaulFlights: 0,
      longHaulFlights: 0,
    },
    energy: {
      kwhPerMonth: 100,
      electricitySource: "grid",
      heatingType: "none",
      heatingAmount: 0,
    },
    food: {
      dietType: "vegan",
      wasteFrequency: "rarely",
    },
    waste: {
      lbsPerWeek: 10,
      recycling: true,
      composting: true,
    },
  };

  const testUserId = "test-user-id";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    // Cleanup test records
    await prisma.footprintRecord.deleteMany({
      where: { userId: testUserId },
    });
  });

  it("calculates and returns results without saving for anonymous users", async () => {
    mockAuth.mockResolvedValueOnce(null); // Anonymous

    const req = new Request("http://localhost/api/footprint/calc", {
      method: "POST",
      body: JSON.stringify(validInputs),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.totalCO2).toBeGreaterThan(0);
    expect(data.breakdown.transport).toBeDefined();
    expect(data.recordId).toBeUndefined(); // Should not save
  });

  it("calculates and saves to database for authenticated users", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: testUserId } });

    const req = new Request("http://localhost/api/footprint/calc", {
      method: "POST",
      body: JSON.stringify(validInputs),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.recordId).toBeDefined();

    // Verify it was saved to the DB
    const savedRecord = await prisma.footprintRecord.findUnique({
      where: { id: data.recordId },
    });

    expect(savedRecord).toBeDefined();
    expect(savedRecord?.userId).toBe(testUserId);
    expect(savedRecord?.totalCO2).toBe(data.totalCO2);
  });

  it("returns 400 for invalid inputs", async () => {
    mockAuth.mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/footprint/calc", {
      method: "POST",
      body: JSON.stringify({ transport: { busMiles: -100 } }), // Invalid negative
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("enforces rate limiting", async () => {
    mockAuth.mockResolvedValue(null);

    // Blast the API to hit the limit (10 for IP based)
    let lastStatus = 200;
    for (let i = 0; i < 15; i++) {
      const req = new Request("http://localhost/api/footprint/calc", {
        method: "POST",
        body: JSON.stringify(validInputs),
        headers: { "x-forwarded-for": "127.0.0.1" },
      });
      const res = await POST(req);
      lastStatus = res.status;
    }

    // By the 15th request, it should be 429 Too Many Requests
    expect(lastStatus).toBe(429);
  });
});
