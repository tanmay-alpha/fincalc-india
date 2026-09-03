import type { Metadata } from "next";
import StepUpSIPCalculator from "@/components/calculators/step-up-sip/StepUpSIPCalculator";
import StepUpSIPInfo from "@/components/seo/StepUpSIPInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";
import AssumptionsDrawer from "@/components/ui/AssumptionsDrawer";
import { TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Step-Up SIP & Goal SIP Calculator — Annual Increment Compounding",
  description:
    "Calculate mutual fund returns with annual step-up / top-up SIP increments. Reverse-calculate required starting SIP for target financial goals.",
  openGraph: {
    title: "Step-Up SIP & Goal SIP Calculator — FinCalc India",
    description:
      "Free Step-Up & Target Goal SIP calculator for Indian mutual fund investors.",
  },
};

export default function StepUpSIPPage() {
  return (
    <main id="main-content" className="min-h-screen pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Investments", href: "/#calculators" },
            { label: "Step-Up SIP Calculator" },
          ]}
        />

        {/* Header Area */}
        <div className="mt-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Step-Up SIP Calculator
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Annual Top-Up
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Model annual percentage or fixed increment top-ups to beat lifestyle inflation, or reverse-calculate the required starting SIP to reach a specific financial goal.
              </p>
            </div>

            {/* Assumptions Drawer */}
            <AssumptionsDrawer
              calcName="Step-Up SIP Calculator"
              assumptions={[
                "Monthly SIP amount increases once every 12 months by the specified percentage or fixed rupee amount.",
                "Compounding is calculated at monthly compounding intervals.",
                "Goal planner mode solves for the initial starting monthly installment required to achieve the future target corpus.",
              ]}
              sources={[
                { label: "AMFI India — Mutual Fund SIP Compounding", url: "https://www.amfiindia.com/" },
              ]}
            />
          </div>
        </div>

        <StepUpSIPCalculator />

        {/* Educational Content */}
        <section className="mt-16 pt-12 border-t border-border/80 max-w-4xl mx-auto">
          <StepUpSIPInfo />
        </section>

        <CalculatorDisclaimer />
        <RelatedCalculators current="step-up-sip" />
      </div>
    </main>
  );
}
