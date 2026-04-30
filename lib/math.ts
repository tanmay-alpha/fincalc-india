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

/** FY 2024-25 New Regime Slabs */
const NEW_REGIME_SLABS: InternalSlab[] = [
  { limit: 300000,   rate: 0,    label: "0 – 3L" },
  { limit: 700000,   rate: 0.05, label: "3L – 7L" },
  { limit: 1000000,  rate: 0.10, label: "7L – 10L" },
  { limit: 1200000,  rate: 0.15, label: "10L – 12L" },
  { limit: 1500000,  rate: 0.20, label: "12L – 15L" },
  { limit: Infinity,  rate: 0.30, label: "15L+" },
];

/** FY 2024-25 Old Regime Slabs */
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
  let rebate = 0;
  if (regime === "new" && taxableIncome <= 700000) {
    rebate = Math.min(rawTax, 25000);
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
 * Income Tax Calculator — FY 2024-25
 *
 * Handles both Old & New regimes, surcharge, cess, rebate 87A,
 * and provides a comparison with recommendation.
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
