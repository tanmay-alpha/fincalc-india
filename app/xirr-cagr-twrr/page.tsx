import type { Metadata } from "next";
import XirrCalculator from "@/components/calculators/xirr/XirrCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "XIRR Calculator India — Irregular Cash Flow Return Analyzer",
  description:
    "Calculate exact annualized mutual fund and stock portfolio returns (XIRR) for irregular SIPs, top-ups, and redemptions with CAGR comparison.",
  keywords: [
    "xirr calculator india",
    "extended internal rate of return",
    "mutual fund sip xirr analyzer",
    "cagr vs xirr",
    "investment return calculator",
  ],
};

export default function XirrPage() {
  return (
    <CalculatorPageShell
      id="xirr-cagr-twrr"
      assumptions={[
        "XIRR uses the Newton-Raphson method to solve the internal rate of return for irregular cash flow dates.",
        "CAGR measures point-to-point geometric growth assuming no intermediate inflows or withdrawals.",
        "TWRR isolates portfolio manager performance by neutralizing the timing and magnitude of external cash flows.",
      ]}
      sources={[
        {
          label: "Association of Mutual Funds in India (AMFI) — Performance Measurement Guidelines",
          url: "https://www.amfiindia.com/",
        },
      ]}
    >
      <XirrCalculator />
    </CalculatorPageShell>
  );
}
