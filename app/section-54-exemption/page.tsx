import type { Metadata } from "next";
import Section54Calculator from "@/components/calculators/section-54/Section54Calculator";
import Section54Info from "@/components/seo/Section54Info";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

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
    <CalculatorPageShell
      id="section-54-exemption"
      badge="Sections 82 / 85 / 86"
      regulatoryMetadata={{
        taxYear: "2026–27",
        currentAct: "Income-tax Act, 2025 as amended by Finance Act, 2026",
        currentSections: ["Section 82 (formerly 54)", "Section 85 (formerly 54EC)", "Section 86 (formerly 54F)"],
        effectiveFrom: "01 April 2026",
        officialSources: [
          "Income Tax Department — Capital Gains Exemption Provisions",
        ],
      }}
      assumptions={[
        "Section 82 (formerly Sec 54): Exemption on LTCG from residential house by investing into a residential house within 1 yr before / 2 yrs after sale (3 yrs for construction). Max deduction ₹10 Crore.",
        "Section 85 (formerly Sec 54EC): Exemption by investing LTCG from land or building into notified bonds (NHAI, REC, PFC, IRFC) within 6 months. Strict statutory ceiling of ₹50 Lakh per financial year.",
        "Section 86 (formerly Sec 54F): Exemption on LTCG from any asset other than house property by investing net consideration into a residential house. Pro-rata formula: LTCG × (Amount Invested / Net Consideration).",
        "Capital Gains Account Scheme (CGAS 1988): Funds must be deposited in designated bank account prior to Section 139(1) ITR filing due date.",
      ]}
      sources={[
        { label: "Income Tax Department — Section 54 Series Provisions", url: "https://incometax.gov.in/" },
      ]}
      educationalContent={<Section54Info />}
    >
      <Section54Calculator />
    </CalculatorPageShell>
  );
}
