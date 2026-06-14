import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";

// Minimal in-memory rate limiter for failed login attempts
// In production, this should be backed by Redis or similar.
const rateLimitMap = new Map<string, { attempts: number; lockoutUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // Secure defaults for both OAuth and Credentials
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials.");
        }

        const email = (credentials.email as string).toLowerCase();
        
        // Rate Limiting Check
        const rl = rateLimitMap.get(email);
        if (rl && rl.lockoutUntil > Date.now()) {
          const minutesLeft = Math.ceil((rl.lockoutUntil - Date.now()) / 60000);
          throw new Error(`Account locked. Try again in ${minutesLeft} minutes.`);
        }

        // Validate password against schema just in case (though we validate on creation)
        const passwordResult = passwordSchema.safeParse(credentials.password);
        if (!passwordResult.success) {
          handleFailedAttempt(email);
          throw new Error("Invalid credentials.");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        // Prevent timing attacks by hashing a dummy password if user not found
        // or just rely on generic error messages. We do the latter to save CPU
        // but typically doing a dummy compare is safer. For MVP, just return error.
        if (!user || !user.password) {
          handleFailedAttempt(email);
          throw new Error("Invalid credentials.");
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isValid) {
          handleFailedAttempt(email);
          throw new Error("Invalid credentials.");
        }

        // Clear rate limit on success
        rateLimitMap.delete(email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role, // Custom claim mapped in JWT callback
        };
      },
    }),
  ],
});

function handleFailedAttempt(email: string) {
  const current = rateLimitMap.get(email) || { attempts: 0, lockoutUntil: 0 };
  current.attempts += 1;
  
  if (current.attempts >= MAX_ATTEMPTS) {
    current.lockoutUntil = Date.now() + LOCKOUT_MS;
  }
  
  rateLimitMap.set(email, current);
}
