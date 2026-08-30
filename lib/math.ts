/**
 * FinCalc India — Unified Calculator Engine
 *
 * All six calculator functions with fully-typed inputs and outputs.
 * Each function accepts a single config object and returns a
 * comprehensive result with breakdowns and chart-ready data.
 *
 * This is the canonical math module. Existing per-file calculators
 * (sip.ts, emi.ts, etc.) remain for backward-compat; new code
 * should import from here.
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── SIP ──────────────────────────────────────────────────────

export interface SipInput {
  monthlyAmount: number;
  annualRate: number;
  years: number;
}

export interface SipYearRow {
  year: number;
  invested: number;
  returns: number;
  corpus: number;
}

export interface SipOutput {
  totalInvested: number;
  estimatedReturns: number;
  totalCorpus: number;
  absoluteReturn: number; // percentage gain
  yearlyBreakdown: SipYearRow[];
}

// ─── EMI ──────────────────────────────────────────────────────

export interface EmiInput {
  principal: number;
  annualRate: number;
  tenureMonths: number;
}

export interface EmiAmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface EmiOutput {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  principalAmount: number;
  interestPercentage: number;
  amortizationSchedule: EmiAmortizationRow[];
}

// ─── FD ───────────────────────────────────────────────────────

export type CompoundingFrequency = 1 | 2 | 4 | 12;

export interface FdInput {
  principal: number;
  annualRate: number;
  tenureYears: number;
  compoundingFrequency: CompoundingFrequency;
}

export interface FdGrowthPoint {
  period: string;
  amount: number;
}

export interface FdOutput {
  maturityAmount: number;
  totalInterest: number;
  growthData: FdGrowthPoint[];
  effectiveAnnualYield: number;
  totalReturnPct: number;
}

// ─── PPF ──────────────────────────────────────────────────────

export interface PpfInput {
  yearlyInvestment: number;
  years: number;
  rate: number;
}

export interface PpfYearRow {
  year: number;
  deposit: number;
  interest: number;
  balance: number;
  withdrawalAllowed: boolean;
  loanAllowed: boolean;
}

export interface PpfOutput {
  totalInvested: number;
  totalInterest: number;
  maturityValue: number;
  yearlyData: PpfYearRow[];
}

// ─── LUMPSUM ──────────────────────────────────────────────────

export interface LumpsumInput {
  principal: number;
  annualRate: number;
  years: number;
}

export interface LumpsumGrowthPoint {
  year: number;
  value: number;
}

export interface LumpsumOutput {
  totalCorpus: number;
  estimatedReturns: number;
  absoluteReturn: number;   // percentage gain
  CAGR: number;
  wealthRatio: number;
  growthData: LumpsumGrowthPoint[];
}

import {
  CURRENT_TAX_YEAR,
  PREVIOUS_FY_LABEL,
  TAX_YEAR_NOTE,
  PENDING_SECTIONS_NOTE,
  NEW_REGIME_SLABS_2026_27,
  OLD_REGIME_SLABS_2026_27,
  STANDARD_DEDUCTION_NEW_REGIME,
  STANDARD_DEDUCTION_OLD_REGIME,
  REBATE_SECTION_157,
  HEALTH_AND_EDUCATION_CESS_RATE,
  CAPITAL_GAINS_RATES,
  STT_RATES_F_AND_O,
  TRANSACTION_CHARGES,
  PRESUMPTIVE_TAX_CONSTANTS,
  HRA_CONSTANTS,
  SECTION_54_CONSTANTS,
  MAX_INPUT_LIMITS,
} from "@/lib/constants/tax-year-2026-27";

export {
  CURRENT_TAX_YEAR,
  PREVIOUS_FY_LABEL,
  TAX_YEAR_NOTE,
  PENDING_SECTIONS_NOTE,
  NEW_REGIME_SLABS_2026_27,
  OLD_REGIME_SLABS_2026_27,
  STANDARD_DEDUCTION_NEW_REGIME,
  STANDARD_DEDUCTION_OLD_REGIME,
  REBATE_SECTION_157,
  HEALTH_AND_EDUCATION_CESS_RATE,
  CAPITAL_GAINS_RATES,
  STT_RATES_F_AND_O,
  TRANSACTION_CHARGES,
  PRESUMPTIVE_TAX_CONSTANTS,
  HRA_CONSTANTS,
  SECTION_54_CONSTANTS,
  MAX_INPUT_LIMITS,
};

// ─── TAX ──────────────────────────────────────────────────────

export type TaxRegime = "old" | "new";

export interface TaxInput {
  grossIncome: number;
  regime: TaxRegime;
  deduction80C?: number;
  deduction80D?: number;
  hraExemption?: number;
  otherDeductions?: number;
  equityLtcg?: number; // Section 112A special rate (12.5% above ₹1.25L)
  equityStcg?: number; // Section 111A special rate (20%)
}

export interface TaxSlabRow {
  slab: string;
  rate: number;     // percentage e.g. 5, 10, 20
  amount: number;   // taxable amount in this slab
  tax: number;      // tax for this slab
}

export interface TaxComparison {
  oldRegimeTax: number;
  newRegimeTax: number;
  savings: number;
  recommendation: TaxRegime;
  reason: string;
}

export interface TaxOutput {
  taxYear: string;
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  slabTaxBeforeRebate: number;
  rebateAmount: number;
  rebateSection: string;
  specialRateTax: number;
  equityLtcgTax: number;
  equityStcgTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  monthlyTakeHome: number;
  slabBreakdown: TaxSlabRow[];
  comparison: TaxComparison;
}

// ─── HRA EXEMPTION ────────────────────────────────────────────

export type CityType = "metro" | "non_metro";
export type SalaryPeriod = "monthly" | "annual";

export interface HRAExemptionInput {
  basicSalary: number;
  salaryPeriod?: SalaryPeriod;
  dearnessAllowance?: number;
  daFormsPartOfRetirementBenefits?: boolean;
  hraReceived: number;
  rentPaid: number;
  cityType: CityType;
  isPayingToParents?: boolean;
  parentsSlabRatePercent?: number;
  userSlabRatePercent?: number;
}

export interface HRAExemptionOutput {
  salaryPeriod: SalaryPeriod;
  annualBasicSalaryBase: number;
  monthlyBasicSalaryBase: number;
  annualHraReceived: number;
  monthlyHraReceived: number;
  annualRentPaid: number;
  monthlyRentPaid: number;
  cityType: CityType;
  actualHraLimit: number;
  rentMinusTenPercentLimit: number;
  salaryPercentageLimit: number;
  salaryPercentageUsed: number;
  bindingConstraint: "actual_hra" | "rent_minus_10pct" | "salary_cap";
  annualExemptHra: number;
  monthlyExemptHra: number;
  annualTaxableHra: number;
  monthlyTaxableHra: number;
  taxSaved: number;
  payingToParentsDetails?: {
    parentGrossRentalIncome: number;
    parentStandardDeductionSection24: number;
    parentTaxableRentalIncome: number;
    parentTaxPayable: number;
    employeeTaxSaved: number;
    netHouseholdTaxSaved: number;
    isBeneficial: boolean;
    recommendation: string;
  };
  summary: string;
}

// ─── PRESUMPTIVE TAXATION (44AD & 44ADA) ──────────────────────

export type PresumptiveProfessionType = "44ADA_professional" | "44AD_business";

export interface PresumptiveTaxInput {
  professionType: PresumptiveProfessionType;
  grossTurnover: number;
  digitalReceiptsPercentage?: number; // 0 to 100, default 100
  actualProfit?: number;
  regime?: TaxRegime;
  deduction80C?: number;
  deduction80D?: number;
  otherDeductions?: number;
}

export interface PresumptiveTaxOutput {
  professionType: PresumptiveProfessionType;
  grossTurnover: number;
  digitalReceiptsPercentage: number;
  digitalTurnover: number;
  cashTurnover: number;
  isEnhancedLimitApplicable: boolean;
  maxTurnoverLimit: number;
  isEligibleForPresumptive: boolean;
  ineligibilityReason?: string;
  presumptiveRateEffective: number;
  presumptiveIncome: number;
  presumptiveTaxPayable: number;
  presumptiveTaxDetails: {
    taxableIncome: number;
    totalTax: number;
    effectiveRate: number;
    slabBreakdown: TaxSlabRow[];
  };
  actualProfit: number;
  actualTaxPayable: number;
  actualTaxDetails: {
    taxableIncome: number;
    totalTax: number;
    effectiveRate: number;
    slabBreakdown: TaxSlabRow[];
  };
  taxDifference: number; // presumptiveTaxPayable - actualTaxPayable
  isPresumptiveCheaper: boolean;
  isAuditTriggeredByOptOut: boolean;
  auditTriggerReason?: string;
  fiveYearLockoutTriggered: boolean;
  recommendation: string;
}

// ─── POSITION SIZE & RISK-REWARD ──────────────────────────────

export interface PositionSizeInput {
  capital: number;
  riskPercent: number; // e.g. 1 for 1%
  entryPrice: number;
  stopLossPrice: number;
  riskRewardRatio: number; // e.g. 2 for 1:2, 2.5 for 1:2.5
  tradeDirection?: "long" | "short" | "auto";
  leverageMultiplier?: number;
}

export interface PositionSizeOutput {
  capital: number;
  riskPercent: number;
  maxRiskAmount: number;
  entryPrice: number;
  stopLossPrice: number;
  riskRewardRatio: number;
  tradeDirection: "long" | "short";
  riskPerShare: number;
  rawQuantityByRisk: number;
  maxAffordableQuantity: number;
  quantity: number;
  positionValue: number;
  actualRiskAmount: number;
  actualRiskPercent: number;
  targetPrice: number;
  potentialProfit: number;
  capitalUtilizationPercent: number;
  isCappedByCapital: boolean;
  isValid: boolean;
  validationError?: string;
  warning?: string;
  summary: string;
}

// ─── SECTION 54 / 54EC CAPITAL GAINS EXEMPTION PLANNER ────────

export type Section54Type = "section_54_property" | "section_54ec_bonds" | "compare_both";
export type Section54PropertyMode = "purchase" | "construction";

export interface Section54ExemptionInput {
  capitalGainsAmount?: number;
  capitalGainsInput?: CapitalGainsInput;
  sectionType: Section54Type;
  propertyInvestmentAmount?: number;
  propertyMode?: Section54PropertyMode;
  propertyTimelineMonths?: number; // months relative to sale date (-12 to 36)
  bondsInvestmentAmount?: number;
  bondsTimelineMonths?: number; // months from sale date (0 to 6)
  taxRatePercent?: number; // default 12.5 (plus 4% cess = 13%)
}

export interface Section54SingleExemptionResult {
  section: "54" | "54EC";
  investmentAmount: number;
  statutoryCap: number;
  isValidTimeline: boolean;
  timelineMessage: string;
  exemptionAllowed: number;
  taxableGainsRemaining: number;
  taxBeforeExemption: number;
  taxAfterExemption: number;
  taxSaved: number;
  effectiveTaxRate: number;
  lockInPeriod: string;
  conditions: string[];
}

export interface Section54ExemptionOutput {
  initialLtcgGains: number;
  taxRatePercent: number;
  cessPercent: number;
  effectiveTaxRateBeforeExemption: number;
  taxBeforeExemption: number;
  selectedSection: Section54Type;
  activeResult: Section54SingleExemptionResult;
  comparison?: {
    section54: Section54SingleExemptionResult;
    section54ec: Section54SingleExemptionResult;
    taxDifference: number;
    recommendation: string;
  };
  summary: string;
}





// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CALCULATIONS — ENGINE V2 (DEFENSIVE & PRECISION HARDENED)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Coerces unknown / null / NaN inputs to finite numbers with fallback.
 */
export function safeNum(val: unknown, fallback = 0): number {
  if (typeof val === "number") {
    return Number.isFinite(val) ? val : fallback;
  }
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

/**
 * Guarantees non-negative finite value
 */
export function safePositive(val: unknown, fallback = 0): number {
  const num = safeNum(val, fallback);
  return Math.max(0, num);
}

// ─── SIP ──────────────────────────────────────────────────────
/**
 * SIP formula: M = P × ((1+i)^n − 1) / i × (1+i)
 * i = annualRate / 12 / 100
 * n = years × 12
 */
export function calcSIP(input: SipInput): SipOutput {
  const monthlyAmount = safePositive(input.monthlyAmount);
  const annualRate = safePositive(input.annualRate);
  const years = safePositive(input.years);

  const i = annualRate / 12 / 100;
  const n = Math.round(years * 12);
  const totalInvested = monthlyAmount * n;

  let totalCorpus = 0;
  if (monthlyAmount === 0 || n === 0) {
    totalCorpus = 0;
  } else if (i === 0) {
    totalCorpus = totalInvested;
  } else {
    totalCorpus = monthlyAmount * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  }

  const estimatedReturns = Math.max(0, Math.round(totalCorpus) - Math.round(totalInvested));
  const absoluteReturn = totalInvested > 0
    ? (estimatedReturns / totalInvested) * 100
    : 0;

  // Year-by-year breakdown
  const yearlyBreakdown: SipYearRow[] = [];
  const roundedYears = Math.round(years);
  for (let y = 1; y <= roundedYears; y++) {
    const months = y * 12;
    const inv = monthlyAmount * months;
    let corp: number;
    if (i === 0) {
      corp = inv;
    } else {
      corp = monthlyAmount * (((Math.pow(1 + i, months) - 1) / i) * (1 + i));
    }
    yearlyBreakdown.push({
      year: y,
      invested: Math.round(inv),
      returns: Math.max(0, Math.round(corp) - Math.round(inv)),
      corpus: Math.round(corp),
    });
  }

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns,
    totalCorpus: Math.round(totalCorpus),
    absoluteReturn: Math.round(absoluteReturn * 100) / 100,
    yearlyBreakdown,
  };
}

// ─── EMI ──────────────────────────────────────────────────────
/**
 * EMI = P × r × (1+r)^n / ((1+r)^n − 1)
 * Includes full amortization schedule with cumulative tracking.
 */
export function calcEMI(input: EmiInput): EmiOutput {
  const principal = safePositive(input.principal);
  const annualRate = safePositive(input.annualRate);
  const tenureMonths = Math.max(1, Math.round(safePositive(input.tenureMonths, 1)));
  const r = annualRate / 12 / 100;

  let emi = 0;
  if (principal === 0) {
    emi = 0;
  } else if (r === 0) {
    emi = principal / tenureMonths;
  } else {
    const factor = Math.pow(1 + r, tenureMonths);
    emi = (principal * r * factor) / (factor - 1);
  }

  const totalPayment = emi * tenureMonths;
  const totalInterest = Math.max(0, totalPayment - principal);
  const interestPercentage = totalPayment > 0
    ? (totalInterest / totalPayment) * 100
    : 0;

  // Amortization schedule
  const amortizationSchedule: EmiAmortizationRow[] = [];
  let balance = principal;
  let cumPrincipal = 0;
  let cumInterest = 0;

  for (let m = 1; m <= tenureMonths; m++) {
    const interestPart = balance * r;
    const principalPart = emi - interestPart;
    balance = Math.max(0, balance - principalPart);
    cumPrincipal += principalPart;
    cumInterest += interestPart;

    amortizationSchedule.push({
      month: m,
      emi: Math.round(emi),
      principal: Math.round(principalPart),
      interest: Math.round(interestPart),
      balance: Math.round(balance),
      cumulativePrincipal: Math.round(cumPrincipal),
      cumulativeInterest: Math.round(cumInterest),
    });
  }

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    principalAmount: Math.round(principal),
    interestPercentage: Math.round(interestPercentage * 100) / 100,
    amortizationSchedule,
  };
}

// ─── FD ───────────────────────────────────────────────────────
/**
 * Compound interest: A = P × (1 + r/(n×100))^(n×t)
 * n = compounding frequency, t = tenure in years
 */
export function calcFD(input: FdInput): FdOutput {
  const principal = safePositive(input.principal);
  const annualRate = safePositive(input.annualRate);
  const tenureYears = safePositive(input.tenureYears);
  const freq: CompoundingFrequency = (input.compoundingFrequency && [1, 2, 4, 12].includes(input.compoundingFrequency))
    ? input.compoundingFrequency
    : 4;

  const maturityAmount = principal *
    Math.pow(1 + annualRate / (freq * 100), freq * tenureYears);

  const totalInterest = Math.max(0, maturityAmount - principal);

  // Growth data for charting
  const steps = Math.min(Math.max(Math.ceil(tenureYears * 4), 8), 60);
  const growthData: FdGrowthPoint[] = [];

  for (let s = 0; s <= steps; s++) {
    const t = steps > 0 ? (tenureYears * s) / steps : 0;
    const amount = principal *
      Math.pow(1 + annualRate / (freq * 100), freq * t);
    const label = t < 1 ? `${Math.round(t * 12)}m` : `${t.toFixed(1)}y`;
    growthData.push({ period: label, amount: Math.round(amount) });
  }

  const effectiveAnnualYield = (Math.pow(1 + annualRate / 100 / freq, freq) - 1) * 100;
  const totalReturnPct = principal > 0 ? (totalInterest / principal) * 100 : 0;

  return {
    maturityAmount: Math.round(maturityAmount),
    totalInterest: Math.round(totalInterest),
    growthData,
    effectiveAnnualYield: Math.round(effectiveAnnualYield * 100) / 100,
    totalReturnPct: Math.round(totalReturnPct * 100) / 100,
  };
}

// ─── PPF ──────────────────────────────────────────────────────
/**
 * PPF: Annual compounding. Interest added at year end.
 * Lock-in: 15 years.
 * Partial withdrawal allowed from year 7.
 * Loans allowed years 3–6.
 */
export function calcPPF(input: PpfInput): PpfOutput {
  const yearlyInvestment = safePositive(input.yearlyInvestment);
  const years = Math.max(1, Math.min(50, Math.round(safePositive(input.years, 15))));
  const rate = safePositive(input.rate, 7.1);

  let balance = 0;
  let totalInvested = 0;
  let totalInterest = 0;
  const yearlyData: PpfYearRow[] = [];

  for (let y = 1; y <= years; y++) {
    balance += yearlyInvestment;
    totalInvested += yearlyInvestment;
    const interest = balance * (rate / 100);
    balance += interest;
    totalInterest += interest;

    yearlyData.push({
      year: y,
      deposit: Math.round(yearlyInvestment),
      interest: Math.round(interest),
      balance: Math.round(balance),
      withdrawalAllowed: y >= 7,
      loanAllowed: y >= 3 && y <= 6,
    });
  }

  return {
    totalInvested: Math.round(totalInvested),
    totalInterest: Math.round(totalInterest),
    maturityValue: Math.round(balance),
    yearlyData,
  };
}

// ─── LUMPSUM ──────────────────────────────────────────────────
/**
 * Compound interest: A = P × (1 + r/100)^t
 * CAGR = ((FV/PV)^(1/t) − 1) × 100
 */
export function calcLumpsum(input: LumpsumInput): LumpsumOutput {
  const principal = safePositive(input.principal);
  const annualRate = safePositive(input.annualRate);
  const years = safePositive(input.years);

  const totalCorpus = principal * Math.pow(1 + annualRate / 100, years);
  const estimatedReturns = Math.max(0, Math.round(totalCorpus) - Math.round(principal));
  const absoluteReturn = principal > 0
    ? (estimatedReturns / principal) * 100
    : 0;
  const CAGR = (years > 0 && principal > 0)
    ? (Math.pow(totalCorpus / principal, 1 / years) - 1) * 100
    : 0;
  const wealthRatio = principal > 0 ? totalCorpus / principal : 0;

  // Growth curve for charting
  const growthData: LumpsumGrowthPoint[] = [];
  const roundedYears = Math.round(years);
  for (let y = 0; y <= roundedYears; y++) {
    growthData.push({
      year: y,
      value: Math.round(principal * Math.pow(1 + annualRate / 100, y)),
    });
  }

  return {
    totalCorpus: Math.round(totalCorpus),
    estimatedReturns,
    absoluteReturn: Math.round(absoluteReturn * 100) / 100,
    CAGR: Math.round(CAGR * 100) / 100,
    wealthRatio: Math.round(wealthRatio * 100) / 100,
    growthData,
  };
}

// ─── TAX ──────────────────────────────────────────────────────

interface InternalSlab {
  limit: number;
  rate: number;     // decimal e.g. 0.05
  label: string;
}

/**
 * Tax Year 2026-27 New Regime Slabs (Income Tax Act, 2025)
 * Nil tax up to ₹4L; Section 157 (formerly 87A) rebate makes taxable income ≤ ₹12L effectively tax-free.
 */
const NEW_REGIME_SLABS: InternalSlab[] = NEW_REGIME_SLABS_2026_27.map((s) => ({
  limit: s.max,
  rate: s.rate,
  label: s.max === Infinity ? "24L+" : `${s.min / 100000}L – ${s.max / 100000}L`,
}));

/**
 * Tax Year 2026-27 Old Regime Slabs (Optional)
 */
const OLD_REGIME_SLABS: InternalSlab[] = OLD_REGIME_SLABS_2026_27.map((s) => ({
  limit: s.max,
  rate: s.rate,
  label: s.max === Infinity ? "10L+" : `${s.min / 100000}L – ${s.max / 100000}L`,
}));

function internalSlabCalc(
  income: number,
  slabs: InternalSlab[]
): { rawTax: number; breakdown: TaxSlabRow[] } {
  let rawTax = 0;
  let prev = 0;
  const breakdown: TaxSlabRow[] = [];

  for (const slab of slabs) {
    if (income <= prev) break;
    const taxableInSlab = Math.min(income, slab.limit) - prev;
    const tax = taxableInSlab * slab.rate;
    rawTax += tax;
    if (taxableInSlab > 0) {
      breakdown.push({
        slab: slab.label,
        rate: slab.rate * 100,
        amount: Math.round(taxableInSlab),
        tax: Math.round(tax),
      });
    }
    prev = slab.limit;
  }

  return { rawTax, breakdown };
}

function internalSurcharge(taxBeforeCess: number, totalIncome: number): number {
  if (totalIncome > 5_00_00_000) return taxBeforeCess * 0.37;
  if (totalIncome > 2_00_00_000) return taxBeforeCess * 0.25;
  if (totalIncome > 1_00_00_000) return taxBeforeCess * 0.15;
  if (totalIncome > 50_00_000) return taxBeforeCess * 0.10;
  return 0;
}

function computeRegimeTax(
  grossIncome: number,
  regime: TaxRegime,
  input: TaxInput
): {
  totalTax: number;
  taxableIncome: number;
  totalDeductions: number;
  slabTaxBeforeRebate: number;
  rebateAmount: number;
  rebateSection: string;
  specialRateTax: number;
  equityLtcgTax: number;
  equityStcgTax: number;
  taxBeforeCess: number;
  surcharge: number;
  cess: number;
  breakdown: TaxSlabRow[];
} {
  let totalDeductions: number;
  let taxableIncome: number;

  if (regime === "new") {
    // New regime: standard deduction of ₹75,000 for salaried
    const stdDed = STANDARD_DEDUCTION_NEW_REGIME;
    totalDeductions = stdDed;
    taxableIncome = Math.max(0, grossIncome - stdDed);
  } else {
    // Old regime: standard deduction ₹50,000 + 80C + 80D + HRA + others
    const stdDed = STANDARD_DEDUCTION_OLD_REGIME;
    const capped80C = Math.min(input.deduction80C ?? 0, 150000);
    const capped80D = Math.min(input.deduction80D ?? 0, 100000);
    totalDeductions = stdDed + capped80C + capped80D + (input.hraExemption ?? 0) + (input.otherDeductions ?? 0);
    taxableIncome = Math.max(0, grossIncome - totalDeductions);
  }

  const slabs = regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  const { rawTax, breakdown } = internalSlabCalc(taxableIncome, slabs);

  // Section 157 (formerly 87A) Rebate:
  // Tax Year 2026-27: New regime taxable income ≤ ₹12L gets full slab rebate (up to ₹60,000).
  // Old regime: taxable income ≤ ₹5L, max rebate ₹12,500.
  // CRITICAL: Rebate applies ONLY to normal slab tax, NOT special-rate capital gains (Sec 112A / 111A).
  let rebateAmount = 0;
  if (regime === "new" && taxableIncome <= REBATE_SECTION_157.newRegimeIncomeLimit) {
    rebateAmount = Math.min(rawTax, REBATE_SECTION_157.newRegimeMaxRebate);
  } else if (regime === "old" && taxableIncome <= REBATE_SECTION_157.oldRegimeIncomeLimit) {
    rebateAmount = Math.min(rawTax, REBATE_SECTION_157.oldRegimeMaxRebate);
  }

  const slabTaxAfterRebate = Math.max(0, rawTax - rebateAmount);

  // Special rate capital gains tax (Section 112A LTCG @ 12.5% above ₹1.25L, Section 111A STCG @ 20%)
  const equityLtcg = Math.max(0, input.equityLtcg ?? 0);
  const equityStcg = Math.max(0, input.equityStcg ?? 0);

  const equityLtcgTaxable = Math.max(0, equityLtcg - CAPITAL_GAINS_RATES.equityLTCG.exemptionThreshold);
  const equityLtcgTax = Math.round(equityLtcgTaxable * CAPITAL_GAINS_RATES.equityLTCG.rate);
  const equityStcgTax = Math.round(equityStcg * CAPITAL_GAINS_RATES.equitySTCG.rate);
  const specialRateTax = equityLtcgTax + equityStcgTax;

  const taxBeforeSurchargeAndCess = slabTaxAfterRebate + specialRateTax;
  const totalCombinedIncome = grossIncome + equityLtcg + equityStcg;

  // Surcharge on high income (>₹50L)
  const surcharge = internalSurcharge(taxBeforeSurchargeAndCess, totalCombinedIncome);

  // Health & Education Cess: 4%
  const cess = (taxBeforeSurchargeAndCess + surcharge) * HEALTH_AND_EDUCATION_CESS_RATE;
  const totalTax = taxBeforeSurchargeAndCess + surcharge + cess;

  return {
    totalTax: Math.round(totalTax),
    taxableIncome: Math.round(taxableIncome),
    totalDeductions: Math.round(totalDeductions),
    slabTaxBeforeRebate: Math.round(rawTax),
    rebateAmount: Math.round(rebateAmount),
    rebateSection: REBATE_SECTION_157.sectionName,
    specialRateTax: Math.round(specialRateTax),
    equityLtcgTax: Math.round(equityLtcgTax),
    equityStcgTax: Math.round(equityStcgTax),
    taxBeforeCess: Math.round(taxBeforeSurchargeAndCess),
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    breakdown,
  };
}

/**
 * Income Tax Calculator — Tax Year 2026-27 (Income Tax Act, 2025)
 *
 * Supports New Regime (default) and Old Regime.
 * New Regime Slabs: 0–4L nil, 4–8L 5%, 8–12L 10%, 12–16L 15%,
 *                   16–20L 20%, 20–24L 25%, 24L+ 30%.
 * Standard deduction: ₹75,000.
 * Rebate under Section 157 (formerly 87A) for taxable income ≤ ₹12L (wiping out up to ₹60,000 slab tax).
 * Special rate equity LTCG (12.5% above ₹1.25L) & STCG (20%) are isolated from rebate.
 */
export function calcTax(input: TaxInput): TaxOutput {
  const { grossIncome, regime } = input;

  const current = computeRegimeTax(grossIncome, regime, input);

  // Compute both regimes for comparison
  const oldResult = computeRegimeTax(grossIncome, "old", input);
  const newResult = computeRegimeTax(grossIncome, "new", input);

  const savings = Math.abs(oldResult.totalTax - newResult.totalTax);
  const recommendation: TaxRegime = oldResult.totalTax <= newResult.totalTax ? "old" : "new";
  const reason = recommendation === "new"
    ? `New regime saves ₹${Math.round(savings).toLocaleString("en-IN")} under Tax Year 2026-27 slabs`
    : `Old regime saves ₹${Math.round(savings).toLocaleString("en-IN")} due to itemized deductions`;

  const totalEffectiveGross = grossIncome + (input.equityLtcg ?? 0) + (input.equityStcg ?? 0);
  const netAnnual = totalEffectiveGross - current.totalTax;
  const effectiveRate = totalEffectiveGross > 0
    ? (current.totalTax / totalEffectiveGross) * 100
    : 0;

  return {
    taxYear: CURRENT_TAX_YEAR,
    grossIncome: Math.round(grossIncome),
    totalDeductions: current.totalDeductions,
    taxableIncome: current.taxableIncome,
    taxBeforeCess: current.taxBeforeCess,
    slabTaxBeforeRebate: current.slabTaxBeforeRebate,
    rebateAmount: current.rebateAmount,
    rebateSection: current.rebateSection,
    specialRateTax: current.specialRateTax,
    equityLtcgTax: current.equityLtcgTax,
    equityStcgTax: current.equityStcgTax,
    surcharge: current.surcharge,
    cess: current.cess,
    totalTax: current.totalTax,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    monthlyTakeHome: Math.round(netAnnual / 12),
    slabBreakdown: current.breakdown,
    comparison: {
      oldRegimeTax: oldResult.totalTax,
      newRegimeTax: newResult.totalTax,
      savings: Math.round(savings),
      recommendation,
      reason,
    },
  };
}

// ─── STEP-UP SIP & GOAL SIP ───────────────────────────────────

export type StepUpType = "percentage" | "fixed";

export interface StepUpSipInput {
  monthlyAmount: number;
  annualRate: number;
  years: number;
  stepUpType: StepUpType;
  stepUpValue: number; // e.g. 10 for 10% or 1000 for ₹1000
}

export interface StepUpSipYearRow {
  year: number;
  monthlyAmount: number;
  yearlyInvested: number;
  totalInvested: number;
  returns: number;
  corpus: number;
  flatCorpus: number;
}

export interface StepUpSipOutput {
  totalInvested: number;
  estimatedReturns: number;
  totalCorpus: number;
  flatCorpus: number;
  wealthGain: number;
  extraReturnsVsFlat: number;
  yearlyBreakdown: StepUpSipYearRow[];
}

export interface GoalSipInput {
  targetCorpus: number;
  annualRate: number;
  years: number;
  stepUpType: StepUpType;
  stepUpValue: number;
}

export interface GoalSipOutput {
  requiredStartingSip: number;
  totalInvested: number;
  estimatedReturns: number;
  projectedCorpus: number;
  yearlyBreakdown: StepUpSipYearRow[];
}

/**
 * Step-Up SIP Calculator:
 * Compounds monthly investments with yearly step-ups (percentage or fixed rupee).
 * Calculates both Step-Up corpus and baseline Flat SIP corpus for comparison.
 */
export function calcStepUpSIP(input: StepUpSipInput): StepUpSipOutput {
  const { monthlyAmount, annualRate, years, stepUpType, stepUpValue } = input;
  const safeMonthly = Math.max(0, monthlyAmount);
  const safeYears = Math.max(1, Math.round(years));
  const safeRate = Math.max(0, annualRate);
  const safeStepUpVal = Math.max(0, stepUpValue);
  const i = safeRate / 12 / 100;

  let stepUpCorpus = 0;
  let flatCorpus = 0;
  let totalInvested = 0;

  const yearlyBreakdown: StepUpSipYearRow[] = [];
  let currentMonthlyAmount = safeMonthly;

  for (let y = 1; y <= safeYears; y++) {
    // Step-up applies starting from Year 2
    if (y > 1) {
      if (stepUpType === "percentage") {
        currentMonthlyAmount = safeMonthly * Math.pow(1 + safeStepUpVal / 100, y - 1);
      } else {
        currentMonthlyAmount = safeMonthly + (y - 1) * safeStepUpVal;
      }
    }

    let yearlyDeposit = 0;
    for (let m = 1; m <= 12; m++) {
      yearlyDeposit += currentMonthlyAmount;
      totalInvested += currentMonthlyAmount;
      if (i === 0) {
        stepUpCorpus += currentMonthlyAmount;
        flatCorpus += safeMonthly;
      } else {
        stepUpCorpus = (stepUpCorpus + currentMonthlyAmount) * (1 + i);
        flatCorpus = (flatCorpus + safeMonthly) * (1 + i);
      }
    }

    yearlyBreakdown.push({
      year: y,
      monthlyAmount: Math.round(currentMonthlyAmount * 100) / 100,
      yearlyInvested: Math.round(yearlyDeposit),
      totalInvested: Math.round(totalInvested),
      returns: Math.round(stepUpCorpus - totalInvested),
      corpus: Math.round(stepUpCorpus),
      flatCorpus: Math.round(flatCorpus),
    });
  }

  const roundedInvested = Math.round(totalInvested);
  const roundedCorpus = Math.round(stepUpCorpus);
  const roundedFlatCorpus = Math.round(flatCorpus);
  const estimatedReturns = roundedCorpus - roundedInvested;

  return {
    totalInvested: roundedInvested,
    estimatedReturns,
    totalCorpus: roundedCorpus,
    flatCorpus: roundedFlatCorpus,
    wealthGain: estimatedReturns,
    extraReturnsVsFlat: Math.max(0, roundedCorpus - roundedFlatCorpus),
    yearlyBreakdown,
  };
}

/**
 * Goal-Based SIP Calculator (Reverse solver):
 * Given a target corpus, calculates the exact starting monthly SIP required
 * with the specified annual step-up.
 */
export function calcGoalSIP(input: GoalSipInput): GoalSipOutput {
  const { targetCorpus, annualRate, years, stepUpType, stepUpValue } = input;
  const safeTarget = Math.max(0, targetCorpus);

  if (safeTarget === 0) {
    return {
      requiredStartingSip: 0,
      totalInvested: 0,
      estimatedReturns: 0,
      projectedCorpus: 0,
      yearlyBreakdown: [],
    };
  }

  // Binary search to find required starting SIP with precision within ₹0.01
  let low = 1;
  let high = safeTarget;
  let bestSip = high;

  for (let iter = 0; iter < 60; iter++) {
    const mid = (low + high) / 2;
    const testResult = calcStepUpSIP({
      monthlyAmount: mid,
      annualRate,
      years,
      stepUpType,
      stepUpValue,
    });

    if (Math.abs(testResult.totalCorpus - safeTarget) <= 1) {
      bestSip = mid;
      break;
    }

    if (testResult.totalCorpus < safeTarget) {
      low = mid;
      bestSip = mid;
    } else {
      high = mid;
      bestSip = mid;
    }
  }

  const roundedSip = Math.round(bestSip);
  const finalResult = calcStepUpSIP({
    monthlyAmount: roundedSip,
    annualRate,
    years,
    stepUpType,
    stepUpValue,
  });

  return {
    requiredStartingSip: roundedSip,
    totalInvested: finalResult.totalInvested,
    estimatedReturns: finalResult.estimatedReturns,
    projectedCorpus: finalResult.totalCorpus,
    yearlyBreakdown: finalResult.yearlyBreakdown,
  };
}

// ─── FEATURE 2: LOAN PRE-PAYMENT VS INVESTMENT COMPARATOR ─────

export type PrepaymentType = "extra_emi_yearly" | "monthly_topup" | "lumpsum";

export interface PrepaymentInput {
  principal: number;
  annualRate: number;
  tenureMonths: number;
  prepaymentType: PrepaymentType;
  prepaymentAmount?: number; // for monthly_topup or lumpsum
  lumpsumYear?: number; // for lumpsum e.g. Year 3
  investmentRate: number; // expected return on alternative investment (e.g. 12%)
}

export interface PrepaymentScheduleRow {
  month: number;
  emi: number;
  prepayment: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
  cumulativeInterest: number;
}

export interface PrepaymentVsInvestOutput {
  originalEmi: number;
  originalTotalInterest: number;
  originalTotalPayment: number;
  newTenureMonths: number;
  tenureSavedMonths: number;
  tenureSavedYears: number;
  newTotalInterest: number;
  interestSaved: number;
  totalPrepaymentMade: number;
  prepayScenarioWealth: number; // wealth accumulated by investing freed EMI after loan closes
  investScenarioWealth: number; // wealth accumulated if prepayment cashflow was invested from day 1
  wealthDifference: number;
  recommendation: "prepay" | "invest" | "neutral";
  breakEvenRate: number;
  schedule: PrepaymentScheduleRow[];
}

export function calcPrepaymentVsInvest(input: PrepaymentInput): PrepaymentVsInvestOutput {
  const {
    principal,
    annualRate,
    tenureMonths,
    prepaymentType,
    prepaymentAmount = 0,
    lumpsumYear = 3,
    investmentRate = 12,
  } = input;

  const safePrincipal = Math.max(0, principal);
  const safeTenure = Math.max(1, Math.round(tenureMonths));
  const safeLoanRate = Math.max(0, annualRate);
  const safeInvestRate = Math.max(0, investmentRate);
  const r = safeLoanRate / 12 / 100;
  const invMonthlyRate = safeInvestRate / 12 / 100;

  // Standard EMI calculation
  let originalEmi: number;
  if (r === 0) {
    originalEmi = safePrincipal / safeTenure;
  } else {
    const factor = Math.pow(1 + r, safeTenure);
    originalEmi = (safePrincipal * r * factor) / (factor - 1);
  }

  const originalTotalPayment = originalEmi * safeTenure;
  const originalTotalInterest = Math.max(0, originalTotalPayment - safePrincipal);

  // Month-by-month simulation
  const schedule: PrepaymentScheduleRow[] = [];
  let balance = safePrincipal;
  let cumInterest = 0;
  let totalPrepayments = 0;
  let newTenureMonths = safeTenure;

  for (let m = 1; m <= safeTenure; m++) {
    if (balance <= 0) {
      newTenureMonths = m - 1;
      break;
    }

    const interestPart = balance * r;
    cumInterest += interestPart;

    // Determine prepayment for month m
    let prepayThisMonth = 0;
    if (prepaymentType === "extra_emi_yearly" && m % 12 === 0) {
      prepayThisMonth = originalEmi;
    } else if (prepaymentType === "monthly_topup") {
      prepayThisMonth = Math.max(0, prepaymentAmount);
    } else if (prepaymentType === "lumpsum" && m === lumpsumYear * 12) {
      prepayThisMonth = Math.max(0, prepaymentAmount);
    }

    const regularPrincipal = originalEmi - interestPart;
    const totalPrincipalAttempt = regularPrincipal + prepayThisMonth;

    let actualPrincipalPaid = 0;
    let actualEmiPaid = originalEmi;
    let actualPrepayPaid = prepayThisMonth;

    if (totalPrincipalAttempt >= balance) {
      // Loan concludes in this month
      actualPrincipalPaid = balance;
      if (regularPrincipal >= balance) {
        actualEmiPaid = interestPart + balance;
        actualPrepayPaid = 0;
      } else {
        actualPrepayPaid = balance - regularPrincipal;
      }
      balance = 0;
      totalPrepayments += actualPrepayPaid;
      newTenureMonths = m;

      schedule.push({
        month: m,
        emi: Math.round(actualEmiPaid * 100) / 100,
        prepayment: Math.round(actualPrepayPaid * 100) / 100,
        principalPaid: Math.round(actualPrincipalPaid * 100) / 100,
        interestPaid: Math.round(interestPart * 100) / 100,
        balance: 0,
        cumulativeInterest: Math.round(cumInterest * 100) / 100,
      });
      break;
    } else {
      actualPrincipalPaid = totalPrincipalAttempt;
      balance = Math.max(0, balance - totalPrincipalAttempt);
      totalPrepayments += actualPrepayPaid;
      newTenureMonths = m;

      schedule.push({
        month: m,
        emi: Math.round(originalEmi * 100) / 100,
        prepayment: Math.round(actualPrepayPaid * 100) / 100,
        principalPaid: Math.round(actualPrincipalPaid * 100) / 100,
        interestPaid: Math.round(interestPart * 100) / 100,
        balance: Math.round(balance * 100) / 100,
        cumulativeInterest: Math.round(cumInterest * 100) / 100,
      });
    }
  }

  const tenureSavedMonths = Math.max(0, safeTenure - newTenureMonths);
  const tenureSavedYears = Math.round((tenureSavedMonths / 12) * 10) / 10;
  const newTotalInterest = Math.round(cumInterest);
  const interestSaved = Math.max(0, Math.round(originalTotalInterest - newTotalInterest));

  // Scenario A: Prepay loan, then invest freed EMI until month safeTenure
  const monthsFreed = tenureSavedMonths;
  let prepayScenarioWealth = 0;
  if (monthsFreed > 0 && invMonthlyRate > 0) {
    prepayScenarioWealth =
      originalEmi *
      (((Math.pow(1 + invMonthlyRate, monthsFreed) - 1) / invMonthlyRate) *
        (1 + invMonthlyRate));
  } else if (monthsFreed > 0) {
    prepayScenarioWealth = originalEmi * monthsFreed;
  }

  // Scenario B: Invest prepayment amounts directly in mutual funds for safeTenure
  let investScenarioWealth = 0;
  for (let m = 1; m <= safeTenure; m++) {
    let deposit = 0;
    if (prepaymentType === "extra_emi_yearly" && m % 12 === 0) {
      deposit = originalEmi;
    } else if (prepaymentType === "monthly_topup") {
      deposit = Math.max(0, prepaymentAmount);
    } else if (prepaymentType === "lumpsum" && m === lumpsumYear * 12) {
      deposit = Math.max(0, prepaymentAmount);
    }

    if (deposit > 0) {
      const remainingMonths = safeTenure - m + 1;
      if (invMonthlyRate > 0) {
        investScenarioWealth += deposit * Math.pow(1 + invMonthlyRate, remainingMonths);
      } else {
        investScenarioWealth += deposit;
      }
    }
  }

  const roundedPrepayWealth = Math.round(prepayScenarioWealth);
  const roundedInvestWealth = Math.round(investScenarioWealth);
  const wealthDifference = Math.abs(roundedInvestWealth - roundedPrepayWealth);

  let recommendation: "prepay" | "invest" | "neutral" = "neutral";
  if (roundedInvestWealth > roundedPrepayWealth + 1000) {
    recommendation = "invest";
  } else if (roundedPrepayWealth > roundedInvestWealth + 1000) {
    recommendation = "prepay";
  }

  // Break-even return rate (approx loan rate adjusted for compounding)
  const breakEvenRate = Math.round(safeLoanRate * 10) / 10;

  return {
    originalEmi: Math.round(originalEmi),
    originalTotalInterest: Math.round(originalTotalInterest),
    originalTotalPayment: Math.round(originalTotalPayment),
    newTenureMonths,
    tenureSavedMonths,
    tenureSavedYears,
    newTotalInterest,
    interestSaved,
    totalPrepaymentMade: Math.round(totalPrepayments),
    prepayScenarioWealth: roundedPrepayWealth,
    investScenarioWealth: roundedInvestWealth,
    wealthDifference,
    recommendation,
    breakEvenRate,
    schedule,
  };
}

// ─── FEATURE 3: NO-COST EMI & BNPL TRUE COST REVEALER ─────────

export interface NoCostEmiInput {
  productPrice: number;
  tenureMonths: number; // 3, 6, 9, 12, 24
  bankInterestRate?: number; // annual interest e.g. 15%
  processingFee: number; // e.g. 199
  upfrontDiscountForfeited: number; // e.g. ₹3,000 instant discount lost by not paying full upfront
  gstRatePercent?: number; // default 18%
}

export interface NoCostEmiMonthRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  gstOnInterest: number;
  totalMonthlyOutflow: number;
  remainingLoanBalance: number;
}

export interface NoCostEmiOutput {
  productPrice: number;
  monthlyEmi: number;
  totalEmiPaid: number;
  hiddenInterest: number;
  hiddenGst: number;
  processingFeeWithGst: number;
  totalCostEmi: number;
  totalCostUpfront: number;
  netDifference: number; // positive = upfront saves money; negative = EMI is cheaper
  effectiveApr: number; // annualized IRR
  verdict: string;
  cheaperOption: "upfront" | "emi" | "same";
  monthlyBreakdown: NoCostEmiMonthRow[];
}

export function calcNoCostEMITruth(input: NoCostEmiInput): NoCostEmiOutput {
  const {
    productPrice,
    tenureMonths,
    bankInterestRate = 15,
    processingFee,
    upfrontDiscountForfeited,
    gstRatePercent = 18,
  } = input;

  // Defensive input clamping
  const safePrice = Math.max(1, productPrice || 0);
  const safeTenure = Math.max(1, Math.min(60, Math.round(tenureMonths || 3)));
  const safeBankRate = Math.max(0.1, bankInterestRate || 15);
  const safeFee = Math.max(0, processingFee || 0);
  const safeForfeitedDisc = Math.max(0, Math.min(safePrice, upfrontDiscountForfeited || 0));
  const safeGstRate = Math.max(0, gstRatePercent || 18);

  const r = safeBankRate / 12 / 100;
  const gstMultiplier = safeGstRate / 100;

  // Subvention Mechanics:
  // Retailer sets EMI = Price / Tenure
  const monthlyEmi = safePrice / safeTenure;

  // Discounted loan amount sanctioned by the bank:
  const discountFactor = (1 - Math.pow(1 + r, -safeTenure)) / r;
  const loanPrincipal = monthlyEmi * discountFactor;
  const hiddenInterest = Math.max(0, safePrice - loanPrincipal);

  // Month-by-month loan amortization with GST on interest
  const monthlyBreakdown: NoCostEmiMonthRow[] = [];
  let balance = loanPrincipal;
  let totalGstOnInterest = 0;

  for (let m = 1; m <= safeTenure; m++) {
    const interestPart = balance * r;
    const principalPart = Math.min(balance, monthlyEmi - interestPart);
    const gstOnInt = interestPart * gstMultiplier;
    totalGstOnInterest += gstOnInt;

    balance = Math.max(0, balance - principalPart);

    monthlyBreakdown.push({
      month: m,
      emi: Math.round(monthlyEmi * 100) / 100,
      principal: Math.round(principalPart * 100) / 100,
      interest: Math.round(interestPart * 100) / 100,
      gstOnInterest: Math.round(gstOnInt * 100) / 100,
      totalMonthlyOutflow: Math.round((monthlyEmi + gstOnInt) * 100) / 100,
      remainingLoanBalance: Math.round(balance * 100) / 100,
    });
  }

  const processingFeeWithGst = safeFee * (1 + gstMultiplier);
  const totalEmiPaid = safePrice;
  const totalCostEmi = Math.round(totalEmiPaid + totalGstOnInterest + processingFeeWithGst);
  const totalCostUpfront = Math.round(safePrice - safeForfeitedDisc);
  const netDifference = totalCostEmi - totalCostUpfront;

  // Solver for Effective Annual Percentage Rate (APR / IRR)
  // Cashflow: +Net Upfront Amount Saved at t=0; -Total Outflow at t=1..n
  const initialCashflow = totalCostUpfront - processingFeeWithGst;
  const outflows = monthlyBreakdown.map((row) => row.totalMonthlyOutflow);

  let monthlyIrr = 0.01;
  if (initialCashflow > 0 && outflows.length > 0) {
    // Bounded Newton-Raphson
    for (let iter = 0; iter < 60; iter++) {
      let f = -initialCashflow;
      let df = 0;
      for (let t = 1; t <= outflows.length; t++) {
        const disc = Math.pow(1 + monthlyIrr, t);
        f += outflows[t - 1] / disc;
        df -= (t * outflows[t - 1]) / (disc * (1 + monthlyIrr));
      }

      if (Math.abs(f) < 0.0001 || Math.abs(df) < 1e-9) break;
      const step = f / df;
      monthlyIrr = Math.max(-0.5, Math.min(2.0, monthlyIrr - step));
    }
  }

  const annualizedApr = Math.max(0, Math.round(monthlyIrr * 12 * 100 * 10) / 10);

  let cheaperOption: "upfront" | "emi" | "same" = "same";
  let verdict = "";

  if (netDifference > 50) {
    cheaperOption = "upfront";
    verdict = `Paying upfront saves you ₹${Math.round(netDifference).toLocaleString("en-IN")} (True Cost: ${annualizedApr}% APR)`;
  } else if (netDifference < -50) {
    cheaperOption = "emi";
    verdict = `No-Cost EMI is cheaper by ₹${Math.round(Math.abs(netDifference)).toLocaleString("en-IN")}`;
  } else {
    cheaperOption = "same";
    verdict = "Both options cost approximately the same.";
  }

  return {
    productPrice: Math.round(safePrice),
    monthlyEmi: Math.round(monthlyEmi),
    totalEmiPaid: Math.round(totalEmiPaid),
    hiddenInterest: Math.round(hiddenInterest),
    hiddenGst: Math.round(totalGstOnInterest),
    processingFeeWithGst: Math.round(processingFeeWithGst),
    totalCostEmi,
    totalCostUpfront,
    netDifference: Math.round(netDifference),
    effectiveApr: annualizedApr,
    verdict,
    cheaperOption,
    monthlyBreakdown,
  };
}

// ─── FEATURE 4: FIRE & RETIREMENT CALCULATOR ──────────────────

export interface FireInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentMonthlyExpenses: number;
  preRetirementReturn: number; // e.g. 12%
  postRetirementReturn: number; // e.g. 8%
  inflationRate: number; // e.g. 6%
  swrPercent?: number; // e.g. 4%
  currentSavings?: number;
}

export interface FireTimelinePoint {
  age: number;
  year: number;
  phase: "accumulation" | "retirement";
  annualExpenses: number;
  yearlyContribution: number;
  yearlyWithdrawal: number;
  corpus: number;
}

export interface FireOutput {
  yearsToRetirement: number;
  yearsInRetirement: number;
  monthlyExpenseAtRetirement: number;
  annualExpenseAtRetirement: number;
  standardFireCorpus: number;
  leanFireCorpus: number; // 0.75x
  fatFireCorpus: number; // 1.5x
  requiredMonthlySavings: number;
  depletionAge: number | null;
  isPerpetual: boolean;
  timeline: FireTimelinePoint[];
}

export function calcFIRE(input: FireInput): FireOutput {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentMonthlyExpenses,
    preRetirementReturn,
    postRetirementReturn,
    inflationRate,
    swrPercent = 4.0,
    currentSavings = 0,
  } = input;

  const safeCurrentAge = Math.max(18, Math.min(100, Math.round(currentAge || 30)));
  const safeRetireAge = Math.max(safeCurrentAge, Math.min(100, Math.round(retirementAge || 50)));
  const safeLifeExp = Math.max(safeRetireAge + 1, Math.min(120, Math.round(lifeExpectancy || 85)));
  const safeMonthlyExp = Math.max(0, currentMonthlyExpenses || 0);

  const safePreRate = Math.max(0, preRetirementReturn || 12);
  const safePostRate = Math.max(0, postRetirementReturn || 8);
  const safeInflation = Math.max(0, inflationRate || 6);
  const safeSwr = Math.max(0.1, swrPercent || 4.0);
  const safeSavings = Math.max(0, currentSavings || 0);

  const yearsToRetirement = safeRetireAge - safeCurrentAge;
  const yearsInRetirement = safeLifeExp - safeRetireAge;
  const totalYears = safeLifeExp - safeCurrentAge;

  const currentAnnualExpenses = safeMonthlyExp * 12;
  const inflationDec = safeInflation / 100;
  const preRateDec = safePreRate / 100;
  const postRateDec = safePostRate / 100;

  // Annual expense at retirement start
  const annualExpenseAtRetirement =
    currentAnnualExpenses * Math.pow(1 + inflationDec, yearsToRetirement);
  const monthlyExpenseAtRetirement = annualExpenseAtRetirement / 12;

  // Real post-retirement rate of return
  const rReal = (1 + postRateDec) / (1 + inflationDec) - 1;

  // Standard FIRE Corpus needed at retirement date
  let standardFireCorpus = 0;
  if (safeMonthlyExp === 0) {
    standardFireCorpus = 0;
  } else if (Math.abs(rReal) < 1e-7) {
    standardFireCorpus = annualExpenseAtRetirement * yearsInRetirement;
  } else {
    standardFireCorpus =
      annualExpenseAtRetirement *
      ((1 - Math.pow(1 + rReal, -yearsInRetirement)) / rReal);
  }

  const roundedStandard = Math.round(standardFireCorpus);
  const leanFireCorpus = Math.round(roundedStandard * 0.75);
  const fatFireCorpus = Math.round(roundedStandard * 1.5);

  // Required monthly savings calculation
  let requiredMonthlySavings = 0;
  if (yearsToRetirement > 0 && roundedStandard > 0) {
    const fvExisting = safeSavings * Math.pow(1 + preRateDec, yearsToRetirement);
    const shortfall = Math.max(0, roundedStandard - fvExisting);

    const mRate = preRateDec / 12;
    const totalMonths = yearsToRetirement * 12;

    if (mRate === 0) {
      requiredMonthlySavings = shortfall / totalMonths;
    } else {
      requiredMonthlySavings =
        shortfall /
        (((Math.pow(1 + mRate, totalMonths) - 1) / mRate) * (1 + mRate));
    }
  }

  // Yearly timeline generation from currentAge to lifeExpectancy
  const timeline: FireTimelinePoint[] = [];
  let currentCorpus = safeSavings;
  let depletionAge: number | null = null;
  const annualContribution = requiredMonthlySavings * 12;

  for (let y = 1; y <= totalYears; y++) {
    const currentSimAge = safeCurrentAge + y;
    const isAccumulation = currentSimAge <= safeRetireAge;

    let annualExp = currentAnnualExpenses * Math.pow(1 + inflationDec, y);
    let contribution = 0;
    let withdrawal = 0;

    if (isAccumulation) {
      contribution = annualContribution;
      currentCorpus = (currentCorpus + contribution) * (1 + preRateDec);
    } else {
      const retirementYearIndex = currentSimAge - safeRetireAge;
      withdrawal =
        annualExpenseAtRetirement *
        Math.pow(1 + inflationDec, retirementYearIndex - 1);

      if (currentCorpus > 0) {
        const netAfterWithdrawal = currentCorpus - withdrawal;
        if (netAfterWithdrawal <= 0) {
          currentCorpus = 0;
          if (depletionAge === null) {
            depletionAge = currentSimAge;
          }
        } else {
          currentCorpus = netAfterWithdrawal * (1 + postRateDec);
        }
      } else {
        currentCorpus = 0;
        if (depletionAge === null) {
          depletionAge = currentSimAge;
        }
      }
    }

    timeline.push({
      age: currentSimAge,
      year: y,
      phase: isAccumulation ? "accumulation" : "retirement",
      annualExpenses: Math.round(annualExp),
      yearlyContribution: Math.round(contribution),
      yearlyWithdrawal: Math.round(withdrawal),
      corpus: Math.round(currentCorpus),
    });
  }

  const isPerpetual = rReal > 0 && rReal >= safeSwr / 100;

  return {
    yearsToRetirement,
    yearsInRetirement,
    monthlyExpenseAtRetirement: Math.round(monthlyExpenseAtRetirement),
    annualExpenseAtRetirement: Math.round(annualExpenseAtRetirement),
    standardFireCorpus: roundedStandard,
    leanFireCorpus,
    fatFireCorpus,
    requiredMonthlySavings: Math.round(requiredMonthlySavings),
    depletionAge,
    isPerpetual,
    timeline,
  };
}

// ─── PART B — FEATURE 1: CAPITAL GAINS TAX CALCULATOR ─────────

export type AssetClass = "equity" | "debt_mf" | "real_estate" | "gold_sgb";

export const CII_TABLE: Record<number, number> = {
  2001: 100, 2002: 105, 2003: 109, 2004: 113, 2005: 117,
  2006: 122, 2007: 129, 2008: 137, 2009: 148, 2010: 167,
  2011: 184, 2012: 200, 2013: 220, 2014: 240, 2015: 254,
  2016: 264, 2017: 272, 2018: 280, 2019: 289, 2020: 301,
  2021: 317, 2022: 331, 2023: 348, 2024: 363, 2025: 363,
};

export interface CapitalGainsInput {
  assetClass: AssetClass;
  purchaseDate?: string; // YYYY-MM-DD
  saleDate?: string;     // YYYY-MM-DD
  holdingMonths?: number;
  purchasePrice: number;
  salePrice: number;
  transferExpenses?: number;
  purchaseCiiYear?: number;
  saleCiiYear?: number;
  isPurchasedBeforeCutoff?: boolean; // Cutoff: 23 July 2024
  investorSlabRatePercent?: number;
  priorExemptionUsed?: number; // Equity ₹1.25L exemption tracking
}

export interface CapitalGainsOutput {
  taxYear: string;
  assetClass: AssetClass;
  gainType: "LTCG" | "STCG" | "LOSS";
  holdingMonths: number;
  grossSaleValue: number;
  netSaleValue: number;
  purchasePrice: number;
  transferExpenses: number;
  rawCapitalGain: number;
  isLoss: boolean;
  exemptionAllowed: number;
  taxableGain: number;
  taxRatePercent: number;
  totalTaxPayable: number;
  effectiveTaxRate: number;
  realEstateComparison?: {
    unindexedGain: number;
    unindexedTax: number;
    indexedCost: number;
    indexedGain: number;
    indexedTax: number;
    recommendedOption: "unindexed_12_5" | "indexed_20";
    taxSavedByBestOption: number;
  };
  explanation: string;
}

export function calcCapitalGains(input: CapitalGainsInput): CapitalGainsOutput {
  const {
    assetClass,
    purchaseDate,
    saleDate,
    purchasePrice,
    salePrice,
    transferExpenses = 0,
    purchaseCiiYear = 2015,
    saleCiiYear = 2024,
    investorSlabRatePercent = 30,
    priorExemptionUsed = 0,
  } = input;

  const safeBuy = Math.max(0, purchasePrice || 0);
  const safeSale = Math.max(0, salePrice || 0);
  const safeExp = Math.max(0, transferExpenses || 0);
  const safeSlab = Math.max(0, investorSlabRatePercent || 30);
  const safePriorExemption = Math.max(0, Math.min(125000, priorExemptionUsed || 0));

  // Determine holding months
  let holdingMonths = input.holdingMonths ?? 0;
  let isPurchasedBeforeCutoff = input.isPurchasedBeforeCutoff;

  if (purchaseDate && saleDate) {
    const pDate = new Date(purchaseDate);
    const sDate = new Date(saleDate);
    const diffTime = sDate.getTime() - pDate.getTime();
    const diffDays = Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
    holdingMonths = Math.round((diffDays / 365.25) * 12 * 10) / 10;

    // Check 23 July 2024 cutoff
    const cutoffDate = new Date("2024-07-23");
    if (isPurchasedBeforeCutoff === undefined) {
      isPurchasedBeforeCutoff = pDate < cutoffDate;
    }
  } else if (isPurchasedBeforeCutoff === undefined) {
    isPurchasedBeforeCutoff = purchaseCiiYear < 2024;
  }

  const netSaleValue = Math.max(0, safeSale - safeExp);
  const rawCapitalGain = netSaleValue - safeBuy;
  const isLoss = rawCapitalGain <= 0;

  let gainType: "LTCG" | "STCG" | "LOSS" = isLoss ? "LOSS" : "STCG";

  // Determine LTCG threshold: Equity = >12m, Real Estate = >24m, Gold = >24m, Debt MF = N/A
  let isLtcg = false;
  if (!isLoss) {
    if (assetClass === "equity" && holdingMonths > 12) {
      isLtcg = true;
    } else if ((assetClass === "real_estate" || assetClass === "gold_sgb") && holdingMonths > 24) {
      isLtcg = true;
    }
    gainType = isLtcg ? "LTCG" : "STCG";
  }

  let exemptionAllowed = 0;
  let taxableGain = Math.max(0, rawCapitalGain);
  let taxRatePercent = 0;
  let totalTaxPayable = 0;
  let realEstateComparison: CapitalGainsOutput["realEstateComparison"];
  let explanation = "";

  if (isLoss) {
    taxableGain = 0;
    totalTaxPayable = 0;
    explanation = `Capital Loss of ₹${Math.abs(Math.round(rawCapitalGain)).toLocaleString("en-IN")}. No tax is payable. This loss can be set off or carried forward for up to 8 financial years.`;
  } else if (assetClass === "debt_mf") {
    // All debt mutual funds taxed at investor slab rate
    gainType = "STCG";
    taxRatePercent = safeSlab;
    totalTaxPayable = (taxableGain * safeSlab) / 100;
    explanation = `Debt Mutual Fund gains are taxed at your income tax slab rate (${safeSlab}%) regardless of holding duration (Tax Year 2026-27).`;
  } else if (assetClass === "equity") {
    if (isLtcg) {
      // LTCG: 12.5% with ₹1.25L exemption (Tax Year 2026-27)
      taxRatePercent = 12.5;
      const remainingExemption = Math.max(0, 125000 - safePriorExemption);
      exemptionAllowed = Math.min(taxableGain, remainingExemption);
      const taxablePortion = Math.max(0, taxableGain - exemptionAllowed);
      totalTaxPayable = (taxablePortion * 12.5) / 100;
      explanation = `Tax Year 2026-27: Listed Equity LTCG (>12 months) is taxed at 12.5%. Statutory exemption of ₹${Math.round(exemptionAllowed).toLocaleString("en-IN")} applied (out of ₹1.25L limit).`;
    } else {
      // STCG: 20%
      taxRatePercent = 20;
      totalTaxPayable = (taxableGain * 20) / 100;
      explanation = `Tax Year 2026-27: Listed Equity STCG (≤12 months) is taxed at a flat 20% rate.`;
    }
  } else if (assetClass === "real_estate") {
    if (isLtcg) {
      const unindexedTax = (taxableGain * 12.5) / 100;

      if (isPurchasedBeforeCutoff) {
        // Grandfathering: Calculate both 12.5% without indexation and 20% with indexation
        const buyCii = CII_TABLE[purchaseCiiYear] || 254;
        const sellCii = CII_TABLE[saleCiiYear] || 363;
        const indexedCost = safeBuy * (sellCii / buyCii);
        const indexedGain = Math.max(0, netSaleValue - indexedCost);
        const indexedTax = (indexedGain * 20) / 100;

        const isUnindexedBetter = unindexedTax <= indexedTax;
        const recommendedOption = isUnindexedBetter ? "unindexed_12_5" : "indexed_20";
        totalTaxPayable = Math.min(unindexedTax, indexedTax);
        taxRatePercent = isUnindexedBetter ? 12.5 : 20;
        const taxSaved = Math.abs(unindexedTax - indexedTax);

        realEstateComparison = {
          unindexedGain: Math.round(taxableGain),
          unindexedTax: Math.round(unindexedTax),
          indexedCost: Math.round(indexedCost),
          indexedGain: Math.round(indexedGain),
          indexedTax: Math.round(indexedTax),
          recommendedOption,
          taxSavedByBestOption: Math.round(taxSaved),
        };

        explanation = `Grandfathered property (bought before 23 July 2024): ${
          isUnindexedBetter
            ? `12.5% without indexation saves you ₹${Math.round(taxSaved).toLocaleString("en-IN")} compared to 20% with indexation.`
            : `20% with indexation saves you ₹${Math.round(taxSaved).toLocaleString("en-IN")} compared to 12.5% without indexation.`
        }`;
      } else {
        // Purchased on or after 23 July 2024: Flat 12.5% without indexation only
        taxRatePercent = 12.5;
        totalTaxPayable = unindexedTax;
        explanation = `Property purchased on/after 23 July 2024: Taxed at 12.5% LTCG (>24 months) without indexation benefit (Tax Year 2026-27).`;
      }
    } else {
      // STCG: Slab rate
      taxRatePercent = safeSlab;
      totalTaxPayable = (taxableGain * safeSlab) / 100;
      explanation = `Real Estate STCG (≤24 months) is taxed at your regular income tax slab rate (${safeSlab}%).`;
    }
  } else if (assetClass === "gold_sgb") {
    if (isLtcg) {
      taxRatePercent = 12.5;
      totalTaxPayable = (taxableGain * 12.5) / 100;
      explanation = `Physical Gold & Gold ETF LTCG (>24 months) is taxed at 12.5% without indexation (Tax Year 2026-27).`;
    } else {
      taxRatePercent = safeSlab;
      totalTaxPayable = (taxableGain * safeSlab) / 100;
      explanation = `Gold STCG (≤24 months) is taxed at your income tax slab rate (${safeSlab}%).`;
    }
  }

  const effectiveTaxRate =
    rawCapitalGain > 0
      ? Math.round((totalTaxPayable / rawCapitalGain) * 100 * 100) / 100
      : 0;

  return {
    taxYear: CURRENT_TAX_YEAR,
    assetClass,
    gainType,
    holdingMonths,
    grossSaleValue: Math.round(safeSale),
    netSaleValue: Math.round(netSaleValue),
    purchasePrice: Math.round(safeBuy),
    transferExpenses: Math.round(safeExp),
    rawCapitalGain: Math.round(rawCapitalGain),
    isLoss,
    exemptionAllowed: Math.round(exemptionAllowed),
    taxableGain: Math.round(taxableGain),
    taxRatePercent,
    totalTaxPayable: Math.round(totalTaxPayable),
    effectiveTaxRate,
    realEstateComparison,
    explanation,
  };
}

// ─── PART B — FEATURE 2: F&O BROKERAGE & BREAK-EVEN CALCULATOR ──

export type FnOInstrument = "futures" | "options";
export type FnOTaxYear = "tax_year_2026_27" | "pre_april_2026";

export interface FnOBreakevenInput {
  instrument: FnOInstrument;
  buyPrice: number;
  sellPrice: number;
  quantity: number; // total shares / units (lots * lotSize)
  brokeragePerOrder?: number; // default ₹20 per executed order
  taxYear?: FnOTaxYear; // default: "tax_year_2026_27" (STT: Futures 0.05%, Options 0.15%)
  sttRatePercent?: number; // Options: 0.15% flat (Tax Year 2026-27) or custom; Futures: 0.05%
  exchangeChargeRatePercent?: number; // Options: ~0.05% on premium; Futures: ~0.003% on turnover
  sebiTurnoverFeePercent?: number; // 0.0001% (₹10 per Crore)
  gstRatePercent?: number; // 18% on (brokerage + exchange charges + sebi fee)
  stampDutyPercent?: number; // Buy side only: Options 0.003%, Futures 0.002%
}

export interface FnOBreakevenOutput {
  instrument: FnOInstrument;
  taxYear: FnOTaxYear;
  taxYearLabel: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  buyTurnover: number;
  sellTurnover: number;
  totalTurnover: number;
  grossPnl: number;
  sttRatePercentUsed: number;
  charges: {
    brokerage: number;
    stt: number;
    exchangeCharges: number;
    gst: number;
    sebiFees: number;
    stampDuty: number;
  };
  totalCharges: number;
  netPnl: number;
  isProfit: boolean;
  breakevenSellPrice: number;
  pointsToBreakeven: number;
}

function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function calcFnOBreakeven(input: FnOBreakevenInput): FnOBreakevenOutput {
  const {
    instrument,
    buyPrice,
    sellPrice,
    quantity,
    brokeragePerOrder = 20,
    gstRatePercent = 18,
    taxYear = "tax_year_2026_27",
  } = input;

  const safeBuy = Math.max(0, buyPrice || 0);
  const safeSell = Math.max(0, sellPrice || 0);
  const safeQty = Math.max(0, quantity || 0);
  const safeBrokerageOrder = Math.max(0, brokeragePerOrder);

  const buyTurnover = round2(safeBuy * safeQty);
  const sellTurnover = round2(safeSell * safeQty);
  const totalTurnover = round2(buyTurnover + sellTurnover);
  const grossPnl = round2(sellTurnover - buyTurnover);

  // STT Rates: Tax Year 2026-27 (effective 1 April 2026: Futures 0.05%, Options 0.15% flat) vs Pre-April 2026
  const isTaxYear2026_27 = taxYear === "tax_year_2026_27";
  const defaultSttRate = isTaxYear2026_27
    ? (instrument === "options" ? 0.15 : 0.05)
    : (instrument === "options" ? 0.10 : 0.02);

  const defaultExchangeRate = instrument === "options" ? 0.05 : 0.0032;
  const defaultSebiRate = 0.0001; // ₹10 per crore
  const defaultStampDuty = instrument === "options" ? 0.003 : 0.002;

  const sttRate = input.sttRatePercent ?? defaultSttRate;
  const exchangeRate = input.exchangeChargeRatePercent ?? defaultExchangeRate;
  const sebiRate = input.sebiTurnoverFeePercent ?? defaultSebiRate;
  const stampDutyRate = input.stampDutyPercent ?? defaultStampDuty;

  // 1. Brokerage: 2 orders (buy + sell)
  const brokerage = safeQty > 0 ? round2(safeBrokerageOrder * 2) : 0;

  // 2. STT: Applied ONLY on sell side
  const stt = safeQty > 0 ? round2((sellTurnover * sttRate) / 100) : 0;

  // 3. Exchange charges: Applied on total turnover
  const exchangeCharges = safeQty > 0 ? round2((totalTurnover * exchangeRate) / 100) : 0;

  // 4. SEBI turnover fee: Applied on total turnover
  const sebiFees = safeQty > 0 ? round2((totalTurnover * sebiRate) / 100) : 0;

  // 5. Stamp duty: Applied ONLY on buy side
  const stampDuty = safeQty > 0 ? round2((buyTurnover * stampDutyRate) / 100) : 0;

  // 6. GST: 18% applied strictly on (brokerage + exchangeCharges + sebiFees)
  const gstTaxable = round2(brokerage + exchangeCharges + sebiFees);
  const gst = safeQty > 0 ? round2((gstTaxable * gstRatePercent) / 100) : 0;

  // Total charges = exact sum of line items to prevent penny drift
  const totalCharges = round2(brokerage + stt + exchangeCharges + gst + sebiFees + stampDuty);
  const netPnl = round2(grossPnl - totalCharges);
  const isProfit = netPnl > 0;

  const pointsToBreakeven = safeQty > 0 ? round2(totalCharges / safeQty) : 0;
  const breakevenSellPrice = round2(safeBuy + pointsToBreakeven);

  return {
    instrument,
    taxYear,
    taxYearLabel: isTaxYear2026_27 ? "Tax Year 2026-27 (Current)" : "Pre-April 2026 (Historical)",
    buyPrice: safeBuy,
    sellPrice: safeSell,
    quantity: safeQty,
    buyTurnover,
    sellTurnover,
    totalTurnover,
    grossPnl,
    sttRatePercentUsed: sttRate,
    charges: {
      brokerage,
      stt,
      exchangeCharges,
      gst,
      sebiFees,
      stampDuty,
    },
    totalCharges,
    netPnl,
    isProfit,
    breakevenSellPrice,
    pointsToBreakeven,
  };
}

// ─── PART B — FEATURE 3: OPTION STRATEGY PAYOFF VISUALIZER ────

export type OptionType = "call" | "put";
export type OptionPosition = "long" | "short";

export interface OptionLeg {
  id: string;
  name?: string;
  type: OptionType;
  position: OptionPosition;
  strike: number;
  premium: number;
  lots: number;
}

export type OptionStrategyPreset =
  | "bull_call_spread"
  | "bear_put_spread"
  | "long_straddle"
  | "long_strangle"
  | "iron_condor"
  | "covered_call"
  | "custom";

export interface OptionPayoffInput {
  legs: OptionLeg[];
  lotSize: number; // e.g. 50
  underlyingPrice?: number;
  minSpot?: number;
  maxSpot?: number;
  step?: number;
}

export interface PayoffDataPoint {
  spot: number;
  pnl: number;
  [legKey: string]: number;
}

export interface OptionPayoffOutput {
  legs: OptionLeg[];
  lotSize: number;
  underlyingPrice: number;
  chartData: PayoffDataPoint[];
  maxProfit: number | "Unlimited";
  maxLoss: number | "Unlimited";
  riskRewardRatio: string;
  breakevens: number[];
  netPremiumPaidOrReceived: number;
  isNetCredit: boolean;
}

export function calcOptionPayoff(input: OptionPayoffInput): OptionPayoffOutput {
  const { legs, lotSize = 50, underlyingPrice = 24000 } = input;
  const safeLotSize = Math.max(1, lotSize);
  const safeUnderlying = Math.max(0, underlyingPrice);

  if (!legs || legs.length === 0) {
    return {
      legs: [],
      lotSize: safeLotSize,
      underlyingPrice: safeUnderlying,
      chartData: [],
      maxProfit: 0,
      maxLoss: 0,
      riskRewardRatio: "1 : 1",
      breakevens: [],
      netPremiumPaidOrReceived: 0,
      isNetCredit: false,
    };
  }

  // Determine spot price range for evaluation
  const strikes = legs.map((l) => l.strike).filter((s) => s > 0);
  const minStrike = strikes.length > 0 ? Math.min(...strikes) : safeUnderlying;
  const maxStrike = strikes.length > 0 ? Math.max(...strikes) : safeUnderlying;
  const baseRange = Math.max(maxStrike - minStrike, safeUnderlying * 0.1, 500);

  const minSpot = Math.max(0, input.minSpot ?? Math.floor((minStrike - baseRange * 1.5) / 100) * 100);
  const maxSpot = input.maxSpot ?? Math.ceil((maxStrike + baseRange * 1.5) / 100) * 100;
  const numSteps = 80;
  const step = input.step ?? Math.max(10, Math.round((maxSpot - minSpot) / numSteps));

  // Compute Net Premium (Debit vs Credit)
  let netPremium = 0;
  for (const leg of legs) {
    const qty = leg.lots * safeLotSize;
    if (leg.position === "long") {
      netPremium += leg.premium * qty; // Debit (paid)
    } else {
      netPremium -= leg.premium * qty; // Credit (received)
    }
  }

  // Generate comprehensive sample spot prices including exact critical points
  const spotSet = new Set<number>();
  for (let s = minSpot; s <= maxSpot; s += step) {
    spotSet.add(s);
  }
  for (const leg of legs) {
    if (leg.strike >= minSpot && leg.strike <= maxSpot) spotSet.add(leg.strike);
    if (leg.strike - leg.premium >= minSpot) spotSet.add(round2(leg.strike - leg.premium));
    if (leg.strike + leg.premium <= maxSpot) spotSet.add(round2(leg.strike + leg.premium));
    // For net debit/credit offsets across all legs
    const totalNetPrem = Math.abs(netPremium / safeLotSize);
    if (leg.strike - totalNetPrem >= minSpot) spotSet.add(round2(leg.strike - totalNetPrem));
    if (leg.strike + totalNetPrem <= maxSpot) spotSet.add(round2(leg.strike + totalNetPrem));
  }
  const sortedSpots = Array.from(spotSet).sort((a, b) => a - b);

  // Calculate Payoff Curve across Spot Range
  const chartData: PayoffDataPoint[] = [];
  let minPnl = Infinity;
  let maxPnl = -Infinity;

  for (const s of sortedSpots) {
    let combinedPnl = 0;
    const point: PayoffDataPoint = { spot: s, pnl: 0 };

    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];
      const qty = leg.lots * safeLotSize;
      let legPnl = 0;

      if (leg.type === "call") {
        const intrinsic = Math.max(0, s - leg.strike);
        legPnl = leg.position === "long" ? (intrinsic - leg.premium) * qty : (leg.premium - intrinsic) * qty;
      } else {
        const intrinsic = Math.max(0, leg.strike - s);
        legPnl = leg.position === "long" ? (intrinsic - leg.premium) * qty : (leg.premium - intrinsic) * qty;
      }

      point[`leg_${i}`] = round2(legPnl);
      combinedPnl += legPnl;
    }

    point.pnl = round2(combinedPnl);
    if (combinedPnl < minPnl) minPnl = combinedPnl;
    if (combinedPnl > maxPnl) maxPnl = combinedPnl;
    chartData.push(point);
  }

  // Breakeven Detection (Zero-crossings via exact checks & linear interpolation)
  const breakevens: number[] = [];
  for (let i = 0; i < chartData.length; i++) {
    const p1 = chartData[i];
    if (Math.abs(p1.pnl) < 0.01) {
      if (!breakevens.some((b) => Math.abs(b - p1.spot) < 1)) {
        breakevens.push(p1.spot);
      }
    } else if (i < chartData.length - 1) {
      const p2 = chartData[i + 1];
      if ((p1.pnl < 0 && p2.pnl > 0) || (p1.pnl > 0 && p2.pnl < 0)) {
        const zeroSpot = round2(p1.spot + (-p1.pnl * (p2.spot - p1.spot)) / (p2.pnl - p1.pnl));
        if (!breakevens.some((b) => Math.abs(b - zeroSpot) < 5)) {
          breakevens.push(zeroSpot);
        }
      }
    }
  }

  // Detect Uncapped / Unlimited Upside or Downside
  // Check slopes at extremes
  const leftSlope = chartData.length > 2 ? chartData[1].pnl - chartData[0].pnl : 0;
  const rightSlope = chartData.length > 2 ? chartData[chartData.length - 1].pnl - chartData[chartData.length - 2].pnl : 0;

  let maxProfitResult: number | "Unlimited" = round2(maxPnl);
  let maxLossResult: number | "Unlimited" = round2(minPnl);

  if (rightSlope > 5) {
    maxProfitResult = "Unlimited";
  } else if (rightSlope < -5) {
    maxLossResult = "Unlimited";
  }

  if (leftSlope < -5 && minSpot === 0) {
    // Put downside capped at spot = 0
  }

  let riskRewardRatio = "1 : 1";
  if (typeof maxProfitResult === "number" && typeof maxLossResult === "number" && maxLossResult !== 0) {
    const ratio = Math.abs(maxProfitResult / maxLossResult);
    riskRewardRatio = `1 : ${round2(ratio)}`;
  } else if (maxProfitResult === "Unlimited") {
    riskRewardRatio = "1 : Unlimited";
  }

  return {
    legs,
    lotSize: safeLotSize,
    underlyingPrice: safeUnderlying,
    chartData,
    maxProfit: maxProfitResult,
    maxLoss: maxLossResult,
    riskRewardRatio,
    breakevens,
    netPremiumPaidOrReceived: round2(netPremium),
    isNetCredit: netPremium < 0,
  };
}

export function getOptionPresetLegs(preset: OptionStrategyPreset, spotPrice = 24000): OptionLeg[] {
  const roundSpot = Math.round(spotPrice / 100) * 100;

  switch (preset) {
    case "bull_call_spread":
      return [
        { id: "1", name: "ATM Long Call", type: "call", position: "long", strike: roundSpot, premium: 200, lots: 1 },
        { id: "2", name: "OTM Short Call", type: "call", position: "short", strike: roundSpot + 300, premium: 80, lots: 1 },
      ];
    case "bear_put_spread":
      return [
        { id: "1", name: "ATM Long Put", type: "put", position: "long", strike: roundSpot, premium: 190, lots: 1 },
        { id: "2", name: "OTM Short Put", type: "put", position: "short", strike: roundSpot - 300, premium: 75, lots: 1 },
      ];
    case "long_straddle":
      return [
        { id: "1", name: "ATM Long Call", type: "call", position: "long", strike: roundSpot, premium: 220, lots: 1 },
        { id: "2", name: "ATM Long Put", type: "put", position: "long", strike: roundSpot, premium: 210, lots: 1 },
      ];
    case "long_strangle":
      return [
        { id: "1", name: "OTM Long Call", type: "call", position: "long", strike: roundSpot + 200, premium: 120, lots: 1 },
        { id: "2", name: "OTM Long Put", type: "put", position: "long", strike: roundSpot - 200, premium: 115, lots: 1 },
      ];
    case "iron_condor":
      return [
        { id: "1", name: "Far OTM Long Put", type: "put", position: "long", strike: roundSpot - 500, premium: 40, lots: 1 },
        { id: "2", name: "OTM Short Put", type: "put", position: "short", strike: roundSpot - 200, premium: 110, lots: 1 },
        { id: "3", name: "OTM Short Call", type: "call", position: "short", strike: roundSpot + 200, premium: 115, lots: 1 },
        { id: "4", name: "Far OTM Long Call", type: "call", position: "long", strike: roundSpot + 500, premium: 45, lots: 1 },
      ];
    case "covered_call":
      return [
        { id: "1", name: "Deep ITM Long Call (Stock proxy)", type: "call", position: "long", strike: roundSpot - 1000, premium: 1020, lots: 1 },
        { id: "2", name: "OTM Short Call", type: "call", position: "short", strike: roundSpot + 300, premium: 90, lots: 1 },
      ];
    default:
      return [
        { id: "1", name: "ATM Long Call", type: "call", position: "long", strike: roundSpot, premium: 200, lots: 1 },
      ];
  }
}

// ─── HRA EXEMPTION CALCULATOR ─────────────────────────────────
/**
 * HRA Exemption Calculator (Section 10(13A) of Income Tax Act)
 *
 * Exempt HRA is minimum of:
 * 1. Actual HRA received
 * 2. Rent paid minus 10% of salary (Basic + DA if included)
 * 3. 50% of salary (Metro: Delhi, Mumbai, Kolkata, Chennai) or 40% (Non-Metro)
 *
 * Also calculates net household tax benefit for "paying rent to parents" mode
 * incorporating Section 24(a) 30% statutory deduction for parents.
 */
export function calcHRAExemption(input: HRAExemptionInput): HRAExemptionOutput {
  const {
    basicSalary,
    salaryPeriod = "monthly",
    dearnessAllowance = 0,
    daFormsPartOfRetirementBenefits = false,
    hraReceived,
    rentPaid,
    cityType,
    isPayingToParents = false,
    parentsSlabRatePercent = 0,
    userSlabRatePercent = 30,
  } = input;

  const multiplier = salaryPeriod === "annual" ? 1 : 12;

  const safeBasic = Math.max(0, basicSalary || 0);
  const safeDa = daFormsPartOfRetirementBenefits ? Math.max(0, dearnessAllowance || 0) : 0;
  const safeHra = Math.max(0, hraReceived || 0);
  const safeRent = Math.max(0, rentPaid || 0);

  const annualBasicSalaryBase = (safeBasic + safeDa) * multiplier;
  const monthlyBasicSalaryBase = annualBasicSalaryBase / 12;

  const annualHraReceived = safeHra * multiplier;
  const monthlyHraReceived = annualHraReceived / 12;

  const annualRentPaid = safeRent * multiplier;
  const monthlyRentPaid = annualRentPaid / 12;

  // Limits
  const actualHraLimit = annualHraReceived;
  const rentMinusTenPercentLimit = Math.max(0, annualRentPaid - 0.10 * annualBasicSalaryBase);
  const salaryPercentageUsed = cityType === "metro" ? 50 : 40;
  const salaryPercentageLimit = (salaryPercentageUsed / 100) * annualBasicSalaryBase;

  // Minimum of three
  let annualExemptHra = 0;
  let bindingConstraint: HRAExemptionOutput["bindingConstraint"] = "actual_hra";

  if (annualHraReceived > 0 && annualRentPaid > 0) {
    const minCalculated = Math.min(actualHraLimit, rentMinusTenPercentLimit, salaryPercentageLimit);
    annualExemptHra = Math.max(0, Math.min(minCalculated, annualHraReceived));

    if (annualExemptHra === actualHraLimit) {
      bindingConstraint = "actual_hra";
    } else if (annualExemptHra === rentMinusTenPercentLimit) {
      bindingConstraint = "rent_minus_10pct";
    } else {
      bindingConstraint = "salary_cap";
    }
  } else {
    annualExemptHra = 0;
    bindingConstraint = annualHraReceived === 0 ? "actual_hra" : "rent_minus_10pct";
  }

  // Round to nearest rupee
  annualExemptHra = Math.round(annualExemptHra);
  const monthlyExemptHra = Math.round((annualExemptHra / 12) * 100) / 100;

  const annualTaxableHra = Math.max(0, Math.round(annualHraReceived - annualExemptHra));
  const monthlyTaxableHra = Math.round((annualTaxableHra / 12) * 100) / 100;

  const safeUserSlab = Math.max(0, userSlabRatePercent || 0);
  const taxSaved = Math.round((annualExemptHra * safeUserSlab) / 100);

  // Paying rent to parents mode
  let payingToParentsDetails: HRAExemptionOutput["payingToParentsDetails"] | undefined = undefined;

  if (isPayingToParents) {
    const parentGrossRentalIncome = annualRentPaid;
    // Section 24(a) statutory deduction: 30% on rental income
    const parentStandardDeductionSection24 = Math.round(parentGrossRentalIncome * 0.30);
    const parentTaxableRentalIncome = Math.max(0, parentGrossRentalIncome - parentStandardDeductionSection24);
    const safeParentSlab = Math.max(0, parentsSlabRatePercent || 0);
    const parentTaxPayable = Math.round((parentTaxableRentalIncome * safeParentSlab) / 100);
    const employeeTaxSaved = taxSaved;
    const netHouseholdTaxSaved = employeeTaxSaved - parentTaxPayable;
    const isBeneficial = netHouseholdTaxSaved > 0;

    let recommendation = "";
    if (safeParentSlab >= safeUserSlab) {
      recommendation = `Not tax-optimal: Parent is in ${safeParentSlab}% slab vs your ${safeUserSlab}% slab. Net household tax increases or remains neutral.`;
    } else if (isBeneficial) {
      recommendation = `Highly beneficial! You save ₹${employeeTaxSaved.toLocaleString("en-IN")}, parents pay ₹${parentTaxPayable.toLocaleString("en-IN")}, resulting in a net family tax savings of ₹${netHouseholdTaxSaved.toLocaleString("en-IN")}/year.`;
    } else {
      recommendation = `Neutral impact: Net family savings is ₹${netHouseholdTaxSaved.toLocaleString("en-IN")}.`;
    }

    payingToParentsDetails = {
      parentGrossRentalIncome,
      parentStandardDeductionSection24,
      parentTaxableRentalIncome,
      parentTaxPayable,
      employeeTaxSaved,
      netHouseholdTaxSaved,
      isBeneficial,
      recommendation,
    };
  }

  let summary = "";
  if (annualExemptHra === 0) {
    if (annualHraReceived === 0) {
      summary = "No HRA component received from employer. Exemption is ₹0.";
    } else if (annualRentPaid === 0) {
      summary = "No rent paid. Full HRA received is taxable.";
    } else {
      summary = "Rent paid is less than or equal to 10% of basic salary. No HRA exemption is admissible.";
    }
  } else {
    summary = `You are eligible for ₹${annualExemptHra.toLocaleString("en-IN")}/year (₹${Math.round(annualExemptHra / 12).toLocaleString("en-IN")}/mo) HRA tax exemption under Section 10(13A).`;
  }

  return {
    salaryPeriod,
    annualBasicSalaryBase: Math.round(annualBasicSalaryBase),
    monthlyBasicSalaryBase: Math.round(monthlyBasicSalaryBase),
    annualHraReceived: Math.round(annualHraReceived),
    monthlyHraReceived: Math.round(monthlyHraReceived),
    annualRentPaid: Math.round(annualRentPaid),
    monthlyRentPaid: Math.round(monthlyRentPaid),
    cityType,
    actualHraLimit: Math.round(actualHraLimit),
    rentMinusTenPercentLimit: Math.round(rentMinusTenPercentLimit),
    salaryPercentageLimit: Math.round(salaryPercentageLimit),
    salaryPercentageUsed,
    bindingConstraint,
    annualExemptHra,
    monthlyExemptHra,
    annualTaxableHra,
    monthlyTaxableHra,
    taxSaved,
    payingToParentsDetails,
    summary,
  };
}

// ─── PRESUMPTIVE TAXATION ENGINE (44AD & 44ADA) ───────────────
/**
 * Helper to compute income tax on PGBP (Profits & Gains from Business or Profession)
 * Reuses official slab rates, rebates u/s 87A, surcharges, and cess without salary standard deductions.
 */
export function computePGBPTax(
  netBusinessIncome: number,
  regime: TaxRegime = "new",
  deduction80C = 0,
  deduction80D = 0,
  otherDeductions = 0
): {
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  slabBreakdown: TaxSlabRow[];
} {
  const safeIncome = Math.max(0, netBusinessIncome || 0);
  let totalDeductions = 0;
  if (regime === "old") {
    const capped80C = Math.min(deduction80C, 150000);
    const capped80D = Math.min(deduction80D, 100000);
    totalDeductions = capped80C + capped80D + (otherDeductions || 0);
  }
  const taxableIncome = Math.max(0, safeIncome - totalDeductions);
  const slabs = regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  const { rawTax, breakdown } = internalSlabCalc(taxableIncome, slabs);

  // Rebate u/s 87A
  let rebate = 0;
  if (regime === "new" && taxableIncome <= 1200000) {
    rebate = rawTax; // Full rebate up to ₹12L in FY 2025-26 new regime
  } else if (regime === "old" && taxableIncome <= 500000) {
    rebate = Math.min(rawTax, 12500);
  }

  const taxAfterRebate = Math.max(0, rawTax - rebate);
  const surcharge = internalSurcharge(taxAfterRebate, safeIncome);
  const cess = (taxAfterRebate + surcharge) * 0.04;
  const totalTax = Math.round(taxAfterRebate + surcharge + cess);
  const effectiveRate = safeIncome > 0 ? Math.round((totalTax / safeIncome) * 100 * 100) / 100 : 0;

  return {
    taxableIncome: Math.round(taxableIncome),
    totalTax,
    effectiveRate,
    slabBreakdown: breakdown,
  };
}

/**
 * Presumptive Taxation Calculator (Section 44AD & Section 44ADA)
 *
 * Section 44ADA (Professionals):
 * - Presumptive profit: 50% of gross receipts
 * - Threshold: ₹50 Lakhs (base) or ₹75 Lakhs (enhanced if digital receipts ≥ 95%)
 *
 * Section 44AD (Eligible Businesses):
 * - Presumptive profit: 6% on digital turnover + 8% on cash turnover
 * - Threshold: ₹2 Crore (base) or ₹3 Crore (enhanced if digital receipts ≥ 95%)
 *
 * Audit Triggers:
 * - If actual profit < presumptive income and total income > basic exemption limit,
 *   maintaining books u/s 44AA and tax audit u/s 44AB are triggered.
 * - Under 44AD(4), opting out also locks the assessee out of 44AD for the next 5 consecutive AYs.
 */
export function calcPresumptiveTax(input: PresumptiveTaxInput): PresumptiveTaxOutput {
  const {
    professionType,
    grossTurnover = 0,
    digitalReceiptsPercentage = 100,
    actualProfit: userActualProfit,
    regime = "new",
    deduction80C = 0,
    deduction80D = 0,
    otherDeductions = 0,
  } = input;

  const safeTurnover = Math.max(0, grossTurnover || 0);
  const safeDigitalPct = Math.min(100, Math.max(0, digitalReceiptsPercentage ?? 100));
  const isEnhancedLimitApplicable = safeDigitalPct >= 95;

  let maxTurnoverLimit = 0;
  let isEligibleForPresumptive = true;
  let ineligibilityReason: string | undefined = undefined;

  if (professionType === "44ADA_professional") {
    maxTurnoverLimit = isEnhancedLimitApplicable ? 7500000 : 5000000;
    if (safeTurnover > maxTurnoverLimit) {
      isEligibleForPresumptive = false;
      if (safeTurnover <= 7500000 && !isEnhancedLimitApplicable) {
        ineligibilityReason = `Turnover (₹${(safeTurnover / 100000).toFixed(2)}L) exceeds the standard ₹50 Lakh limit, and digital receipts are ${safeDigitalPct}% (under the 95% threshold required for the enhanced ₹75 Lakh limit).`;
      } else {
        ineligibilityReason = `Gross receipts of ₹${(safeTurnover / 100000).toFixed(2)} Lakh exceed the maximum ₹75 Lakh limit allowed under Section 44ADA.`;
      }
    }
  } else {
    // 44AD Business
    maxTurnoverLimit = isEnhancedLimitApplicable ? 30000000 : 20000000;
    if (safeTurnover > maxTurnoverLimit) {
      isEligibleForPresumptive = false;
      if (safeTurnover <= 30000000 && !isEnhancedLimitApplicable) {
        ineligibilityReason = `Turnover (₹${(safeTurnover / 10000000).toFixed(2)} Cr) exceeds standard ₹2 Crore limit, and digital receipts are ${safeDigitalPct}% (under the 95% threshold required for enhanced ₹3 Crore limit).`;
      } else {
        ineligibilityReason = `Gross turnover of ₹${(safeTurnover / 10000000).toFixed(2)} Crore exceeds the maximum ₹3 Crore limit allowed under Section 44AD.`;
      }
    }
  }

  // Calculate turnover splits
  const digitalTurnover = Math.round(safeTurnover * (safeDigitalPct / 100));
  const cashTurnover = Math.max(0, safeTurnover - digitalTurnover);

  // Presumptive Income
  let presumptiveIncome = 0;
  let presumptiveRateEffective = 0;

  if (safeTurnover > 0 && isEligibleForPresumptive) {
    if (professionType === "44ADA_professional") {
      presumptiveIncome = Math.round(safeTurnover * 0.50);
      presumptiveRateEffective = 50;
    } else {
      // 44AD: 6% digital, 8% cash
      presumptiveIncome = Math.round((digitalTurnover * 0.06) + (cashTurnover * 0.08));
      presumptiveRateEffective = Math.round((presumptiveIncome / safeTurnover) * 100 * 100) / 100;
    }
  } else if (safeTurnover === 0) {
    presumptiveIncome = 0;
    presumptiveRateEffective = professionType === "44ADA_professional" ? 50 : 6;
  }

  // Actual Profit
  const actualProfit = userActualProfit !== undefined ? Math.max(0, userActualProfit) : presumptiveIncome;

  // Calculate Taxes using shared tax engine
  const presumptiveTaxDetails = computePGBPTax(
    presumptiveIncome,
    regime,
    deduction80C,
    deduction80D,
    otherDeductions
  );

  const actualTaxDetails = computePGBPTax(
    actualProfit,
    regime,
    deduction80C,
    deduction80D,
    otherDeductions
  );

  const presumptiveTaxPayable = isEligibleForPresumptive ? presumptiveTaxDetails.totalTax : 0;
  const actualTaxPayable = actualTaxDetails.totalTax;
  const taxDifference = presumptiveTaxPayable - actualTaxPayable;
  const isPresumptiveCheaper = presumptiveTaxPayable <= actualTaxPayable;

  // Audit triggers:
  // If eligible for presumptive taxation, but assessee declares profit lower than the presumptive percentage:
  let isAuditTriggeredByOptOut = false;
  let auditTriggerReason: string | undefined = undefined;
  let fiveYearLockoutTriggered = false;

  const basicExemptionLimit = regime === "new" ? 400000 : 250000;

  if (isEligibleForPresumptive && safeTurnover > 0 && actualProfit < presumptiveIncome && actualProfit > basicExemptionLimit) {
    isAuditTriggeredByOptOut = true;
    if (professionType === "44ADA_professional") {
      auditTriggerReason = "Declared profit is below 50% presumptive rate and total income exceeds basic exemption. Maintenance of books of account u/s 44AA and Tax Audit u/s 44AB(d) by a Chartered Accountant are mandatorily required.";
    } else {
      fiveYearLockoutTriggered = true;
      auditTriggerReason = "Declared profit is below 6%/8% presumptive rate and income exceeds basic exemption. Maintenance of books u/s 44AA + Tax Audit u/s 44AB(e) are required. Under Section 44AD(4), you will be barred from opting into 44AD for the next 5 assessment years.";
    }
  }

  // Recommendation
  let recommendation = "";
  if (!isEligibleForPresumptive) {
    recommendation = ineligibilityReason || "Turnover exceeds eligible limits for presumptive taxation. Regular books of account and normal tax filing apply.";
  } else if (safeTurnover === 0) {
    recommendation = "Enter your gross turnover to calculate presumptive taxation vs actual profit.";
  } else if (actualProfit === presumptiveIncome) {
    recommendation = `Presumptive scheme u/s ${professionType === "44ADA_professional" ? "44ADA" : "44AD"} is optimal: No need to maintain detailed accounting books or undergo a mandatory tax audit. Tax payable is ₹${presumptiveTaxPayable.toLocaleString("en-IN")}.`;
  } else if (isPresumptiveCheaper) {
    recommendation = `Presumptive scheme saves ₹${Math.abs(taxDifference).toLocaleString("en-IN")} in tax compared to your actual profit, while eliminating all bookkeeping and tax audit compliance overhead.`;
  } else {
    recommendation = `Declaring actual profit saves ₹${Math.abs(taxDifference).toLocaleString("en-IN")} in tax, but ${
      isAuditTriggeredByOptOut
        ? "triggers mandatory CA Tax Audit and accounting compliance overhead."
        : "requires maintaining regular books of accounts."
    }`;
  }

  return {
    professionType,
    grossTurnover: Math.round(safeTurnover),
    digitalReceiptsPercentage: safeDigitalPct,
    digitalTurnover,
    cashTurnover,
    isEnhancedLimitApplicable,
    maxTurnoverLimit,
    isEligibleForPresumptive,
    ineligibilityReason,
    presumptiveRateEffective,
    presumptiveIncome,
    presumptiveTaxPayable,
    presumptiveTaxDetails,
    actualProfit: Math.round(actualProfit),
    actualTaxPayable,
    actualTaxDetails,
    taxDifference,
    isPresumptiveCheaper,
    isAuditTriggeredByOptOut,
    auditTriggerReason,
    fiveYearLockoutTriggered,
    recommendation,
  };
}

// ─── POSITION SIZE & RISK-REWARD ENGINE ───────────────────────
/**
 * Intraday Risk-Reward & Position Size Calculator
 *
 * Computes exact position size capped by:
 * 1. Maximum rupee risk allowed (capital * riskPercent)
 * 2. Available capital limit (including optional intraday leverage)
 * 3. Floor integer rounding (never rounds up past the risk cap)
 * 4. Inverts long/short targets cleanly based on entry vs stop loss
 */
export function calcPositionSize(input: PositionSizeInput): PositionSizeOutput {
  const {
    capital,
    riskPercent = 1,
    entryPrice,
    stopLossPrice,
    riskRewardRatio = 2,
    tradeDirection: inputDirection = "auto",
    leverageMultiplier = 1,
  } = input;

  const safeCapital = capital || 0;
  const safeEntry = entryPrice || 0;
  const safeStop = stopLossPrice || 0;
  const safeRiskPct = Math.max(0, riskPercent || 0);
  const safeRR = Math.max(0.1, riskRewardRatio || 2);
  const safeLeverage = Math.max(1, leverageMultiplier || 1);

  // Validation checks
  if (safeCapital <= 0) {
    return {
      capital: 0,
      riskPercent: safeRiskPct,
      maxRiskAmount: 0,
      entryPrice: safeEntry,
      stopLossPrice: safeStop,
      riskRewardRatio: safeRR,
      tradeDirection: "long",
      riskPerShare: 0,
      rawQuantityByRisk: 0,
      maxAffordableQuantity: 0,
      quantity: 0,
      positionValue: 0,
      actualRiskAmount: 0,
      actualRiskPercent: 0,
      targetPrice: 0,
      potentialProfit: 0,
      capitalUtilizationPercent: 0,
      isCappedByCapital: false,
      isValid: false,
      validationError: "Total trading capital must be greater than zero.",
      summary: "Invalid capital input. Please enter a valid capital amount.",
    };
  }

  if (safeEntry <= 0 || safeStop <= 0) {
    return {
      capital: safeCapital,
      riskPercent: safeRiskPct,
      maxRiskAmount: (safeCapital * safeRiskPct) / 100,
      entryPrice: safeEntry,
      stopLossPrice: safeStop,
      riskRewardRatio: safeRR,
      tradeDirection: "long",
      riskPerShare: 0,
      rawQuantityByRisk: 0,
      maxAffordableQuantity: 0,
      quantity: 0,
      positionValue: 0,
      actualRiskAmount: 0,
      actualRiskPercent: 0,
      targetPrice: 0,
      potentialProfit: 0,
      capitalUtilizationPercent: 0,
      isCappedByCapital: false,
      isValid: false,
      validationError: "Entry price and Stop-loss price must both be greater than zero.",
      summary: "Please enter positive entry and stop-loss prices.",
    };
  }

  const priceDiff = Math.abs(safeEntry - safeStop);
  if (priceDiff < 0.001) {
    return {
      capital: safeCapital,
      riskPercent: safeRiskPct,
      maxRiskAmount: (safeCapital * safeRiskPct) / 100,
      entryPrice: safeEntry,
      stopLossPrice: safeStop,
      riskRewardRatio: safeRR,
      tradeDirection: "long",
      riskPerShare: 0,
      rawQuantityByRisk: 0,
      maxAffordableQuantity: Math.floor((safeCapital * safeLeverage) / safeEntry),
      quantity: 0,
      positionValue: 0,
      actualRiskAmount: 0,
      actualRiskPercent: 0,
      targetPrice: safeEntry,
      potentialProfit: 0,
      capitalUtilizationPercent: 0,
      isCappedByCapital: false,
      isValid: false,
      validationError: "Stop-loss price cannot be equal to entry price (zero risk per share).",
      summary: "Stop-loss must differ from entry price to determine risk per share.",
    };
  }

  // Determine Direction
  let tradeDirection: "long" | "short" = "long";
  if (inputDirection === "short") {
    tradeDirection = "short";
  } else if (inputDirection === "long") {
    tradeDirection = "long";
  } else {
    // Auto-detect based on prices
    tradeDirection = safeEntry < safeStop ? "short" : "long";
  }

  const riskPerShare = round2(priceDiff);
  const maxRiskAmount = round2(safeCapital * (safeRiskPct / 100));
  const rawQuantityByRisk = maxRiskAmount / riskPerShare;

  const effectiveCapital = safeCapital * safeLeverage;
  const maxAffordableQuantity = Math.floor(effectiveCapital / safeEntry);

  // Position quantity strictly rounded down (floor) to whole integer
  const quantity = Math.max(0, Math.floor(Math.min(rawQuantityByRisk, maxAffordableQuantity)));
  const isCappedByCapital = rawQuantityByRisk > maxAffordableQuantity;

  const positionValue = round2(quantity * safeEntry);
  const actualRiskAmount = round2(quantity * riskPerShare);
  const actualRiskPercent = safeCapital > 0 ? round2((actualRiskAmount / safeCapital) * 100) : 0;

  // Target price calculation
  const targetDistance = round2(safeRR * riskPerShare);
  const targetPrice = tradeDirection === "long"
    ? round2(safeEntry + targetDistance)
    : round2(Math.max(0, safeEntry - targetDistance));

  const potentialProfit = round2(quantity * targetDistance);
  const capitalUtilizationPercent = safeCapital > 0 ? round2((positionValue / safeCapital) * 100) : 0;

  let warning: string | undefined = undefined;
  if (isCappedByCapital) {
    warning = `Position size capped at ${quantity} shares by available capital limit (${safeLeverage > 1 ? `${safeLeverage}x leverage` : "cash"}). Risk cap would allow ${Math.floor(rawQuantityByRisk)} shares.`;
  } else if (riskPerShare / safeEntry < 0.005) {
    warning = `Extremely tight stop loss (${round2((riskPerShare / safeEntry) * 100)}% of price). High likelihood of noise execution.`;
  }

  const summary = `Buy ${quantity} shares @ ₹${safeEntry}. Target: ₹${targetPrice} (+₹${potentialProfit.toLocaleString("en-IN")}), Stop-Loss: ₹${safeStop} (-₹${actualRiskAmount.toLocaleString("en-IN")}). Risk-Reward 1 : ${safeRR}.`;

  return {
    capital: safeCapital,
    riskPercent: safeRiskPct,
    maxRiskAmount,
    entryPrice: safeEntry,
    stopLossPrice: safeStop,
    riskRewardRatio: safeRR,
    tradeDirection,
    riskPerShare,
    rawQuantityByRisk: round2(rawQuantityByRisk),
    maxAffordableQuantity,
    quantity,
    positionValue,
    actualRiskAmount,
    actualRiskPercent,
    targetPrice,
    potentialProfit,
    capitalUtilizationPercent,
    isCappedByCapital,
    isValid: true,
    warning,
    summary,
  };
}

// ─── SECTION 54 & 54EC CAPITAL GAINS EXEMPTION PLANNER ────────
/**
 * Capital Gains Exemption Planner (Section 54 & Section 54EC)
 *
 * Can chain directly from `calcCapitalGains` Real Estate LTCG output or accept direct numbers.
 *
 * Section 54 (Residential House):
 * - Exemption = min(LTCG, eligible investment)
 * - Purchase window: 1 year before transfer (-12m) to 2 years after transfer (+24m)
 * - Construction window: within 3 years after transfer (+36m)
 * - Statutory cap: ₹10 Crore
 * - Lock-in: 3 years on newly acquired property
 *
 * Section 54EC (Specified Capital Gains Bonds: REC, NHAI, PFC, IRFC):
 * - Exemption = min(LTCG, investment amount, ₹50 Lakh)
 * - Timeline: within 6 months from date of transfer
 * - Lock-in: 5 years (fixed interest taxable annually)
 */
export function calcSection54Exemption(input: Section54ExemptionInput): Section54ExemptionOutput {
  const {
    capitalGainsAmount,
    capitalGainsInput,
    sectionType = "section_54_property",
    propertyInvestmentAmount = 0,
    propertyMode = "purchase",
    propertyTimelineMonths = 6,
    bondsInvestmentAmount = 0,
    bondsTimelineMonths = 3,
    taxRatePercent = 12.5,
  } = input;

  // Resolve LTCG amount (from upstream calcCapitalGains if provided, else direct input)
  let initialLtcgGains = 0;
  if (capitalGainsInput) {
    const upstreamResult = calcCapitalGains(capitalGainsInput);
    if (!upstreamResult.isLoss && upstreamResult.gainType === "LTCG") {
      initialLtcgGains = upstreamResult.taxableGain || upstreamResult.rawCapitalGain;
    } else {
      initialLtcgGains = 0;
    }
  } else {
    initialLtcgGains = Math.max(0, capitalGainsAmount || 0);
  }

  const baseRate = taxRatePercent || 12.5;
  const cessPercent = 4;
  const effectiveTaxRateBeforeExemption = round2(baseRate * (1 + cessPercent / 100)); // 13%
  const taxBeforeExemption = Math.round((initialLtcgGains * effectiveTaxRateBeforeExemption) / 100);

  // Helper to compute Section 54 (Residential Property)
  function computeSection54(): Section54SingleExemptionResult {
    const invAmount = Math.max(0, propertyInvestmentAmount || 0);
    const statutoryCap = 100000000; // ₹10 Crore

    let isValidTimeline = false;
    let timelineMessage = "";

    if (propertyMode === "purchase") {
      isValidTimeline = propertyTimelineMonths >= -12 && propertyTimelineMonths <= 24;
      timelineMessage = isValidTimeline
        ? `Valid purchase timeline (${propertyTimelineMonths} months relative to sale date. Prescribed window: 1 year before to 2 years after sale).`
        : `Invalid purchase timeline (${propertyTimelineMonths} months). Section 54 requires property purchase between 1 year before and 2 years after transfer date.`;
    } else {
      isValidTimeline = propertyTimelineMonths >= 0 && propertyTimelineMonths <= 36;
      timelineMessage = isValidTimeline
        ? `Valid construction timeline (${propertyTimelineMonths} months from sale date. Prescribed window: within 3 years after sale).`
        : `Invalid construction timeline (${propertyTimelineMonths} months). Section 54 requires construction completion within 3 years from transfer date.`;
    }

    let exemptionAllowed = 0;
    if (isValidTimeline && initialLtcgGains > 0 && invAmount > 0) {
      exemptionAllowed = Math.min(initialLtcgGains, Math.min(invAmount, statutoryCap));
    }

    const taxableGainsRemaining = Math.max(0, initialLtcgGains - exemptionAllowed);
    const taxAfterExemption = Math.round((taxableGainsRemaining * effectiveTaxRateBeforeExemption) / 100);
    const taxSaved = taxBeforeExemption - taxAfterExemption;
    const effectiveTaxRate = initialLtcgGains > 0 ? round2((taxAfterExemption / initialLtcgGains) * 100) : 0;

    return {
      section: "54",
      investmentAmount: invAmount,
      statutoryCap,
      isValidTimeline,
      timelineMessage,
      exemptionAllowed: Math.round(exemptionAllowed),
      taxableGainsRemaining: Math.round(taxableGainsRemaining),
      taxBeforeExemption,
      taxAfterExemption,
      taxSaved,
      effectiveTaxRate,
      lockInPeriod: "3 Years (from date of purchase/construction)",
      conditions: [
        "Reinvestment must be in a residential house property situated in India.",
        "Unutilized capital gains before ITR filing due date must be deposited into a Capital Gains Account Scheme (CGAS).",
        "If the new house is sold within 3 years of purchase/construction, the exemption is revoked and taxed.",
        "Maximum statutory exemption limit is ₹10 Crore (Finance Act 2023).",
      ],
    };
  }

  // Helper to compute Section 54EC (Bonds: REC, NHAI, PFC, IRFC)
  function computeSection54EC(): Section54SingleExemptionResult {
    const invAmount = Math.max(0, bondsInvestmentAmount || 0);
    const statutoryCap = 5000000; // ₹50 Lakhs per financial year

    const isValidTimeline = bondsTimelineMonths >= 0 && bondsTimelineMonths <= 6;
    const timelineMessage = isValidTimeline
      ? `Valid investment timeline (${bondsTimelineMonths} months from transfer date. Prescribed window: within 6 months of sale).`
      : `Invalid timeline (${bondsTimelineMonths} months). Section 54EC requires bond investment within strictly 6 months from the date of property transfer.`;

    let exemptionAllowed = 0;
    if (isValidTimeline && initialLtcgGains > 0 && invAmount > 0) {
      exemptionAllowed = Math.min(initialLtcgGains, Math.min(invAmount, statutoryCap));
    }

    const taxableGainsRemaining = Math.max(0, initialLtcgGains - exemptionAllowed);
    const taxAfterExemption = Math.round((taxableGainsRemaining * effectiveTaxRateBeforeExemption) / 100);
    const taxSaved = taxBeforeExemption - taxAfterExemption;
    const effectiveTaxRate = initialLtcgGains > 0 ? round2((taxAfterExemption / initialLtcgGains) * 100) : 0;

    return {
      section: "54EC",
      investmentAmount: invAmount,
      statutoryCap,
      isValidTimeline,
      timelineMessage,
      exemptionAllowed: Math.round(exemptionAllowed),
      taxableGainsRemaining: Math.round(taxableGainsRemaining),
      taxBeforeExemption,
      taxAfterExemption,
      taxSaved,
      effectiveTaxRate,
      lockInPeriod: "5 Years (mandatory lock-in; cannot pledge/transfer)",
      conditions: [
        "Invest in eligible 54EC bonds issued by NHAI, REC, PFC, or IRFC.",
        "Maximum statutory investment cap is ₹50 Lakhs per investor in a financial year.",
        "Must be invested within 6 months from the date of property transfer.",
        "Bonds have a 5-year lock-in period at ~5.25% p.a. interest (interest is taxable annually).",
      ],
    };
  }

  const s54Result = computeSection54();
  const s54ecResult = computeSection54EC();

  const activeResult = sectionType === "section_54ec_bonds" ? s54ecResult : s54Result;

  let comparison: Section54ExemptionOutput["comparison"] | undefined = undefined;
  if (sectionType === "compare_both") {
    const taxDiff = Math.abs(s54Result.taxAfterExemption - s54ecResult.taxAfterExemption);
    let rec = "";
    if (s54Result.taxAfterExemption < s54ecResult.taxAfterExemption) {
      rec = `Section 54 (Residential Property) saves ₹${taxDiff.toLocaleString("en-IN")} more in taxes because it covers gains beyond the ₹50 Lakh statutory cap of Section 54EC bonds.`;
    } else if (s54ecResult.taxAfterExemption < s54Result.taxAfterExemption) {
      rec = `Section 54EC Bonds save ₹${taxDiff.toLocaleString("en-IN")} more in taxes given your current investment amounts.`;
    } else {
      rec = `Both Section 54 and Section 54EC provide equal tax savings of ₹${s54Result.taxSaved.toLocaleString("en-IN")}. Section 54EC offers zero real estate hassle with a 5-year bond lock-in.`;
    }

    comparison = {
      section54: s54Result,
      section54ec: s54ecResult,
      taxDifference: taxDiff,
      recommendation: rec,
    };
  }

  let summary = "";
  if (initialLtcgGains === 0) {
    summary = "No Long-Term Capital Gains entered. Tax payable and exemption required are ₹0.";
  } else if (activeResult.exemptionAllowed >= initialLtcgGains) {
    summary = `100% Tax Exemption Achieved! Full ₹${initialLtcgGains.toLocaleString("en-IN")} LTCG is exempt. Total tax payable is ₹0 (saved ₹${taxBeforeExemption.toLocaleString("en-IN")}).`;
  } else if (activeResult.exemptionAllowed > 0) {
    summary = `Partial Exemption of ₹${activeResult.exemptionAllowed.toLocaleString("en-IN")} applied. Remaining taxable gains: ₹${activeResult.taxableGainsRemaining.toLocaleString("en-IN")}. Tax payable: ₹${activeResult.taxAfterExemption.toLocaleString("en-IN")}.`;
  } else {
    summary = `No exemption allowed (${activeResult.isValidTimeline ? "reinvestment amount is ₹0" : "investment outside prescribed timeline window"}). Total tax payable: ₹${taxBeforeExemption.toLocaleString("en-IN")}.`;
  }

  return {
    initialLtcgGains: Math.round(initialLtcgGains),
    taxRatePercent: baseRate,
    cessPercent,
    effectiveTaxRateBeforeExemption,
    taxBeforeExemption,
    selectedSection: sectionType,
    activeResult,
    comparison,
    summary,
  };
}







