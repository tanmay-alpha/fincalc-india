import type { Metadata } from "next";
import CapitalGainsCalculator from "@/components/calculators/capital-gains/CapitalGainsCalculator";
import CapitalGainsInfo from "@/components/seo/CapitalGainsInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Capital Gains Tax Calculator — Tax Year 2026-27",
  description:
    "Calculate STCG and LTCG tax on Equity, Debt Mutual Funds, Real Estate, and Gold under Tax Year 2026-27 rules (12.5% LTCG, ₹1.25L exemption, real estate grandfathering).",
  openGraph: {
    title: "Capital Gains Tax Calculator — Tax Year 2026-27 — FinCalc India",
    description:
      "Calculate Capital Gains Tax on shares, property, and gold with 12.5% LTCG, 20% STCG, and grandfathering rules.",
  },
};

export default function CapitalGainsTaxPage() {
  return (
    <CalculatorPageShell
      id="capital-gains-tax"
      badge="Tax Year 2026–27"
      regulatoryMetadata={{
        taxYear: "2026–27",
        currentAct: "Income-tax Act, 2025 as amended by Finance Act, 2026",
        currentSections: ["Section 112A", "Section 111A", "Section 112", "Section 50AA"],
        effectiveFrom: "23 July 2024 / 01 April 2026",
        officialSources: [
          "Income Tax Department — Capital Gains Rates",
          "CBDT Circular on Real Estate Grandfathering Option",
        ],
      }}
      assumptions={[
        "Listed Equity & Equity Mutual Funds: 12.5% LTCG on aggregate gains above ₹1.25 Lakh per financial year.",
        "Listed Equity STCG (Section 111A): Flat 20% tax rate.",
        "Real Estate acquired before 23 July 2024: Taxpayer can choose between 12.5% without indexation OR 20% with indexation (whichever is lower).",
        "Unlisted shares & real estate holding period for long-term classification is 24 months; listed equity is 12 months.",
      ]}
      educationalContent={<CapitalGainsInfo />}
    >
      <CapitalGainsCalculator />
    </CalculatorPageShell>
  );
}
