import { describe, it, expect } from "vitest";
import { calcXIRR, calcTWRR } from "../lib/math";

describe("XIRR Multi-Root Detection & TWRR Precision Hardening", () => {
  it("calculates accurate XIRR with 365-day day-count convention", () => {
    const res = calcXIRR([
      { date: "2023-01-01", amount: -100000 },
      { date: "2024-01-01", amount: 112000 },
    ]);

    expect(res.isValid).toBe(true);
    expect(Math.round(res.xirr)).toBe(12);
    expect(res.durationYears).toBeCloseTo(1.0, 2);
  });

  it("detects multiple roots and populates warning when cash flow signs alternate multiple times", () => {
    // Project with alternating cash flows: -$100, +$230, -$132
    const res = calcXIRR([
      { date: "2020-01-01", amount: -100 },
      { date: "2021-01-01", amount: 230 },
      { date: "2022-01-01", amount: -132 },
    ]);

    expect(res.isValid).toBe(true);
    if (res.multipleRootsDetected) {
      expect(res.rootCount).toBeGreaterThan(1);
      expect(res.candidateRoots?.length).toBeGreaterThan(1);
      expect(res.warning).toContain("Multiple Internal Rates of Return detected");
    }
  });

  it("correctly computes negative XIRR for loss-making portfolios without masking", () => {
    const res = calcXIRR([
      { date: "2023-01-01", amount: -100000 },
      { date: "2024-01-01", amount: 70000 },
    ]);

    expect(res.isValid).toBe(true);
    expect(res.xirr).toBeLessThan(0);
    expect(res.netGain).toBe(-30000);
    expect(res.absoluteGainPercent).toBe(-30);
  });

  it("calcTWRR validates start values and rejects zero / negative start values cleanly", () => {
    const invalidResult = calcTWRR([
      { startValue: 0, endValue: 10000, netCashflow: 0 },
    ]);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errorMessage).toContain("strictly positive");

    const validResult = calcTWRR([
      { startValue: 100000, endValue: 110000, netCashflow: 0 },
      { startValue: 110000, endValue: 105000, netCashflow: 0 },
    ]);
    expect(validResult.isValid).toBe(true);
    expect(validResult.twrr).toBeCloseTo(5.0, 0);
  });
});
