import type { Metadata } from "next";
import DuPontCalculator from "@/components/calculators/dupont/DuPontCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "DuPont ROE Analysis Calculator India — 3-Step & 5-Step ROE Decomposition",
  description:
    "Decompose Return on Equity (ROE) into Operating Profit Margin, Asset Turnover, Financial Leverage, Tax Burden, and Interest Burden.",
  keywords: [
    "dupont analysis calculator india",
    "roe decomposition formula",
    "profit margin asset turnover leverage",
    "return on equity financial analysis",
    "fundamental stock analysis tool",
  ],
};

export default function DuPontPage() {
  return (
    <CalculatorPageShell
      id="dupont-analysis"
      assumptions={[
        "Decomposes Return on Equity (ROE) into operating efficiency, asset utilization, and financial leverage.",
        "5-step framework isolates Tax Burden (Net Income / EBT) and Interest Burden (EBT / EBIT) to identify earnings quality.",
        "All ratios are calculated on consistent balance-sheet period figures.",
      ]}
      sources={[
        {
          label: "Institute of Chartered Accountants of India (ICAI)",
          url: "https://www.icai.org/",
        },
      ]}
    >
      <DuPontCalculator />
    </CalculatorPageShell>
  );
}
