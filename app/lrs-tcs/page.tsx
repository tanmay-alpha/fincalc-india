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
      badge="FA 2026"
      assumptions={[
        "Calculates Tax Collected at Source (TCS) under Section 206C(1G) of the Income Tax Act.",
        "Statutory remittance threshold of ₹10 Lakh applies aggregated across all authorized dealer banks per fiscal year.",
        "TCS collected is not an additional tax cost — it can be adjusted against advance tax or refunded via ITR.",
      ]}
      sources={[
        {
          label: "Income Tax Department — Section 206C(1G) LRS TCS Guidelines",
          url: "https://incometaxindia.gov.in/",
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
