import { Metadata } from "next";
import LumpsumCalculator from "@/components/calculators/lumpsum/LumpsumCalculator";

export const metadata: Metadata = {
  title: "Lumpsum Calculator | FinCalc India",
  description: "Calculate future value of a one-time lumpsum investment. View wealth multipliers, absolute returns, and year-by-year growth curves.",
  openGraph: {
    title: "Lumpsum Calculator | FinCalc India",
    description: "Calculate expected returns from one-time lumpsum investments.",
    type: "website",
  }
};

export default function Page() {
  return <LumpsumCalculator />;
}
