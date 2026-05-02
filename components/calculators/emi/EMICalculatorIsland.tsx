"use client";

import dynamic from "next/dynamic";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";

const EMICalculator = dynamic(
  () => import("@/components/calculators/emi/EMICalculator"),
  { ssr: false, loading: () => <CalcPageSkeleton /> }
);

export default function EMICalculatorIsland() {
  return <EMICalculator />;
}
