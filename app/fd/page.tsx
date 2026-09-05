
import FDCalculator from "@/components/calculators/fd/FDCalculator";
import FDInfo from "@/components/seo/FDInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata = {
  title: 'FD Calculator',
  description: 'Calculate Fixed Deposit maturity amount with monthly, quarterly, and annual compounding. See how ₹1 lakh grows in any FD.',
  openGraph: {
    title: 'FD Calculator — FinCalc India',
    description: 'Free FD maturity calculator with compounding frequency options.',
  }
}

export default function FDPage() {
  return (
    <CalculatorPageShell
      id="fd"
      badge="Fixed Returns"
      assumptions={[
        "Compounding interest is calculated based on chosen frequency (monthly, quarterly, half-yearly, annually).",
        "Quarterly compounding is the standard convention used by most Indian scheduled commercial banks.",
        "TDS (Tax Deducted at Source) under Section 194A is not automatically subtracted from the projected maturity.",
        "Senior citizen preferential rate increments (typically +0.50%) can be entered directly into the interest rate field.",
      ]}
      sources={[
        { label: "Reserve Bank of India — Deposit Rules", url: "https://rbi.org.in/" },
        { label: "Income Tax Department — Section 194A TDS on Interest", url: "https://incometax.gov.in/" },
      ]}
      educationalContent={<FDInfo />}
    >
      <FDCalculator />
    </CalculatorPageShell>
  );
}
