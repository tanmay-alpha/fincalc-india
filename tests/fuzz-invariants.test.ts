import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { calcTax, calcSIP, calcEMI, calcPositionSize } from "../lib/math";

describe("Property & Fuzz Invariant Tests (fast-check)", () => {
  it("Tax Invariant: Total tax is always non-negative and take-home pay is valid", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100000, max: 20000000 }),
        (salary) => {
          const res = calcTax({
            grossIncome: salary,
            salaryIncome: salary,
            residency: "resident_individual",
            regime: "new",
          });

          // 1. Tax is non-negative
          expect(res.totalTax).toBeGreaterThanOrEqual(0);

          // 2. Net take-home pay is positive
          const netTakeHome = res.monthlyTakeHome;
          expect(netTakeHome).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("SIP Invariant: Total invested strictly equals monthly investment * 12 * tenure", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 500, max: 500000 }),
        fc.double({ min: 1, max: 30, noNaN: true }),
        fc.integer({ min: 1, max: 30 }),
        (monthly, returnRate, tenure) => {
          const res = calcSIP({
            monthlyAmount: monthly,
            annualRate: returnRate,
            years: tenure,
          });

          const expectedInvested = monthly * 12 * tenure;
          expect(res.totalInvested).toBe(expectedInvested);
          expect(res.totalCorpus).toBeGreaterThanOrEqual(expectedInvested);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("EMI Invariant: Total payment equals EMI * tenureMonths within rounding tolerance and interest >= 0", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 50000, max: 50000000 }),
        fc.double({ min: 5, max: 20, noNaN: true }),
        fc.integer({ min: 1, max: 30 }),
        (principal, rate, tenureYears) => {
          const tenureMonths = tenureYears * 12;
          const res = calcEMI({
            principal,
            annualRate: rate,
            tenureMonths,
          });

          expect(res.emi).toBeGreaterThan(0);
          expect(Math.abs(res.totalPayment - res.emi * tenureMonths)).toBeLessThanOrEqual(tenureMonths);
          expect(res.totalInterest).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Position Size Invariant: Actual risk amount never exceeds maximum allowed risk budget", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10000, max: 10000000 }), // capital
        fc.double({ min: 0.5, max: 5.0, noNaN: true }), // risk%
        fc.double({ min: 50, max: 5000, noNaN: true }), // entry
        fc.double({ min: 0.1, max: 40, noNaN: true }), // stop distance %
        (capital, riskPct, entry, stopPct) => {
          const stopLoss = Math.max(1, entry * (1 - stopPct / 100));
          const res = calcPositionSize({
            capital,
            riskPercent: riskPct,
            entryPrice: entry,
            stopLossPrice: stopLoss,
            riskRewardRatio: 2,
          });

          if (res.isValid && res.quantity > 0) {
            expect(res.actualRiskAmount).toBeLessThanOrEqual(res.maxRiskAmount + 1); // +1 rounding tolerance
            expect(res.positionValue).toBeLessThanOrEqual(capital + 1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
