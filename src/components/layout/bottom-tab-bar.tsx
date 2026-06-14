/**
 * BottomTabBar — iOS-style floating tab bar for mobile navigation.
 *
 * Renders a glassmorphic floating bubble at the bottom of the viewport
 * with 3 tabs: Home, Calculator, Dashboard. Active tab shows filled
 * icon + label; inactive tabs show outline icon only.
 *
 * Hidden on desktop (md: breakpoint). Uses `usePathname()` for active state.
 * Spring animations on tab switch via Framer Motion.
 */
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Calculator, LayoutDashboard } from "lucide-react";

interface TabItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Calculator", href: "/calculator", icon: Calculator },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      data-slot="bottom-tab-bar"
      aria-label="Mobile navigation"
      className="
        fixed bottom-4 left-4 right-4 z-50
        md:hidden
        liquid-glass
        rounded-2xl
        px-2 py-1
      "
    >
      <ul className="flex items-center justify-around" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <li key={tab.href} role="presentation" className="flex-1">
              <Link
                href={tab.href}
                role="tab"
                aria-selected={isActive}
                aria-label={tab.label}
                className="
                  relative flex flex-col items-center gap-0.5
                  py-2 px-1
                  text-muted-foreground
                  transition-colors
                  outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl
                "
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{ scale: isActive ? 1 : 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative z-10"
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative z-10 text-[10px] font-semibold text-primary"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
