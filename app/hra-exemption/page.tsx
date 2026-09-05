import type { Metadata } from "next";
import HRACalculator from "@/components/calculators/hra/HRACalculator";
import HRAInfo from "@/components/seo/HRAInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "HRA Exemption Calculator & Rent Optimizer — Tax Year 2026-27",
  description:
    "Calculate exempt and taxable HRA under Section 10(13A) for Tax Year 2026-27. Compare Metro vs Non-Metro limits, monthly vs annual salary, and calculate net household tax benefit when paying rent to parents.",
  openGraph: {
    title: "HRA Exemption Calculator & Rent Optimizer — Tax Year 2026-27 — FinCalc India",
    description:
      "Accurately calculate tax-exempt House Rent Allowance with 3 statutory limits and parent rent arbitrage planner for Tax Year 2026-27.",
  },
};

export default function HRAExemptionPage() {
  return (
    <CalculatorPageShell
      id="hra-exemption"
      badge="Section 10(13A)"
      regulatoryMetadata={{
        taxYear: "2026–27",
        currentAct: "Income-tax Act, 1961 / Income-tax Act, 2025",
        currentSections: ["Section 10(13A)", "Rule 2A"],
        effectiveFrom: "01 April 2025",
        officialSources: [
          "Income Tax Department — House Rent Allowance Exemption",
        ],
      }}
      assumptions={[
        "Exemption is determined under Rule 2A as the lowest of: (1) Actual HRA received, (2) Rent paid minus 10% of Basic Salary + DA, (3) 50% (metros: Mumbai, Delhi, Kolkata, Chennai) or 40% (non-metros) of Basic Salary.",
        "HRA exemption applies strictly under the Old Tax Regime; it is not eligible under the New Tax Regime (Section 115BAC).",
        "Annual rent payments exceeding ₹1,00,000 mandate declaration of the landlord's Permanent Account Number (PAN).",
        "Rent paid to parents requires commercial tenancy documentation and declared rental income in the parents' tax return.",
      ]}
      sources={[
        { label: "Income Tax Department — HRA Exemption Rules", url: "https://incometax.gov.in/" },
      ]}
      educationalContent={<HRAInfo />}
    >
      <HRACalculator />
    </CalculatorPageShell>
  );
}
