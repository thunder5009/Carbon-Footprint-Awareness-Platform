import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://carbon-track-sable-nu.vercel.app"),
  title: {
    default: "CarbonTrack — Know Your Impact",
    template: "%s | CarbonTrack",
  },
  description:
    "Premium carbon footprint calculator. Understand your impact across transport, energy, food, and waste.",
  keywords: ["carbon footprint", "CO2 calculator", "climate", "sustainability"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div className="app-frame">
          {children}
        </div>
      </body>
    </html>
  );
}
