import type { Metadata } from "next";
import Section54Calculator from "@/components/calculators/section-54/Section54Calculator";
import Section54Info from "@/components/seo/Section54Info";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "Section 54 & 54EC Capital Gains Exemption Planner FY 2025-26",
  description:
    "Calculate tax exemption on real estate LTCG under Section 54 (Residential house reinvestment) and Section 54EC (REC/NHAI bonds up to ₹50L). Compare side-by-side with timeline rules.",
  openGraph: {
    title: "Section 54 & 54EC Capital Gains Exemption Planner — FinCalc India",
    description:
      "Plan real estate capital gains tax savings, compare residential property vs 54EC bonds, and check statutory reinvestment timelines.",
  },
};

export default function Section54ExemptionPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Capital Gains Tax", href: "/capital-gains-tax" },
              { label: "Section 54 / 54EC Planner" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">🏡</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Section 54 & 54EC Capital Gains Exemption Planner
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Save up to 100% tax on property LTCG by planning reinvestment in a new residential house (Section 54, up to ₹10 Cr) or specified REC/NHAI bonds (Section 54EC, up to ₹50L).
          </p>
        </div>

        <Section54Calculator />
        <Section54Info />
        <CalculatorDisclaimer />
        <RelatedCalculators current="tax" />
      </div>
    </main>
  );
}
