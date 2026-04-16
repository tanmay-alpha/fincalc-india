import { Metadata } from "next";
import PPFCalculator from "@/components/calculators/ppf/PPFCalculator";

export const metadata: Metadata = {
  title: "PPF Calculator | FinCalc India",
  description: "Calculate Public Provident Fund (PPF) maturity value and tax-free interest over a 15+ year period.",
  openGraph: {
    title: "PPF Calculator | FinCalc India",
    description: "Calculate Public Provident Fund (PPF) maturity value and tax-free interest.",
    type: "website",
  }
};

export default function Page() {
  return <PPFCalculator />;
}
