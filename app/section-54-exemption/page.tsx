import type { Metadata } from "next";
import Section54Calculator from "@/components/calculators/section-54/Section54Calculator";
import Section54Info from "@/components/seo/Section54Info";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "Section 54, 54EC & 54F Capital Gains Exemption Planner — Tax Year 2026-27",
  description:
    "Calculate statutory capital gains exemptions under Section 54 (Residential house), Section 54EC (Specified bonds up to ₹50L), and Section 54F (Shares/Gold/Plot to House). Statutory eligibility depends strictly on the original asset sold.",
  openGraph: {
    title: "Section 54, 54EC & 54F Capital Gains Exemption Planner — Tax Year 2026-27 — FinCalc India",
    description:
      "Statutory capital gains tax exemption planner under Sections 54, 54EC, and 54F. Compare eligible routes based on the original asset sold under Tax Year 2026-27 rules.",
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
              { label: "Section 54 / 54EC / 54F Planner" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">🏡</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Section 54, 54EC & 54F Exemption Planner — Tax Year 2026-27
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Save tax on long-term capital gains by planning statutory reinvestment under Section 54 (residential house), Section 54EC (specified bonds up to ₹50L), or Section 54F (shares, gold, or plot reinvested into a residential house). Available statutory routes depend strictly on the original asset transferred.
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
