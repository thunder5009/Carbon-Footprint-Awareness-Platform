import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

export const getUserHistory = unstable_cache(
  async (userId: string) => {
    return await prisma.footprintRecord.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }, // Ascending for trend charts left-to-right
    });
  },
  ["user-history"],
  { tags: ["history"], revalidate: 3600 } // Revalidate hourly at worst, but actively invalidated via tags
);
