"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HybridInput from "@/components/ui/HybridInput";
import ResultHero from "@/components/ui/ResultHero";
import StickyResultBar from "@/components/ui/StickyResultBar";
import CalcPageSkeleton from "@/components/ui/CalcPageSkeleton";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import SaveCalculationButton from "@/components/SaveCalculationButton";
import ShareButton from "@/components/ui/ShareButton";
import InsightCard from "@/components/ui/InsightCard";
import { calcCarTCO } from "@/lib/math";
import type { CarTCOInput } from "@/lib/math";
import { getCarTCOInsights } from "@/lib/insights";
import { formatINR } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { Car, Fuel, Wrench, Shield, TrendingDown } from "lucide-react";

const CarTcoChart = dynamic(
  () => import("@/components/calculators/car-tco/CarTcoChart"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export default function CarTcoCalculator() {
  const [mounted, setMounted] = useState(false);
  const [carOnRoadPrice, setCarOnRoadPrice] = useState(1500000);
  const [downPayment, setDownPayment] = useState(300000);
  const [loanInterestRate, setLoanInterestRate] = useState(9.0);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [ownershipTenureYears, setOwnershipTenureYears] = useState(7);
  const [annualKmDriven, setAnnualKmDriven] = useState(12000);
  const [fuelMileageKmpl, setFuelMileageKmpl] = useState(15);
  const [fuelPricePerLitre, setFuelPricePerLitre] = useState(100);
  const [annualInsuranceCost, setAnnualInsuranceCost] = useState(35000);
  const [annualMaintenanceCost, setAnnualMaintenanceCost] = useState(15000);
  const [annualDepreciationPercent, setAnnualDepreciationPercent] = useState(15);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inputs: CarTCOInput = useMemo(
    () => ({
      carOnRoadPrice,
      downPayment,
      loanInterestRate,
      loanTenureYears,
      ownershipTenureYears,
      annualKmDriven,
      fuelMileageKmpl,
      fuelPricePerLitre,
      annualInsuranceCost,
      annualMaintenanceCost,
      annualDepreciationPercent,
    }),
    [
      carOnRoadPrice,
      downPayment,
      loanInterestRate,
      loanTenureYears,
      ownershipTenureYears,
      annualKmDriven,
      fuelMileageKmpl,
      fuelPricePerLitre,
      annualInsuranceCost,
      annualMaintenanceCost,
      annualDepreciationPercent,
    ]
  );

  const debouncedInputs = useDebounce(inputs, 150);
  const result = useMemo(() => calcCarTCO(debouncedInputs), [debouncedInputs]);
  const insights = useMemo(() => getCarTCOInsights(result), [result]);

  if (!mounted) {
    return <CalcPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cost Components */}
        <div className="lg:col-span-6 space-y-5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <Car className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground text-base">
              Vehicle Purchase & Loan Parameters
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <HybridInput
                label="On-Road Vehicle Price"
                hint="Ex-showroom + RTO tax + insurance"
                value={carOnRoadPrice}
                onChange={setCarOnRoadPrice}
                min={200000}
                max={20000000}
                step={50000}
                prefix="₹"
              />

              <HybridInput
                label="Down Payment (Upfront Cash)"
                hint="Initial cash paid from savings"
                value={downPayment}
                onChange={setDownPayment}
                min={0}
                max={carOnRoadPrice}
                step={50000}
                prefix="₹"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <HybridInput
                label="Loan Rate (%)"
                hint="Car loan interest rate"
                value={loanInterestRate}
                onChange={setLoanInterestRate}
                min={5}
                max={20}
                step={0.25}
                suffix="%"
              />

              <HybridInput
                label="Loan Tenure"
                hint="Financing duration in years"
                value={loanTenureYears}
                onChange={setLoanTenureYears}
                min={1}
                max={8}
                step={1}
                suffix="Y"
              />

              <HybridInput
                label="Ownership Period"
                hint="Planned ownership horizon in years"
                value={ownershipTenureYears}
                onChange={setOwnershipTenureYears}
                min={1}
                max={15}
                step={1}
                suffix="Y"
              />
            </div>

            <div className="pt-2 border-t border-border/40 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Running & Maintenance Costs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <HybridInput
                  label="Annual Driving (Km)"
                  hint="Estimated distance driven per year"
                  value={annualKmDriven}
                  onChange={setAnnualKmDriven}
                  min={1000}
                  max={100000}
                  step={1000}
                  suffix="km"
                />

                <HybridInput
                  label="Fuel Mileage (km/L)"
                  hint="Real-world fuel efficiency"
                  value={fuelMileageKmpl}
                  onChange={setFuelMileageKmpl}
                  min={5}
                  max={45}
                  step={0.5}
                  suffix="km/L"
                />

                <HybridInput
                  label="Fuel Price (₹/L)"
                  hint="Petrol/diesel or unit EV rate"
                  value={fuelPricePerLitre}
                  onChange={setFuelPricePerLitre}
                  min={5}
                  max={200}
                  step={1}
                  prefix="₹"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <HybridInput
                  label="Yearly Insurance (₹)"
                  hint="Annual motor insurance premium"
                  value={annualInsuranceCost}
                  onChange={setAnnualInsuranceCost}
                  min={5000}
                  max={200000}
                  step={2000}
                  prefix="₹"
                />

                <HybridInput
                  label="Yearly Service & Maint (₹)"
                  hint="Servicing, tyres, wear & tear"
                  value={annualMaintenanceCost}
                  onChange={setAnnualMaintenanceCost}
                  min={2000}
                  max={200000}
                  step={2000}
                  prefix="₹"
                />

                <HybridInput
                  label="Annual Depreciation (%)"
                  hint="Expected depreciation rate (12% - 18% p.a.)"
                  value={annualDepreciationPercent}
                  onChange={setAnnualDepreciationPercent}
                  min={5}
                  max={40}
                  step={1}
                  suffix="%"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Hero, Visualizations & Insights */}
        <div className="lg:col-span-6 space-y-5">
          <ResultHero
            label="Net Total Cost of Ownership (TCO)"
            value={result.netTotalCostOfOwnership}
            formatValue={(val) => formatINR(val)}
            breakdown={[
              { label: "Purchase & Loan Interest", value: result.totalEmiPaid + result.downPayment, color: "blue" },
              { label: "Fuel & Maintenance", value: result.totalFuelCost + result.totalMaintenanceCost + result.totalInsuranceCost, color: "red" },
              { label: "Resale Recovery", value: result.estimatedResaleValue, color: "green" },
            ]}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">True Cost / Km</p>
              <p className="text-base font-bold text-foreground mt-0.5">
                ₹{result.costPerKm}/km
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Effective Monthly Cost</p>
              <p className="text-base font-bold text-rose-400 mt-0.5">
                {formatINR(result.effectiveMonthlyCost)}/mo
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Monthly EMI</p>
              <p className="text-base font-bold text-primary mt-0.5">
                {formatINR(result.monthlyEmi)}/mo
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Resale Value</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {formatINR(result.estimatedResaleValue)}
              </p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              Annual Outflow & Resale Value Trajectory
            </h3>
            <div className="h-56">
              <CarTcoChart yearlyBreakdown={result.yearlyBreakdown} />
            </div>
          </div>

          {/* Dynamic Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.map((item, idx) => (
              <InsightCard key={idx} {...item} />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <SaveCalculationButton
              calcType="car-loan-tco"
              data={{
                inputs: inputs as unknown as Record<string, unknown>,
                results: result as unknown as Record<string, unknown>,
              }}
              onSaved={(id) => setShareId(id)}
            />
            <ShareButton shareId={shareId} />
          </div>
        </div>
      </div>

      <StickyResultBar
        label="Net Lifetime TCO"
        value={result.netTotalCostOfOwnership}
      />
    </div>
  );
}
