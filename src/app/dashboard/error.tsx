"use client";

import { useEffect } from "react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { LiquidButton } from "@/components/ui/liquid-button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <LiquidGlass className="max-w-md p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Failed to load dashboard</h2>
          <p className="text-muted-foreground text-sm">
            We couldn&apos;t retrieve your carbon footprint history. Please try again.
          </p>
        </div>
        <LiquidButton onClick={reset} className="w-full">
          Try again
        </LiquidButton>
      </LiquidGlass>
    </div>
  );
}
