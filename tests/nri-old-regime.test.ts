import { describe, it, expect } from "vitest";
import { calcTax } from "../lib/math";

describe("Residency & Old Regime Slabs (CBDT Senior Exemption Rules)", () => {
  it("applies ₹3,00,000 basic exemption to Resident Senior Citizens (60-79) under Old Regime", () => {
    const res = calcTax({
      salaryIncome: 0,
      interestAndOtherIncome: 300000,
      regime: "old",
      residency: "resident_individual",
      ageCategory: "senior_60_to_79",
    });

    // For resident senior citizen, 0–3L is nil slab => tax = 0
    expect(res.slabTaxBeforeRebate).toBe(0);
    expect(res.totalTax).toBe(0);
  });

  it("applies ₹5,00,000 basic exemption to Resident Super Senior Citizens (80+) under Old Regime", () => {
    const res = calcTax({
      salaryIncome: 0,
      interestAndOtherIncome: 500000,
      regime: "old",
      residency: "resident_individual",
      ageCategory: "super_senior_80_plus",
    });

    // For resident super senior citizen, 0–5L is nil slab => tax = 0
    expect(res.slabTaxBeforeRebate).toBe(0);
    expect(res.totalTax).toBe(0);
  });

  it("strictly enforces ₹2,50,000 general basic exemption for NRIs regardless of age category under Old Regime", () => {
    // NRI senior citizen with ₹3,00,000 ordinary income
    const nriSenior = calcTax({
      salaryIncome: 0,
      interestAndOtherIncome: 300000,
      regime: "old",
      residency: "nri",
      ageCategory: "senior_60_to_79",
    });

    // NRI gets only ₹2.5L nil slab; ₹50,000 is taxed @ 5% = ₹2,500 + cess.
    // Also NRIs are not eligible for Section 156 / 87A rebate.
    expect(nriSenior.slabTaxBeforeRebate).toBe(2500);
    expect(nriSenior.totalTax).toBe(2600); // 2500 + 4% cess
  });

  it("strictly enforces ₹2,50,000 general basic exemption for NRI super senior citizens under Old Regime", () => {
    const nriSuperSenior = calcTax({
      salaryIncome: 0,
      interestAndOtherIncome: 500000,
      regime: "old",
      residency: "nri",
      ageCategory: "super_senior_80_plus",
    });

    // 0-2.5L nil, 2.5L-5.0L @ 5% = ₹12,500 + cess = ₹13,000 (No Section 156 rebate for NRI)
    expect(nriSuperSenior.slabTaxBeforeRebate).toBe(12500);
    expect(nriSuperSenior.totalTax).toBe(13000);
  });

  it("HRA exemption is capped to salary income (₹0 allowed if salary is ₹0)", () => {
    const res = calcTax({
      salaryIncome: 0,
      interestAndOtherIncome: 1000000,
      hraExemption: 200000,
      regime: "old",
    });

    // Since salary income is 0, HRA exemption cannot be claimed against other income
    expect(res.totalDeductions).toBe(0);
    expect(res.ordinaryTaxableIncome).toBe(1000000);
  });
});
