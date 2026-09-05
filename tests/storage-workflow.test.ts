// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  getRestoredInputs,
  validateAndRestoreInputs,
  prepareOpenAgain,
} from "@/lib/storage-workflow";

const DEFAULT_SIP = {
  monthlyAmount: 5000,
  annualRate: 12,
  years: 10,
};

const DEFAULT_TAX = {
  salaryIncome: 1500000,
  regime: "new" as const,
  residency: "resident_individual" as const,
  ageCategory: "below_60" as const,
  interestAndOtherIncome: 0,
  dividendIncome: 0,
  businessIncome: 0,
  equityLtcg: 0,
  equityStcg: 0,
  otherLtcg: 0,
  deduction80C: 0,
  deduction80D: 0,
  deduction80CCD1B: 0,
  hraExemption: 0,
  otherDeductions: 0,
};

describe("Storage Workflow Restore State Validation", () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, "", "/sip");
  });

  it("restores valid saved inputs exactly", () => {
    const validSaved = {
      monthlyAmount: 25000,
      annualRate: 14.5,
      years: 15,
    };

    const restored = validateAndRestoreInputs("sip", validSaved, DEFAULT_SIP);
    expect(restored).toEqual(validSaved);

    // Also via sessionStorage
    prepareOpenAgain("sip", validSaved);
    const sessionRestored = getRestoredInputs("sip", DEFAULT_SIP);
    expect(sessionRestored).toEqual(validSaved);
  });

  it("restores valid URL query parameters exactly", () => {
    window.history.replaceState(
      {},
      "",
      "/sip?monthlyAmount=15000&annualRate=11.5&years=20"
    );

    const restored = getRestoredInputs("sip", DEFAULT_SIP);
    expect(restored).toEqual({
      monthlyAmount: 15000,
      annualRate: 11.5,
      years: 20,
    });
  });

  it("rejects malformed JSON in sessionStorage and safely falls back to defaults", () => {
    sessionStorage.setItem("fincalc_restore_inputs", "{ invalid_json: ");
    const restored = getRestoredInputs("sip", DEFAULT_SIP);
    expect(restored).toEqual(DEFAULT_SIP);
  });

  it("rejects wrong calculator ID in restore payload", () => {
    sessionStorage.setItem(
      "fincalc_restore_inputs",
      JSON.stringify({
        type: "emi",
        inputs: { principal: 5000000, annualRate: 8.5, tenureMonths: 240 },
      })
    );

    const restored = getRestoredInputs("sip", DEFAULT_SIP);
    expect(restored).toEqual(DEFAULT_SIP);
  });

  it("rejects invalid enum values and falls back safely to defaults", () => {
    const badEnumCandidate = {
      salaryIncome: 1200000,
      regime: "flat_rate_unsupported",
    };

    const restored = validateAndRestoreInputs("tax", badEnumCandidate, DEFAULT_TAX);
    expect(restored).toEqual(DEFAULT_TAX);
  });

  it("rejects negative values where prohibited", () => {
    const negativeCandidate = {
      monthlyAmount: -5000,
      annualRate: 12,
      years: 10,
    };

    const restored = validateAndRestoreInputs("sip", negativeCandidate, DEFAULT_SIP);
    expect(restored).toEqual(DEFAULT_SIP);
  });

  it("rejects values above maximum supported limits", () => {
    const aboveMaxCandidate = {
      monthlyAmount: 99_99_99_999, // Max allowed is 10,00,000
      annualRate: 12,
      years: 10,
    };

    const restored = validateAndRestoreInputs("sip", aboveMaxCandidate, DEFAULT_SIP);
    expect(restored).toEqual(DEFAULT_SIP);
  });

  it("rejects NaN values safely", () => {
    const nanCandidate = {
      monthlyAmount: NaN,
      annualRate: 12,
      years: 10,
    };

    const restored = validateAndRestoreInputs("sip", nanCandidate, DEFAULT_SIP);
    expect(restored).toEqual(DEFAULT_SIP);

    // Also via URL
    window.history.replaceState(
      {},
      "",
      "/sip?monthlyAmount=not_a_number&annualRate=12&years=10"
    );
    const urlRestored = getRestoredInputs("sip", DEFAULT_SIP);
    expect(urlRestored).toEqual(DEFAULT_SIP);
  });

  it("rejects Infinity values safely", () => {
    const infinityCandidate = {
      monthlyAmount: 5000,
      annualRate: Infinity,
      years: 10,
    };

    const restored = validateAndRestoreInputs("sip", infinityCandidate, DEFAULT_SIP);
    expect(restored).toEqual(DEFAULT_SIP);
  });

  it("rejects payloads containing unknown properties", () => {
    const unknownPropCandidate = {
      monthlyAmount: 10000,
      annualRate: 12,
      years: 10,
      maliciousScriptInjection: "<script>alert(1)</script>",
    };

    const restored = validateAndRestoreInputs("sip", unknownPropCandidate, DEFAULT_SIP);
    expect(restored).toEqual(DEFAULT_SIP);
  });

  it("rejects array instead of object", () => {
    const arrayPayload = [5000, 12, 10];
    const restored = validateAndRestoreInputs("sip", arrayPayload, DEFAULT_SIP);
    expect(restored).toEqual(DEFAULT_SIP);
  });

  it("rejects null payload safely", () => {
    const restored = validateAndRestoreInputs("sip", null, DEFAULT_SIP);
    expect(restored).toEqual(DEFAULT_SIP);
  });
});
