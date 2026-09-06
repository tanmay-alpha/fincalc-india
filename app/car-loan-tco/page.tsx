import type { Metadata } from "next";
import CarTcoCalculator from "@/components/calculators/car-tco/CarTcoCalculator";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Car Loan Total Cost of Ownership (TCO) Calculator India — Real Cost Per Km",
  description:
    "Calculate the true total cost of owning a car in India including loan EMI, fuel mileage, insurance, maintenance, depreciation, and resale value.",
  keywords: [
    "car loan tco calculator india",
    "car total cost of ownership",
    "real cost per km car india",
    "car depreciation calculator",
    "true cost of car ownership",
  ],
};

export default function CarLoanTcoPage() {
  return (
    <CalculatorPageShell
      id="car-loan-tco"
      assumptions={[
        "Vehicle depreciation is modeled annually on the reducing market value of the vehicle.",
        "Fuel efficiency, maintenance, and replacement tires escalate with running mileage and general inflation.",
        "Insurance premiums reflect the reduction in Insured Declared Value (IDV) minus standard NCB accrual.",
      ]}
      sources={[
        {
          label: "Insurance Regulatory and Development Authority of India (IRDAI)",
          url: "https://irdai.gov.in/",
        },
      ]}
    >
      <CarTcoCalculator />
    </CalculatorPageShell>
  );
}
