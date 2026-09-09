import { describe, it, expect } from "vitest";
import { CALCULATOR_INPUT_LIMITS } from "@/lib/constants/calculator-input-limits";
import {
  sipSchema,
  emiSchema,
  fdSchema,
  ppfSchema,
  lumpsumSchema,
} from "@/lib/validations";

describe("CALCULATOR_INPUT_LIMITS & Schema Parity", () => {
  it("enforces that ui limits are valid sub-ranges of supported limits", () => {
    for (const [calcName, params] of Object.entries(CALCULATOR_INPUT_LIMITS)) {
      for (const [paramName, config] of Object.entries(params)) {
        const { supported, ui } = config;

        expect(
          supported.min,
          `${calcName}.${paramName}: supported.min must be <= supported.max`
        ).toBeLessThan(supported.max);

        expect(
          ui.min,
          `${calcName}.${paramName}: ui.min must be <= ui.max`
        ).toBeLessThan(ui.max);

        expect(
          ui.min,
          `${calcName}.${paramName}: ui.min (${ui.min}) must be >= supported.min (${supported.min})`
        ).toBeGreaterThanOrEqual(supported.min);

        expect(
          ui.max,
          `${calcName}.${paramName}: ui.max (${ui.max}) must be <= supported.max (${supported.max})`
        ).toBeLessThanOrEqual(supported.max);

        if (ui.step !== undefined) {
          expect(
            ui.step,
            `${calcName}.${paramName}: ui.step must be positive`
          ).toBeGreaterThan(0);
        }
      }
    }
  });

  describe("SIP validation schema limits", () => {
    it("accepts valid boundaries including ₹1 Crore monthly investment", () => {
      const validSip = {
        monthlyAmount: 10_000_000, // ₹1 Crore
        annualRate: 12,
        years: 10,
      };
      const result = sipSchema.safeParse(validSip);
      expect(result.success).toBe(true);
    });

    it("accepts minimum supported monthly amount ₹100", () => {
      const minSip = {
        monthlyAmount: 100,
        annualRate: 12,
        years: 10,
      };
      const result = sipSchema.safeParse(minSip);
      expect(result.success).toBe(true);
    });

    it("rejects amounts below supported min or above supported max", () => {
      expect(
        sipSchema.safeParse({ monthlyAmount: 99, annualRate: 12, years: 10 }).success
      ).toBe(false);

      expect(
        sipSchema.safeParse({
          monthlyAmount: 10_000_001,
          annualRate: 12,
          years: 10,
        }).success
      ).toBe(false);
    });
  });

  describe("EMI validation schema limits", () => {
    it("accepts principal up to ₹100 Crore", () => {
      const validEmi = {
        principal: 1_000_000_000,
        annualRate: 8.5,
        tenureMonths: 240,
      };
      expect(emiSchema.safeParse(validEmi).success).toBe(true);
    });

    it("accepts min principal ₹1,000", () => {
      const minEmi = {
        principal: 1000,
        annualRate: 8.5,
        tenureMonths: 12,
      };
      expect(emiSchema.safeParse(minEmi).success).toBe(true);
    });
  });

  describe("FD validation schema limits", () => {
    it("accepts principal up to ₹100 Crore", () => {
      const validFd = {
        principal: 1_000_000_000,
        annualRate: 7,
        tenureYears: 5,
        compoundingFrequency: 4,
      };
      expect(fdSchema.safeParse(validFd).success).toBe(true);
    });
  });

  describe("PPF validation schema limits", () => {
    it("accepts maximum statutory limit ₹1.5 Lakh and rejects ₹1,50,001", () => {
      const validPpf = {
        yearlyInvestment: 150_000,
        years: 15,
        rate: 7.1,
      };
      expect(ppfSchema.safeParse(validPpf).success).toBe(true);

      const invalidPpf = {
        yearlyInvestment: 150_001,
        years: 15,
        rate: 7.1,
      };
      expect(ppfSchema.safeParse(invalidPpf).success).toBe(false);
    });
  });

  describe("Lumpsum validation schema limits", () => {
    it("accepts principal up to ₹100 Crore", () => {
      const validLumpsum = {
        principal: 1_000_000_000,
        annualRate: 12,
        years: 10,
      };
      expect(lumpsumSchema.safeParse(validLumpsum).success).toBe(true);
    });
  });
});
