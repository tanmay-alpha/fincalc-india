/**
 * FinCalc India — Zod Validation Schemas
 *
 * One schema per calculator with descriptive error messages
 * and sensible min/max limits for Indian financial context.
 *
 * Uses Zod v4 API (message-based errors, no required_error / errorMap).
 */

import { z } from "zod";
import { MAX_INPUT_LIMITS } from "@/lib/constants/tax-year-2026-27";
import { CALCULATOR_INPUT_LIMITS } from "@/lib/constants/calculator-input-limits";

// ─── SIP ──────────────────────────────────────────────────────

export const sipSchema = z.object({
  monthlyAmount: z
    .number({ message: "Monthly investment is required" })
    .min(CALCULATOR_INPUT_LIMITS.sip.monthlyAmount.supported.min, "Minimum monthly investment is ₹100")
    .max(CALCULATOR_INPUT_LIMITS.sip.monthlyAmount.supported.max, "Maximum monthly investment is ₹1 Crore"),
  annualRate: z
    .number({ message: "Expected return rate is required" })
    .min(CALCULATOR_INPUT_LIMITS.sip.annualRate.supported.min, "Minimum rate is 0.1%")
    .max(CALCULATOR_INPUT_LIMITS.sip.annualRate.supported.max, "Maximum rate is 50%"),
  years: z
    .number({ message: "Time period is required" })
    .int("Time period must be a whole number")
    .min(CALCULATOR_INPUT_LIMITS.sip.years.supported.min, "Minimum period is 1 year")
    .max(CALCULATOR_INPUT_LIMITS.sip.years.supported.max, "Maximum period is 50 years"),
});

export type SipFormValues = z.infer<typeof sipSchema>;

// ─── EMI ──────────────────────────────────────────────────────

export const emiSchema = z.object({
  principal: z
    .number({ message: "Loan amount is required" })
    .min(CALCULATOR_INPUT_LIMITS.emi.principal.supported.min, "Minimum loan amount is ₹1,000")
    .max(CALCULATOR_INPUT_LIMITS.emi.principal.supported.max, "Maximum loan amount is ₹100 Crore"),
  annualRate: z
    .number({ message: "Interest rate is required" })
    .min(CALCULATOR_INPUT_LIMITS.emi.annualRate.supported.min, "Minimum rate is 0.1%")
    .max(CALCULATOR_INPUT_LIMITS.emi.annualRate.supported.max, "Maximum rate is 50%"),
  tenureMonths: z
    .number({ message: "Loan tenure is required" })
    .int("Tenure must be a whole number of months")
    .min(CALCULATOR_INPUT_LIMITS.emi.tenureMonths.supported.min, "Minimum tenure is 1 month")
    .max(CALCULATOR_INPUT_LIMITS.emi.tenureMonths.supported.max, "Maximum tenure is 600 months (50 years)"),
});

export type EmiFormValues = z.infer<typeof emiSchema>;

// ─── FD ───────────────────────────────────────────────────────

export const fdSchema = z.object({
  principal: z
    .number({ message: "Deposit amount is required" })
    .min(CALCULATOR_INPUT_LIMITS.fd.principal.supported.min, "Minimum deposit is ₹1,000")
    .max(CALCULATOR_INPUT_LIMITS.fd.principal.supported.max, "Maximum deposit is ₹100 Crore"),
  annualRate: z
    .number({ message: "Interest rate is required" })
    .min(CALCULATOR_INPUT_LIMITS.fd.annualRate.supported.min, "Minimum rate is 0.1%")
    .max(CALCULATOR_INPUT_LIMITS.fd.annualRate.supported.max, "Maximum rate is 20%"),
  tenureYears: z
    .number({ message: "Tenure is required" })
    .min(CALCULATOR_INPUT_LIMITS.fd.tenureYears.supported.min, "Minimum tenure is 3 months")
    .max(CALCULATOR_INPUT_LIMITS.fd.tenureYears.supported.max, "Maximum tenure is 30 years"),
  compoundingFrequency: z
    .union(
      [z.literal(1), z.literal(2), z.literal(4), z.literal(12)],
      { message: "Must be 1 (yearly), 2 (half-yearly), 4 (quarterly), or 12 (monthly)" }
    ),
});

export type FdFormValues = z.infer<typeof fdSchema>;

// ─── PPF ──────────────────────────────────────────────────────

export const ppfSchema = z.object({
  yearlyInvestment: z
    .number({ message: "Yearly investment is required" })
    .min(CALCULATOR_INPUT_LIMITS.ppf.yearlyInvestment.supported.min, "Minimum yearly investment is ₹500")
    .max(CALCULATOR_INPUT_LIMITS.ppf.yearlyInvestment.supported.max, "Maximum yearly investment is ₹1,50,000 (Section 80C limit)"),
  years: z
    .number({ message: "Time period is required" })
    .int("Time period must be a whole number")
    .min(CALCULATOR_INPUT_LIMITS.ppf.years.supported.min, "PPF has a minimum lock-in of 15 years")
    .max(CALCULATOR_INPUT_LIMITS.ppf.years.supported.max, "Maximum period is 50 years"),
  rate: z
    .number({ message: "PPF rate is required" })
    .min(CALCULATOR_INPUT_LIMITS.ppf.rate.supported.min, "Minimum rate is 1%")
    .max(CALCULATOR_INPUT_LIMITS.ppf.rate.supported.max, "Maximum rate is 15%"),
});

export type PpfFormValues = z.infer<typeof ppfSchema>;

// ─── LUMPSUM ──────────────────────────────────────────────────

export const lumpsumSchema = z.object({
  principal: z
    .number({ message: "Investment amount is required" })
    .min(CALCULATOR_INPUT_LIMITS.lumpsum.principal.supported.min, "Minimum investment is ₹100")
    .max(CALCULATOR_INPUT_LIMITS.lumpsum.principal.supported.max, "Maximum investment is ₹100 Crore"),
  annualRate: z
    .number({ message: "Expected return rate is required" })
    .min(CALCULATOR_INPUT_LIMITS.lumpsum.annualRate.supported.min, "Minimum rate is 0.1%")
    .max(CALCULATOR_INPUT_LIMITS.lumpsum.annualRate.supported.max, "Maximum rate is 50%"),
  years: z
    .number({ message: "Time period is required" })
    .int("Time period must be a whole number")
    .min(CALCULATOR_INPUT_LIMITS.lumpsum.years.supported.min, "Minimum period is 1 year")
    .max(CALCULATOR_INPUT_LIMITS.lumpsum.years.supported.max, "Maximum period is 50 years"),
});

export type LumpsumFormValues = z.infer<typeof lumpsumSchema>;

// ─── TAX ──────────────────────────────────────────────────────

const taxIncomeSchema = z
  .number({ message: "Income must be a number" })
  .finite("Income must be finite")
  .min(0, "Income cannot be negative")
  .max(MAX_INPUT_LIMITS.annualIncome, "Maximum income is ₹100 Crore");

const taxDeductionSchema = (maximum: number, label: string) =>
  z
    .number({ message: `${label} must be a number` })
    .finite(`${label} must be finite`)
    .min(0, `${label} cannot be negative`)
    .max(maximum, `${label} exceeds the supported limit`)
    .default(0);

export const taxSchema = z.object({
  // Retained only for legacy saved inputs. New callers provide actual income streams.
  grossIncome: taxIncomeSchema.optional(),
  salaryIncome: taxIncomeSchema.optional(),
  interestAndOtherIncome: taxIncomeSchema.default(0),
  dividendIncome: taxIncomeSchema.default(0),
  businessIncome: taxIncomeSchema.default(0),
  equityLtcg: taxIncomeSchema.default(0),
  equityStcg: taxIncomeSchema.default(0),
  otherLtcg: taxIncomeSchema.default(0),
  residency: z.enum(["resident_individual", "nri"], {
    message: "Only resident individual and NRI individual taxation are supported",
  }).default("resident_individual"),
  ageCategory: z.enum(["below_60", "senior_60_to_79", "super_senior_80_plus"], {
    message: "Select a supported age category",
  }).default("below_60"),
  regime: z.enum(["old", "new"], {
    message: "Select Old or New tax regime",
  }),
  deduction80C: taxDeductionSchema(150000, "Section 80C deduction"),
  deduction80D: taxDeductionSchema(100000, "Section 80D deduction"),
  deduction80CCD1B: taxDeductionSchema(50000, "Section 80CCD(1B) deduction"),
  hraExemption: taxDeductionSchema(MAX_INPUT_LIMITS.annualIncome, "HRA exemption"),
  otherDeductions: taxDeductionSchema(50_00_000, "Other deductions"),
});

export type TaxFormValues = z.infer<typeof taxSchema>;

// ─── Utility: generic validator ──────────────────────────────

/**
 * Validate input against a schema and return typed data or errors.
 * Useful in API routes.
 */
export function validateInput<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors as Record<string, string[]>,
  };
}
