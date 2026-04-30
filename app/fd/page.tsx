import { Metadata } from "next";
import FDCalculator from "@/components/calculators/fd/FDCalculator";

export const metadata: Metadata = {
  title: "FD Calculator",
  description: "Calculate maturity amounts on Fixed Deposits (FDs) with options for monthly, quarterly, half-yearly, or annual compounding.",
  openGraph: {
    title: "FD Calculator | FinCalc India",
    description: "Calculate maturity amounts on Fixed Deposits (FDs) with compounding.",
    type: "website",
  }
};

export default function Page() {
  return <FDCalculator />;
}
