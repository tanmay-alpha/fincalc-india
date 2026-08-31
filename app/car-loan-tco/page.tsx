import type { Metadata } from "next";
import CarTcoCalculator from "@/components/calculators/car-tco/CarTcoCalculator";

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
    <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Car Loan Total Cost of Ownership (TCO)
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Uncover the true all-inclusive financial commitment of buying a car — factoring in fuel inflation, yearly insurance, maintenance escalations, and residual resale depreciation.
        </p>
      </header>

      <CarTcoCalculator />
    </main>
  );
}
