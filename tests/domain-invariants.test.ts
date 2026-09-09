import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  calcEMI,
  calcFD,
  calcPPF,
  calcDCF,
  calcLumpsum,
  calcSIP,
} from "../lib/math";

describe("Domain Invariant & Edge Case Tests", () => {
  it("EMI Invariant: Loan amortization schedule fully pays off principal at final month", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10_000, max: 10_000_000 }),
        fc.double({ min: 5, max: 24, noNaN: true }),
        fc.integer({ min: 12, max: 360 }),
        (principal, annualRate, tenureMonths) => {
          const res = calcEMI({
            principal,
            annualRate,
            tenureMonths,
          });

          expect(res.amortizationSchedule.length).toBe(tenureMonths);

          const finalMonth = res.amortizationSchedule[tenureMonths - 1];
          // Final balance must be 0 within integer rounding tolerance (≤ ₹1)
          expect(Math.abs(finalMonth.balance)).toBeLessThanOrEqual(1);

          // Total principal paid across schedule must equal the original principal
          const sumPrincipalPaid = res.amortizationSchedule.reduce(
            (acc, m) => acc + m.principal,
            0
          );
          expect(Math.abs(sumPrincipalPaid - principal)).toBeLessThanOrEqual(
            tenureMonths
          );
        }
      ),
      { numRuns: 50 }
    );
  });

  it("FD Invariant: Maturity amount exceeds principal when rate and tenure are positive", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000, max: 10_000_000 }),
        fc.double({ min: 1, max: 15, noNaN: true }),
        fc.integer({ min: 1, max: 20 }),
        fc.constantFrom(1, 2, 4, 12 as const),
        (principal, annualRate, tenureYears, compoundingFrequency) => {
          const res = calcFD({
            principal,
            annualRate,
            tenureYears,
            compoundingFrequency,
          });

          expect(res.maturityAmount).toBeGreaterThan(principal);
          expect(res.totalInterest).toBeGreaterThan(0);
          expect(res.effectiveAnnualYield).toBeGreaterThanOrEqual(
            Math.round(annualRate * 100) / 100 - 0.02
          );
          expect(res.totalReturnPct).toBeGreaterThan(0);

          if (res.growthData.length > 0) {
            const finalPoint = res.growthData[res.growthData.length - 1];
            expect(Math.abs(finalPoint.amount - res.maturityAmount)).toBeLessThanOrEqual(1);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("PPF Invariant: Statutory lock-in and withdrawal rules are strictly maintained", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 500, max: 150_000 }),
        fc.integer({ min: 15, max: 40 }),
        fc.double({ min: 6.0, max: 8.5, noNaN: true }),
        (yearlyInvestment, years, rate) => {
          const res = calcPPF({
            yearlyInvestment,
            years,
            rate,
          });

          expect(res.totalInvested).toBe(yearlyInvestment * years);
          expect(res.totalInterest).toBeGreaterThan(0);
          expect(res.maturityValue).toBe(res.totalInvested + res.totalInterest);

          // Partial withdrawal is only allowed starting year 7
          for (const row of res.yearlyData) {
            if (row.year < 7) {
              expect(row.withdrawalAllowed).toBe(false);
            } else {
              expect(row.withdrawalAllowed).toBe(true);
            }
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("DCF Invariant: Gordon Growth terminal value is invalid when terminal growth rate >= discount rate (g >= r)", () => {
    // 1. Invalid when g >= r
    const invalidDcf = calcDCF({
      fcfProjections: [1_000_000, 1_200_000, 1_400_000, 1_600_000, 1_800_000],
      terminalGrowthRate: 12,
      discountRate: 10, // r < g
      sharesOutstanding: 100_000,
      netDebt: 0,
    });
    expect(invalidDcf.isValid).toBe(false);
    expect(invalidDcf.errorMessage).toContain("strictly less than");
    expect(invalidDcf.enterpriseValue).toBe(0);

    // 2. Invalid when g === r
    const equalDcf = calcDCF({
      fcfProjections: [1_000_000, 1_200_000, 1_400_000, 1_600_000, 1_800_000],
      terminalGrowthRate: 10,
      discountRate: 10, // r === g
      sharesOutstanding: 100_000,
      netDebt: 0,
    });
    expect(equalDcf.isValid).toBe(false);

    // 3. Valid when g < r
    const validDcf = calcDCF({
      fcfProjections: [1_000_000, 1_200_000, 1_400_000, 1_600_000, 1_800_000],
      terminalGrowthRate: 4,
      discountRate: 11, // r > g
      sharesOutstanding: 100_000,
      netDebt: 0,
    });
    expect(validDcf.isValid).toBe(true);
    expect(validDcf.enterpriseValue).toBeGreaterThan(0);
    expect(validDcf.intrinsicValuePerShare).toBeGreaterThan(0);
  });

  it("Time Value Invariant: Lumpsum outperforms equivalent SIP when return rate is positive", () => {
    const principal = 1_200_000;
    const years = 10;
    const rate = 12;

    const lumpsum = calcLumpsum({
      principal,
      annualRate: rate,
      years,
    });

    const sip = calcSIP({
      monthlyAmount: principal / (years * 12), // ₹10,000/month
      annualRate: rate,
      years,
    });

    // Upfront compounding on whole amount outperforms gradual monthly deployment
    expect(lumpsum.totalCorpus).toBeGreaterThan(sip.totalCorpus);
  });
});
