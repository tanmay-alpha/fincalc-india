import { Suspense } from "react";
import type { Metadata } from "next";
import CategoryDirectory from "@/components/home/CategoryDirectory";

export const metadata: Metadata = {
  title: "All Calculators",
  description:
    "Browse all 31 verified financial calculators for Indian investors — SIP, EMI, Income Tax, Capital Gains, FIRE, NPS, F&O Brokerage, DCF, WACC, and more. Updated for Tax Year 2026–27.",
  alternates: {
    canonical: "https://fincalc-india.vercel.app/calculators",
  },
  openGraph: {
    title: "All Financial Calculators — FinCalc India",
    description:
      "31 verified, precise calculators for investing, tax, loans, trading, and corporate valuation. Built for Indian investors. Updated for Tax Year 2026–27.",
    url: "https://fincalc-india.vercel.app/calculators",
  },
};

export default function CalculatorsPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Suspense
          fallback={
            <div className="py-16 text-center text-sm text-muted-foreground animate-pulse">
              Loading calculators...
            </div>
          }
        >
          <CategoryDirectory />
        </Suspense>
      </div>
    </main>
  );
}
