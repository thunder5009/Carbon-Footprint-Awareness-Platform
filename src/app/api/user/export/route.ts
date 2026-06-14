import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const history = await prisma.footprintRecord.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const exportData = {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      exportDate: new Date().toISOString(),
      records: history,
    };

    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="carbontrack-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("[api/user/export]", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
