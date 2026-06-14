import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

export const { auth } = NextAuth(authConfig);

// Routes that require authentication
const protectedRoutes = ["/settings"];
// API routes that require authentication
const protectedApiRoutes = ["/api/footprint/history", "/api/user/export", "/api/user/delete"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isProtectedApiRoute = protectedApiRoutes.some((route) => pathname.startsWith(route));

  // If accessing a protected API route without being logged in
  if (isProtectedApiRoute && !isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // If accessing a protected page without being logged in
  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  // The matcher controls which routes the middleware runs on.
  // We exclude static files, images, Next.js internals, etc.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
