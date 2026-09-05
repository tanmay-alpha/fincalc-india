import type { Metadata } from "next";
import LoanPrepaymentCalculator from "@/components/calculators/loan-prepayment/LoanPrepaymentCalculator";
import LoanPrepaymentInfo from "@/components/seo/LoanPrepaymentInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

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
    <CalculatorPageShell
      id="loan-prepayment"
      badge="Prepay vs Invest"
      assumptions={[
        "Prepayments directly reduce the outstanding principal balance on the reducing balance schedule.",
        "Zero foreclosure or part-prepayment penalties apply for individual borrowers on floating-rate home loans per RBI mandate.",
        "Alternative investment comparison models an equity mutual fund SIP compounding monthly at the specified rate.",
        "Tax benefits under Section 24(b) (₹2 Lakh interest cap under Old Regime) are not deducted from net interest savings.",
      ]}
      sources={[
        { label: "Reserve Bank of India — Foreclosure Charges Guidelines", url: "https://rbi.org.in/" },
        { label: "Income Tax Department — Section 24(b) Deductions", url: "https://incometax.gov.in/" },
      ]}
      educationalContent={<LoanPrepaymentInfo />}
    >
      <LoanPrepaymentCalculator />
    </CalculatorPageShell>
  );
}
