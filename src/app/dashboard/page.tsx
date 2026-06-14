import { auth } from "@/lib/auth/config";
import Link from "next/link";
import { LiquidButton } from "@/components/ui/liquid-button";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { DashboardData } from "./dashboard-client";

import { getUserHistory } from "@/lib/db/queries";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return <DashboardPreview />;
  }

  // Fetch from DB using unstable_cache
  const history = await getUserHistory(session.user.id);

  return <DashboardData history={history} />;
}

// ── Preview for Unauthenticated Users (Hybrid Strategy) ──
function DashboardPreview() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold glass-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Sign in to unlock personalized trends and history.</p>
        </div>
      </div>

      <LiquidGlass className="p-8 md:p-12 text-center max-w-2xl mx-auto space-y-8 relative overflow-hidden">
        {/* Subtle background graphics to make it look premium */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center relative z-10">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-4 relative z-10">
          <h2 className="text-3xl font-bold">Your Progress Lives Here</h2>
          <p className="text-muted-foreground">
            Get instant access to powerful visualization tools, track your emissions over time, and measure your impact against global targets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto relative z-10">
          {[
            "Historical emission trends",
            "Category breakdown vs targets",
            "Automatic data persistence",
            "Personalized reduction goals",
          ].map((feature) => (
            <div key={feature} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
          <Link href="/api/auth/signin">
            <LiquidButton>
              Sign In to Save History
            </LiquidButton>
          </Link>
          <Link href="/calculator">
            <LiquidButton variant="clear" className="hover:bg-white/5">
              Continue Without Saving <ArrowRight className="w-4 h-4 ml-2" />
            </LiquidButton>
          </Link>
        </div>
      </LiquidGlass>
    </div>
  );
}
