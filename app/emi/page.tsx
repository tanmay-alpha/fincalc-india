import type { Metadata } from "next";
import EMICalculator from "@/components/calculators/emi/EMICalculatorIsland";
import EMIInfo from "@/components/seo/EMIInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";
import AssumptionsDrawer from "@/components/ui/AssumptionsDrawer";
import { Landmark } from "lucide-react";

export const metadata: Metadata = {
  title: "EMI Calculator — Loan EMI & Amortization Schedule",
  description:
    "Calculate loan EMI, total interest, and total payment for home, car, and personal loans. Monthly amortization schedule and interactive interest split chart.",
  openGraph: {
    title: "EMI Calculator — FinCalc India",
    description:
      "Free home loan, car loan & personal loan EMI calculator. Accurate monthly amortization schedule.",
    url: "https://fincalc-india.vercel.app/emi",
  },
};

export default function EMIPage() {
  return (
    <main id="main-content" className="min-h-screen pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Loans & Credit", href: "/#calculators" },
            { label: "EMI Calculator" },
          ]}
        />

        {/* Header Area */}
        <div className="mt-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Landmark className="w-4.5 h-4.5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Loan EMI Calculator
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Reducing Balance
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Calculate your monthly loan Equated Monthly Installment (EMI), total interest outgo, and complete amortization schedule for home, car, or personal loans.
              </p>
            </div>

            {/* Assumptions Drawer */}
            <AssumptionsDrawer
              calcName="Loan EMI Calculator"
              assumptions={[
                "Monthly reducing balance method is used: E = P × r × (1+r)^n / ((1+r)^n - 1).",
                "Interest rate is assumed to remain constant throughout the chosen tenure.",
                "Processing fees, documentation charges, and GST are excluded from pure amortization.",
                "Amortization table calculates principal and interest components month by month.",
              ]}
              sources={[
                { label: "Reserve Bank of India — Consumer Education on Loans", url: "https://rbi.org.in/" },
              ]}
            />
          </div>
        </div>

        <EMICalculator />

        {/* Separated Educational Section */}
        <section className="mt-16 pt-12 border-t border-border/80 max-w-4xl mx-auto">
          <EMIInfo />
        </section>

        <CalculatorDisclaimer />
        <RelatedCalculators current="emi" />
      </div>
    </main>
  );
}
