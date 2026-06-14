import { prisma } from "@/lib/db/prisma";
import crypto from "crypto";

/**
 * Generate a cryptographically secure token, hash it, and store it
 * with a 1-hour expiration time for a specific email.
 */
export async function generatePasswordResetToken(email: string) {
  // Generate a random 32-byte token
  const token = crypto.randomBytes(32).toString("hex");

  // 1-hour expiration
  const expires = new Date(Date.now() + 3600 * 1000);

  // Delete any existing tokens for this email to prevent spam/clutter
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  // Create the new token
  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
}
