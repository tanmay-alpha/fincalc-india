import type { Metadata } from "next";
import LoanPrepaymentCalculator from "@/components/calculators/loan-prepayment/LoanPrepaymentCalculator";
import LoanPrepaymentInfo from "@/components/seo/LoanPrepaymentInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";

export const metadata: Metadata = {
  title: "Loan Pre-Payment & Prepay vs Invest Calculator",
  description:
    "Calculate interest and tenure saved by prepaying home or car loans. Compare prepaying loan vs investing that extra money in mutual funds.",
  openGraph: {
    title: "Loan Pre-Payment vs Investment Calculator — FinCalc India",
    description:
      "Find out how much interest you save with 1 extra EMI or monthly prepayment vs investing in equity SIP.",
  },
};

export default function LoanPrepaymentPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Loan Pre-Payment Calculator" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">🏦</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Loan Pre-Payment vs Invest Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Simulate how making extra loan payments slashes your debt tenure and saves lakhs in interest vs investing the difference in mutual funds.
          </p>
        </div>

        <LoanPrepaymentCalculator />
        <LoanPrepaymentInfo />
        <CalculatorDisclaimer />
        <RelatedCalculators current="loan-prepayment" />
      </div>
    </main>
  );
}
