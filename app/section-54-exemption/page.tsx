import type { Metadata } from "next";
import Section54Calculator from "@/components/calculators/section-54/Section54Calculator";
import Section54Info from "@/components/seo/Section54Info";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "Sections 82, 85 & 86 (formerly Sec 54, 54EC & 54F) Exemption Planner — Tax Year 2026-27",
  description:
    "Calculate statutory capital gains exemptions under the Income-tax Act, 2025: Section 82 (formerly Section 54 — Residential house), Section 85 (formerly Section 54EC — Specified bonds up to ₹50L), and Section 86 (formerly Section 54F — Other LTCG asset to house).",
  openGraph: {
    title: "Sections 82, 85 & 86 (formerly Sec 54, 54EC & 54F) Exemption Planner — Tax Year 2026-27 — FinCalc India",
    description:
      "Statutory capital gains exemption planner under the Income-tax Act, 2025 Sections 82, 85, and 86 (formerly Sections 54, 54EC, and 54F). Compare eligible routes based on the original asset sold.",
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
              { label: "Sections 82, 85 & 86 (Sec 54 / 54EC / 54F)" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">🏡</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Sections 82, 85 & 86 Capital Gains Exemption Planner — Tax Year 2026-27
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-3xl leading-relaxed">
            Statutory exemptions under the <strong>Income-tax Act, 2025 as amended by Finance Act, 2026</strong> (formerly Sections 54, 54EC & 54F of the 1961 Act). Plan reinvestment in a residential house (Section 82, up to ₹10 Cr), specified bonds (Section 85, up to ₹50L aggregate), or non-residential assets into a house (Section 86).
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
