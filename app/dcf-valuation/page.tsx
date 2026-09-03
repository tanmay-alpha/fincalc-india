import type { Metadata } from "next";
import DcfCalculator from "@/components/calculators/dcf/DcfCalculator";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";
import AssumptionsDrawer from "@/components/ui/AssumptionsDrawer";
import { Scale } from "lucide-react";

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
    <main id="main-content" className="min-h-screen pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Corporate & Valuation", href: "/#calculators" },
            { label: "DCF Valuation Calculator" },
          ]}
        />

        {/* Header Area */}
        <div className="mt-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Scale className="w-4.5 h-4.5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  DCF Valuation Calculator
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  Institutional Model
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                2-stage Discounted Cash Flow (DCF) model with explicit forecast period, Gordon Growth Terminal Value, and net debt equity bridge.
              </p>
            </div>

            {/* Assumptions Drawer */}
            <AssumptionsDrawer
              calcName="DCF Valuation Model"
              assumptions={[
                "Explicit forecast period: 3 to 15 years with constant compound growth rate.",
                "Discount rate (WACC): Represents the company's weighted average cost of capital.",
                "Terminal Value: Computed using Gordon Growth Model (TV = FCF_n * (1 + g) / (WACC - g)).",
                "WACC must exceed perpetual terminal growth rate (g) for mathematical validity.",
                "Enterprise Value = PV of Explicit FCF + PV of Terminal Value.",
                "Equity Value = Enterprise Value - Total Debt + Cash & Liquid Equivalents.",
                "Intrinsic Value Per Share = Equity Value / Diluted Shares Outstanding.",
              ]}
              sources={[
                { label: "Damodaran Online — Valuation Modeling", url: "https://pages.stern.nyu.edu/~adamodar/" },
                { label: "CFA Institute — Equity Valuation Standards", url: "https://www.cfainstitute.org/" },
              ]}
            />
          </div>
        </div>

        {/* Interactive Workspace */}
        <DcfCalculator />

        {/* Educational Content */}
        <section className="mt-16 pt-12 border-t border-border/80 max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Financial Analysis
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
              Methodology of Discounted Cash Flow Valuation
            </h2>
          </div>

          <div className="bg-card rounded-2xl border border-border/80 p-6 space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
              Discounted Cash Flow (DCF) is the foundation of fundamental equity valuation. The model values an enterprise based on the present value of its future cash flows, discounted at a rate that reflects the operational and financial risk of the business.
            </p>
            <div className="p-4 rounded-xl bg-muted/50 border border-border/60 font-mono text-xs text-foreground space-y-1">
              <p>1. PV(Explicit FCF) = ∑ [ FCF_t / (1 + WACC)^t ]</p>
              <p>2. Terminal Value (Gordon Growth) = [ FCF_n × (1 + g) ] / (WACC - g)</p>
              <p>3. Enterprise Value = PV(Explicit FCF) + PV(Terminal Value)</p>
              <p>4. Fair Value / Share = [ Enterprise Value - Net Debt ] / Shares Outstanding</p>
            </div>
            <p>
              Sensitivity considerations: Valuation is heavily influenced by the terminal growth rate and the discount rate. Investors typically use sensitivity matrices to establish a margin of safety.
            </p>
          </div>
        </section>

        <CalculatorDisclaimer />
        <RelatedCalculators current="dcf-valuation" />
      </div>
    </main>
  );
}
