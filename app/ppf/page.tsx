
import PPFCalculator from "@/components/calculators/ppf/PPFCalculator";
import PPFInfo from "@/components/seo/PPFInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata = {
  title: 'PPF Calculator',
  description: 'Calculate PPF (Public Provident Fund) corpus over 15 to 50 years. See year-by-year tax-free growth at 7.1% interest rate.',
  openGraph: {
    title: 'PPF Calculator — FinCalc India',
    description: 'Free PPF calculator with withdrawal eligibility and tax-free corpus projection.',
  }
}

export default function PPFPage() {
  return (
    <CalculatorPageShell
      id="ppf"
      badge="EEE Tax-Free"
      assumptions={[
        "Interest rate is assumed at the current government notified rate (7.1% p.a., compounded annually).",
        "Interest is calculated on the minimum balance between the 5th and the end of each month.",
        "Annual investment limit is minimum ₹500 and maximum ₹1,50,000 per financial year.",
        "Maturity lock-in period is 15 complete financial years, extendable in blocks of 5 years.",
        "Complete EEE status: Investments (under Old Regime 80C), interest earned, and maturity proceeds are 100% tax-exempt.",
      ]}
      sources={[
        { label: "National Savings Institute — PPF Scheme Rules", url: "https://www.nsiindia.gov.in/" },
        { label: "Ministry of Finance — Small Savings Interest Rates", url: "https://dea.gov.in/" },
      ]}
      educationalContent={<PPFInfo />}
    >
      <PPFCalculator />
    </CalculatorPageShell>
  );
}
