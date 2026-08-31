/**
 * FinCalc India — Engine v2 Single Source of Truth (SSOT)
 * Canonical constants, tax slabs, statutory thresholds, CII series, STT, and regulatory benchmarks.
 * Sourced directly from:
 * - Income Tax Act, 2025 / Finance Acts (CBDT / Ministry of Finance)
 * - Reserve Bank of India (RBI) notifications (LRS, FEMA)
 * - Securities and Exchange Board of India (SEBI) & NSE/BSE master circulars
 * - Pension Fund Regulatory and Development Authority (PFRDA)
 */

// ─── 1. TAX YEAR & LEGISLATIVE METADATA ─────────────────────────
export const CURRENT_TAX_YEAR = "Tax Year 2026-27";
export const PREVIOUS_FY_LABEL = "FY 2026-27 (formerly AY 2027-28 / FY 2025-26)";
export const TAX_YEAR_NOTE = "Under the Income Tax Act, 2025 (effective 1 April 2026), the terminology has been modernized to a single 'Tax Year'.";
export const PENDING_SECTIONS_NOTE = "Section numbers under the Income Tax Act, 2025 are noted alongside legacy pre-2025 Act references for clarity.";

// ─── 2. INCOME TAX SLABS (TAX YEAR 2026-27) ─────────────────────
// Source: Income Tax Act, 2025 / Budget 2025-26 New Regime Rates
export const NEW_REGIME_SLABS_2026_27 = [
  { min: 0, max: 400000, rate: 0.00, label: "₹0 to ₹4 Lakhs" },
  { min: 400000, max: 800000, rate: 0.05, label: "₹4 Lakhs to ₹8 Lakhs" },
  { min: 800000, max: 1200000, rate: 0.10, label: "₹8 Lakhs to ₹12 Lakhs" },
  { min: 1200000, max: 1600000, rate: 0.15, label: "₹12 Lakhs to ₹16 Lakhs" },
  { min: 1600000, max: 2000000, rate: 0.20, label: "₹16 Lakhs to ₹20 Lakhs" },
  { min: 2000000, max: 2400000, rate: 0.25, label: "₹20 Lakhs to ₹24 Lakhs" },
  { min: 2400000, max: Infinity, rate: 0.30, label: "Above ₹24 Lakhs" },
] as const;

// Source: Legacy Old Tax Regime Rates (Retained as optional choice)
export const OLD_REGIME_SLABS_2026_27 = [
  { min: 0, max: 250000, rate: 0.00, label: "₹0 to ₹2.5 Lakhs" },
  { min: 250000, max: 500000, rate: 0.05, label: "₹2.5 Lakhs to ₹5 Lakhs" },
  { min: 500000, max: 1000000, rate: 0.20, label: "₹5 Lakhs to ₹10 Lakhs" },
  { min: 1000000, max: Infinity, rate: 0.30, label: "Above ₹10 Lakhs" },
] as const;

// ─── 3. STANDARD DEDUCTION & REBATE ─────────────────────────────
export const STANDARD_DEDUCTION_NEW_REGIME = 75000; // ₹75,000 for salaried & pensioners in New Regime
export const STANDARD_DEDUCTION_OLD_REGIME = 50000; // ₹50,000 in Old Regime

/**
 * Section 157 (formerly Section 87A) Tax Rebate:
 * - New Regime: Available if Total Taxable Income <= ₹12,00,000. Maximum rebate = ₹60,000.
 *   CRITICAL STATUTORY RULE: Special-rate capital gains (111A, 112A, 112) are NOT reduced by rebate.
 * - Old Regime: Available if Total Taxable Income <= ₹5,00,000. Maximum rebate = ₹12,500.
 */
export const REBATE_SECTION_157 = {
  sectionName: "Section 157 (formerly 87A)",
  newRegimeIncomeLimit: 1200000,
  newRegimeMaxRebate: 60000,
  oldRegimeIncomeLimit: 500000,
  oldRegimeMaxRebate: 12500,
} as const;

export const HEALTH_AND_EDUCATION_CESS_RATE = 0.04; // 4% flat on (Tax + Surcharge after Marginal Relief)

// ─── 4. HIGH-INCOME SURCHARGE & MARGINAL RELIEF ─────────────────
/**
 * Statutory Surcharge Tiers:
 * - New Regime: Max Surcharge is strictly capped at 25% (NO 37% tier exists in New Regime).
 * - Old Regime: 10% (>50L), 15% (>1Cr), 25% (>2Cr), 37% (>5Cr).
 * - Special Rate Income (111A, 112, 112A, Dividends): Capped at statutory maximum of 15%.
 */
export const SURCHARGE_SLABS_NEW_REGIME = [
  { min: 0, max: 5000000, rate: 0.00 },
  { min: 5000000, max: 10000000, rate: 0.10 },
  { min: 10000000, max: 20000000, rate: 0.15 },
  { min: 20000000, max: Infinity, rate: 0.25 },
] as const;

export const SURCHARGE_SLABS_OLD_REGIME = [
  { min: 0, max: 5000000, rate: 0.00 },
  { min: 5000000, max: 10000000, rate: 0.10 },
  { min: 10000000, max: 20000000, rate: 0.15 },
  { min: 20000000, max: 50000000, rate: 0.25 },
  { min: 50000000, max: Infinity, rate: 0.37 },
] as const;

export const SPECIAL_RATE_MAX_SURCHARGE = 0.15; // 15% cap on equity LTCG (112A), STCG (111A), and dividend income

export const MARGINAL_RELIEF_THRESHOLDS = {
  newRegime: [5000000, 10000000, 20000000],
  oldRegime: [5000000, 10000000, 20000000, 50000000],
} as const;

// ─── 5. CAPITAL GAINS TAX RATES (TAX YEAR 2026-27) ──────────────
export const CAPITAL_GAINS_RATES = {
  // Listed Equity & Equity Oriented Mutual Funds
  equityLTCG: {
    rate: 0.125, // 12.5% (Finance Act 2024 amendment)
    exemptionThreshold: 125000, // ₹1.25 Lakh aggregate annual exemption under Section 112A
    holdingPeriodMonthsLTCG: 12,
  },
  equitySTCG: {
    rate: 0.20, // 20% under Section 111A (Finance Act 2024 amendment)
    holdingPeriodMonthsSTCG: 12,
  },
  // Real Estate (Land & Buildings)
  realEstate: {
    unindexedLTCGRate: 0.125, // 12.5% without indexation
    indexedLTCGRate: 0.20,     // 20% with CII indexation (Grandfathered for pre-23 July 2024 acquisitions)
    holdingPeriodMonthsLTCG: 24,
    cutOffDate: "2024-07-23",
  },
  // Unlisted Shares & Other Long Term Assets
  unlistedEquity: {
    ltcgRate: 0.125,
    stcgSlab: true,
    holdingPeriodMonthsLTCG: 24,
  },
  // Debt Mutual Funds (Specified Mutual Funds acquired after 1 April 2023)
  debtMutualFunds: {
    taxation: "slab", // Taxed at investor slab rates with no indexation benefit
  },
} as const;

// ─── 6. COST INFLATION INDEX (CII) CANONICAL SERIES ─────────────
// Source: Income Tax Department / CBDT Notifications (Base Year 2001-02 = 100)
export const CII_TABLE: Record<string | number, number> = {
  "2001-02": 100, 2001: 100,
  "2002-03": 105, 2002: 105,
  "2003-04": 109, 2003: 109,
  "2004-05": 113, 2004: 113,
  "2005-06": 117, 2005: 117,
  "2006-07": 122, 2006: 122,
  "2007-08": 129, 2007: 129,
  "2008-09": 137, 2008: 137,
  "2009-10": 148, 2009: 148,
  "2010-11": 167, 2010: 167,
  "2011-12": 184, 2011: 184,
  "2012-13": 200, 2012: 200,
  "2013-14": 220, 2013: 220,
  "2014-15": 240, 2014: 240,
  "2015-16": 254, 2015: 254,
  "2016-17": 264, 2016: 264,
  "2017-18": 272, 2017: 272,
  "2018-19": 280, 2018: 280,
  "2019-20": 289, 2019: 289,
  "2020-21": 301, 2020: 301,
  "2021-22": 317, 2021: 317,
  "2022-23": 331, 2022: 331,
  "2023-24": 348, 2023: 348,
  "2024-25": 363, 2024: 363, // Notification No. 44/2024
  "2025-26": 376, 2025: 376, // CBDT Official Series
  "2026-27": 384, 2026: 384, // CBDT Official Series (Tax Year 2026-27)
};

export function getCiiValue(year: string | number): number {
  if (typeof year === "number") {
    return CII_TABLE[year] ?? (year >= 2026 ? 384 : 363);
  }
  if (CII_TABLE[year]) return CII_TABLE[year];
  const numYear = parseInt(year, 10);
  if (!isNaN(numYear) && CII_TABLE[numYear]) return CII_TABLE[numYear];
  return 384;
}

export const CURRENT_CII_YEAR = "2026-27";
export const CURRENT_CII_VALUE = 384;

// ─── 7. LRS TCS (LIBERALISED REMITTANCE SCHEME) ─────────────────
/**
 * RBI & Income Tax Act Section 206C(1G) TCS Rates:
 * Statutory threshold is ₹10,00,000 (10 Lakhs) per financial year across all remittance modes.
 * - Qualifying education loan u/s 80E: 0.0% (NIL TCS)
 * - Self-funded education & medical treatment: 0% up to ₹10L, 5% above ₹10L
 * - Overseas tour package: 5% up to ₹10L, 20% above ₹10L
 * - General remittance / Foreign stocks / Real estate: 0% up to ₹10L, 20% above ₹10L
 * - Without PAN: 20% flat
 */
export const LRS_TCS_CONSTANTS = {
  exemptionThreshold: 1000000, // ₹10 Lakhs per financial year
  categories: {
    education_loan: {
      label: "Education Remittance (Funded by Loan u/s 80E)",
      tier1Rate: 0.00, // 0% up to ₹10L
      tier2Rate: 0.00, // 0% above ₹10L (Exempt / Nil TCS)
    },
    education_self: {
      label: "Education Remittance (Self-Funded)",
      tier1Rate: 0.00, // 0% up to ₹10L
      tier2Rate: 0.05, // 5% above ₹10L
    },
    medical_treatment: {
      label: "Medical Treatment Remittance",
      tier1Rate: 0.00, // 0% up to ₹10L
      tier2Rate: 0.05, // 5% above ₹10L
    },
    overseas_tour_package: {
      label: "Overseas Tour Program Package",
      tier1Rate: 0.05, // 5% up to ₹10L
      tier2Rate: 0.20, // 20% above ₹10L
    },
    general_investment: {
      label: "Foreign Stocks, Real Estate, Gift & General Remittance",
      tier1Rate: 0.00, // 0% up to ₹10L
      tier2Rate: 0.20, // 20% above ₹10L
    },
  },
  nonPanRate: 0.20, // 20% flat if PAN not furnished
} as const;

// ─── 8. STT & F&O TRANSACTION CHARGES ───────────────────────────
// Source: Finance Act 2024 amendments effective from 1 October 2024 / Tax Year 2026-27
export const STT_RATES_F_AND_O = {
  tax_year_2026_27: {
    label: "Tax Year 2026-27 (Current)",
    futures: 0.0005, // 0.05% on sell turnover
    optionsPremiumSell: 0.0015, // 0.15% on options premium turnover
    optionsExercise: 0.0015,    // 0.15% on intrinsic value on exercise
  },
  pre_october_2024: {
    label: "Pre-October 2024 (Historical)",
    futures: 0.000125, // 0.0125%
    optionsPremiumSell: 0.000625, // 0.0625%
    optionsExercise: 0.00125,     // 0.125%
  },
} as const;

export const TRANSACTION_CHARGES = {
  gstRate: 0.18, // 18% GST on brokerage and statutory fees
  stampDutyEquityDelivery: 0.00015, // 0.015%
  stampDutyEquityIntraday: 0.00003, // 0.003%
  stampDutyFutures: 0.00002,        // 0.002%
  stampDutyOptions: 0.00003,        // 0.003%
  sebiTurnoverFee: 0.000001,        // ₹10 per crore (0.0001%)
  ipftRate: 0.000001,               // ₹10 per crore
  nseExchangeTurnoverRateFutures: 0.0000173,
  nseExchangeTurnoverRateOptions: 0.000350,
} as const;

// ─── 9. PRESUMPTIVE TAXATION (SECTION 44AD / 44ADA) ────────────
export const PRESUMPTIVE_TAX_CONSTANTS = {
  section44ADA: {
    rate: 0.50, // 50% presumptive profit for specified professionals
    baseTurnoverLimit: 5000000,    // ₹50 Lakhs
    enhancedTurnoverLimit: 7500000, // ₹75 Lakhs (if >= 95% digital receipts)
  },
  section44AD: {
    digitalProfitRate: 0.06, // 6% on digital/banking receipts
    cashProfitRate: 0.08,    // 8% on cash receipts
    baseTurnoverLimit: 20000000,    // ₹2 Crore
    enhancedTurnoverLimit: 30000000, // ₹3 Crore (if >= 95% digital receipts)
    optOutLockoutYears: 5,           // Section 44AD(4) 5-year audit lockout
  },
} as const;

// ─── 10. HRA EXEMPTION (SECTION 10(13A)) ────────────────────────
export const HRA_CONSTANTS = {
  metroPercentage: 0.50,    // 50% of basic salary + DA (Delhi, Mumbai, Kolkata, Chennai)
  nonMetroPercentage: 0.40, // 40% of basic salary + DA (other cities)
  salaryDeductionBase: 0.10, // 10% of basic salary + DA
  parentStatutoryDeductionSection24: 0.30, // 30% standard deduction on rental income for parents
} as const;

// ─── 11. CAPITAL GAINS EXEMPTIONS (SECTION 54 / 54EC) ───────────
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
    investmentWindowMonths: 6, // strictly within 6 months of transfer
    lockInYears: 5, // 5-year lock-in for REC/PFC/NHAI/IRFC bonds
    approxAnnualInterestRate: 0.0525, // ~5.25% p.a.
  },
} as const;

// ─── 12. NATIONAL PENSION SYSTEM (NPS) STATUTORY RULES ─────────
export const NPS_CONSTANTS = {
  sec80CCD1BMaxDeduction: 50000, // ₹50,000 exclusive self-contribution deduction (Old Regime ONLY)
  sec80CCD2GovtLimitPercent: 0.14, // 14% of Basic+DA for Central/State Govt employees
  sec80CCD2PrivateLimitPercent: 0.14, // Up to 14% allowed in New Regime (10% in Old Regime)
  normalExitLumpSumTaxFreeMaxPercent: 0.60, // 60% lump sum is 100% tax-free
  normalExitMandatoryAnnuityMinPercent: 0.40, // 40% mandatory annuity purchase
  smallCorpusFullWithdrawalLimit: 500000, // ₹5 Lakhs or less allows 100% lump sum exit
} as const;

// ─── 13. MAXIMUM INPUT LIMITS (HNI / UHNI SAFEGUARDS) ───────────
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
