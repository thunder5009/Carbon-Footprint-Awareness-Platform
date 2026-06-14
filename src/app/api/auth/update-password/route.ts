import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const updateSchema = z.object({
  token: z.string(),
  password: passwordSchema,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = updateSchema.parse(body);

    // Find the token
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Check expiration
    if (new Date(existingToken.expires) < new Date()) {
      // Delete expired token
      await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Update user password
    const hashedPassword = await bcrypt.hash(password, 12); // cost factor 12

    await prisma.user.update({
      where: { email: existingToken.email },
      data: { password: hashedPassword },
    });

    // Delete the single-use token
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("[api/auth/update-password]", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
