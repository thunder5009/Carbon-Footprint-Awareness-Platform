import { LiquidGlass } from "@/components/ui/liquid-glass";

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="h-12 w-64 bg-white/10 rounded-lg"></div>
          <div className="h-4 w-96 bg-white/5 rounded-md"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-white/10 rounded-xl"></div>
        </div>
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <LiquidGlass key={i} className="p-6 h-[140px] flex flex-col justify-center items-center space-y-4">
            <div className="h-12 w-24 bg-white/10 rounded-md"></div>
            <div className="h-4 w-32 bg-white/5 rounded-md"></div>
          </LiquidGlass>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 w-48 bg-white/10 rounded-md"></div>
          <LiquidGlass className="h-[368px] w-full"><div /></LiquidGlass>
        </div>
        <div className="space-y-4">
          <div className="h-8 w-48 bg-white/10 rounded-md"></div>
          <LiquidGlass className="h-[368px] w-full"><div /></LiquidGlass>
        </div>
      </div>
    </div>
  );
}
