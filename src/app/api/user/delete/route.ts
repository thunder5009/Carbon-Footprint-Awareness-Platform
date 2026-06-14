import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete user from DB. Cascading will delete footprint records and accounts.
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    // In NextAuth v5, signOut via API route doesn't destroy the cookie directly here
    // the client handles destruction when returning 200, or you can destroy the cookie headers.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/user/delete]", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
