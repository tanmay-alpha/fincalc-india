import type { Metadata } from "next";
import TaxCalculator from "@/components/calculators/tax/TaxCalculator";
import TaxInfo from "@/components/seo/TaxInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Income Tax Calculator — Tax Year 2026-27 (FY 2026-27)",
  description:
    "Calculate and compare Income Tax under Old vs New Tax Regime for Tax Year 2026-27 (Income-tax Act, 2025 as amended by Finance Act, 2026). Detailed slab breakdown, ₹75k standard deduction, Section 157 rebate, and tax-saving recommendations.",
  openGraph: {
    title: "Income Tax Calculator — Tax Year 2026-27 — FinCalc India",
    description:
      "Free Old vs New tax regime comparison for Tax Year 2026-27 (FY 2026-27). Find the regime that saves you the most tax.",
  },
};

export default function TaxPage() {
  return (
    <CalculatorPageShell
      id="tax"
      badge="Finance Act, 2026"
      regulatoryMetadata={{
        taxYear: "2026–27",
        currentAct: "Income-tax Act, 2025 & Finance Act, 2026",
        currentSections: ["Section 157", "Section 112A", "Section 111A", "Chapter VI-A"],
        effectiveFrom: "01 April 2026",
        officialSources: [
          "Income Tax Department of India (incometax.gov.in)",
          "Finance Bill 2026 Official Gazette",
        ],
      }}
      assumptions={[
        "New Regime standard deduction is ₹75,000 applicable only to salary and pension income.",
        "Section 157 rebate eliminates tax for Resident Individuals with taxable ordinary income up to ₹12,00,000 under the New Regime.",
        "Marginal relief under Section 157(2)(b) smooths the tax cliff for taxable income between ₹12,00,000 and ₹12,70,588.",
        "Health & Education Cess of 4% applies to total tax after rebate and surcharge.",
      ]}
      educationalContent={<TaxInfo />}
    >
      <TaxCalculator />
    </CalculatorPageShell>
  );
}
