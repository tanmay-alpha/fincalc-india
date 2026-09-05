import SIPCalculator from "@/components/calculators/sip/SIPCalculator";
import SIPInfo from "@/components/seo/SIPInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata = {
  title: "SIP Calculator",
  description:
    "Calculate SIP returns with our free SIP calculator. See how ₹5,000/month grows to ₹11.6L in 10 years at 12% return. Year-by-year compound interest breakdown.",
  openGraph: {
    title: "SIP Calculator — FinCalc India",
    description:
      "Free SIP calculator for Indian mutual fund investors. Instant compound interest calculation.",
  },
};

export default function SIPPage() {
  return (
    <CalculatorPageShell
      id="sip"
      badge="Compounding Growth"
      assumptions={[
        "Monthly investments occur at the beginning of each calendar month.",
        "Compounding is calculated on a monthly compounding frequency.",
        "Returns are projected at a constant annualized rate; actual equity market returns will experience volatility.",
        "Taxation (e.g. 12.5% LTCG above ₹1.25 Lakh) and exit loads are not deducted from gross corpus projection.",
      ]}
      sources={[
        { label: "AMFI India — Understanding SIPs", url: "https://www.amfiindia.com/" },
        { label: "SEBI Investor Education", url: "https://investor.sebi.gov.in/" },
      ]}
      educationalContent={<SIPInfo />}
    >
      <SIPCalculator />
    </CalculatorPageShell>
  );
}
