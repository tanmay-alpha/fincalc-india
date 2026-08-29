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

// ─── TAX ──────────────────────────────────────────────────────

export type TaxRegime = "old" | "new";

export interface TaxInput {
  grossIncome: number;
  regime: TaxRegime;
  deduction80C: number;
  deduction80D: number;
  hraExemption: number;
  otherDeductions: number;
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
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  monthlyTakeHome: number;
  slabBreakdown: TaxSlabRow[];
  comparison: TaxComparison;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CALCULATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── SIP ──────────────────────────────────────────────────────
/**
 * SIP formula: M = P × ((1+i)^n − 1) / i × (1+i)
 * i = annualRate / 12 / 100
 * n = years × 12
 */
export function calcSIP(input: SipInput): SipOutput {
  const { monthlyAmount, annualRate, years } = input;
  const i = annualRate / 12 / 100;
  const n = years * 12;
  const totalInvested = monthlyAmount * n;

  let totalCorpus: number;
  if (i === 0) {
    totalCorpus = totalInvested;
  } else {
    totalCorpus = monthlyAmount * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  }

  const estimatedReturns = Math.round(totalCorpus) - Math.round(totalInvested);
  const absoluteReturn = totalInvested > 0
    ? (estimatedReturns / totalInvested) * 100
    : 0;

  // Year-by-year breakdown
  const yearlyBreakdown: SipYearRow[] = [];
  for (let y = 1; y <= years; y++) {
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
      returns: Math.round(corp) - Math.round(inv),
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
  const { principal, annualRate, tenureMonths } = input;
  const r = annualRate / 12 / 100;

  let emi: number;
  if (r === 0) {
    emi = principal / tenureMonths;
  } else {
    const factor = Math.pow(1 + r, tenureMonths);
    emi = (principal * r * factor) / (factor - 1);
  }

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;
  const interestPercentage = principal > 0
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
  const { principal, annualRate, tenureYears, compoundingFrequency: freq } = input;

  const maturityAmount = principal *
    Math.pow(1 + annualRate / (freq * 100), freq * tenureYears);

  const totalInterest = maturityAmount - principal;

  // Growth data for charting
  const steps = Math.min(Math.max(Math.ceil(tenureYears * 4), 8), 60);
  const growthData: FdGrowthPoint[] = [];

  for (let s = 0; s <= steps; s++) {
    const t = (tenureYears * s) / steps;
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
  const { yearlyInvestment, years, rate } = input;

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
  const { principal, annualRate, years } = input;

  const totalCorpus = principal * Math.pow(1 + annualRate / 100, years);
  const estimatedReturns = Math.round(totalCorpus) - Math.round(principal);
  const absoluteReturn = principal > 0
    ? (estimatedReturns / principal) * 100
    : 0;
  const CAGR = years > 0
    ? (Math.pow(totalCorpus / principal, 1 / years) - 1) * 100
    : 0;
  const wealthRatio = principal > 0 ? totalCorpus / principal : 0;

  // Growth curve for charting
  const growthData: LumpsumGrowthPoint[] = [];
  for (let y = 0; y <= years; y++) {
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
 * FY 2025-26 / AY 2026-27 New Regime Slabs
 * (Union Budget 2025 — default regime for individuals)
 * Nil tax up to ₹4L; 87A rebate makes income ≤ ₹12L effectively tax-free.
 */
const NEW_REGIME_SLABS: InternalSlab[] = [
  { limit: 400000,   rate: 0,    label: "0 – 4L" },
  { limit: 800000,   rate: 0.05, label: "4L – 8L" },
  { limit: 1200000,  rate: 0.10, label: "8L – 12L" },
  { limit: 1600000,  rate: 0.15, label: "12L – 16L" },
  { limit: 2000000,  rate: 0.20, label: "16L – 20L" },
  { limit: 2400000,  rate: 0.25, label: "20L – 24L" },
  { limit: Infinity,  rate: 0.30, label: "24L+" },
];

/**
 * FY 2025-26 Old Regime Slabs (unchanged)
 * Individuals can optionally choose this if deductions are significant.
 */
const OLD_REGIME_SLABS: InternalSlab[] = [
  { limit: 250000,   rate: 0,    label: "0 – 2.5L" },
  { limit: 500000,   rate: 0.05, label: "2.5L – 5L" },
  { limit: 1000000,  rate: 0.20, label: "5L – 10L" },
  { limit: Infinity,  rate: 0.30, label: "10L+" },
];

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

function internalSurcharge(taxBeforeRebate: number, grossIncome: number): number {
  if (grossIncome > 5_00_00_000) return taxBeforeRebate * 0.37;
  if (grossIncome > 2_00_00_000) return taxBeforeRebate * 0.25;
  if (grossIncome > 1_00_00_000) return taxBeforeRebate * 0.15;
  if (grossIncome > 50_00_000) return taxBeforeRebate * 0.10;
  return 0;
}

function computeRegimeTax(
  grossIncome: number,
  regime: TaxRegime,
  input: TaxInput
): { totalTax: number; taxableIncome: number; totalDeductions: number; surcharge: number; cess: number; breakdown: TaxSlabRow[] } {
  let totalDeductions: number;
  let taxableIncome: number;

  if (regime === "new") {
    // New regime: only standard deduction of ₹75,000
    const stdDed = 75000;
    totalDeductions = stdDed;
    taxableIncome = Math.max(0, grossIncome - stdDed);
  } else {
    // Old regime: standard deduction ₹50,000 + 80C + 80D + HRA + others
    const stdDed = 50000;
    const capped80C = Math.min(input.deduction80C ?? 0, 150000);
    const capped80D = Math.min(input.deduction80D, 100000);
    totalDeductions = stdDed + capped80C + capped80D + input.hraExemption + input.otherDeductions;
    taxableIncome = Math.max(0, grossIncome - totalDeductions);
  }

  const slabs = regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  const { rawTax, breakdown } = internalSlabCalc(taxableIncome, slabs);

  // Rebate u/s 87A
  // FY 2025-26: New regime rebate raised — income ≤ ₹12L gets full rebate (zero tax)
  // Old regime: unchanged (taxable income ≤ ₹5L, max rebate ₹12,500)
  let rebate = 0;
  if (regime === "new" && taxableIncome <= 1200000) {
    rebate = rawTax; // full rebate — effectively zero tax up to ₹12L taxable
  } else if (regime === "old" && taxableIncome <= 500000) {
    rebate = Math.min(rawTax, 12500);
  }

  const taxAfterRebate = Math.max(0, rawTax - rebate);

  // Surcharge: 10% for 50L–1Cr, 15% for 1Cr+
  const surcharge = internalSurcharge(taxAfterRebate, grossIncome);

  // Health & Education Cess: 4%
  const cess = (taxAfterRebate + surcharge) * 0.04;
  const totalTax = taxAfterRebate + surcharge + cess;

  return { totalTax, taxableIncome, totalDeductions, surcharge, cess, breakdown };
}

/**
 * Income Tax Calculator — FY 2025-26 / AY 2026-27
 *
 * Supports both Old & New regimes with FY 2025-26 slabs.
 * New Regime: 0–4L nil, 4–8L 5%, 8–12L 10%, 12–16L 15%,
 *             16–20L 20%, 20–24L 25%, 24L+ 30%.
 *             Standard deduction ₹75,000. Rebate u/s 87A for
 *             taxable income ≤ ₹12L (effectively zero tax).
 * Old Regime: unchanged slabs. Max rebate ₹12,500 for taxable ≤ ₹5L.
 * Includes surcharge (>₹50L) and 4% health + education cess.
 */
export function calcTax(input: TaxInput): TaxOutput {
  const { grossIncome, regime } = input;

  const current = computeRegimeTax(grossIncome, regime, input);

  // Always compute both for comparison
  const oldResult = computeRegimeTax(grossIncome, "old", input);
  const newResult = computeRegimeTax(grossIncome, "new", input);

  const savings = Math.abs(oldResult.totalTax - newResult.totalTax);
  const recommendation: TaxRegime = oldResult.totalTax <= newResult.totalTax ? "old" : "new";
  const reason = recommendation === "new"
    ? `New regime saves ₹${Math.round(savings).toLocaleString("en-IN")} with simplified slabs`
    : `Old regime saves ₹${Math.round(savings).toLocaleString("en-IN")} due to deduction benefits`;

  const netAnnual = grossIncome - current.totalTax;
  const effectiveRate = grossIncome > 0
    ? (current.totalTax / grossIncome) * 100
    : 0;
  const taxBeforeCess = Math.max(0, current.totalTax - current.surcharge - current.cess);

  return {
    grossIncome: Math.round(grossIncome),
    totalDeductions: Math.round(current.totalDeductions),
    taxableIncome: Math.round(current.taxableIncome),
    taxBeforeCess: Math.round(taxBeforeCess),
    surcharge: Math.round(current.surcharge),
    cess: Math.round(current.cess),
    totalTax: Math.round(current.totalTax),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    monthlyTakeHome: Math.round(netAnnual / 12),
    slabBreakdown: current.breakdown,
    comparison: {
      oldRegimeTax: Math.round(oldResult.totalTax),
      newRegimeTax: Math.round(newResult.totalTax),
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




