import type { Metadata } from "next";
import NoCostEMICalculator from "@/components/calculators/no-cost-emi/NoCostEMICalculator";
import NoCostEMIInfo from "@/components/seo/NoCostEMIInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "No-Cost EMI Truth & Hidden Cost Calculator",
  description:
    "Discover the true interest rate, 18% GST on interest, and hidden processing fees of No-Cost EMI on phones, laptops, and consumer electronics.",
  openGraph: {
    title: "No-Cost EMI Truth & APR Revealer — FinCalc India",
    description:
      "Find out if 0% interest EMI is really free or if paying upfront with a discount saves you thousands.",
  },
};

export default function NoCostEMIPage() {
  return (
    <CalculatorPageShell
      id="no-cost-emi"
      badge="APR & GST Revealer"
      assumptions={[
        "Retailers provide an upfront merchant discount equivalent to the loan interest charged by the bank.",
        "18% GST is levied by the bank on every month's interest component, which is not discounted.",
        "Upfront non-refundable card processing fees (plus 18% GST) significantly increase the effective Annual Percentage Rate (APR).",
        "Forfeited instant card cashbacks are factored as an opportunity cost against the zero-cost EMI option.",
      ]}
      sources={[
        { label: "Reserve Bank of India — Guidelines on Zero Percent Loan Schemes", url: "https://rbi.org.in/" },
        { label: "CBIC — GST on Financial & Banking Services", url: "https://cbic.gov.in/" },
      ]}
      educationalContent={<NoCostEMIInfo />}
    >
      <NoCostEMICalculator />
    </CalculatorPageShell>
  );
}
