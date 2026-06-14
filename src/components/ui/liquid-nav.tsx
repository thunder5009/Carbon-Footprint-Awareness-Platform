/**
 * LiquidNav — Aurora glassmorphic navigation bar.
 *
 * Features:
 * - Scroll-responsive: shrinks, gains border-radius, and floats on scroll
 * - Glowing emerald brand logo
 * - Active link with gradient underline
 * - ThemeToggle integration
 * - Hidden on mobile (replaced by BottomTabBar)
 */
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Leaf } from "lucide-react";

const navLinks = [
  { label: "Calculator", href: "/calculator" },
  { label: "Dashboard", href: "/dashboard" },
] as const;

export function LiquidNav() {
  const { scrollY } = useScroll();
  const pathname = usePathname();

  const height = useTransform(scrollY, [0, 100], [80, 60]);
  const borderRadius = useTransform(scrollY, [0, 100], [0, 28]);
  const margin = useTransform(scrollY, [0, 100], [0, 16]);
  const bgOpacity = useTransform(scrollY, [0, 100], [0.5, 0.8]);

  return (
    <motion.header
      style={{ height, borderRadius, marginLeft: margin, marginRight: margin }}
      className="fixed top-0 left-0 right-0 z-50 hidden md:block overflow-hidden"
    >
      {/* Background glass */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-background/70 backdrop-blur-2xl border-b border-white/10"
      />

      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <nav className="relative h-full flex items-center justify-between px-6 md:px-8" aria-label="Main navigation">
        {/* Brand logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md group-hover:bg-emerald-500/35 transition-colors duration-300" />
            <Leaf className="relative w-4.5 h-4.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-xl font-bold glass-text">CarbonTrack</span>
        </Link>

        {/* Nav links + toggle */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium transition-colors group"
                aria-current={isActive ? "page" : undefined}
              >
                <span className={isActive ? "text-emerald-400" : "text-foreground/65 hover:text-foreground"}>
                  {link.label}
                </span>
                {/* Active underline glow */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                  />
                )}
                {/* Hover underline */}
                {!isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-emerald-400/0 via-emerald-400/60 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
