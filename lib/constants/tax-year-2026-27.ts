/**
 * Single Source of Truth for Tax Year 2026-27 (Income Tax Act, 2025)
 * and all Financial Calculator Benchmarks, Rates, and Thresholds.
 */

// ─── TAX YEAR METADATA ────────────────────────────────────────
export const CURRENT_TAX_YEAR = "Tax Year 2026-27";
export const PREVIOUS_FY_LABEL = "FY 2026-27 (formerly AY 2027-28 / FY 2025-26)";
export const TAX_YEAR_NOTE = "Under the Income Tax Act, 2025 (effective 1 April 2026), the terminology has been modernized to 'Tax Year'.";
export const PENDING_SECTIONS_NOTE = "Section numbers under the Income Tax Act, 2025 are being finalized across tax platforms — labels shown reflect the pre-2025-Act numbering pending confirmation.";

// ─── INCOME TAX SLABS (NEW REGIME) ───────────────────────────
export const NEW_REGIME_SLABS_2026_27 = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.10 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.20 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: Infinity, rate: 0.30 },
] as const;

// ─── INCOME TAX SLABS (OLD REGIME) ───────────────────────────
export const OLD_REGIME_SLABS_2026_27 = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.20 },
  { min: 1000000, max: Infinity, rate: 0.30 },
] as const;

// ─── STANDARD DEDUCTIONS & REBATES ────────────────────────────
export const STANDARD_DEDUCTION_NEW_REGIME = 75000;
export const STANDARD_DEDUCTION_OLD_REGIME = 50000;

// Section 157 (formerly Section 87A) Rebate
export const REBATE_SECTION_157 = {
  sectionName: "Section 157 (formerly 87A)",
  newRegimeIncomeLimit: 1200000, // Up to ₹12L taxable income (excluding special rate gains)
  newRegimeMaxRebate: 60000,    // Full slab tax of ₹60,000 on ₹12L is wiped out
  oldRegimeIncomeLimit: 500000,
  oldRegimeMaxRebate: 12500,
} as const;

export const HEALTH_AND_EDUCATION_CESS_RATE = 0.04; // 4%

// Surcharge Slabs (New Regime)
export const SURCHARGE_SLABS_NEW_REGIME = [
  { min: 5000000, max: 10000000, rate: 0.10 },
  { min: 10000000, max: 20000000, rate: 0.15 },
  { min: 20000000, max: Infinity, rate: 0.25 },
] as const;

// ─── CAPITAL GAINS TAX RATES (TAX YEAR 2026-27) ──────────────
export const CAPITAL_GAINS_RATES = {
  // Listed Equity & Equity Mutual Funds
  equityLTCG: {
    rate: 0.125, // 12.5%
    exemptionThreshold: 125000, // ₹1.25 Lakh per financial year
    holdingPeriodMonthsLTCG: 12,
  },
  equitySTCG: {
    rate: 0.20, // 20%
    holdingPeriodMonthsSTCG: 12,
  },
  // Real Estate (Land & Building)
  realEstate: {
    unindexedLTCGRate: 0.125, // 12.5% without indexation
    indexedLTCGRate: 0.20,     // 20% with CII indexation (grandfathered pre-23 July 2024)
    holdingPeriodMonthsLTCG: 24,
    cutOffDate: "2024-07-23",
  },
  // Unlisted Shares & Other Assets
  unlistedEquity: {
    ltcgRate: 0.125,
    stcgSlab: true,
    holdingPeriodMonthsLTCG: 24,
  },
  debtMutualFunds: {
    taxation: "slab", // Taxed at investor slab rates
  },
} as const;

// ─── STT & F&O TRANSACTION CHARGES ───────────────────────────
// STT rates for Tax Year 2026-27 (effective 1 April 2026) and pre-April 2026
export const STT_RATES_F_AND_O = {
  tax_year_2026_27: {
    label: "Tax Year 2026-27 (from 1 Apr 2026)",
    futures: 0.0005, // 0.05% on sell turnover (increased from 0.02%)
    optionsPremiumSell: 0.0015, // 0.15% flat (unified rate)
    optionsExercise: 0.0015,    // 0.15% flat (unified rate)
  },
  pre_april_2026: {
    label: "Pre-April 2026 (Historical)",
    futures: 0.0002, // 0.02%
    optionsPremiumSell: 0.0010, // 0.10%
    optionsExercise: 0.00125,   // 0.125%
  },
} as const;

export const TRANSACTION_CHARGES = {
  gstRate: 0.18, // 18% GST on brokerage & exchange charges
  stampDutyEquityDelivery: 0.00015, // 0.015%
  stampDutyEquityIntraday: 0.00003, // 0.003%
  stampDutyFutures: 0.00002,        // 0.002%
  stampDutyOptions: 0.00003,        // 0.003%
  sebiTurnoverFee: 0.000001,        // ₹10 per crore (0.0001%)
  ipftRate: 0.000001,               // ₹10 per crore
  nseExchangeTurnoverRateFutures: 0.0000173,
  nseExchangeTurnoverRateOptions: 0.000350,
} as const;

// ─── PRESUMPTIVE TAXATION (SECTION 44AD / 44ADA) ─────────────
export const PRESUMPTIVE_TAX_CONSTANTS = {
  section44ADA: {
    rate: 0.50, // 50% presumptive profit
    baseTurnoverLimit: 5000000,    // ₹50 Lakhs
    enhancedTurnoverLimit: 7500000, // ₹75 Lakhs (if >= 95% digital receipts)
  },
  section44AD: {
    digitalProfitRate: 0.06, // 6% on digital/banking receipts
    cashProfitRate: 0.08,    // 8% on cash receipts
    baseTurnoverLimit: 20000000,    // ₹2 Crore
    enhancedTurnoverLimit: 30000000, // ₹3 Crore (if >= 95% digital receipts)
    optOutLockoutYears: 5,           // Section 44AD(4) lockout period
  },
} as const;

// ─── HRA EXEMPTION (SECTION 10(13A)) ─────────────────────────
export const HRA_CONSTANTS = {
  metroPercentage: 0.50,    // 50% of basic salary + DA (Delhi, Mumbai, Kolkata, Chennai)
  nonMetroPercentage: 0.40, // 40% of basic salary + DA
  salaryDeductionBase: 0.10, // 10% of basic salary + DA
  parentStatutoryDeductionSection24: 0.30, // 30% standard deduction on rental income for parents
} as const;

// ─── CAPITAL GAINS EXEMPTIONS (SECTION 54 / 54EC) ────────────
export const SECTION_54_CONSTANTS = {
  section54: {
    statutoryMaxCap: 100000000, // ₹10 Crore cap (Finance Act 2023)
    purchaseWindowPriorMonths: 12,  // 1 year before transfer
    purchaseWindowPostMonths: 24,   // 2 years after transfer
    constructionWindowPostMonths: 36, // 3 years after transfer
    lockInYears: 3,
  },
  section54EC: {
    statutoryMaxCap: 5000000, // ₹50 Lakhs per financial year
    investmentWindowMonths: 6, // strictly within 6 months
    lockInYears: 5,
    approxAnnualInterestRate: 0.0525, // ~5.25% p.a.
  },
} as const;

// ─── MAXIMUM INPUT LIMITS (HNI / UHNI SAFEGUARDS) ────────────
export const MAX_INPUT_LIMITS = {
  loanAmount: 500000000,        // ₹50 Crore (supports luxury & commercial real estate loans)
  sipMonthlyAmount: 10000000,   // ₹1 Crore / month SIP
  lumpsumInvestment: 1000000000,// ₹100 Crore lumpsum
  tradingCapital: 500000000,    // ₹50 Crore trading capital
  annualIncome: 1000000000,     // ₹100 Crore annual income
  capitalGain: 500000000,       // ₹50 Crore capital gains
  propertyCost: 1000000000,     // ₹100 Crore property
  tenureYears: 50,              // 50 years max tenure
} as const;
