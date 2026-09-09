export interface NumericInputRange {
  min: number;
  max: number;
  step?: number;
}

export interface NumericInputContract {
  supported: NumericInputRange;
  ui: NumericInputRange;
}

export const CALCULATOR_INPUT_LIMITS = {
  sip: {
    monthlyAmount: {
      supported: { min: 100, max: 10_000_000 },
      ui: { min: 500, max: 10_000_000, step: 500 },
    },
    annualRate: {
      supported: { min: 0.1, max: 50 },
      ui: { min: 1, max: 40, step: 0.5 },
    },
    years: {
      supported: { min: 1, max: 50 },
      ui: { min: 1, max: 40, step: 1 },
    },
  },
  emi: {
    principal: {
      supported: { min: 1_000, max: 1_000_000_000 },
      ui: { min: 10_000, max: 1_000_000_000, step: 10_000 },
    },
    annualRate: {
      supported: { min: 0.1, max: 50 },
      ui: { min: 1, max: 36, step: 0.1 },
    },
    tenureMonths: {
      supported: { min: 1, max: 600 },
      ui: { min: 12, max: 360, step: 1 },
    },
  },
  fd: {
    principal: {
      supported: { min: 1_000, max: 1_000_000_000 },
      ui: { min: 1_000, max: 1_000_000_000, step: 5_000 },
    },
    annualRate: {
      supported: { min: 0.1, max: 20 },
      ui: { min: 1, max: 20, step: 0.1 },
    },
    tenureYears: {
      supported: { min: 0.25, max: 30 },
      ui: { min: 1, max: 30, step: 1 },
    },
  },
  ppf: {
    yearlyInvestment: {
      supported: { min: 500, max: 150_000 },
      ui: { min: 500, max: 150_000, step: 500 },
    },
    years: {
      supported: { min: 15, max: 50 },
      ui: { min: 15, max: 50, step: 1 },
    },
    rate: {
      supported: { min: 1, max: 15 },
      ui: { min: 1, max: 15, step: 0.1 },
    },
  },
  lumpsum: {
    principal: {
      supported: { min: 100, max: 1_000_000_000 },
      ui: { min: 1_000, max: 1_000_000_000, step: 10_000 },
    },
    annualRate: {
      supported: { min: 0.1, max: 50 },
      ui: { min: 1, max: 50, step: 0.5 },
    },
    years: {
      supported: { min: 1, max: 50 },
      ui: { min: 1, max: 50, step: 1 },
    },
  },
} as const;
