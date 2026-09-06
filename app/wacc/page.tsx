import type { Metadata } from "next";
import WaccCalculator from "@/components/calculators/wacc/WaccCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "WACC Calculator India — Weighted Average Cost of Capital",
  description:
    "Calculate company WACC (Weighted Average Cost of Capital) with corporate tax shield adjustment, cost of equity (Ke), and cost of debt (Kd).",
  keywords: [
    "wacc calculator india",
    "weighted average cost of capital",
    "cost of equity formula",
    "after tax cost of debt",
    "corporate finance hurdle rate",
  ],
};

export default function WaccPage() {
  return (
    <CalculatorPageShell
      id="wacc"
      assumptions={[
        "Cost of Equity (Ke) is estimated using the Capital Asset Pricing Model (CAPM): Ke = Rf + Beta × (Rm - Rf).",
        "Cost of Debt (Kd) is adjusted for the corporate income tax shield: Kd_after_tax = Kd × (1 - Tax Rate).",
        "Capital weights reflect relative proportions of equity and interest-bearing debt.",
      ]}
      sources={[
        {
          label: "Institute of Cost Accountants of India — Cost of Capital Principles",
          url: "https://icmai.in/",
        },
      ]}
    >
      <WaccCalculator />
    </CalculatorPageShell>
  );
}
