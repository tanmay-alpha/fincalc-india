import type { Metadata } from "next";
import FIRECalculator from "@/components/calculators/fire/FIRECalculator";
import FIREInfo from "@/components/seo/FIREInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "FIRE & Early Retirement Calculator — Financial Independence in India",
  description:
    "Calculate your FIRE corpus (Lean, Standard, Fat FIRE) and required monthly savings to achieve early financial independence in India.",
  openGraph: {
    title: "FIRE Calculator — Financial Independence Retire Early — FinCalc India",
    description:
      "Model inflation-adjusted wealth accumulation and retirement depletion to retire early in India.",
  },
};

export default function FIREPage() {
  return (
    <CalculatorPageShell
      id="fire"
      badge="Financial Independence"
      assumptions={[
        "Standard Safe Withdrawal Rate (SWR) is assumed at 3.0% to 3.5% for extended 35+ year Indian retirements (given Indian inflation).",
        "Annual expenses are projected to retirement age using compound inflation.",
        "Lean FIRE target: 20× annual expenses; Standard FIRE: 25-33× annual expenses; Fat FIRE: 40× annual expenses.",
        "Post-retirement real return (return minus inflation) is modeled between 1% and 2.5% to ensure perpetual corpus survival.",
      ]}
      educationalContent={<FIREInfo />}
    >
      <FIRECalculator />
    </CalculatorPageShell>
  );
}
