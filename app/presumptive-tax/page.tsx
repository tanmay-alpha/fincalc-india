import type { Metadata } from "next";
import PresumptiveTaxCalculator from "@/components/calculators/presumptive-tax/PresumptiveTaxCalculator";
import PresumptiveTaxInfo from "@/components/seo/PresumptiveTaxInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Presumptive Tax Calculator (Section 44AD & 44ADA) — Tax Year 2026-27",
  description:
    "Calculate presumptive income and tax for Professionals (44ADA - 50% rate, ₹75L limit) and Businesses (44AD - 6%/8% rate, ₹3Cr limit) under Tax Year 2026-27 slabs. Compare with actual profit and audit triggers.",
  openGraph: {
    title: "Presumptive Tax Calculator (Section 44AD & 44ADA) — Tax Year 2026-27 — FinCalc India",
    description:
      "Compute deemed profits, slab-rate taxes, and evaluate tax audit triggers for Section 44AD and 44ADA under Tax Year 2026-27 rules.",
  },
};

export default function PresumptiveTaxPage() {
  return (
    <CalculatorPageShell
      id="presumptive-tax"
      badge="Section 44AD & 44ADA"
      regulatoryMetadata={{
        taxYear: "2026–27",
        currentAct: "Income-tax Act, 1961 / Income-tax Act, 2025",
        currentSections: ["Section 44AD", "Section 44ADA", "Section 44AB"],
        effectiveFrom: "01 April 2024 / 01 April 2025",
        officialSources: [
          "Income Tax Department — Presumptive Taxation Scheme",
        ],
      }}
      assumptions={[
        "Section 44ADA: Specified professionals with gross receipts up to ₹75 Lakh (if cash receipts ≤ 5%) declare deemed profits at minimum 50%.",
        "Section 44AD: Eligible small businesses with turnover up to ₹3 Crore (if cash receipts ≤ 5%) declare deemed profits at 6% (digital) or 8% (non-digital).",
        "Taxpayers opting for presumptive schemes are exempt from maintaining formal books under Section 44AA and tax audit under Section 44AB.",
        "Advance tax liability: 100% of tax is due on or before 15 March of the relevant financial year.",
      ]}
      sources={[
        { label: "Income Tax Department — Presumptive Taxation Guide", url: "https://incometax.gov.in/" },
      ]}
      educationalContent={<PresumptiveTaxInfo />}
    >
      <PresumptiveTaxCalculator />
    </CalculatorPageShell>
  );
}
