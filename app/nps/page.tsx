import type { Metadata } from "next";
import NpsCalculator from "@/components/calculators/nps/NpsCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "NPS Calculator India — National Pension System Tier-1 Corpus & Pension Modeler",
  description:
    "Calculate NPS Tier-1 retirement corpus, permitted lump-sum exit up to 80%, 60% tax-free withdrawal under Section 10(12A), annuity pension, and Section 80CCD(1B) tax deduction benefits.",
  keywords: [
    "nps calculator india",
    "national pension system returns calculator",
    "nps tier 1 pension modeler",
    "section 80ccd 1b tax savings nps",
    "pfrda all citizen exit regulations",
  ],
};

export default function NpsPage() {
  return (
    <CalculatorPageShell
      id="nps"
      badge="PFRDA All-Citizen"
      regulatoryMetadata={{
        currentAct: "PFRDA (Exits and Withdrawals under NPS) Regulations / Income-tax Act",
        currentSections: ["PFRDA Exit Regulations", "Section 10(12A)", "Section 80CCD(1B)", "Section 80CCD(2)"],
        effectiveFrom: "01 April 2025",
        officialSources: [
          "Pension Fund Regulatory and Development Authority (PFRDA)",
          "National Pension System Trust (npstrust.org.in)",
        ],
      }}
      assumptions={[
        "Under current PFRDA All Citizen rules for normal exit at retirement (age 60), subscribers may withdraw up to 80% as lump sum with a minimum of 20% allocated to purchase an annuity.",
        "Tax exemption is distinct from exit allocation: up to 60% of the accumulated corpus may qualify for tax-exempt withdrawal under Section 10(12A), while any additional permitted lump sum above 60% is subject to prevailing tax treatment.",
        "Section 80CCD(1B) provides an additional tax deduction up to ₹50,000 exclusively for Tier-1 NPS contributions over and above the Section 80C limit.",
      ]}
      sources={[
        {
          label: "Pension Fund Regulatory and Development Authority (PFRDA)",
          url: "https://www.pfrda.org.in/",
        },
        {
          label: "NPS Trust — Exit & Withdrawal Guidelines",
          url: "https://npstrust.org.in/",
        },
      ]}
    >
      <NpsCalculator />
    </CalculatorPageShell>
  );
}
