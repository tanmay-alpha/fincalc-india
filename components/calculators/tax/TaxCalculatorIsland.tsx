"use client";

import dynamic from "next/dynamic";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";

const TaxCalculator = dynamic(
  () => import("@/components/calculators/tax/TaxCalculator"),
  { ssr: false, loading: () => <CalcPageSkeleton /> }
);

export default function TaxCalculatorIsland() {
  return <TaxCalculator />;
}
