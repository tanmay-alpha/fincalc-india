/**
 * FinCalc India — Zod Validation Schemas
 *
 * One schema per calculator with descriptive error messages
 * and sensible min/max limits for Indian financial context.
 *
 * Uses Zod v4 API (message-based errors, no required_error / errorMap).
 */

import { z } from "zod";

// ─── SIP ──────────────────────────────────────────────────────

export const sipSchema = z.object({
  monthlyAmount: z
    .number({ message: "Monthly investment is required" })
    .min(100, "Minimum monthly investment is ₹100")
    .max(10_00_000, "Maximum monthly investment is ₹10,00,000"),
  annualRate: z
    .number({ message: "Expected return rate is required" })
    .min(0.1, "Minimum rate is 0.1%")
    .max(50, "Maximum rate is 50%"),
  years: z
    .number({ message: "Time period is required" })
    .int("Time period must be a whole number")
    .min(1, "Minimum period is 1 year")
    .max(50, "Maximum period is 50 years"),
});

export type SipFormValues = z.infer<typeof sipSchema>;

// ─── EMI ──────────────────────────────────────────────────────

export const emiSchema = z.object({
  principal: z
    .number({ message: "Loan amount is required" })
    .min(1000, "Minimum loan amount is ₹1,000")
    .max(100_00_00_000, "Maximum loan amount is ₹100 Crore"),
  annualRate: z
    .number({ message: "Interest rate is required" })
    .min(0.1, "Minimum rate is 0.1%")
    .max(50, "Maximum rate is 50%"),
  tenureMonths: z
    .number({ message: "Loan tenure is required" })
    .int("Tenure must be a whole number of months")
    .min(1, "Minimum tenure is 1 month")
    .max(600, "Maximum tenure is 600 months (50 years)"),
});

export type EmiFormValues = z.infer<typeof emiSchema>;

// ─── FD ───────────────────────────────────────────────────────

export const fdSchema = z.object({
  principal: z
    .number({ message: "Deposit amount is required" })
    .min(1000, "Minimum deposit is ₹1,000")
    .max(100_00_00_000, "Maximum deposit is ₹100 Crore"),
  annualRate: z
    .number({ message: "Interest rate is required" })
    .min(0.1, "Minimum rate is 0.1%")
    .max(20, "Maximum rate is 20%"),
  tenureYears: z
    .number({ message: "Tenure is required" })
    .min(0.25, "Minimum tenure is 3 months")
    .max(30, "Maximum tenure is 30 years"),
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
    .min(500, "Minimum yearly investment is ₹500")
    .max(150000, "Maximum yearly investment is ₹1,50,000 (Section 80C limit)"),
  years: z
    .number({ message: "Time period is required" })
    .int("Time period must be a whole number")
    .min(15, "PPF has a minimum lock-in of 15 years")
    .max(50, "Maximum period is 50 years"),
  rate: z
    .number({ message: "PPF rate is required" })
    .min(1, "Minimum rate is 1%")
    .max(15, "Maximum rate is 15%"),
});

export type PpfFormValues = z.infer<typeof ppfSchema>;

// ─── LUMPSUM ──────────────────────────────────────────────────

export const lumpsumSchema = z.object({
  principal: z
    .number({ message: "Investment amount is required" })
    .min(100, "Minimum investment is ₹100")
    .max(100_00_00_000, "Maximum investment is ₹100 Crore"),
  annualRate: z
    .number({ message: "Expected return rate is required" })
    .min(0.1, "Minimum rate is 0.1%")
    .max(50, "Maximum rate is 50%"),
  years: z
    .number({ message: "Time period is required" })
    .int("Time period must be a whole number")
    .min(1, "Minimum period is 1 year")
    .max(50, "Maximum period is 50 years"),
});

export type LumpsumFormValues = z.infer<typeof lumpsumSchema>;

// ─── TAX ──────────────────────────────────────────────────────

export const taxSchema = z.object({
  grossIncome: z
    .number({ message: "Gross income is required" })
    .min(0, "Income cannot be negative")
    .max(100_00_00_000, "Maximum income is ₹100 Crore"),
  regime: z.enum(["old", "new"], {
    message: "Select Old or New tax regime",
  }),
  deduction80C: z
    .number()
    .min(0, "Cannot be negative")
    .max(150000, "Section 80C maximum is ₹1,50,000")
    .default(0),
  deduction80D: z
    .number()
    .min(0, "Cannot be negative")
    .max(100000, "Section 80D maximum is ₹1,00,000")
    .default(0),
  hraExemption: z
    .number()
    .min(0, "Cannot be negative")
    .max(10_00_000, "Maximum HRA exemption is ₹10,00,000")
    .default(0),
  otherDeductions: z
    .number()
    .min(0, "Cannot be negative")
    .max(50_00_000, "Maximum other deductions is ₹50,00,000")
    .default(0),
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
