import type { Metadata } from "next";
import PositionSizeCalculator from "@/components/calculators/position-size/PositionSizeCalculator";
import PositionSizeInfo from "@/components/seo/PositionSizeInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Position Size & Risk-Reward Calculator — FinCalc India",
  description:
    "Calculate optimal share quantity, stop-loss distance, target price, and rupee risk per trade for intraday and swing trading using the 1% risk rule.",
  openGraph: {
    title: "Position Size & Risk-Reward Calculator — FinCalc India",
    description:
      "Exact quantity sizing, target price calculation, and capital risk management for Indian stock market traders.",
  },
};

export default function PositionSizePage() {
  return (
    <CalculatorPageShell
      id="position-size"
      badge="Risk Management"
      assumptions={[
        "Risk is strictly constrained to a fixed percentage (typically 1% to 2%) of total active trading capital.",
        "Quantity is calculated as Risk Amount divided by per-share Stop-Loss distance.",
        "Margin leverage complies with SEBI peak margin requirements (up to 5× intraday MIS, 1× CNC/delivery).",
        "Overnight gap risk and execution slippage are not factored into ideal stop-loss calculations.",
      ]}
      sources={[
        { label: "SEBI Master Circular on Peak Margin System", url: "https://www.sebi.gov.in/" },
      ]}
      educationalContent={<PositionSizeInfo />}
    >
      <PositionSizeCalculator />
    </CalculatorPageShell>
  );
}
