import type { Metadata } from "next";
import LrsTcsCalculator from "@/components/calculators/lrs-tcs/LrsTcsCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "LRS TCS Calculator India — Foreign Remittance Tax Collected at Source",
  description:
    "Calculate exact TCS (Tax Collected at Source) on foreign remittances under RBI Liberalised Remittance Scheme (LRS) for investments, travel, and education.",
  keywords: [
    "lrs tcs calculator india",
    "liberalised remittance scheme tcs 20 percent",
    "foreign stock remittance tcs",
    "overseas tour package tcs rate",
    "education loan foreign remittance tcs",
  ],
};

export default function LrsTcsPage() {
  return (
    <CalculatorPageShell
      id="lrs-tcs"
      badge="Section 394 / FA 2026"
      regulatoryMetadata={{
        taxYear: "2026–27",
        currentAct: "Income-tax Act, 2025 & Finance Act, 2026",
        currentSections: [
          "Section 394 of the Income-tax Act, 2025 (formerly Section 206C(1G) of the Income-tax Act, 1961)",
        ],
        legacySections: ["Section 206C(1G)"],
        effectiveFrom: "01 April 2026",
        officialSources: [
          "Income Tax Department of India (incometax.gov.in)",
          "Reserve Bank of India — Liberalised Remittance Scheme (LRS)",
        ],
      }}
      assumptions={[
        "Calculates Tax Collected at Source (TCS) under Section 394 of the Income-tax Act, 2025 (formerly Section 206C(1G) of the Income-tax Act, 1961).",
        "Statutory remittance threshold of ₹10 Lakh applies aggregated across all authorized dealer banks per fiscal year.",
        "TCS collected is not an additional tax cost — it can be adjusted against advance tax liability or claimed as a refund in your annual Income Tax Return (ITR).",
      ]}
      sources={[
        {
          label: "Income Tax Department — Section 394 TCS Guidelines",
          url: "https://incometax.gov.in/",
        },
        {
          label: "Reserve Bank of India — Liberalised Remittance Scheme (LRS)",
          url: "https://rbi.org.in/",
        },
      ]}
    >
      <LrsTcsCalculator />
    </CalculatorPageShell>
  );
}
