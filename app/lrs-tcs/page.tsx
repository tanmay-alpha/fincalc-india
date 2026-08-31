import type { Metadata } from "next";
import LrsTcsCalculator from "@/components/calculators/lrs-tcs/LrsTcsCalculator";

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
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          LRS TCS & Foreign Remittance Calculator
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Calculate Section 206C(1G) Tax Collected at Source (TCS) on foreign remittances across investments, overseas travel, education loans, and medical treatment.
        </p>
      </header>

      <LrsTcsCalculator />
    </main>
  );
}
