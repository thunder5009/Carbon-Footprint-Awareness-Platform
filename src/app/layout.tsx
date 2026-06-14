import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LiquidNav } from "@/components/ui/liquid-nav";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://carbontrack.app"),
  title: {
    default: "CarbonTrack — Calculate and Reduce Your Carbon Footprint",
    template: "%s | CarbonTrack",
  },
  description:
    "Free carbon footprint calculator. Track emissions, get personalized tips, and reduce your environmental impact.",
  keywords: ["carbon footprint", "CO2 calculator", "climate action", "sustainability", "emissions tracking"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CarbonTrack",
    description: "Calculate and reduce your carbon footprint",
    url: "https://carbontrack.app",
    siteName: "CarbonTrack",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CarbonTrack Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonTrack",
    description: "Calculate and reduce your carbon footprint",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Clean, minimal background */}
          <div
            className="fixed inset-0 -z-10"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-background" />
            {/* Subtle gradient accent - very minimal */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                background: "radial-gradient(ellipse at top, hsl(var(--primary) / 0.15), transparent 50%)",
              }}
            />
          </div>

          <SkipLink />
          <LiquidNav />
          <main id="main-content" className="relative pt-0 md:pt-24 pb-20 md:pb-0 min-h-screen">
            {children}
          </main>
          <Footer />
          <BottomTabBar />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
