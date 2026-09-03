import type { Metadata } from "next";
import FnOBrokerageCalculator from "@/components/calculators/fno-brokerage/FnOBrokerageCalculator";
import FnOBrokerageInfo from "@/components/seo/FnOBrokerageInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";
import AssumptionsDrawer from "@/components/ui/AssumptionsDrawer";
import { LineChart } from "lucide-react";

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
    <main id="main-content" className="min-h-screen pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Trading & Risk", href: "/#calculators" },
            { label: "F&O Brokerage Calculator" },
          ]}
        />

        {/* Header Area */}
        <div className="mt-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <LineChart className="w-4.5 h-4.5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  F&O Brokerage & Break-Even Calculator
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Tax Year 2026–27 STT
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Itemize discount broker commissions, updated STT rates (Futures 0.05%, Options 0.15% flat), NSE/BSE exchange charges, SEBI turnover fees, 18% GST, and find your exact breakeven exit tick.
              </p>
            </div>

            {/* Assumptions Drawer */}
            <AssumptionsDrawer
              calcName="F&O Brokerage Calculator"
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
            />
          </div>
        </div>

        {/* Interactive Calculator */}
        <FnOBrokerageCalculator />

        {/* Separated SEO Section */}
        <section className="mt-16 pt-12 border-t border-border/80 max-w-4xl mx-auto">
          <FnOBrokerageInfo />
        </section>

        <CalculatorDisclaimer />
        <RelatedCalculators current="fno-brokerage" />
      </div>
    </main>
  );
}
