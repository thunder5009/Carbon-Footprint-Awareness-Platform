/**
 * Database Seed Script — Carbon Reduction Tips
 *
 * Populates the `tips` table with 30+ actionable, categorized tips.
 * Impact values are estimated annual CO2e reductions in metric tons.
 * Null impact means the tip is qualitative (behavioral/systemic).
 *
 * Run: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedTip {
  text: string;
  category: string;
  impact: number | null;
}

const tips: SeedTip[] = [
  // ── Transport ──────────────────────────────
  {
    text: "Carpool or use ride-sharing services for your daily commute to split emissions across passengers.",
    category: "transport",
    impact: 0.8,
  },
  {
    text: "Switch to an electric or hybrid vehicle — EVs produce 50-85% fewer emissions than gasoline cars.",
    category: "transport",
    impact: 2.4,
  },
  {
    text: "Use public transit instead of driving for trips under 10 miles.",
    category: "transport",
    impact: 1.1,
  },
  {
    text: "Combine errands into single trips to reduce total driving distance and cold starts.",
    category: "transport",
    impact: 0.3,
  },
  {
    text: "Work from home 2-3 days per week if your job allows it.",
    category: "transport",
    impact: 0.9,
  },
  {
    text: "Take trains instead of short-haul flights when possible — rail emits 5-7x less CO2 per passenger mile.",
    category: "transport",
    impact: 0.6,
  },
  {
    text: "Keep your tires properly inflated — underinflated tires reduce fuel efficiency by up to 3%.",
    category: "transport",
    impact: 0.15,
  },

  // ── Energy ─────────────────────────────────
  {
    text: "Switch to a certified 100% renewable energy provider or community solar program.",
    category: "energy",
    impact: 3.5,
  },
  {
    text: "Install a programmable or smart thermostat to optimize heating and cooling schedules.",
    category: "energy",
    impact: 0.5,
  },
  {
    text: "Replace all incandescent and CFL bulbs with LED alternatives — they use 75% less energy.",
    category: "energy",
    impact: 0.2,
  },
  {
    text: "Improve home insulation (attic, walls, windows) to reduce heating and cooling energy needs.",
    category: "energy",
    impact: 1.0,
  },
  {
    text: "Unplug devices and use smart power strips to eliminate phantom loads that consume energy 24/7.",
    category: "energy",
    impact: 0.1,
  },
  {
    text: "Set your water heater to 120°F (49°C) — every 10°F reduction saves 3-5% on water heating costs and emissions.",
    category: "energy",
    impact: 0.15,
  },
  {
    text: "Air-dry laundry when weather permits instead of using an electric dryer.",
    category: "energy",
    impact: 0.2,
  },

  // ── Food ───────────────────────────────────
  {
    text: "Adopt Meatless Mondays — one plant-based day per week reduces your food footprint by ~15%.",
    category: "food",
    impact: 0.3,
  },
  {
    text: "Buy local and seasonal produce to minimize transportation and cold-storage emissions.",
    category: "food",
    impact: 0.2,
  },
  {
    text: "Reduce food waste by meal planning, proper storage, and using leftovers creatively.",
    category: "food",
    impact: 0.25,
  },
  {
    text: "Choose organic and regeneratively farmed products that sequester carbon in soil.",
    category: "food",
    impact: 0.15,
  },
  {
    text: "Grow some of your own herbs, fruits, or vegetables — zero transport emissions and fresher food.",
    category: "food",
    impact: 0.1,
  },
  {
    text: "Reduce consumption of beef and dairy — these are the highest-emission foods per calorie.",
    category: "food",
    impact: 0.8,
  },
  {
    text: "Choose tap water over bottled water to avoid plastic production and transport emissions.",
    category: "food",
    impact: 0.05,
  },

  // ── Waste ──────────────────────────────────
  {
    text: "Recycle all eligible paper, plastic, glass, and metal — recycling uses 30-95% less energy than virgin production.",
    category: "waste",
    impact: 0.2,
  },
  {
    text: "Start composting food scraps and yard waste to divert organic material from methane-producing landfills.",
    category: "waste",
    impact: 0.15,
  },
  {
    text: "Carry reusable bags, bottles, and containers to eliminate single-use plastic waste.",
    category: "waste",
    impact: 0.05,
  },
  {
    text: "Buy products with minimal or recyclable packaging — packaging accounts for ~5% of global emissions.",
    category: "waste",
    impact: 0.1,
  },
  {
    text: "Donate or repurpose items instead of sending them to landfill.",
    category: "waste",
    impact: 0.08,
  },
  {
    text: "Choose durable, repairable products over disposable alternatives — the greenest product is one you don't have to replace.",
    category: "waste",
    impact: 0.12,
  },

  // ── General ────────────────────────────────
  {
    text: "Calculate your carbon footprint regularly to track progress and identify your highest-impact areas.",
    category: "general",
    impact: null,
  },
  {
    text: "Offset remaining emissions through verified carbon offset programs (Gold Standard, VCS).",
    category: "general",
    impact: null,
  },
  {
    text: "Educate family and friends about reducing their carbon footprint — behavioral change multiplies impact.",
    category: "general",
    impact: null,
  },
  {
    text: "Support businesses and policies that prioritize carbon reduction and sustainability.",
    category: "general",
    impact: null,
  },
  {
    text: "Plant trees or support reforestation initiatives — a single tree absorbs ~22 kg CO2 per year.",
    category: "general",
    impact: 0.022,
  },
  {
    text: "Follow the waste hierarchy: Refuse > Reduce > Reuse > Recycle > Rot (compost) > Landfill.",
    category: "general",
    impact: null,
  },
];

async function main(): Promise<void> {
  console.log("🌱 Seeding tips database...");

  // Clear existing tips to prevent duplicates on re-seed
  await prisma.tip.deleteMany();
  console.log("   Cleared existing tips.");

  // Insert all tips
  const result = await prisma.tip.createMany({
    data: tips,
  });

  console.log(`   Inserted ${result.count} tips.`);
  console.log("✅ Seed complete.");
}

main()
  .catch((e: unknown) => {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error(`❌ Seed failed: ${message}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
