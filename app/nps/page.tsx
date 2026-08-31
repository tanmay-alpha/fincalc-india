import type { Metadata } from "next";
import NpsCalculator from "@/components/calculators/nps/NpsCalculator";

export const metadata: Metadata = {
  title: "NPS Calculator India — National Pension System Tier-1 Corpus & Pension Modeler",
  description:
    "Calculate NPS Tier-1 retirement corpus, 60% tax-free lump-sum withdrawal, monthly annuity pension, and ₹50,000 Section 80CCD(1B) tax deduction benefits.",
  keywords: [
    "nps calculator india",
    "national pension system returns calculator",
    "nps tier 1 pension modeler",
    "section 80ccd 1b tax savings nps",
    "pfrda active choice asset allocation",
  ],
};

export default function NpsPage() {
  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          NPS Pension & Corpus Calculator
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Model retirement wealth accumulation in National Pension System (NPS Tier-1) across Equity (E), Corporate Debt (C), and Government Bonds (G) with exact monthly pension payouts.
        </p>
      </header>

      <NpsCalculator />
    </main>
  );
}
