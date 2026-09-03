import type { Metadata } from "next";
import TaxCalculator from "@/components/calculators/tax/TaxCalculator";
import TaxInfo from "@/components/seo/TaxInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";
import AssumptionsDrawer from "@/components/ui/AssumptionsDrawer";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Income Tax Calculator — Tax Year 2026-27 (FY 2026-27)",
  description:
    "Calculate and compare Income Tax under Old vs New Tax Regime for Tax Year 2026-27 (Income-tax Act, 2025 as amended by Finance Act, 2026). Detailed slab breakdown, ₹75k standard deduction, Section 156 rebate, and tax-saving recommendations.",
  openGraph: {
    title: "Income Tax Calculator — Tax Year 2026-27 — FinCalc India",
    description:
      "Free Old vs New tax regime comparison for Tax Year 2026-27 (FY 2026-27). Find the regime that saves you the most tax.",
  },
};

export default function TaxPage() {
  return (
    <main id="main-content" className="min-h-screen pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tax & Compliance", href: "/#calculators" },
            { label: "Income Tax Calculator" },
          ]}
        />

        {/* Header */}
        <div className="mt-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Income Tax Calculator
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Tax Year 2026–27
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                  AY 2026–27 (FY 2026–27)
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-3xl">
                Compare Old vs New Tax Regime under Income-tax Act, 2025 as amended by Finance Act, 2026. Includes ₹75,000 standard deduction and Section 156 rebate up to ₹12L with marginal relief.
              </p>
            </div>

            {/* Statutory Assumptions Drawer */}
            <AssumptionsDrawer
              calcName="Income Tax Calculator"
              metadata={{
                taxYear: "2026–27",
                currentAct: "Income-tax Act, 2025 & Finance Act, 2026",
                currentSections: ["Section 156", "Section 112A", "Section 111A", "Chapter VI-A"],
                effectiveFrom: "01 April 2026",
                officialSources: [
                  "Income Tax Department of India (incometax.gov.in)",
                  "Finance Bill 2026 Official Gazette",
                ],
              }}
              assumptions={[
                "New Regime standard deduction is ₹75,000 applicable only to salary and pension income.",
                "Section 156 rebate eliminates tax for Resident Individuals with taxable ordinary income up to ₹12,00,000 under the New Regime.",
                "Marginal relief under Section 156(2)(b) smooths the tax cliff for taxable income between ₹12,00,000 and ₹12,70,588.",
                "Health & Education Cess of 4% applies to total tax after rebate and surcharge.",
              ]}
            />
          </div>
        </div>

        {/* Interactive Tax Calculator */}
        <TaxCalculator />

        {/* Separated SEO & Educational Content */}
        <section className="mt-16 pt-12 border-t border-border/80 max-w-4xl mx-auto">
          <TaxInfo />
        </section>

        <CalculatorDisclaimer />
        <RelatedCalculators current="tax" />
      </div>
    </main>
  );
}
