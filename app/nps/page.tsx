import type { Metadata } from "next";
import NpsCalculator from "@/components/calculators/nps/NpsCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

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
    <CalculatorPageShell
      id="nps"
      badge="PFRDA 2026"
      assumptions={[
        "At least 40% of the accumulated Tier-1 corpus must be used to purchase an annuity as per PFRDA regulations.",
        "Up to 60% of the corpus can be withdrawn as a completely tax-free lump sum at age 60.",
        "Section 80CCD(1B) provides an additional exclusive tax deduction up to ₹50,000 over and above the ₹1.5L Section 80C ceiling.",
      ]}
      sources={[
        {
          label: "Pension Fund Regulatory and Development Authority (PFRDA)",
          url: "https://www.pfrda.org.in/",
        },
      ]}
    >
      <NpsCalculator />
    </CalculatorPageShell>
  );
}
