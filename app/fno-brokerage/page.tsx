import type { Metadata } from "next";
import FnOBrokerageCalculator from "@/components/calculators/fno-brokerage/FnOBrokerageCalculator";
import FnOBrokerageInfo from "@/components/seo/FnOBrokerageInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "F&O Brokerage & Break-Even Calculator — Tax Year 2026-27",
  description:
    "Calculate itemized brokerage, Tax Year 2026-27 STT (0.05% futures, 0.15% flat options), exchange charges, GST, SEBI fees, and exact points to break even.",
  openGraph: {
    title: "F&O Brokerage & Break-Even Calculator — Tax Year 2026-27 — FinCalc India",
    description:
      "Accurate brokerage and statutory charge calculator with Tax Year 2026-27 STT rates and exact break-even exit price for F&O trading.",
  },
};

export default function FnOBrokeragePage() {
  return (
    <CalculatorPageShell
      id="fno-brokerage"
      badge="Tax Year 2026–27 STT"
      assumptions={[
        "Futures STT: 0.05% on sell-side turnover (Finance Act 2026).",
        "Options STT: 0.15% on sell premium turnover.",
        "Exchange Turnover Charges: NSE Futures 0.00173%, NSE Options 0.03503% (BSE tiered charges apply accordingly).",
        "SEBI Turnover Fee: ₹10 per crore (0.0001%).",
        "Stamp Duty: 0.002% on buy futures, 0.003% on buy options.",
        "GST: 18% on (Brokerage + Exchange Charges + SEBI Fees).",
      ]}
      sources={[
        { label: "NSE India — Transaction Charges", url: "https://www.nseindia.com/" },
        { label: "SEBI Circular on Regulatory & Turnover Fees", url: "https://www.sebi.gov.in/" },
      ]}
      educationalContent={<FnOBrokerageInfo />}
    >
      <FnOBrokerageCalculator />
    </CalculatorPageShell>
  );
}
