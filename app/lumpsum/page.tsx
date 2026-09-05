import LumpsumCalculator from "@/components/calculators/lumpsum/LumpsumCalculator";
import LumpsumInfo from "@/components/seo/LumpsumInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata = {
  title: 'Lumpsum Calculator',
  description: 'Calculate returns on one-time lumpsum investment. Compare lumpsum vs SIP returns and see CAGR on your investment.',
  openGraph: {
    title: 'Lumpsum Calculator — FinCalc India',
    description: 'Free lumpsum investment calculator with CAGR and SIP comparison.',
  }
}

export default function LumpsumPage() {
  return (
    <CalculatorPageShell
      id="lumpsum"
      badge="One-Time Wealth"
      assumptions={[
        "Compounding is calculated on an annual compounding basis over the entire investment horizon.",
        "Assumed annual rate of return remains constant; actual mutual fund/equity returns vary year-to-year.",
        "Inflation adjustment calculates the real purchasing power of the future corpus.",
        "Capital gains taxes (LTCG / STCG) are not deducted from gross projections.",
      ]}
      sources={[
        { label: "AMFI India — Lump Sum vs SIP", url: "https://www.amfiindia.com/" },
        { label: "SEBI Investor Education Portal", url: "https://investor.sebi.gov.in/" },
      ]}
      educationalContent={<LumpsumInfo />}
    >
      <LumpsumCalculator />
    </CalculatorPageShell>
  );
}
