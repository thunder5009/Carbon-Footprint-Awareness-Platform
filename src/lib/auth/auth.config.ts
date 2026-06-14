import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible authentication configuration.
 * Do NOT import Prisma, bcrypt, or other Node.js-only modules here.
 * This is used strictly by the Next.js Middleware.
 */
export const authConfig = {
  providers: [], // Providers are injected in config.ts (Node runtime)
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    // We handle the authorization logic explicitly in middleware.ts
    // so we just return true here to let NextAuth pass the session into the request object.
    authorized() {
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "user";
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { id: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
