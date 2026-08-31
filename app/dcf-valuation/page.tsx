import type { Metadata } from "next";
import DcfCalculator from "@/components/calculators/dcf/DcfCalculator";

export const metadata: Metadata = {
  title: "DCF Valuation Calculator India — Discounted Cash Flow Fair Value Model",
  description:
    "Calculate intrinsic stock value and enterprise value using 2-stage Discounted Cash Flow (DCF) modeling with terminal growth rate, WACC, debt & cash adjustments.",
  keywords: [
    "dcf valuation calculator india",
    "discounted cash flow intrinsic value",
    "terminal value Gordon growth model",
    "enterprise value to equity value calculator",
    "stock valuation model",
  ],
};

export default function DcfValuationPage() {
  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          DCF Valuation Calculator
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          2-stage Discounted Cash Flow (DCF) model with explicit forecast period, Gordon Growth Terminal Value, and net debt equity bridge.
        </p>
      </header>

      <DcfCalculator />
    </main>
  );
}
