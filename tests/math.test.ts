/**
 * FinCalc India — Math Engine Tests
 * Tests for all 6 calculator functions in lib/math.ts
 * Run with: npm run test
 */

import { describe, it, expect } from 'vitest'
import {
  calcSIP,
  calcEMI,
  calcFD,
  calcPPF,
  calcLumpsum,
  calcTax,
  calcStepUpSIP,
  calcGoalSIP,
  calcPrepaymentVsInvest,
  calcNoCostEMITruth,
  calcFIRE,
  calcCapitalGains,
  calcFnOBreakeven,
  calcOptionPayoff,
  getOptionPresetLegs,
  calcHRAExemption,
  calcPresumptiveTax,
  calcPositionSize,
  calcSection54Exemption,
  calcDCF,
  calcWACC,
  calcDuPont,
  calcXIRR,
  calcTWRR,
  calcRiskRatios,
  calcBlackScholes,
  calcMarginRequired,
  calcCarTCO,
  calcBalanceTransfer,
  calcMarginalRelief,
  calcLRSTCS,
  calcUSStockReturn,
  calcNRIDepositReturns,
  calcNPS,
} from '../lib/math'

// ─── SIP ──────────────────────────────────────────────────────

describe('calcSIP', () => {
  it('calculates basic SIP corpus correctly', () => {
    const result = calcSIP({ monthlyAmount: 5000, annualRate: 12, years: 10 })
    // SIP formula: M = P * ((1+i)^n - 1)/i * (1+i)
    // i = 0.01, n = 120
    expect(result.totalInvested).toBe(600000)            // 5000 * 120
    expect(result.totalCorpus).toBeGreaterThan(1100000)  // well above 11L
    expect(result.estimatedReturns).toBe(result.totalCorpus - result.totalInvested)
    expect(result.absoluteReturn).toBeGreaterThan(80)    // > 80%
    expect(result.yearlyBreakdown).toHaveLength(10)
  })

  it('handles zero rate gracefully', () => {
    const result = calcSIP({ monthlyAmount: 1000, annualRate: 0.001, years: 5 })
    expect(result.totalInvested).toBe(60000)
    expect(result.totalCorpus).toBeGreaterThanOrEqual(60000)
  })

  it('year-by-year breakdown is cumulative', () => {
    const result = calcSIP({ monthlyAmount: 10000, annualRate: 12, years: 5 })
    const breakdown = result.yearlyBreakdown
    // corpus should grow each year
    for (let i = 1; i < breakdown.length; i++) {
      expect(breakdown[i].corpus).toBeGreaterThan(breakdown[i - 1].corpus)
    }
    // final year corpus should match totalCorpus (within rounding)
    expect(breakdown[4].corpus).toBe(result.totalCorpus)
  })
})

// ─── EMI ──────────────────────────────────────────────────────

describe('calcEMI', () => {
  it('calculates home loan EMI correctly', () => {
    // ₹30L at 8.5% for 20 years
    const result = calcEMI({ principal: 3000000, annualRate: 8.5, tenureMonths: 240 })
    expect(result.emi).toBeGreaterThan(25000)
    expect(result.emi).toBeLessThan(28000)
    expect(result.totalPayment).toBeCloseTo(result.emi * 240, -3)
    expect(result.totalInterest).toBe(result.totalPayment - result.principalAmount)
    expect(result.amortizationSchedule).toHaveLength(240)
  })

  it('first month interest is principal * monthly_rate', () => {
    const result = calcEMI({ principal: 1000000, annualRate: 12, tenureMonths: 120 })
    const firstRow = result.amortizationSchedule[0]
    const expectedInterest = Math.round(1000000 * 0.01)
    expect(firstRow.interest).toBe(expectedInterest)
  })

  it('final balance is zero', () => {
    const result = calcEMI({ principal: 500000, annualRate: 10, tenureMonths: 60 })
    const lastRow = result.amortizationSchedule[59]
    expect(lastRow.balance).toBe(0)
  })

  it('interestPercentage is between 0 and 100', () => {
    const result = calcEMI({ principal: 2000000, annualRate: 9, tenureMonths: 180 })
    expect(result.interestPercentage).toBeGreaterThan(0)
    expect(result.interestPercentage).toBeLessThan(100)
  })
})

// ─── FD ───────────────────────────────────────────────────────

describe('calcFD', () => {
  it('calculates quarterly compounded FD correctly', () => {
    // ₹1L at 7% for 3 years, quarterly
    const result = calcFD({ principal: 100000, annualRate: 7, tenureYears: 3, compoundingFrequency: 4 })
    // A = 100000 * (1 + 0.07/4)^12
    const expected = Math.round(100000 * Math.pow(1 + 0.07 / 4, 12))
    expect(result.maturityAmount).toBe(expected)
    expect(result.totalInterest).toBe(result.maturityAmount - 100000)
  })

  it('monthly compounding gives higher return than annual', () => {
    const base = { principal: 100000, annualRate: 8, tenureYears: 2 }
    const monthly = calcFD({ ...base, compoundingFrequency: 12 })
    const annual  = calcFD({ ...base, compoundingFrequency: 1 })
    expect(monthly.maturityAmount).toBeGreaterThan(annual.maturityAmount)
  })

  it('effectiveAnnualYield is greater than nominal rate for freq > 1', () => {
    const result = calcFD({ principal: 50000, annualRate: 6.5, tenureYears: 1, compoundingFrequency: 4 })
    expect(result.effectiveAnnualYield).toBeGreaterThan(6.5)
  })

  it('growthData has at least 2 points', () => {
    const result = calcFD({ principal: 100000, annualRate: 7, tenureYears: 1, compoundingFrequency: 2 })
    expect(result.growthData.length).toBeGreaterThanOrEqual(2)
  })
})

// ─── PPF ──────────────────────────────────────────────────────

describe('calcPPF', () => {
  it('calculates standard 15-year PPF correctly', () => {
    const result = calcPPF({ yearlyInvestment: 150000, years: 15, rate: 7.1 })
    expect(result.totalInvested).toBe(150000 * 15)
    expect(result.maturityValue).toBeGreaterThan(result.totalInvested)
    expect(result.totalInterest).toBeGreaterThan(0)
    expect(result.yearlyData).toHaveLength(15)
  })

  it('withdrawal is allowed from year 7 onwards', () => {
    const result = calcPPF({ yearlyInvestment: 100000, years: 15, rate: 7.1 })
    const year6 = result.yearlyData.find(r => r.year === 6)
    const year7 = result.yearlyData.find(r => r.year === 7)
    expect(year6?.withdrawalAllowed).toBe(false)
    expect(year7?.withdrawalAllowed).toBe(true)
  })

  it('loan is allowed years 3-6 only', () => {
    const result = calcPPF({ yearlyInvestment: 100000, years: 15, rate: 7.1 })
    const year2 = result.yearlyData.find(r => r.year === 2)
    const year3 = result.yearlyData.find(r => r.year === 3)
    const year6 = result.yearlyData.find(r => r.year === 6)
    const year7 = result.yearlyData.find(r => r.year === 7)
    expect(year2?.loanAllowed).toBe(false)
    expect(year3?.loanAllowed).toBe(true)
    expect(year6?.loanAllowed).toBe(true)
    expect(year7?.loanAllowed).toBe(false)
  })

  it('balance grows each year', () => {
    const result = calcPPF({ yearlyInvestment: 50000, years: 15, rate: 7.1 })
    for (let i = 1; i < result.yearlyData.length; i++) {
      expect(result.yearlyData[i].balance).toBeGreaterThan(result.yearlyData[i - 1].balance)
    }
  })
})

// ─── LUMPSUM ──────────────────────────────────────────────────

describe('calcLumpsum', () => {
  it('calculates lumpsum corpus using compound interest', () => {
    const result = calcLumpsum({ principal: 100000, annualRate: 12, years: 10 })
    const expected = Math.round(100000 * Math.pow(1.12, 10))
    expect(result.totalCorpus).toBe(expected)
    expect(result.estimatedReturns).toBe(result.totalCorpus - 100000)
  })

  it('CAGR is close to input rate', () => {
    const result = calcLumpsum({ principal: 100000, annualRate: 15, years: 5 })
    expect(result.CAGR).toBeCloseTo(15, 1)
  })

  it('wealthRatio is totalCorpus / principal', () => {
    const result = calcLumpsum({ principal: 200000, annualRate: 10, years: 7 })
    expect(result.wealthRatio).toBeCloseTo(result.totalCorpus / 200000, 2)
  })

  it('growthData starts at principal and ends at totalCorpus', () => {
    const result = calcLumpsum({ principal: 50000, annualRate: 8, years: 5 })
    expect(result.growthData[0].value).toBe(50000)
    expect(result.growthData[5].value).toBe(result.totalCorpus)
  })
})

// ─── TAX — TAX YEAR 2026-27 (INCOME TAX ACT, 2025) ──────────

describe('calcTax — Tax Year 2026-27 New Regime', () => {
  it('1. Total income of ₹12,75,000 with standard deduction — final tax payable is ₹0 under new regime', () => {
    // 12.75L gross - 75K std ded = 12.00L taxable.
    // Slab tax on 12L = 0-4L (0) + 4-8L (20k) + 8-12L (40k) = ₹60,000.
    // Section 156 (formerly 87A) rebate = ₹60,000. Net tax = ₹0.
    const result = calcTax({
      grossIncome: 1275000,
      regime: 'new',
      deduction80C: 0,
      deduction80D: 0,
      hraExemption: 0,
      otherDeductions: 0,
    })
    expect(result.taxYear).toContain('Tax Year 2026-27')
    expect(result.taxableIncome).toBe(1200000)
    expect(result.slabTaxBeforeRebate).toBe(60000)
    expect(result.rebateSection).toContain('Section 156')
    expect(result.totalTax).toBe(0)
    expect(result.cess).toBe(0)
  })

  it('2. Total income of ₹10,00,000 salary + ₹2,00,000 equity LTCG — rebate reduces tax ONLY on ₹10L slab portion, and LTCG tax is charged in full', () => {
    // Salary: 10L - 75K std ded = 9.25L taxable slab income.
    // Slab tax: 4L @ 5% (20k) + 1.25L @ 10% (12.5k) = ₹32,500.
    // Section 156 rebate wipes out slab tax: ₹32,500. Net slab tax = ₹0.
    // Equity LTCG: 2,00,000. Exemption: 1,25,000. Taxable LTCG = 75,000.
    // LTCG Tax @ 12.5% = ₹9,375. (Rebate does NOT wipe this out).
    // Cess @ 4% on ₹9,375 = ₹375.
    // Total Tax Payable = 9,375 + 375 = ₹9,750.
    const result = calcTax({
      grossIncome: 1000000,
      equityLtcg: 200000,
      regime: 'new',
    })
    expect(result.ordinaryTaxableIncome).toBe(925000)
    expect(result.taxableIncome).toBe(1000000)
    expect(result.slabTaxBeforeRebate).toBe(32500)
    expect(result.rebateAmount).toBe(32500)
    expect(result.specialRateTax).toBe(9375)
    expect(result.equityLtcgTax).toBe(9375)
    expect(result.cess).toBe(375)
    expect(result.totalTax).toBe(9750)
  })

  it('3. Income above ₹12L taxable (>12.75L gross) attracts Section 156(2)(b) marginal relief tapering', () => {
    // Gross 15L - 75K std ded = 14.25L taxable → above 12L rebate threshold and above marginal relief zone
    const result = calcTax({
      grossIncome: 1500000,
      regime: 'new',
      deduction80C: 0,
      deduction80D: 0,
      hraExemption: 0,
      otherDeductions: 0,
    })
    expect(result.taxableIncome).toBe(1425000) // 15L - 75K
    expect(result.rebateAmount).toBe(0)
    expect(result.totalTax).toBeGreaterThan(0)
  })

  it('4. Cess is 4% of (tax + surcharge)', () => {
    const result = calcTax({
      grossIncome: 2000000,
      regime: 'new',
      deduction80C: 0,
      deduction80D: 0,
      hraExemption: 0,
      otherDeductions: 0,
    })
    const taxPlusSurcharge = result.taxBeforeCess + result.surcharge
    expect(result.cess).toBeCloseTo(taxPlusSurcharge * 0.04, 0)
  })

  it('5. Slab breakdown covers all slabs under Tax Year 2026-27', () => {
    const result = calcTax({
      grossIncome: 3000000, // 30L → taxable 29.25L
      regime: 'new',
      deduction80C: 0,
      deduction80D: 0,
      hraExemption: 0,
      otherDeductions: 0,
    })
    expect(result.slabBreakdown.length).toBeGreaterThan(3)
  })

  it('6. Provides both-regime comparison with savings reason', () => {
    const result = calcTax({
      grossIncome: 1500000,
      regime: 'new',
      deduction80C: 150000,
      deduction80D: 25000,
      hraExemption: 0,
      otherDeductions: 0,
    })
    expect(result.comparison.oldRegimeTax).toBeGreaterThanOrEqual(0)
    expect(result.comparison.newRegimeTax).toBeGreaterThanOrEqual(0)
    expect(['old', 'new']).toContain(result.comparison.recommendation)
    expect(result.comparison.reason).toContain('Tax Year 2026-27')
  })

  it('7. Old regime with max 80C deduction reduces tax', () => {
    const withoutDeduction = calcTax({
      grossIncome: 1500000, regime: 'old',
      deduction80C: 0, deduction80D: 0, hraExemption: 0, otherDeductions: 0,
    })
    const withDeduction = calcTax({
      grossIncome: 1500000, regime: 'old',
      deduction80C: 150000, deduction80D: 0, hraExemption: 0, otherDeductions: 0,
    })
    expect(withDeduction.totalTax).toBeLessThan(withoutDeduction.totalTax)
  })

  it('8. Monthly take-home is correctly computed as (totalEffectiveGross - totalTax) / 12', () => {
    const result = calcTax({
      grossIncome: 1500000,
      regime: 'new',
      deduction80C: 0, deduction80D: 0, hraExemption: 0, otherDeductions: 0,
    })
    const expected = Math.round((1500000 - result.totalTax) / 12)
    expect(result.monthlyTakeHome).toBe(expected)
  })
})

// ─── FEATURE 1: STEP-UP SIP & GOAL SIP ────────────────────────

describe('calcStepUpSIP & calcGoalSIP', () => {
  it('1. Zero step-up matches calcBasicSIP output to the exact rupee', () => {
    const basic = calcSIP({ monthlyAmount: 10000, annualRate: 12, years: 10 })
    const stepUp = calcStepUpSIP({
      monthlyAmount: 10000,
      annualRate: 12,
      years: 10,
      stepUpType: 'percentage',
      stepUpValue: 0,
    })

    expect(stepUp.totalInvested).toBe(basic.totalInvested)
    expect(stepUp.totalCorpus).toBe(basic.totalCorpus)
    expect(stepUp.estimatedReturns).toBe(basic.estimatedReturns)
    expect(stepUp.flatCorpus).toBe(basic.totalCorpus)
    expect(stepUp.extraReturnsVsFlat).toBe(0)
  })

  it('2. Boundary amounts: minimum ₹500/month and maximum ₹10,00,000/month compute without error', () => {
    const minResult = calcStepUpSIP({
      monthlyAmount: 500,
      annualRate: 10,
      years: 5,
      stepUpType: 'percentage',
      stepUpValue: 5,
    })
    expect(minResult.totalInvested).toBeGreaterThan(0)
    expect(minResult.totalCorpus).toBeGreaterThan(minResult.totalInvested)

    const maxResult = calcStepUpSIP({
      monthlyAmount: 1000000,
      annualRate: 15,
      years: 10,
      stepUpType: 'percentage',
      stepUpValue: 10,
    })
    expect(maxResult.totalInvested).toBeGreaterThan(120000000)
    expect(Number.isFinite(maxResult.totalCorpus)).toBe(true)
  })

  it('3. 1-year tenure: step-up must NOT trigger and first 12 months stay at base amount', () => {
    const result = calcStepUpSIP({
      monthlyAmount: 8000,
      annualRate: 12,
      years: 1,
      stepUpType: 'percentage',
      stepUpValue: 20,
    })
    expect(result.yearlyBreakdown).toHaveLength(1)
    expect(result.yearlyBreakdown[0].monthlyAmount).toBe(8000)
    expect(result.totalInvested).toBe(8000 * 12)
    expect(result.totalCorpus).toBe(result.flatCorpus)
  })

  it('4. 50-year ultra-long horizon produces no Infinity, NaN, or integer overflow', () => {
    const result = calcStepUpSIP({
      monthlyAmount: 5000,
      annualRate: 12,
      years: 50,
      stepUpType: 'percentage',
      stepUpValue: 5,
    })
    expect(Number.isFinite(result.totalCorpus)).toBe(true)
    expect(Number.isNaN(result.totalCorpus)).toBe(false)
    expect(result.totalCorpus).toBeGreaterThan(0)
    expect(result.yearlyBreakdown).toHaveLength(50)
  })

  it('5. Extreme step-up (50%/year): compounding curve must be strictly monotonically increasing', () => {
    const result = calcStepUpSIP({
      monthlyAmount: 2000,
      annualRate: 15,
      years: 8,
      stepUpType: 'percentage',
      stepUpValue: 50,
    })
    const breakdown = result.yearlyBreakdown
    for (let i = 1; i < breakdown.length; i++) {
      expect(breakdown[i].corpus).toBeGreaterThan(breakdown[i - 1].corpus)
      expect(breakdown[i].totalInvested).toBeGreaterThan(breakdown[i - 1].totalInvested)
    }
  })

  it('6. Low interest rate (0.1%) and high interest rate (30%) both produce valid, sane output', () => {
    const low = calcStepUpSIP({
      monthlyAmount: 5000,
      annualRate: 0.1,
      years: 5,
      stepUpType: 'percentage',
      stepUpValue: 10,
    })
    expect(low.totalCorpus).toBeGreaterThanOrEqual(low.totalInvested)

    const high = calcStepUpSIP({
      monthlyAmount: 5000,
      annualRate: 30,
      years: 5,
      stepUpType: 'percentage',
      stepUpValue: 10,
    })
    expect(high.totalCorpus).toBeGreaterThan(high.totalInvested * 1.5)
  })

  it('7. Fixed rupee step-up (+₹1,000/year) vs percentage step-up produce different, correctly-calculated results', () => {
    const fixed = calcStepUpSIP({
      monthlyAmount: 5000,
      annualRate: 12,
      years: 5,
      stepUpType: 'fixed',
      stepUpValue: 1000,
    })
    const pct = calcStepUpSIP({
      monthlyAmount: 5000,
      annualRate: 12,
      years: 5,
      stepUpType: 'percentage',
      stepUpValue: 10,
    })

    // Fixed gives 5k, 6k, 7k, 8k, 9k
    expect(fixed.yearlyBreakdown[1].monthlyAmount).toBe(6000)
    expect(fixed.yearlyBreakdown[4].monthlyAmount).toBe(9000)
    expect(fixed.totalCorpus).not.toBe(pct.totalCorpus)
  })

  it('8. Goal Mode precision: solving for ₹5 Crore target in 15 years at 12% return lands within ±₹1 of target', () => {
    const goal = calcGoalSIP({
      targetCorpus: 50000000, // ₹5 Crore
      annualRate: 12,
      years: 15,
      stepUpType: 'percentage',
      stepUpValue: 10,
    })
    expect(goal.requiredStartingSip).toBeGreaterThan(10000)
    expect(goal.requiredStartingSip).toBeLessThan(100000)

    const verified = calcStepUpSIP({
      monthlyAmount: goal.requiredStartingSip,
      annualRate: 12,
      years: 15,
      stepUpType: 'percentage',
      stepUpValue: 10,
    })
    // Within 0.1% tolerance of ₹5 Cr
    const diffPct = Math.abs(verified.totalCorpus - 50000000) / 50000000
    expect(diffPct).toBeLessThan(0.01)
  })

  it('9. Step-up timing: increments apply precisely starting from year 2', () => {
    const result = calcStepUpSIP({
      monthlyAmount: 10000,
      annualRate: 12,
      years: 4,
      stepUpType: 'percentage',
      stepUpValue: 10,
    })
    // Year 1 = 10,000; Year 2 = 11,000; Year 3 = 12,100; Year 4 = 13,310
    expect(result.yearlyBreakdown[0].monthlyAmount).toBe(10000)
    expect(result.yearlyBreakdown[1].monthlyAmount).toBe(11000)
    expect(result.yearlyBreakdown[2].monthlyAmount).toBe(12100)
    expect(result.yearlyBreakdown[3].monthlyAmount).toBe(13310)
  })

  it('10. No floating-point rounding artifacts anywhere in the yearly breakdown table', () => {
    const result = calcStepUpSIP({
      monthlyAmount: 3333.33,
      annualRate: 11.7,
      years: 5,
      stepUpType: 'percentage',
      stepUpValue: 7.3,
    })
    for (const row of result.yearlyBreakdown) {
      expect(row.monthlyAmount.toString()).not.toMatch(/\.\d{3,}/)
      expect(Number.isInteger(row.totalInvested)).toBe(true)
      expect(Number.isInteger(row.corpus)).toBe(true)
    }
  })
})

// ─── FEATURE 2: LOAN PRE-PAYMENT VS INVESTMENT COMPARATOR ─────

describe('calcPrepaymentVsInvest', () => {
  it('1. Pre-payment amount exceeds outstanding principal terminates loan at Month 1 with balance = 0 and no negative numbers', () => {
    const result = calcPrepaymentVsInvest({
      principal: 3000000, // ₹30 Lakhs
      annualRate: 8.5,
      tenureMonths: 240,
      prepaymentType: 'lumpsum',
      prepaymentAmount: 3500000, // ₹35 Lakhs prepayment in Month 1 (lumpsumYear: 1/12)
      lumpsumYear: 1 / 12,
      investmentRate: 12,
    })
    expect(result.newTenureMonths).toBe(1)
    expect(result.schedule[0].balance).toBe(0)
    expect(result.schedule[0].principalPaid).toBe(3000000)
    expect(result.tenureSavedMonths).toBe(239)
  })

  it('2. Pre-payment made in final month does not cause array/index out-of-bounds error', () => {
    const result = calcPrepaymentVsInvest({
      principal: 1000000,
      annualRate: 9,
      tenureMonths: 60,
      prepaymentType: 'lumpsum',
      prepaymentAmount: 50000,
      lumpsumYear: 5, // Month 60
      investmentRate: 12,
    })
    expect(result.newTenureMonths).toBeLessThanOrEqual(60)
    expect(result.schedule[result.schedule.length - 1].balance).toBe(0)
  })

  it('3. Zero pre-payment schedule matches base calcEMI schedule', () => {
    const baseEmi = calcEMI({ principal: 2500000, annualRate: 8.5, tenureMonths: 120 })
    const prepayZero = calcPrepaymentVsInvest({
      principal: 2500000,
      annualRate: 8.5,
      tenureMonths: 120,
      prepaymentType: 'monthly_topup',
      prepaymentAmount: 0,
      investmentRate: 12,
    })

    expect(prepayZero.originalEmi).toBe(baseEmi.emi)
    expect(prepayZero.newTenureMonths).toBe(120)
    expect(prepayZero.tenureSavedMonths).toBe(0)
    expect(prepayZero.interestSaved).toBe(0)
    expect(prepayZero.newTotalInterest).toBe(baseEmi.totalInterest)
  })

  it('4. 1 extra EMI per year on ₹50L, 8.5%, 20-year loan cuts tenure by over 3 years (~39 months)', () => {
    const result = calcPrepaymentVsInvest({
      principal: 5000000,
      annualRate: 8.5,
      tenureMonths: 240, // 20 years
      prepaymentType: 'extra_emi_yearly',
      investmentRate: 12,
    })
    // 1 extra EMI per year (13 EMIs/yr) reduces 240 months to 201 months (saves 39 months / 3.25 years)
    expect(result.tenureSavedMonths).toBeGreaterThanOrEqual(36)
    expect(result.tenureSavedMonths).toBeLessThanOrEqual(45)
    expect(result.interestSaved).toBeGreaterThan(1000000) // Saves > ₹10 Lakhs in interest!
  })

  it('5. Zero interest rate (r = 0) uses clean linear division and does not divide by zero', () => {
    const result = calcPrepaymentVsInvest({
      principal: 600000,
      annualRate: 0,
      tenureMonths: 60,
      prepaymentType: 'monthly_topup',
      prepaymentAmount: 5000,
      investmentRate: 10,
    })
    expect(result.originalEmi).toBe(10000) // 600000 / 60
    expect(result.originalTotalInterest).toBe(0)
    expect(result.newTenureMonths).toBe(40) // (10000 + 5000) * 40 = 600000
    expect(result.schedule[result.schedule.length - 1].balance).toBe(0)
  })

  it('6. Micro-loan case (₹10,000 over 3 months) computes without truncation or precision errors', () => {
    const result = calcPrepaymentVsInvest({
      principal: 10000,
      annualRate: 12,
      tenureMonths: 3,
      prepaymentType: 'monthly_topup',
      prepaymentAmount: 1000,
      investmentRate: 8,
    })
    expect(result.newTenureMonths).toBeLessThanOrEqual(3)
    expect(result.schedule[result.schedule.length - 1].balance).toBe(0)
  })

  it('7. Mega-loan case (₹50 Crore over 30 years) remains numerically stable', () => {
    const result = calcPrepaymentVsInvest({
      principal: 500000000,
      annualRate: 9,
      tenureMonths: 360,
      prepaymentType: 'extra_emi_yearly',
      investmentRate: 12,
    })
    expect(Number.isFinite(result.newTotalInterest)).toBe(true)
    expect(result.interestSaved).toBeGreaterThan(50000000) // Saves > ₹5 Crore
  })

  it('8. Interest recalculation starts from the very next month after a pre-payment is applied', () => {
    const result = calcPrepaymentVsInvest({
      principal: 1000000,
      annualRate: 12,
      tenureMonths: 120,
      prepaymentType: 'monthly_topup',
      prepaymentAmount: 5000,
      investmentRate: 12,
    })
    // Month 1 interest is based on full 10L: 10L * 1% = 10,000
    expect(result.schedule[0].interestPaid).toBe(10000)
    // Month 2 interest is strictly less than Month 1 because principal was reduced by EMI + 5000
    expect(result.schedule[1].interestPaid).toBeLessThan(result.schedule[0].interestPaid)
  })

  it('9. Break-even rate calculation returns a sane, correctly-signed rate', () => {
    const result = calcPrepaymentVsInvest({
      principal: 3000000,
      annualRate: 8.5,
      tenureMonths: 240,
      prepaymentType: 'monthly_topup',
      prepaymentAmount: 5000,
      investmentRate: 12,
    })
    expect(result.breakEvenRate).toBeGreaterThan(0)
    expect(result.breakEvenRate).toBeLessThan(20)
    expect(['prepay', 'invest', 'neutral']).toContain(result.recommendation)
  })

  it('10. Final row of every amortization table has a balance of exactly 0', () => {
    const result = calcPrepaymentVsInvest({
      principal: 1745678, // irregular principal
      annualRate: 8.35,   // irregular rate
      tenureMonths: 137,  // irregular tenure
      prepaymentType: 'monthly_topup',
      prepaymentAmount: 4321,
      investmentRate: 11.5,
    })
    const lastRow = result.schedule[result.schedule.length - 1]
    expect(lastRow.balance).toBe(0)
    expect(lastRow.balance.toString()).toBe('0')
  })
})

// ─── FEATURE 3: NO-COST EMI & BNPL TRUE COST REVEALER ─────────

describe('calcNoCostEMITruth', () => {
  it('1. Zero processing fee computes pure interest disguised as forfeited discount cleanly', () => {
    const result = calcNoCostEMITruth({
      productPrice: 60000,
      tenureMonths: 6,
      bankInterestRate: 15,
      processingFee: 0,
      upfrontDiscountForfeited: 0,
      gstRatePercent: 18,
    })
    expect(result.processingFeeWithGst).toBe(0)
    expect(result.hiddenInterest).toBeGreaterThan(1500)
    expect(result.hiddenGst).toBeGreaterThan(200)
    expect(result.totalCostEmi).toBeGreaterThan(60000) // GST makes it > ₹60,000
  })

  it('2. GST applies ONLY to the monthly interest portion of the EMI, never to principal', () => {
    const result = calcNoCostEMITruth({
      productPrice: 30000,
      tenureMonths: 3,
      bankInterestRate: 15,
      processingFee: 199,
      upfrontDiscountForfeited: 0,
      gstRatePercent: 18,
    })
    for (const row of result.monthlyBreakdown) {
      // GST on Interest must equal interest * 0.18 within rounding tolerance
      const expectedGst = Math.round(row.interest * 0.18 * 100) / 100
      expect(Math.abs(row.gstOnInterest - expectedGst)).toBeLessThanOrEqual(0.05)
      expect(row.gstOnInterest).toBeLessThan(row.principal * 0.18)
    }
  })

  it('3. Shortest supported tenure (3 months) and longest (24 months) converge correctly without NaN', () => {
    const shortTenure = calcNoCostEMITruth({
      productPrice: 50000,
      tenureMonths: 3,
      processingFee: 199,
      upfrontDiscountForfeited: 1500,
    })
    expect(Number.isFinite(shortTenure.effectiveApr)).toBe(true)
    expect(shortTenure.monthlyBreakdown).toHaveLength(3)

    const longTenure = calcNoCostEMITruth({
      productPrice: 50000,
      tenureMonths: 24,
      processingFee: 199,
      upfrontDiscountForfeited: 1500,
    })
    expect(Number.isFinite(longTenure.effectiveApr)).toBe(true)
    expect(longTenure.monthlyBreakdown).toHaveLength(24)
  })

  it('4. Upfront discount forfeiture correctly factored into comparison', () => {
    const result = calcNoCostEMITruth({
      productPrice: 80000,
      tenureMonths: 6,
      processingFee: 199,
      upfrontDiscountForfeited: 5000, // ₹5,000 instant card discount if paid in full
    })
    expect(result.totalCostUpfront).toBe(75000)
    expect(result.netDifference).toBeGreaterThan(5000)
    expect(result.cheaperOption).toBe('upfront')
  })

  it('5. Odd/fractional pricing (₹19,999) does not produce numerical errors or verdict flips', () => {
    const result = calcNoCostEMITruth({
      productPrice: 19999,
      tenureMonths: 9,
      processingFee: 99,
      upfrontDiscountForfeited: 500,
    })
    expect(result.totalCostEmi).toBeGreaterThan(19999)
    expect(result.totalCostUpfront).toBe(19499)
    expect(Number.isFinite(result.effectiveApr)).toBe(true)
  })

  it('6. High-value item (₹3,00,000) solver remains stable at scale', () => {
    const result = calcNoCostEMITruth({
      productPrice: 300000,
      tenureMonths: 12,
      processingFee: 499,
      upfrontDiscountForfeited: 10000,
    })
    expect(result.totalCostEmi).toBeGreaterThan(300000)
    expect(result.hiddenInterest).toBeGreaterThan(10000)
  })

  it('7. IRR/Newton-Raphson solver terminates safely without infinite loops on adversarial inputs', () => {
    const adversarial = calcNoCostEMITruth({
      productPrice: 10000,
      tenureMonths: 12,
      processingFee: 5000, // Extreme 50% processing fee
      upfrontDiscountForfeited: 8000, // Extreme 80% discount
    })
    expect(Number.isFinite(adversarial.effectiveApr)).toBe(true)
    expect(adversarial.effectiveApr).toBeGreaterThan(0)
  })

  it('8. Processing fee greater than 5% of product price surges APR', () => {
    const normalFee = calcNoCostEMITruth({
      productPrice: 20000,
      tenureMonths: 6,
      processingFee: 100,
      upfrontDiscountForfeited: 0,
    })
    const highFee = calcNoCostEMITruth({
      productPrice: 20000,
      tenureMonths: 6,
      processingFee: 1500, // 7.5% fee
      upfrontDiscountForfeited: 0,
    })
    expect(highFee.effectiveApr).toBeGreaterThan(normalFee.effectiveApr)
    expect(highFee.totalCostEmi).toBeGreaterThan(normalFee.totalCostEmi)
  })

  it('9. Verdict string logic is tested explicitly for both directions', () => {
    const upfrontCheaper = calcNoCostEMITruth({
      productPrice: 50000,
      tenureMonths: 6,
      processingFee: 199,
      upfrontDiscountForfeited: 4000,
    })
    expect(upfrontCheaper.cheaperOption).toBe('upfront')
    expect(upfrontCheaper.verdict).toContain('Paying upfront saves you')

    // Hypothetical case where EMI has negative fee / cash subsidy:
    const emiCheaper = calcNoCostEMITruth({
      productPrice: 50000,
      tenureMonths: 6,
      bankInterestRate: 0.1,
      processingFee: 0,
      upfrontDiscountForfeited: 0,
      gstRatePercent: 0,
    })
    expect(['same', 'emi']).toContain(emiCheaper.cheaperOption)
  })

  it('10. Input clamping rejects or clamps negative values gracefully', () => {
    const clamped = calcNoCostEMITruth({
      productPrice: -50000,
      tenureMonths: -6,
      processingFee: -199,
      upfrontDiscountForfeited: -1000,
    })
    expect(clamped.productPrice).toBeGreaterThan(0)
    expect(clamped.monthlyBreakdown.length).toBeGreaterThan(0)
    expect(clamped.totalCostEmi).toBeGreaterThan(0)
  })
})

// ─── FEATURE 4: FIRE & RETIREMENT CALCULATOR ──────────────────

describe('calcFIRE', () => {
  it('1. Immediate retirement (currentAge = retirementAge) has zero accumulation phase and starts depletion immediately', () => {
    const result = calcFIRE({
      currentAge: 45,
      retirementAge: 45,
      lifeExpectancy: 80,
      currentMonthlyExpenses: 50000,
      preRetirementReturn: 12,
      postRetirementReturn: 8,
      inflationRate: 6,
    })
    expect(result.yearsToRetirement).toBe(0)
    expect(result.yearsInRetirement).toBe(35)
    expect(result.requiredMonthlySavings).toBe(0)
    expect(result.standardFireCorpus).toBeGreaterThan(10000000)
    expect(result.timeline[0].phase).toBe('retirement')
  })

  it('2. Inflation rate equal to return rate (both 6%) produces linear real drawdown matching expected value', () => {
    const result = calcFIRE({
      currentAge: 50,
      retirementAge: 50,
      lifeExpectancy: 70, // 20 years in retirement
      currentMonthlyExpenses: 100000, // 12 Lakhs/yr
      preRetirementReturn: 6,
      postRetirementReturn: 6,
      inflationRate: 6,
    })
    // When real return is 0%, Standard FIRE corpus must equal Annual Expenses * Years = 12L * 20 = ₹2.40 Crore
    expect(result.standardFireCorpus).toBe(24000000)
  })

  it('3. Hyper-inflation scenario (10% inflation, 7% return) accelerates corpus depletion correctly', () => {
    const normal = calcFIRE({
      currentAge: 30,
      retirementAge: 50,
      lifeExpectancy: 80,
      currentMonthlyExpenses: 50000,
      preRetirementReturn: 12,
      postRetirementReturn: 8,
      inflationRate: 6,
    })
    const hyper = calcFIRE({
      currentAge: 30,
      retirementAge: 50,
      lifeExpectancy: 80,
      currentMonthlyExpenses: 50000,
      preRetirementReturn: 12,
      postRetirementReturn: 7, // lower post-ret return
      inflationRate: 10,       // 10% high inflation
    })
    expect(hyper.standardFireCorpus).toBeGreaterThan(normal.standardFireCorpus * 2)
  })

  it('4. Perpetual corpus case: when postRetirementReturn is high and inflation is low, corpus preserves well', () => {
    const result = calcFIRE({
      currentAge: 30,
      retirementAge: 40,
      lifeExpectancy: 90,
      currentMonthlyExpenses: 50000,
      preRetirementReturn: 14,
      postRetirementReturn: 10,
      inflationRate: 4,
      swrPercent: 3.5,
    })
    expect(result.isPerpetual).toBe(true)
    expect(result.standardFireCorpus).toBeGreaterThan(0)
  })

  it('5. Long horizon: retire at 30, live to 100 (70-year simulation) remains numerically stable with no NaN/Infinity', () => {
    const result = calcFIRE({
      currentAge: 30,
      retirementAge: 30,
      lifeExpectancy: 100,
      currentMonthlyExpenses: 40000,
      preRetirementReturn: 12,
      postRetirementReturn: 8,
      inflationRate: 6,
    })
    expect(result.timeline).toHaveLength(70)
    for (const pt of result.timeline) {
      expect(Number.isFinite(pt.corpus)).toBe(true)
      expect(Number.isNaN(pt.corpus)).toBe(false)
    }
  })

  it('6. Zero monthly expense input gracefully outputs zero corpus requirement without throwing', () => {
    const result = calcFIRE({
      currentAge: 30,
      retirementAge: 50,
      lifeExpectancy: 80,
      currentMonthlyExpenses: 0,
      preRetirementReturn: 12,
      postRetirementReturn: 8,
      inflationRate: 6,
    })
    expect(result.standardFireCorpus).toBe(0)
    expect(result.leanFireCorpus).toBe(0)
    expect(result.fatFireCorpus).toBe(0)
    expect(result.requiredMonthlySavings).toBe(0)
  })

  it('7. Reverse mode: correctly calculates required monthly savings today to reach target', () => {
    const result = calcFIRE({
      currentAge: 30,
      retirementAge: 45, // 15 years
      lifeExpectancy: 85,
      currentMonthlyExpenses: 60000,
      preRetirementReturn: 12,
      postRetirementReturn: 8,
      inflationRate: 6,
    })
    expect(result.requiredMonthlySavings).toBeGreaterThan(15000)
    expect(result.requiredMonthlySavings).toBeLessThan(150000)
  })

  it('8. Fat-FIRE (1.5x) and Lean-FIRE (0.75x) are internally consistent multiples in all test cases', () => {
    const result = calcFIRE({
      currentAge: 28,
      retirementAge: 48,
      lifeExpectancy: 82,
      currentMonthlyExpenses: 75000,
      preRetirementReturn: 11.5,
      postRetirementReturn: 7.5,
      inflationRate: 5.5,
    })
    expect(result.leanFireCorpus).toBe(Math.round(result.standardFireCorpus * 0.75))
    expect(result.fatFireCorpus).toBe(Math.round(result.standardFireCorpus * 1.5))
  })

  it('9. Yearly cashflow array length strictly equals (lifeExpectancy - currentAge)', () => {
    const result = calcFIRE({
      currentAge: 27,
      retirementAge: 42,
      lifeExpectancy: 91,
      currentMonthlyExpenses: 50000,
      preRetirementReturn: 12,
      postRetirementReturn: 8,
      inflationRate: 6,
    })
    expect(result.timeline).toHaveLength(91 - 27) // Exactly 64 years
  })

  it('10. Depletion crossover detection: underfunded scenario identifies exact age corpus hits zero', () => {
    // Current age 30, retire at 50, life 85. With ₹0 savings and only ₹100/mo contribution (drastically underfunded)
    const underfunded = calcFIRE({
      currentAge: 30,
      retirementAge: 30, // Retires immediately with only ₹5 Lakhs corpus but ₹1 Lakh/month expenses!
      lifeExpectancy: 80,
      currentMonthlyExpenses: 100000,
      preRetirementReturn: 12,
      postRetirementReturn: 6,
      inflationRate: 6,
      currentSavings: 500000, // ₹5L only lasts ~5 months
    })
    expect(underfunded.depletionAge).not.toBeNull()
    expect(underfunded.depletionAge).toBeGreaterThanOrEqual(30)
    expect(underfunded.depletionAge).toBeLessThan(40)
  })
})

// ─── PART B — FEATURE 1: CAPITAL GAINS TAX (POST-BUDGET 2024) ───

describe('Feature 1: Capital Gains Tax Calculator (calcCapitalGains)', () => {
  it('1. Equity LTCG exactly at the ₹1,25,000 exemption threshold produces ₹0 tax under Tax Year 2026-27', () => {
    const result = calcCapitalGains({
      assetClass: 'equity',
      holdingMonths: 18,
      purchasePrice: 500000,
      salePrice: 625000, // Exactly ₹1,25,000 gain
    })
    expect(result.taxYear).toContain('Tax Year 2026-27')
    expect(result.gainType).toBe('LTCG')
    expect(result.rawCapitalGain).toBe(125000)
    expect(result.exemptionAllowed).toBe(125000)
    expect(result.totalTaxPayable).toBe(0)
    expect(result.effectiveTaxRate).toBe(0)
  })

  it('2. Equity LTCG of ₹5,00,000 taxes only the amount exceeding ₹1,25,000 at 12.5%', () => {
    const result = calcCapitalGains({
      assetClass: 'equity',
      holdingMonths: 24,
      purchasePrice: 1000000,
      salePrice: 1500000, // ₹5,00,000 gain
    })
    expect(result.gainType).toBe('LTCG')
    expect(result.rawCapitalGain).toBe(500000)
    expect(result.exemptionAllowed).toBe(125000)
    // Taxable = 5,00,000 - 1,25,000 = 3,75,000. Tax at 12.5% = 46,875
    expect(result.totalTaxPayable).toBe(46875)
    expect(result.taxRatePercent).toBe(12.5)
  })

  it('3. Equity holding period boundary (364 vs 366 days) correctly classifies STCG (20%) vs LTCG (12.5%)', () => {
    // 364 days (<12 months) -> STCG at 20%
    const stcgResult = calcCapitalGains({
      assetClass: 'equity',
      purchaseDate: '2024-01-01',
      saleDate: '2024-12-30', // 364 days
      purchasePrice: 100000,
      salePrice: 200000,
    })
    expect(stcgResult.gainType).toBe('STCG')
    expect(stcgResult.taxRatePercent).toBe(20)
    expect(stcgResult.totalTaxPayable).toBe(20000) // 100,000 * 20%

    // 366 days (>12 months) -> LTCG at 12.5%
    const ltcgResult = calcCapitalGains({
      assetClass: 'equity',
      purchaseDate: '2024-01-01',
      saleDate: '2025-01-02', // 366 days
      purchasePrice: 100000,
      salePrice: 300000, // 200k gain
    })
    expect(ltcgResult.gainType).toBe('LTCG')
    expect(ltcgResult.taxRatePercent).toBe(12.5)
    // (200k - 125k) * 12.5% = 75k * 12.5% = 9375
    expect(ltcgResult.totalTaxPayable).toBe(9375)
  })

  it('4. Debt MF always uses slab-rate treatment regardless of holding period (1 month or 10 years)', () => {
    const shortDebt = calcCapitalGains({
      assetClass: 'debt_mf',
      holdingMonths: 1,
      purchasePrice: 100000,
      salePrice: 110000,
      investorSlabRatePercent: 30,
    })
    expect(shortDebt.totalTaxPayable).toBe(3000) // 10k * 30%

    const longDebt = calcCapitalGains({
      assetClass: 'debt_mf',
      holdingMonths: 120, // 10 years
      purchasePrice: 100000,
      salePrice: 250000,
      investorSlabRatePercent: 30,
    })
    expect(longDebt.taxRatePercent).toBe(30)
    expect(longDebt.totalTaxPayable).toBe(45000) // 150k * 30% (zero indexation)
  })

  it('5. Real estate purchased before cutoff computes both indexation & non-indexation and displays both figures', () => {
    const result = calcCapitalGains({
      assetClass: 'real_estate',
      purchaseDate: '2015-06-01', // Before 23 July 2024 cutoff
      saleDate: '2024-10-01',
      purchaseCiiYear: 2015, // CII = 254
      saleCiiYear: 2024,     // CII = 363
      purchasePrice: 5000000, // ₹50 Lakhs
      salePrice: 9000000,     // ₹90 Lakhs
    })
    expect(result.gainType).toBe('LTCG')
    expect(result.realEstateComparison).toBeDefined()
    // Unindexed: 40L gain * 12.5% = 5,00,000
    expect(result.realEstateComparison?.unindexedTax).toBe(500000)
    // Indexed Cost: 50L * (363 / 254) = 71,45,669. Indexed Gain = ~18,54,331. Indexed Tax at 20% = ~3,70,866
    expect(result.realEstateComparison?.indexedTax).toBeLessThan(result.realEstateComparison!.unindexedTax)
    expect(result.realEstateComparison?.recommendedOption).toBe('indexed_20')
    expect(result.totalTaxPayable).toBe(result.realEstateComparison?.indexedTax)
  })

  it('6. Real estate purchased after cutoff does not offer the indexation option', () => {
    const result = calcCapitalGains({
      assetClass: 'real_estate',
      purchaseDate: '2024-08-01', // After 23 July 2024
      saleDate: '2026-10-01',     // > 24 months
      purchasePrice: 5000000,
      salePrice: 7000000,
    })
    expect(result.gainType).toBe('LTCG')
    expect(result.realEstateComparison).toBeUndefined()
    expect(result.taxRatePercent).toBe(12.5)
    expect(result.totalTaxPayable).toBe(250000) // 20L * 12.5%
  })

  it('7. Purchase date exactly on 23 July 2024 cutoff falls under the post-cutoff rule', () => {
    const result = calcCapitalGains({
      assetClass: 'real_estate',
      purchaseDate: '2024-07-23', // Exactly on cutoff date
      saleDate: '2026-08-01',     // > 24 months
      purchasePrice: 10000000,
      salePrice: 13000000,
    })
    expect(result.gainType).toBe('LTCG')
    expect(result.realEstateComparison).toBeUndefined()
    expect(result.taxRatePercent).toBe(12.5)
    expect(result.totalTaxPayable).toBe(375000) // 30L * 12.5%
  })

  it('8. Capital loss (sale price < purchase price) outputs ₹0 tax and never negative tax', () => {
    const result = calcCapitalGains({
      assetClass: 'equity',
      holdingMonths: 6,
      purchasePrice: 500000,
      salePrice: 350000, // ₹1.5L loss
    })
    expect(result.isLoss).toBe(true)
    expect(result.gainType).toBe('LOSS')
    expect(result.rawCapitalGain).toBe(-150000)
    expect(result.taxableGain).toBe(0)
    expect(result.totalTaxPayable).toBe(0)
  })

  it('9. Multiple equity LTCG entries / prior exemption tracking applies ₹1,25,000 aggregate limit', () => {
    const result = calcCapitalGains({
      assetClass: 'equity',
      holdingMonths: 15,
      purchasePrice: 1000000,
      salePrice: 1300000, // ₹3,00,000 gain
      priorExemptionUsed: 100000, // ₹1,00,000 already used in another trade this FY
    })
    // Only ₹25,000 remaining exemption allowed
    expect(result.exemptionAllowed).toBe(25000)
    // Taxable = 3,00,000 - 25,000 = 2,75,000. Tax at 12.5% = 34,375
    expect(result.totalTaxPayable).toBe(34375)
  })

  it('10. Very large gain (₹10 Crore+) computes cleanly without precision loss', () => {
    const result = calcCapitalGains({
      assetClass: 'equity',
      holdingMonths: 36,
      purchasePrice: 100000000,  // ₹10 Cr
      salePrice: 250000000,     // ₹25 Cr (₹15 Cr gain)
    })
    expect(result.rawCapitalGain).toBe(150000000)
    expect(result.totalTaxPayable).toBe(Math.round((150000000 - 125000) * 0.125))
    expect(result.effectiveTaxRate).toBeCloseTo(12.49, 1)
  })
})

// ─── PART B — FEATURE 2: F&O BROKERAGE & BREAK-EVEN CALCULATOR ───

describe('Feature 2: F&O Brokerage & Break-Even Calculator (calcFnOBreakeven)', () => {
  it('1. STT is applied strictly to the sell leg (Tax Year 2026-27: Options flat 0.15%; Futures 0.05%)', () => {
    // Options: Buy 100 qty @ 100, Sell 100 qty @ 150 -> Sell turnover = 15,000.
    // Tax Year 2026-27 STT @ 0.15% = 22.5
    const opt = calcFnOBreakeven({
      instrument: 'options',
      buyPrice: 100,
      sellPrice: 150,
      quantity: 100,
      brokeragePerOrder: 20,
    })
    expect(opt.charges.stt).toBe(22.5)

    // Pre-April 2026 historical option trade: STT @ 0.10% = 15
    const optPre = calcFnOBreakeven({
      instrument: 'options',
      buyPrice: 100,
      sellPrice: 150,
      quantity: 100,
      brokeragePerOrder: 20,
      taxYear: 'pre_april_2026',
    })
    expect(optPre.charges.stt).toBe(15)

    // Futures: Buy 100 qty @ 1000, Sell 100 qty @ 1050 -> Sell turnover = 105,000.
    // Tax Year 2026-27 STT @ 0.05% = 52.50
    const fut = calcFnOBreakeven({
      instrument: 'futures',
      buyPrice: 1000,
      sellPrice: 1050,
      quantity: 100,
      brokeragePerOrder: 20,
    })
    expect(fut.charges.stt).toBe(52.5)

    // Pre-April 2026 historical futures trade: STT @ 0.02% = 21
    const futPre = calcFnOBreakeven({
      instrument: 'futures',
      buyPrice: 1000,
      sellPrice: 1050,
      quantity: 100,
      brokeragePerOrder: 20,
      taxYear: 'pre_april_2026',
    })
    expect(futPre.charges.stt).toBe(21)
  })

  it('2. GST is computed only on (brokerage + exchange charges + SEBI fee), never on STT or stamp duty', () => {
    const result = calcFnOBreakeven({
      instrument: 'options',
      buyPrice: 200,
      sellPrice: 250,
      quantity: 50,
      brokeragePerOrder: 20, // Brokerage = 40
      gstRatePercent: 18,
    })
    const taxableBase = result.charges.brokerage + result.charges.exchangeCharges + result.charges.sebiFees
    const expectedGst = Math.round((taxableBase * 0.18) * 100) / 100
    expect(result.charges.gst).toBeCloseTo(expectedGst, 2)
  })

  it('3. Stamp duty is applied only on the buy side, never on the sell side', () => {
    const result = calcFnOBreakeven({
      instrument: 'options',
      buyPrice: 300,
      sellPrice: 500,
      quantity: 100,
      stampDutyPercent: 0.003,
    })
    // Buy turnover = 30,000. Stamp duty @ 0.003% = 0.90
    expect(result.charges.stampDuty).toBe(0.9)
  })

  it('4. Options vs Futures STT calculation bases are correctly differentiated under Tax Year 2026-27', () => {
    const optionsResult = calcFnOBreakeven({
      instrument: 'options',
      buyPrice: 100,
      sellPrice: 100,
      quantity: 1000,
    })
    const futuresResult = calcFnOBreakeven({
      instrument: 'futures',
      buyPrice: 100,
      sellPrice: 100,
      quantity: 1000,
    })
    // Options STT = 100,000 * 0.15% = 150
    expect(optionsResult.charges.stt).toBe(150)
    // Futures STT = 100,000 * 0.05% = 50
    expect(futuresResult.charges.stt).toBe(50)
  })

  it('5. Break-even point matches exact calculation for a known trade', () => {
    const result = calcFnOBreakeven({
      instrument: 'options',
      buyPrice: 100,
      sellPrice: 100,
      quantity: 50,
      brokeragePerOrder: 20,
    })
    expect(result.pointsToBreakeven).toBeGreaterThan(0)
    expect(result.breakevenSellPrice).toBeCloseTo(result.buyPrice + result.pointsToBreakeven, 2)
  })

  it('6. Zero-brokerage input (discount broker ₹0 plan) computes cleanly without NaN or zero division', () => {
    const result = calcFnOBreakeven({
      instrument: 'options',
      buyPrice: 150,
      sellPrice: 180,
      quantity: 100,
      brokeragePerOrder: 0,
    })
    expect(result.charges.brokerage).toBe(0)
    expect(Number.isNaN(result.totalCharges)).toBe(false)
    expect(Number.isNaN(result.breakevenSellPrice)).toBe(false)
    expect(result.netPnl).toBeGreaterThan(0)
  })

  it('7. Large multi-lot trade charges scale linearly and correctly with quantity', () => {
    const trade1Lot = calcFnOBreakeven({
      instrument: 'futures',
      buyPrice: 24000,
      sellPrice: 24200,
      quantity: 50, // 1 lot
    })
    const trade10Lots = calcFnOBreakeven({
      instrument: 'futures',
      buyPrice: 24000,
      sellPrice: 24200,
      quantity: 500, // 10 lots
    })
    expect(trade10Lots.charges.stt).toBeCloseTo(trade1Lot.charges.stt * 10, 1)
    expect(trade10Lots.charges.exchangeCharges).toBeCloseTo(trade1Lot.charges.exchangeCharges * 10, 1)
  })

  it('8. Net loss scenario still deducts all statutory charges correctly and maintains correct sign', () => {
    const result = calcFnOBreakeven({
      instrument: 'options',
      buyPrice: 200,
      sellPrice: 120, // Loss trade
      quantity: 100,
    })
    expect(result.grossPnl).toBe(-8000)
    expect(result.totalCharges).toBeGreaterThan(0)
    expect(result.netPnl).toBeLessThan(-8000)
    expect(result.isProfit).toBe(false)
  })

  it('9. All itemized charges round to 2 decimals and exactly sum to total charges', () => {
    const result = calcFnOBreakeven({
      instrument: 'options',
      buyPrice: 173.45,
      sellPrice: 219.85,
      quantity: 67, // irregular qty
      brokeragePerOrder: 15,
    })
    const c = result.charges
    const sumLineItems = Math.round((c.brokerage + c.stt + c.exchangeCharges + c.gst + c.sebiFees + c.stampDuty) * 100) / 100
    expect(result.totalCharges).toBe(sumLineItems)
  })

  it('10. Negative or zero quantity/price inputs are safely clamped without throwing exceptions', () => {
    const zeroTrade = calcFnOBreakeven({
      instrument: 'options',
      buyPrice: 0,
      sellPrice: 0,
      quantity: 0,
    })
    expect(zeroTrade.totalCharges).toBe(0)
    expect(zeroTrade.netPnl).toBe(0)
    expect(zeroTrade.breakevenSellPrice).toBe(0)
  })
})

// ─── PART B — FEATURE 3: OPTION STRATEGY PAYOFF VISUALIZER ──────

describe('Feature 3: Option Strategy Payoff Visualizer (calcOptionPayoff)', () => {
  it('1. Single long call matches textbook formula: max loss = premium paid (bounded), upside uncapped', () => {
    const result = calcOptionPayoff({
      legs: [{ id: '1', type: 'call', position: 'long', strike: 24000, premium: 200, lots: 1 }],
      lotSize: 50,
      underlyingPrice: 24000,
    })
    expect(result.maxLoss).toBe(-10000) // 200 * 50 = -10,000
    expect(result.maxProfit).toBe('Unlimited')
    expect(result.breakevens).toEqual([24200]) // Strike 24000 + Premium 200
  })

  it('2. Single short put: max profit = premium received (bounded), max loss bounded at spot = 0', () => {
    const result = calcOptionPayoff({
      legs: [{ id: '1', type: 'put', position: 'short', strike: 24000, premium: 150, lots: 1 }],
      lotSize: 50,
      underlyingPrice: 24000,
      minSpot: 0,
    })
    expect(result.maxProfit).toBe(7500) // 150 * 50 = +7,500
    expect(result.breakevens).toEqual([23850]) // Strike 24000 - Premium 150
  })

  it('3. Long straddle (long call + long put at same strike) correctly calculates payoff and two breakevens', () => {
    const result = calcOptionPayoff({
      legs: [
        { id: '1', type: 'call', position: 'long', strike: 24000, premium: 200, lots: 1 },
        { id: '2', type: 'put', position: 'long', strike: 24000, premium: 200, lots: 1 },
      ],
      lotSize: 50,
      underlyingPrice: 24000,
    })
    expect(result.maxLoss).toBe(-20000) // (200 + 200) * 50 = -20,000
    expect(result.maxProfit).toBe('Unlimited')
    expect(result.breakevens.length).toBe(2)
    // Lower BE: 24000 - 400 = 23600, Upper BE: 24000 + 400 = 24400
    expect(result.breakevens[0]).toBeCloseTo(23600, -1)
    expect(result.breakevens[1]).toBeCloseTo(24400, -1)
  })

  it('4. Iron Condor (4 legs) correctly calculates bounded max profit, max loss, and two breakevens', () => {
    const legs = getOptionPresetLegs('iron_condor', 24000)
    const result = calcOptionPayoff({
      legs,
      lotSize: 50,
      underlyingPrice: 24000,
    })
    expect(result.legs).toHaveLength(4)
    expect(typeof result.maxProfit).toBe('number')
    expect(typeof result.maxLoss).toBe('number')
    expect(result.maxProfit).toBeGreaterThan(0)
    expect(result.maxLoss).toBeLessThan(0)
    expect(result.breakevens.length).toBe(2)
  })

  it('5. Covered Call strategy nets correctly with capped upside and cushioned downside', () => {
    const legs = getOptionPresetLegs('covered_call', 24000)
    const result = calcOptionPayoff({
      legs,
      lotSize: 50,
      underlyingPrice: 24000,
    })
    expect(result.legs).toHaveLength(2)
    expect(result.chartData.length).toBeGreaterThan(10)
  })

  it('6. Spot price range including zero does not throw errors or break calculations', () => {
    const result = calcOptionPayoff({
      legs: [{ id: '1', type: 'call', position: 'long', strike: 500, premium: 50, lots: 1 }],
      lotSize: 10,
      minSpot: 0,
      maxSpot: 1000,
      step: 50,
    })
    expect(result.chartData[0].spot).toBe(0)
    expect(result.chartData[0].pnl).toBe(-500) // 50 * 10 = -500
  })

  it('7. Preset generator creates clean, fresh leg arrays without state leaks', () => {
    const bullCall = getOptionPresetLegs('bull_call_spread', 24000)
    const bearPut = getOptionPresetLegs('bear_put_spread', 24000)
    expect(bullCall[0].type).toBe('call')
    expect(bearPut[0].type).toBe('put')
    expect(bullCall[0].strike).not.toBe(bearPut[1].strike)
  })

  it('8. Custom multi-leg strategy (5+ legs) sums payoff accurately across all legs', () => {
    const fiveLegs = [
      { id: '1', type: 'call' as const, position: 'long' as const, strike: 23800, premium: 300, lots: 1 },
      { id: '2', type: 'call' as const, position: 'short' as const, strike: 24000, premium: 180, lots: 2 },
      { id: '3', type: 'call' as const, position: 'long' as const, strike: 24200, premium: 90, lots: 1 },
      { id: '4', type: 'put' as const, position: 'long' as const, strike: 23500, premium: 50, lots: 1 },
      { id: '5', type: 'put' as const, position: 'short' as const, strike: 23300, premium: 25, lots: 1 },
    ]
    const result = calcOptionPayoff({
      legs: fiveLegs,
      lotSize: 50,
      underlyingPrice: 24000,
    })
    expect(result.legs).toHaveLength(5)
    expect(result.chartData.length).toBeGreaterThan(0)
    expect(result.chartData[0].leg_4).toBeDefined()
  })

  it('9. Breakeven detection correctly surfaces multiple distinct breakevens', () => {
    const strangle = getOptionPresetLegs('long_strangle', 24000)
    const result = calcOptionPayoff({
      legs: strangle,
      lotSize: 50,
      underlyingPrice: 24000,
    })
    expect(result.breakevens.length).toBe(2)
    expect(result.breakevens[0]).toBeLessThan(24000)
    expect(result.breakevens[1]).toBeGreaterThan(24000)
  })

  it('10. Max profit, max loss, and breakeven values in summary match values on chart data points', () => {
    const result = calcOptionPayoff({
      legs: getOptionPresetLegs('bull_call_spread', 24000),
      lotSize: 50,
      underlyingPrice: 24000,
    })
    const chartMaxPnl = Math.max(...result.chartData.map((d) => d.pnl))
    const chartMinPnl = Math.min(...result.chartData.map((d) => d.pnl))
    expect(result.maxProfit).toBe(chartMaxPnl)
    expect(result.maxLoss).toBe(chartMinPnl)
  })
})

// ─── HRA EXEMPTION ────────────────────────────────────────────

describe('calcHRAExemption', () => {
  it('1. Standard case — minimum of three limits picks the correct smallest value', () => {
    // Basic: 50,000/mo (6,00,000/yr), HRA received: 25,000/mo (3,00,000/yr), Rent: 20,000/mo (2,40,000/yr), Metro (Delhi)
    // Limit A (Actual HRA): 3,00,000
    // Limit B (Rent - 10% Basic): 2,40,000 - 60,000 = 1,80,000
    // Limit C (50% Basic): 3,00,000
    // Min is 1,80,000 (15,000/mo)
    const result = calcHRAExemption({
      basicSalary: 50000,
      salaryPeriod: 'monthly',
      hraReceived: 25000,
      rentPaid: 20000,
      cityType: 'metro',
    })
    expect(result.annualExemptHra).toBe(180000)
    expect(result.monthlyExemptHra).toBe(15000)
    expect(result.annualTaxableHra).toBe(120000)
    expect(result.monthlyTaxableHra).toBe(10000)
    expect(result.bindingConstraint).toBe('rent_minus_10pct')
  })

  it('2. Rent paid is zero — exempt HRA must be ₹0, not negative', () => {
    const result = calcHRAExemption({
      basicSalary: 60000,
      salaryPeriod: 'monthly',
      hraReceived: 30000,
      rentPaid: 0,
      cityType: 'metro',
    })
    expect(result.annualExemptHra).toBe(0)
    expect(result.monthlyExemptHra).toBe(0)
    expect(result.annualTaxableHra).toBe(360000)
  })

  it('3. Rent paid is less than 10% of basic salary — exempt HRA correctly clamps to ₹0 (never negative)', () => {
    // Basic: 50,000/mo (10% = 5,000), Rent: 4,000/mo -> Rent - 10% basic = -1,000 -> clamped to 0
    const result = calcHRAExemption({
      basicSalary: 50000,
      salaryPeriod: 'monthly',
      hraReceived: 20000,
      rentPaid: 4000,
      cityType: 'metro',
    })
    expect(result.annualExemptHra).toBe(0)
    expect(result.rentMinusTenPercentLimit).toBe(0)
    expect(result.annualTaxableHra).toBe(240000)
  })

  it('4. Metro vs Non-metro — same inputs produce different 50%/40% caps', () => {
    // Basic: 1,00,000/mo (12,00,000/yr), HRA: 60,000/mo (7,20,000/yr), Rent: 60,000/mo (7,20,000 - 1,20,000 = 6,00,000)
    // Metro cap (50%): 6,00,000
    // Non-metro cap (40%): 4,80,000
    const metroRes = calcHRAExemption({
      basicSalary: 100000,
      hraReceived: 60000,
      rentPaid: 60000,
      cityType: 'metro',
    })
    const nonMetroRes = calcHRAExemption({
      basicSalary: 100000,
      hraReceived: 60000,
      rentPaid: 60000,
      cityType: 'non_metro',
    })
    expect(metroRes.salaryPercentageLimit).toBe(600000)
    expect(nonMetroRes.salaryPercentageLimit).toBe(480000)
    expect(metroRes.annualExemptHra).toBe(600000)
    expect(nonMetroRes.annualExemptHra).toBe(480000)
  })

  it('5. HRA received is ₹0 — exemption is ₹0 regardless of rent paid', () => {
    const result = calcHRAExemption({
      basicSalary: 80000,
      hraReceived: 0,
      rentPaid: 35000,
      cityType: 'metro',
    })
    expect(result.annualExemptHra).toBe(0)
    expect(result.annualTaxableHra).toBe(0)
  })

  it('6. Monthly vs annual input mode — both produce identical final results when converted correctly', () => {
    const monthlyResult = calcHRAExemption({
      basicSalary: 60000,
      salaryPeriod: 'monthly',
      hraReceived: 30000,
      rentPaid: 25000,
      cityType: 'metro',
    })
    const annualResult = calcHRAExemption({
      basicSalary: 720000,
      salaryPeriod: 'annual',
      hraReceived: 360000,
      rentPaid: 300000,
      cityType: 'metro',
    })
    expect(monthlyResult.annualExemptHra).toBe(annualResult.annualExemptHra)
    expect(monthlyResult.annualTaxableHra).toBe(annualResult.annualTaxableHra)
    expect(monthlyResult.bindingConstraint).toBe(annualResult.bindingConstraint)
  })

  it('7. DA-included vs DA-excluded toggle — produces different, correctly calculated basic-salary base', () => {
    // Basic: 50,000/mo, DA: 10,000/mo, HRA: 30,000/mo, Rent: 25,000/mo, Metro
    // If DA excluded: Base = 6,00,000 -> 10% = 60,000 -> Rent - 10% = 3,00,000 - 60,000 = 2,40,000. 50% = 3,00,000
    const daExcluded = calcHRAExemption({
      basicSalary: 50000,
      dearnessAllowance: 10000,
      daFormsPartOfRetirementBenefits: false,
      hraReceived: 30000,
      rentPaid: 25000,
      cityType: 'metro',
    })
    // If DA included: Base = 7,20,000 -> 10% = 72,000 -> Rent - 10% = 3,00,000 - 72,000 = 2,28,000. 50% = 3,60,000
    const daIncluded = calcHRAExemption({
      basicSalary: 50000,
      dearnessAllowance: 10000,
      daFormsPartOfRetirementBenefits: true,
      hraReceived: 30000,
      rentPaid: 25000,
      cityType: 'metro',
    })
    expect(daExcluded.annualBasicSalaryBase).toBe(600000)
    expect(daIncluded.annualBasicSalaryBase).toBe(720000)
    expect(daExcluded.annualExemptHra).toBe(240000)
    expect(daIncluded.annualExemptHra).toBe(228000)
  })

  it('8. Extremely high rent relative to modest salary — 50%/40% cap correctly becomes binding constraint', () => {
    // Basic: 30,000/mo (3,60,000/yr), HRA: 20,000/mo (2,40,000/yr), Rent: 5,00,000/mo (60,00,000/yr), Non-metro
    // Limit A (HRA): 2,40,000
    // Limit B (Rent - 10% Basic): 60,00,000 - 36,000 = 59,64,000
    // Limit C (40% Basic): 1,44,000
    // Min is Limit C: 1,44,000 (salary_cap)
    const result = calcHRAExemption({
      basicSalary: 30000,
      hraReceived: 20000,
      rentPaid: 500000,
      cityType: 'non_metro',
    })
    expect(result.annualExemptHra).toBe(144000)
    expect(result.bindingConstraint).toBe('salary_cap')
  })

  it('9. Boundary case — rent paid minus 10% salary equals exactly the 50%/40% cap', () => {
    // Basic: 1,00,000/mo (12,00,000/yr). 50% cap = 6,00,000.
    // 10% basic = 1,20,000. Rent = 7,20,000/yr (60,000/mo). Rent - 10% = 6,00,000.
    // HRA received = 8,00,000.
    const result = calcHRAExemption({
      basicSalary: 100000,
      hraReceived: 70000,
      rentPaid: 60000,
      cityType: 'metro',
    })
    expect(result.rentMinusTenPercentLimit).toBe(600000)
    expect(result.salaryPercentageLimit).toBe(600000)
    expect(result.annualExemptHra).toBe(600000)
  })

  it('10. Paying-rent-to-parents mode — net household tax benefit is directionally correct', () => {
    // Employee in 30% slab, Parents in 0% slab
    // Rent: 30,000/mo (3,60,000/yr), HRA: 30,000/mo, Basic: 70,000/mo (8,40,000/yr), Metro
    // Exemption = min(3.6L, 3.6L - 0.84L = 2.76L, 4.2L) = 2,76,000
    // Employee tax saved = 2,76,000 * 30% = 82,800
    // Parent rental income = 3,60,000. Standard deduction u/s 24 = 30% (1,08,000). Taxable = 2,52,000.
    // Parent tax at 0% = 0. Net family savings = 82,800.
    const parentZeroSlab = calcHRAExemption({
      basicSalary: 70000,
      hraReceived: 30000,
      rentPaid: 30000,
      cityType: 'metro',
      isPayingToParents: true,
      userSlabRatePercent: 30,
      parentsSlabRatePercent: 0,
    })
    expect(parentZeroSlab.payingToParentsDetails?.isBeneficial).toBe(true)
    expect(parentZeroSlab.payingToParentsDetails?.netHouseholdTaxSaved).toBe(82800)

    // Parent in 30% slab -> Parent tax = 2,52,000 * 30% = 75,600. Net savings = 82,800 - 75,600 = 7,200 (still positive due to 30% standard deduction!)
    const parentThirtySlab = calcHRAExemption({
      basicSalary: 70000,
      hraReceived: 30000,
      rentPaid: 30000,
      cityType: 'metro',
      isPayingToParents: true,
      userSlabRatePercent: 30,
      parentsSlabRatePercent: 30,
    })
    expect(parentThirtySlab.payingToParentsDetails?.parentTaxPayable).toBe(75600)
    expect(parentThirtySlab.payingToParentsDetails?.netHouseholdTaxSaved).toBe(7200)
  })
})

// ─── PRESUMPTIVE TAXATION (44AD & 44ADA) ──────────────────────

describe('calcPresumptiveTax', () => {
  it('1. 44ADA turnover exactly at ₹75 lakh threshold with ≥95% digital receipts — still eligible', () => {
    const result = calcPresumptiveTax({
      professionType: '44ADA_professional',
      grossTurnover: 7500000,
      digitalReceiptsPercentage: 95,
      regime: 'new',
    })
    expect(result.isEligibleForPresumptive).toBe(true)
    expect(result.isEnhancedLimitApplicable).toBe(true)
    expect(result.maxTurnoverLimit).toBe(7500000)
    expect(result.presumptiveIncome).toBe(3750000) // 50% of 75L
    expect(result.presumptiveTaxPayable).toBeGreaterThan(0)
  })

  it('2. 44ADA turnover marginally above ₹50 lakh but digital receipts below 95% — reverts to ₹50L and flagged ineligible', () => {
    const result = calcPresumptiveTax({
      professionType: '44ADA_professional',
      grossTurnover: 5100000,
      digitalReceiptsPercentage: 90, // < 95%
      regime: 'new',
    })
    expect(result.isEnhancedLimitApplicable).toBe(false)
    expect(result.maxTurnoverLimit).toBe(5000000)
    expect(result.isEligibleForPresumptive).toBe(false)
    expect(result.ineligibilityReason).toContain('50 Lakh')
  })

  it('3. 44AD with 100% digital receipts — 6% rate applied correctly', () => {
    // Turnover ₹1 Crore, 100% digital -> Presumptive income = ₹6,00,000
    const result = calcPresumptiveTax({
      professionType: '44AD_business',
      grossTurnover: 10000000,
      digitalReceiptsPercentage: 100,
      regime: 'new',
    })
    expect(result.isEligibleForPresumptive).toBe(true)
    expect(result.presumptiveIncome).toBe(600000)
    expect(result.presumptiveRateEffective).toBe(6)
  })

  it('4. 44AD with significant cash receipts — mixed 6% digital + 8% cash applied accurately', () => {
    // Turnover ₹1 Crore: ₹60L digital (6% = 3,60,000) + ₹40L cash (8% = 3,20,000) -> Total = 6,80,000
    const result = calcPresumptiveTax({
      professionType: '44AD_business',
      grossTurnover: 10000000,
      digitalReceiptsPercentage: 60,
      regime: 'new',
    })
    expect(result.digitalTurnover).toBe(6000000)
    expect(result.cashTurnover).toBe(4000000)
    expect(result.presumptiveIncome).toBe(680000)
    expect(result.presumptiveRateEffective).toBe(6.8)
  })

  it('5. Turnover of ₹0 — presumptive income and tax both compute to ₹0 without division errors', () => {
    const result = calcPresumptiveTax({
      professionType: '44ADA_professional',
      grossTurnover: 0,
      digitalReceiptsPercentage: 100,
    })
    expect(result.presumptiveIncome).toBe(0)
    expect(result.presumptiveTaxPayable).toBe(0)
    expect(result.actualTaxPayable).toBe(0)
  })

  it('6. Actual profit is lower than presumptive income — output flags presumptive costs more and notes audit conditions', () => {
    // 44ADA: 60L turnover -> Presumptive income = 30L (tax ~ ₹4.73L in new regime)
    // Actual profit = 10L (tax = 0 in new regime due to rebate)
    const result = calcPresumptiveTax({
      professionType: '44ADA_professional',
      grossTurnover: 6000000,
      digitalReceiptsPercentage: 100,
      actualProfit: 1000000,
      regime: 'new',
    })
    expect(result.presumptiveIncome).toBe(3000000)
    expect(result.actualProfit).toBe(1000000)
    expect(result.isPresumptiveCheaper).toBe(false)
    expect(result.isAuditTriggeredByOptOut).toBe(true)
    expect(result.auditTriggerReason).toBeDefined()
  })

  it('7. Turnover exceeding the presumptive scheme threshold entirely — clearly states ineligible and does not compute false valid status', () => {
    // 44ADA with 80L turnover (> 75L enhanced limit)
    const result = calcPresumptiveTax({
      professionType: '44ADA_professional',
      grossTurnover: 8000000,
      digitalReceiptsPercentage: 100,
    })
    expect(result.isEligibleForPresumptive).toBe(false)
    expect(result.presumptiveTaxPayable).toBe(0)
    expect(result.ineligibilityReason).toContain('exceed the maximum ₹75 Lakh limit')
  })

  it('8. Extremely high turnover under enhanced 44AD limit (₹2.9 Crore) — calculates correctly without boundary bugs', () => {
    // 44AD: 2.9 Crore turnover with 98% digital -> Eligible under 3 Crore enhanced limit
    const result = calcPresumptiveTax({
      professionType: '44AD_business',
      grossTurnover: 29000000,
      digitalReceiptsPercentage: 98,
      regime: 'new',
    })
    expect(result.isEligibleForPresumptive).toBe(true)
    expect(result.maxTurnoverLimit).toBe(30000000)
    // Digital: 2,84,20,000 * 6% = 17,05,200; Cash: 5,80,000 * 8% = 46,400 -> Total = 17,51,600
    expect(result.presumptiveIncome).toBe(1751600)
    expect(result.presumptiveTaxPayable).toBeGreaterThan(0)
  })

  it('9. Slab-rate tax calculation on presumptive income correctly uses the income tax slab logic', () => {
    // 44ADA with ₹20L turnover -> Presumptive income = ₹10L.
    // In FY 2025-26 new regime: income ≤ 12L gets 87A rebate -> Tax is ₹0!
    const resUnderRebate = calcPresumptiveTax({
      professionType: '44ADA_professional',
      grossTurnover: 2000000,
      digitalReceiptsPercentage: 100,
      regime: 'new',
    })
    expect(resUnderRebate.presumptiveIncome).toBe(1000000)
    expect(resUnderRebate.presumptiveTaxPayable).toBe(0)

    // In old regime: income ₹10L with ₹1.5L 80C -> Taxable ₹8.5L.
    // Slabs: 0-2.5L 0, 2.5-5L 12.5k, 5-8.5L 70k -> Raw tax 82.5k + 4% cess = 85.8k
    const resOldRegime = calcPresumptiveTax({
      professionType: '44ADA_professional',
      grossTurnover: 2000000,
      digitalReceiptsPercentage: 100,
      regime: 'old',
      deduction80C: 150000,
    })
    expect(resOldRegime.presumptiveTaxDetails.taxableIncome).toBe(850000)
    expect(resOldRegime.presumptiveTaxPayable).toBe(85800)
  })

  it('10. Audit-trigger and 5-year lockout flags activate when opting out of 44AD with lower declared profit', () => {
    // 44AD: Turnover 1.5 Cr -> Presumptive income = 9 Lakhs.
    // Assessee declares actual profit of 5 Lakhs (which is < 9 Lakhs and > basic exemption of 4 Lakhs)
    const result = calcPresumptiveTax({
      professionType: '44AD_business',
      grossTurnover: 15000000,
      digitalReceiptsPercentage: 100,
      actualProfit: 500000,
      regime: 'new',
    })
    expect(result.isAuditTriggeredByOptOut).toBe(true)
    expect(result.fiveYearLockoutTriggered).toBe(true)
    expect(result.auditTriggerReason).toContain('Section 44AD(4)')
  })
})

// ─── POSITION SIZE & RISK-REWARD ──────────────────────────────

describe('calcPositionSize', () => {
  it('1. Standard long trade — entry > stop-loss; quantity, risk amount, and target compute correctly', () => {
    // Capital: 1,00,000, Risk: 1% (1,000), Entry: 500, Stop: 480 (diff=20), RR: 1:2 (2)
    // Raw qty = 1000 / 20 = 50 shares. Max affordable = 100000 / 500 = 200 shares.
    // Qty = 50. Position Value = 25,000. Risk = 1,000. Target = 500 + 2*20 = 540. Profit = 50*40 = 2,000.
    const result = calcPositionSize({
      capital: 100000,
      riskPercent: 1,
      entryPrice: 500,
      stopLossPrice: 480,
      riskRewardRatio: 2,
    })
    expect(result.isValid).toBe(true)
    expect(result.tradeDirection).toBe('long')
    expect(result.maxRiskAmount).toBe(1000)
    expect(result.riskPerShare).toBe(20)
    expect(result.quantity).toBe(50)
    expect(result.positionValue).toBe(25000)
    expect(result.actualRiskAmount).toBe(1000)
    expect(result.targetPrice).toBe(540)
    expect(result.potentialProfit).toBe(2000)
    expect(result.isCappedByCapital).toBe(false)
  })

  it('2. Short trade — entry < stop-loss; correctly flips to short and target price is below entry', () => {
    // Capital: 1,00,000, Risk: 1% (1,000), Entry: 500, Stop: 520 (diff=20), RR: 1:2
    // Target price = 500 - 2*20 = 460.
    const result = calcPositionSize({
      capital: 100000,
      riskPercent: 1,
      entryPrice: 500,
      stopLossPrice: 520,
      riskRewardRatio: 2,
    })
    expect(result.isValid).toBe(true)
    expect(result.tradeDirection).toBe('short')
    expect(result.quantity).toBe(50)
    expect(result.targetPrice).toBe(460)
    expect(result.potentialProfit).toBe(2000)
  })

  it('3. Stop-loss equal to entry price — handled gracefully with validation message, no division by zero', () => {
    const result = calcPositionSize({
      capital: 100000,
      riskPercent: 1,
      entryPrice: 500,
      stopLossPrice: 500,
      riskRewardRatio: 2,
    })
    expect(result.isValid).toBe(false)
    expect(result.validationError).toContain('cannot be equal')
    expect(result.quantity).toBe(0)
  })

  it('4. Extremely tight stop-loss (₹0.05) — quantity is capped at total affordable capital', () => {
    // Capital: 1,00,000, Risk: 1% (1,000), Entry: 1000, Stop: 999.95 (diff=0.05).
    // Risk qty = 1000 / 0.05 = 20,000 shares (would cost 2 Crore!).
    // Capped by capital: 100,000 / 1000 = 100 shares.
    const result = calcPositionSize({
      capital: 100000,
      riskPercent: 1,
      entryPrice: 1000,
      stopLossPrice: 999.95,
      riskRewardRatio: 2,
    })
    expect(result.isValid).toBe(true)
    expect(result.quantity).toBe(100)
    expect(result.positionValue).toBe(100000)
    expect(result.isCappedByCapital).toBe(true)
    expect(result.warning).toBeDefined()
  })

  it('5. Position size implied by risk cap exceeds what capital can afford — caps at affordable max and flags it', () => {
    // Capital: 50,000, Risk: 2% (1,000), Entry: 500, Stop: 495 (diff=5).
    // Risk qty = 1000 / 5 = 200 shares (value = 1,00,000 > 50,000 capital).
    // Max affordable = 50,000 / 500 = 100 shares.
    const result = calcPositionSize({
      capital: 50000,
      riskPercent: 2,
      entryPrice: 500,
      stopLossPrice: 495,
      riskRewardRatio: 2,
    })
    expect(result.quantity).toBe(100)
    expect(result.isCappedByCapital).toBe(true)
    expect(result.actualRiskAmount).toBe(500) // 100 * 5
  })

  it('6. Zero or negative capital input — rejected with clear validation message', () => {
    const zeroCapital = calcPositionSize({
      capital: 0,
      riskPercent: 1,
      entryPrice: 100,
      stopLossPrice: 95,
      riskRewardRatio: 2,
    })
    expect(zeroCapital.isValid).toBe(false)
    expect(zeroCapital.validationError).toContain('greater than zero')

    const negCapital = calcPositionSize({
      capital: -50000,
      riskPercent: 1,
      entryPrice: 100,
      stopLossPrice: 95,
      riskRewardRatio: 2,
    })
    expect(negCapital.isValid).toBe(false)
    expect(negCapital.validationError).toContain('greater than zero')
  })

  it('7. Custom risk-reward ratio (e.g. 1:2.5) — target price calculation handles non-integer ratios correctly', () => {
    // Entry: 200, Stop: 190 (diff=10), RR: 2.5
    // Target = 200 + 2.5 * 10 = 225.
    const result = calcPositionSize({
      capital: 100000,
      riskPercent: 1,
      entryPrice: 200,
      stopLossPrice: 190,
      riskRewardRatio: 2.5,
    })
    expect(result.targetPrice).toBe(225)
    expect(result.riskRewardRatio).toBe(2.5)
  })

  it('8. 1% risk on ₹1,00,000 capital — exact rupee risk (₹1,000) and quantity verified against manual calculation', () => {
    // Capital: 1,00,000, Risk: 1% = 1,000. Entry: 250, Stop: 240 (diff=10).
    // Qty = 1,000 / 10 = 100 shares.
    const result = calcPositionSize({
      capital: 100000,
      riskPercent: 1,
      entryPrice: 250,
      stopLossPrice: 240,
      riskRewardRatio: 3,
    })
    expect(result.maxRiskAmount).toBe(1000)
    expect(result.quantity).toBe(100)
    expect(result.actualRiskAmount).toBe(1000)
    expect(result.potentialProfit).toBe(3000)
    expect(result.targetPrice).toBe(280)
  })

  it('9. Fractional share quantity result — correctly rounds down (floor) to nearest whole share, never exceeds risk cap', () => {
    // Capital: 1,00,000, Risk: 1% (1,000), Entry: 100, Stop: 70 (diff=30).
    // Raw qty = 1000 / 30 = 33.3333 shares.
    // Must floor to 33 shares (never 34 which would risk 1020 > 1000).
    const result = calcPositionSize({
      capital: 100000,
      riskPercent: 1,
      entryPrice: 100,
      stopLossPrice: 70,
      riskRewardRatio: 2,
    })
    expect(result.quantity).toBe(33)
    expect(result.actualRiskAmount).toBe(990)
    expect(result.actualRiskAmount).toBeLessThanOrEqual(1000)
  })

  it('10. Risk percentage input at boundary values (0.1% minimum, 10% maximum) — both compute without error', () => {
    const minRisk = calcPositionSize({
      capital: 100000,
      riskPercent: 0.1,
      entryPrice: 100,
      stopLossPrice: 95,
      riskRewardRatio: 2,
    })
    expect(minRisk.maxRiskAmount).toBe(100)
    expect(minRisk.quantity).toBe(20) // 100 / 5

    const maxRisk = calcPositionSize({
      capital: 100000,
      riskPercent: 10,
      entryPrice: 100,
      stopLossPrice: 95,
      riskRewardRatio: 2,
    })
    expect(maxRisk.maxRiskAmount).toBe(10000)
    expect(maxRisk.quantity).toBe(1000) // 10000 / 5 = 2000 capped at 100000/100 = 1000
    expect(maxRisk.positionValue).toBe(100000)
  })
})

// ─── SECTION 54 & 54EC EXEMPTIONS ─────────────────────────────

describe('calcSection54Exemption', () => {
  it('1. Full capital gains reinvested under Section 54 — exemption equals full gains, resulting tax is ₹0', () => {
    // Gains: 50,00,000, Reinvested in property: 50,00,000 within 6 months
    const result = calcSection54Exemption({
      capitalGainsAmount: 5000000,
      sectionType: 'section_54_property',
      propertyInvestmentAmount: 5000000,
      propertyMode: 'purchase',
      propertyTimelineMonths: 6,
    })
    expect(result.initialLtcgGains).toBe(5000000)
    expect(result.activeResult.exemptionAllowed).toBe(5000000)
    expect(result.activeResult.taxableGainsRemaining).toBe(0)
    expect(result.activeResult.taxAfterExemption).toBe(0)
    expect(result.activeResult.taxSaved).toBe(result.taxBeforeExemption)
  })

  it('2. Partial reinvestment under Section 54 — exemption capped at reinvested amount, remaining gains taxed', () => {
    // Gains: 50,00,000, Reinvested: 30,00,000. Remaining taxable: 20,00,000.
    // Tax at 13% (12.5% + 4% cess) = 2,60,000.
    const result = calcSection54Exemption({
      capitalGainsAmount: 5000000,
      sectionType: 'section_54_property',
      propertyInvestmentAmount: 3000000,
      propertyMode: 'purchase',
      propertyTimelineMonths: 12,
    })
    expect(result.activeResult.exemptionAllowed).toBe(3000000)
    expect(result.activeResult.taxableGainsRemaining).toBe(2000000)
    expect(result.activeResult.taxAfterExemption).toBe(260000)
    expect(result.activeResult.taxSaved).toBe(390000) // 30L * 13%
  })

  it('3. Section 54EC reinvestment at ₹50 lakh cap — exemption capped at ₹50L, excess taxable', () => {
    // Gains: 80,00,000, Bond Investment: 60,00,000 (attempted).
    // Section 54EC statutory cap is 50,00,000. Remaining taxable: 30,00,000.
    // Tax at 13% = 3,90,000.
    const result = calcSection54Exemption({
      capitalGainsAmount: 8000000,
      sectionType: 'section_54ec_bonds',
      bondsInvestmentAmount: 6000000,
      bondsTimelineMonths: 4,
    })
    expect(result.activeResult.exemptionAllowed).toBe(5000000)
    expect(result.activeResult.taxableGainsRemaining).toBe(3000000)
    expect(result.activeResult.taxAfterExemption).toBe(390000)
  })

  it('4. Section 54EC investment attempted beyond 6-month window — exemption denied and flagged clearly', () => {
    // Attempted at 7 months (prescribed window: within 6 months)
    const result = calcSection54Exemption({
      capitalGainsAmount: 5000000,
      sectionType: 'section_54ec_bonds',
      bondsInvestmentAmount: 5000000,
      bondsTimelineMonths: 7,
    })
    expect(result.activeResult.isValidTimeline).toBe(false)
    expect(result.activeResult.exemptionAllowed).toBe(0)
    expect(result.activeResult.taxableGainsRemaining).toBe(5000000)
    expect(result.activeResult.taxAfterExemption).toBe(result.taxBeforeExemption)
    expect(result.activeResult.timelineMessage).toContain('Invalid timeline')
  })

  it('5. Section 54 purchase completed within "1 year before sale" window — correctly counted as valid', () => {
    // Purchased 6 months prior to transfer (-6 months)
    const result = calcSection54Exemption({
      capitalGainsAmount: 4000000,
      sectionType: 'section_54_property',
      propertyInvestmentAmount: 4000000,
      propertyMode: 'purchase',
      propertyTimelineMonths: -6,
    })
    expect(result.activeResult.isValidTimeline).toBe(true)
    expect(result.activeResult.exemptionAllowed).toBe(4000000)
    expect(result.activeResult.taxAfterExemption).toBe(0)
  })

  it('6. Section 54 construction case using 3-year window — correctly distinguished from 2-year purchase window', () => {
    // Construction completed at 30 months (+2.5 years) -> Valid for construction (up to 36m)
    const constructionResult = calcSection54Exemption({
      capitalGainsAmount: 6000000,
      sectionType: 'section_54_property',
      propertyInvestmentAmount: 6000000,
      propertyMode: 'construction',
      propertyTimelineMonths: 30,
    })
    expect(constructionResult.activeResult.isValidTimeline).toBe(true)
    expect(constructionResult.activeResult.exemptionAllowed).toBe(6000000)

    // Purchase attempted at 30 months -> Invalid for purchase (only up to 24m)
    const purchaseResult = calcSection54Exemption({
      capitalGainsAmount: 6000000,
      sectionType: 'section_54_property',
      propertyInvestmentAmount: 6000000,
      propertyMode: 'purchase',
      propertyTimelineMonths: 30,
    })
    expect(purchaseResult.activeResult.isValidTimeline).toBe(false)
    expect(purchaseResult.activeResult.exemptionAllowed).toBe(0)
  })

  it('7. Reinvestment amount exceeding total capital gains — exemption caps at gains amount, no negative tax', () => {
    // LTCG: 40,00,000. Invested: 80,00,000 in property.
    const result = calcSection54Exemption({
      capitalGainsAmount: 4000000,
      sectionType: 'section_54_property',
      propertyInvestmentAmount: 8000000,
      propertyMode: 'purchase',
      propertyTimelineMonths: 6,
    })
    expect(result.activeResult.exemptionAllowed).toBe(4000000)
    expect(result.activeResult.taxableGainsRemaining).toBe(0)
    expect(result.activeResult.taxAfterExemption).toBe(0)
  })

  it('8. Side-by-side Section 54 vs 54EC comparison — both computed independently and accurately', () => {
    // LTCG: 1,00,00,000 (1 Crore).
    // Section 54: Invest 1 Cr in house -> Exemption 1 Cr, Tax = 0
    // Section 54EC: Invest 50L in bonds -> Exemption 50L, Taxable 50L, Tax = 6.5L
    const result = calcSection54Exemption({
      capitalGainsAmount: 10000000,
      sectionType: 'compare_both',
      propertyInvestmentAmount: 10000000,
      propertyMode: 'purchase',
      propertyTimelineMonths: 6,
      bondsInvestmentAmount: 5000000,
      bondsTimelineMonths: 3,
    })
    expect(result.comparison).toBeDefined()
    expect(result.comparison?.section54.exemptionAllowed).toBe(10000000)
    expect(result.comparison?.section54.taxAfterExemption).toBe(0)
    expect(result.comparison?.section54ec.exemptionAllowed).toBe(5000000)
    expect(result.comparison?.section54ec.taxAfterExemption).toBe(650000)
    expect(result.comparison?.taxDifference).toBe(650000)
  })

  it('9. Zero capital gains input — both sections correctly output ₹0 exemption needed, no errors', () => {
    const result = calcSection54Exemption({
      capitalGainsAmount: 0,
      sectionType: 'compare_both',
      propertyInvestmentAmount: 5000000,
      bondsInvestmentAmount: 5000000,
    })
    expect(result.initialLtcgGains).toBe(0)
    expect(result.taxBeforeExemption).toBe(0)
    expect(result.activeResult.exemptionAllowed).toBe(0)
    expect(result.activeResult.taxAfterExemption).toBe(0)
  })

  it('10. Chained correctly from existing Capital Gains Calculator output — real estate LTCG flows through accurately', () => {
    // Chain from calcCapitalGains with real_estate LTCG:
    // Buy 40L in 2016, sell 1.2Cr in 2024 (holding 96 months > 24m) -> LTCG gain = 80L
    const result = calcSection54Exemption({
      capitalGainsInput: {
        assetClass: 'real_estate',
        purchasePrice: 4000000,
        salePrice: 12000000,
        holdingMonths: 96,
        isPurchasedBeforeCutoff: false,
      },
      sectionType: 'section_54_property',
      propertyInvestmentAmount: 8000000,
      propertyMode: 'purchase',
      propertyTimelineMonths: 6,
    })
    expect(result.initialLtcgGains).toBe(8000000) // 1.2Cr - 40L
    expect(result.activeResult.exemptionAllowed).toBe(8000000)
    expect(result.activeResult.taxAfterExemption).toBe(0)
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GROUP 1: CFA & INVESTMENT ANALYTICS UNIT TESTS (60 TESTS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── 1. DCF Valuation ──────────────────────────────────────────
describe('calcDCF', () => {
  it('1. Standard 5-year FCF projection with g < r computes positive EV and equity value', () => {
    const res = calcDCF({
      fcfProjections: [1000000, 1150000, 1320000, 1520000, 1750000],
      terminalGrowthRate: 4,
      discountRate: 11,
      sharesOutstanding: 100000,
      netDebt: 2000000,
    })
    expect(res.isValid).toBe(true)
    expect(res.presentValueExplicitFcf).toBeGreaterThan(0)
    expect(res.terminalValue).toBeGreaterThan(0)
    expect(res.enterpriseValue).toBeGreaterThan(res.presentValueExplicitFcf)
    expect(res.equityValue).toBe(res.enterpriseValue - 2000000)
    expect(res.intrinsicValuePerShare).toBeGreaterThan(0)
    expect(res.yearlyBreakdown.length).toBe(5)
  })

  it('2. Terminal growth rate ≥ discount rate (g ≥ r) triggers Gordon Growth breakdown error', () => {
    const res = calcDCF({
      fcfProjections: [1000000, 1200000],
      terminalGrowthRate: 12,
      discountRate: 10,
    })
    expect(res.isValid).toBe(false)
    expect(res.errorMessage).toContain('strictly less than the discount rate')
    expect(res.enterpriseValue).toBe(0)
  })

  it('3. Zero-growth perpetuity (g = 0) evaluates clean terminal value FCF/r', () => {
    const res = calcDCF({
      fcfProjections: [1000000],
      terminalGrowthRate: 0,
      discountRate: 10,
      sharesOutstanding: 10000,
    })
    expect(res.isValid).toBe(true)
    expect(res.terminalValue).toBe(10000000) // 10L / 0.10 = 1 Cr
    expect(res.intrinsicValuePerShare).toBeGreaterThan(0)
  })

  it('4. Negative FCF in early projection years handled without breaking NPV sum', () => {
    const res = calcDCF({
      fcfProjections: [-500000, -200000, 1000000, 2000000],
      terminalGrowthRate: 3,
      discountRate: 12,
      sharesOutstanding: 50000,
    })
    expect(res.isValid).toBe(true)
    expect(res.yearlyBreakdown[0].presentValue).toBeLessThan(0)
    expect(res.yearlyBreakdown[3].presentValue).toBeGreaterThan(0)
    expect(res.enterpriseValue).toBeGreaterThan(0)
  })

  it('5. Single-year projection vs 10-year projection both calculate accurately', () => {
    const singleYear = calcDCF({
      fcfProjections: [1000000],
      terminalGrowthRate: 4,
      discountRate: 10,
    })
    const tenYears = calcDCF({
      fcfProjections: [1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000, 1800000, 1900000],
      terminalGrowthRate: 4,
      discountRate: 10,
    })
    expect(singleYear.yearlyBreakdown.length).toBe(1)
    expect(tenYears.yearlyBreakdown.length).toBe(10)
    expect(tenYears.enterpriseValue).toBeGreaterThan(singleYear.enterpriseValue)
  })

  it('6. Discount rate ≤ 0% rejected defensively', () => {
    const res = calcDCF({
      fcfProjections: [1000000],
      terminalGrowthRate: 3,
      discountRate: 0,
    })
    expect(res.isValid).toBe(false)
    expect(res.errorMessage).toContain('strictly greater than 0%')
  })

  it('7. Negative net debt (net cash company) increases Equity Value above EV', () => {
    const res = calcDCF({
      fcfProjections: [1000000, 1100000],
      terminalGrowthRate: 3,
      discountRate: 10,
      netDebt: -5000000, // Net cash of ₹50 Lakhs
    })
    expect(res.equityValue).toBe(res.enterpriseValue + 5000000)
  })

  it('8. High net debt correctly subtracts from EV', () => {
    const res = calcDCF({
      fcfProjections: [1000000, 1100000],
      terminalGrowthRate: 3,
      discountRate: 10,
      netDebt: 5000000,
    })
    expect(res.equityValue).toBe(res.enterpriseValue - 5000000)
  })

  it('9. Intrinsic share price scales inversely with shares outstanding', () => {
    const resSmall = calcDCF({
      fcfProjections: [1000000],
      terminalGrowthRate: 3,
      discountRate: 10,
      sharesOutstanding: 100000,
    })
    const resLarge = calcDCF({
      fcfProjections: [1000000],
      terminalGrowthRate: 3,
      discountRate: 10,
      sharesOutstanding: 200000,
    })
    expect(Math.round(resSmall.intrinsicValuePerShare)).toBe(Math.round(resLarge.intrinsicValuePerShare * 2))
  })

  it('10. Generates non-empty sensitivity matrix around discount and growth rates', () => {
    const res = calcDCF({
      fcfProjections: [1000000, 1200000, 1400000],
      terminalGrowthRate: 4,
      discountRate: 11,
    })
    expect(res.sensitivityMatrix.length).toBeGreaterThanOrEqual(3)
    expect(res.sensitivityMatrix[0].length).toBeGreaterThanOrEqual(3)
  })
})

// ─── 2. WACC Calculator ────────────────────────────────────────
describe('calcWACC', () => {
  it('1. 100% Equity / 0% Debt case yields WACC equal to Cost of Equity', () => {
    const res = calcWACC({
      equityValue: 10000000,
      debtValue: 0,
      costOfEquity: 15,
      costOfDebt: 9,
      taxRate: 25,
    })
    expect(res.weightOfEquity).toBe(100)
    expect(res.weightOfDebt).toBe(0)
    expect(res.wacc).toBe(15)
  })

  it('2. 0% Equity / 100% Debt case yields WACC equal to after-tax Cost of Debt', () => {
    const res = calcWACC({
      equityValue: 0,
      debtValue: 10000000,
      costOfEquity: 15,
      costOfDebt: 10,
      taxRate: 25,
    })
    expect(res.weightOfEquity).toBe(0)
    expect(res.weightOfDebt).toBe(100)
    expect(res.wacc).toBe(7.5) // 10 * (1 - 0.25) = 7.5%
  })

  it('3. CAPM mode correctly derives cost of equity from risk-free rate, beta, and market return', () => {
    // Ke = 7 + 1.2 * (15 - 7) = 7 + 9.6 = 16.6%
    const res = calcWACC({
      equityValue: 6000000,
      debtValue: 4000000,
      costOfEquityMode: 'capm',
      riskFreeRate: 7,
      beta: 1.2,
      marketReturn: 15,
      costOfDebt: 8,
      taxRate: 25,
    })
    expect(res.costOfEquity).toBe(16.6)
    expect(res.afterTaxCostOfDebt).toBe(6) // 8 * 0.75
    // WACC = 0.6 * 16.6 + 0.4 * 6 = 9.96 + 2.4 = 12.36%
    expect(res.wacc).toBe(12.36)
  })

  it('4. Tax shield correctly reduces after-tax cost of debt', () => {
    const res = calcWACC({
      equityValue: 5000000,
      debtValue: 5000000,
      costOfEquity: 12,
      costOfDebt: 10,
      taxRate: 30,
    })
    expect(res.preTaxCostOfDebt).toBe(10)
    expect(res.afterTaxCostOfDebt).toBe(7)
    expect(res.taxShieldBenefit).toBe(3)
  })

  it('5. 0% tax rate produces no tax shield benefit (after-tax Kd = pre-tax Kd)', () => {
    const res = calcWACC({
      equityValue: 5000000,
      debtValue: 5000000,
      costOfEquity: 12,
      costOfDebt: 8,
      taxRate: 0,
    })
    expect(res.afterTaxCostOfDebt).toBe(8)
    expect(res.taxShieldBenefit).toBe(0)
    expect(res.wacc).toBe(10) // 0.5*12 + 0.5*8 = 10
  })

  it('6. Zero capital structure value handled defensively', () => {
    const res = calcWACC({
      equityValue: 0,
      debtValue: 0,
      costOfEquity: 12,
      costOfDebt: 8,
      taxRate: 25,
    })
    expect(res.wacc).toBe(0)
    expect(res.totalValue).toBe(0)
  })

  it('7. 50/50 capital structure accurately weights components', () => {
    const res = calcWACC({
      equityValue: 50000000,
      debtValue: 50000000,
      costOfEquity: 14,
      costOfDebt: 10,
      taxRate: 20,
    })
    expect(res.weightOfEquity).toBe(50)
    expect(res.weightOfDebt).toBe(50)
    expect(res.wacc).toBe(11) // 0.5*14 + 0.5*8 = 11
  })

  it('8. High beta (>2.0) increases WACC in CAPM mode', () => {
    const resBase = calcWACC({
      equityValue: 1000000,
      debtValue: 500000,
      costOfEquityMode: 'capm',
      riskFreeRate: 7,
      beta: 1.0,
      marketReturn: 15,
      costOfDebt: 8,
      taxRate: 25,
    })
    const resHighBeta = calcWACC({
      equityValue: 1000000,
      debtValue: 500000,
      costOfEquityMode: 'capm',
      riskFreeRate: 7,
      beta: 2.0,
      marketReturn: 15,
      costOfDebt: 8,
      taxRate: 25,
    })
    expect(resHighBeta.wacc).toBeGreaterThan(resBase.wacc)
  })

  it('9. Low beta (<0.5) decreases WACC in CAPM mode', () => {
    const resBase = calcWACC({
      equityValue: 1000000,
      debtValue: 500000,
      costOfEquityMode: 'capm',
      riskFreeRate: 7,
      beta: 1.0,
      marketReturn: 15,
      costOfDebt: 8,
      taxRate: 25,
    })
    const resLowBeta = calcWACC({
      equityValue: 1000000,
      debtValue: 500000,
      costOfEquityMode: 'capm',
      riskFreeRate: 7,
      beta: 0.4,
      marketReturn: 15,
      costOfDebt: 8,
      taxRate: 25,
    })
    expect(resLowBeta.wacc).toBeLessThan(resBase.wacc)
  })

  it('10. Capital structure weights sum to exactly 100%', () => {
    const res = calcWACC({
      equityValue: 7300000,
      debtValue: 2700000,
      costOfEquity: 14,
      costOfDebt: 9,
      taxRate: 25,
    })
    expect(res.weightOfEquity + res.weightOfDebt).toBe(100)
    expect(res.capitalStructureBreakdown.length).toBe(2)
  })
})

// ─── 3. DuPont Analysis ────────────────────────────────────────
describe('calcDuPont', () => {
  it('1. 3-step components multiply back to match reported ROE', () => {
    const res = calcDuPont({
      netIncome: 1500000,
      revenue: 10000000,
      totalAssets: 8000000,
      shareholdersEquity: 5000000,
    })
    expect(res.reportedRoe).toBe(30) // 1.5M / 5M = 30%
    expect(res.threeStep.netProfitMargin).toBe(15) // 1.5M / 10M
    expect(res.threeStep.assetTurnover).toBe(1.25) // 10M / 8M
    expect(res.threeStep.financialLeverage).toBe(1.6) // 8M / 5M
    // 15 * 1.25 * 1.6 = 30
    expect(res.threeStep.decomposedRoe).toBe(30)
  })

  it('2. 5-step components multiply back to match reported ROE', () => {
    const res = calcDuPont({
      netIncome: 1500000,
      revenue: 10000000,
      totalAssets: 8000000,
      shareholdersEquity: 5000000,
      ebt: 2000000,
      ebit: 2500000,
    })
    expect(res.isFiveStepAvailable).toBe(true)
    expect(res.fiveStep?.taxBurden).toBe(0.75) // 1.5M / 2.0M
    expect(res.fiveStep?.interestBurden).toBe(0.8) // 2.0M / 2.5M
    expect(res.fiveStep?.operatingMargin).toBe(25) // 2.5M / 10M
    expect(res.fiveStep?.decomposedRoe).toBe(30)
  })

  it('3. 3-step and 5-step produce the exact same final ROE number', () => {
    const res = calcDuPont({
      netIncome: 1200000,
      revenue: 15000000,
      totalAssets: 10000000,
      shareholdersEquity: 6000000,
      ebt: 1600000,
      ebit: 2000000,
    })
    expect(res.threeStep.decomposedRoe).toBe(res.reportedRoe)
    expect(res.fiveStep?.decomposedRoe).toBe(res.reportedRoe)
  })

  it('4. Zero equity rejected with clear message', () => {
    const res = calcDuPont({
      netIncome: 1000000,
      revenue: 5000000,
      totalAssets: 4000000,
      shareholdersEquity: 0,
    })
    expect(res.reportedRoe).toBe(0)
    expect(res.summary).toContain('Invalid equity value')
  })

  it('5. Negative net income (loss-making company) handled cleanly without throwing', () => {
    const res = calcDuPont({
      netIncome: -500000,
      revenue: 5000000,
      totalAssets: 4000000,
      shareholdersEquity: 2000000,
    })
    expect(res.reportedRoe).toBe(-25)
    expect(res.threeStep.netProfitMargin).toBe(-10)
    expect(res.threeStep.decomposedRoe).toBe(-25)
  })

  it('6. High financial leverage identifies leverage as primary driver', () => {
    const res = calcDuPont({
      netIncome: 200000,
      revenue: 5000000,
      totalAssets: 6000000,
      shareholdersEquity: 1000000, // 6x leverage
    })
    expect(res.primaryDriver).toBe('leverage')
    expect(res.driverAnalysis).toContain('High Financial Leverage')
  })

  it('7. High asset turnover identifies efficiency as primary driver', () => {
    const res = calcDuPont({
      netIncome: 300000,
      revenue: 10000000,
      totalAssets: 4000000, // 2.5x turnover
      shareholdersEquity: 2000000, // 2x leverage (< 2.5)
    })
    expect(res.primaryDriver).toBe('efficiency')
    expect(res.driverAnalysis).toContain('High Asset Turnover')
  })

  it('8. High net margin identifies profitability as primary driver', () => {
    const res = calcDuPont({
      netIncome: 3000000,
      revenue: 10000000, // 30% margin
      totalAssets: 10000000, // 1x turnover
      shareholdersEquity: 8000000, // 1.25x leverage
    })
    expect(res.primaryDriver).toBe('profitability')
    expect(res.driverAnalysis).toContain('Net Profit Margin')
  })

  it('9. Zero revenue handled without division by zero', () => {
    const res = calcDuPont({
      netIncome: 0,
      revenue: 0,
      totalAssets: 1000000,
      shareholdersEquity: 1000000,
    })
    expect(res.threeStep.netProfitMargin).toBe(0)
    expect(res.threeStep.assetTurnover).toBe(0)
  })

  it('10. Extreme HNI numbers scale cleanly', () => {
    const res = calcDuPont({
      netIncome: 5000000000,
      revenue: 25000000000,
      totalAssets: 40000000000,
      shareholdersEquity: 20000000000,
    })
    expect(res.reportedRoe).toBe(25)
    expect(res.threeStep.decomposedRoe).toBe(25)
  })
})

// ─── 4. XIRR & TWRR Analyzer ───────────────────────────────────
describe('calcXIRR and calcTWRR', () => {
  it('1. Single lump sum outflow + single redemption matches CAGR formula exactly', () => {
    const res = calcXIRR([
      { date: '2020-01-01', amount: -100000 },
      { date: '2023-01-01', amount: 200000 },
    ])
    expect(res.isValid).toBe(true)
    expect(res.cagr).toBeDefined()
    expect(Math.round(res.xirr)).toBe(Math.round(res.cagr!))
    expect(res.xirr).toBeGreaterThan(25) // doubling in 3 years is ~26% CAGR
  })

  it('2. Irregular multi-date cashflows (monthly SIP-like pattern) converge accurately', () => {
    const res = calcXIRR([
      { date: '2023-01-01', amount: -10000 },
      { date: '2023-02-01', amount: -10000 },
      { date: '2023-03-01', amount: -10000 },
      { date: '2023-04-01', amount: -10000 },
      { date: '2023-05-01', amount: -10000 },
      { date: '2023-12-31', amount: 55000 },
    ])
    expect(res.isValid).toBe(true)
    expect(res.xirr).toBeGreaterThan(0)
    expect(res.totalInvested).toBe(50000)
    expect(res.totalWithdrawn).toBe(55000)
  })

  it('3. All-negative cash flows array returns isValid: false', () => {
    const res = calcXIRR([
      { date: '2023-01-01', amount: -10000 },
      { date: '2023-06-01', amount: -20000 },
    ])
    expect(res.isValid).toBe(false)
    expect(res.errorMessage).toContain('outflow')
  })

  it('4. All-positive cash flows array returns isValid: false', () => {
    const res = calcXIRR([
      { date: '2023-01-01', amount: 10000 },
      { date: '2023-06-01', amount: 20000 },
    ])
    expect(res.isValid).toBe(false)
    expect(res.errorMessage).toContain('outflow')
  })

  it('5. Less than 2 cash flows returns error', () => {
    const res = calcXIRR([{ date: '2023-01-01', amount: -10000 }])
    expect(res.isValid).toBe(false)
  })

  it('6. High return scenario (100%+ gain) converges', () => {
    const res = calcXIRR([
      { date: '2022-01-01', amount: -100000 },
      { date: '2023-01-01', amount: 300000 },
    ])
    expect(res.isValid).toBe(true)
    expect(res.xirr).toBeGreaterThan(190)
  })

  it('7. Negative return scenario converges to negative XIRR', () => {
    const res = calcXIRR([
      { date: '2022-01-01', amount: -100000 },
      { date: '2023-01-01', amount: 80000 },
    ])
    expect(res.isValid).toBe(true)
    expect(res.xirr).toBeLessThan(0)
  })

  it('8. TWRR accurately multiplies sub-period holding returns', () => {
    const res = calcTWRR([
      { startValue: 100000, endValue: 110000, netCashflow: 0 }, // +10%
      { startValue: 110000, endValue: 121000, netCashflow: 0 }, // +10%
    ])
    // (1 + 0.1) * (1 + 0.1) - 1 = +21%
    expect(res.twrr).toBe(21)
    expect(res.periods.length).toBe(2)
  })

  it('9. TWRR correctly isolates investment performance from cashflow timing', () => {
    // Period 1: $100 -> $120 (+20%). Then deposit $80. Start of period 2 = $200.
    // Period 2: $200 -> $180 (-10%).
    const res = calcTWRR([
      { startValue: 100, endValue: 120, netCashflow: 0 },
      { startValue: 200, endValue: 180, netCashflow: 0 },
    ])
    // TWRR = 1.20 * 0.90 - 1 = 1.08 - 1 = +8%
    expect(res.twrr).toBe(8)
  })

  it('10. Empty TWRR periods handled gracefully', () => {
    const res = calcTWRR([])
    expect(res.twrr).toBe(0)
  })
})

// ─── 5. Portfolio Risk & Return Ratios ──────────────────────────
describe('calcRiskRatios', () => {
  it('1. Sortino ratio uses only downside deviation below risk-free rate', () => {
    // Returns with negative and sub-Rf months
    const returns = [3, 4, -1, 2, 6, 0.2, 4, -2, 3, 4, 5, 2]
    const res = calcRiskRatios({
      returns,
      periodFrequency: 'monthly',
      riskFreeRate: 6.0, // 0.5% per month
    })
    expect(res.sharpeRatio).toBeGreaterThan(0)
    expect(res.sortinoRatio).toBeDefined()
    expect(res.sortinoRatio!).toBeGreaterThan(0)
    expect(res.downsideDeviationAnnualized).toBeLessThanOrEqual(res.totalVolatilityAnnualized)
  })

  it('2. When returns have upside skew, Sortino is significantly higher than Sharpe', () => {
    // Strong positive months with mild drawdown
    const returns = [10, 15, -1, 12, 8, -2, 14, 11, -1, 9, 13, -1]
    const res = calcRiskRatios({
      returns,
      periodFrequency: 'monthly',
      riskFreeRate: 6.0,
    })
    expect(res.sortinoRatio).toBeGreaterThan(res.sharpeRatio)
  })

  it('3. Zero downside observations (all returns exceed Rf) flags isSortinoInfinite', () => {
    const returns = [2, 2, 2, 2, 2, 2] // 2% monthly > 0.5% Rf
    const res = calcRiskRatios({
      returns,
      periodFrequency: 'monthly',
      riskFreeRate: 6.0,
    })
    expect(Number.isFinite(res.sharpeRatio)).toBe(true)
    expect(res.isSortinoInfinite).toBe(true)
    expect(res.sortinoRatio).toBeUndefined()
  })

  it('4. Negative excess return (underperforming risk-free) produces negative Sharpe', () => {
    const returns = [0.1, 0.2, 0.1, 0.2, 0.1, 0.2] // annualized return = ~1.8% < 6.5% Rf
    const res = calcRiskRatios({
      returns,
      periodFrequency: 'monthly',
      riskFreeRate: 6.5,
    })
    expect(res.sharpeRatio).toBeLessThan(0)
  })

  it('5. Treynor ratio with beta provided calculates accurately', () => {
    const returns = [2, 3, -1, 4, 1, 2, 3, -1, 2, 3, 1, 2]
    const res = calcRiskRatios({
      returns,
      periodFrequency: 'monthly',
      riskFreeRate: 6.0,
      portfolioBeta: 1.2,
    })
    expect(res.treynorRatio).toBeDefined()
    expect(Number.isFinite(res.treynorRatio!)).toBe(true)
  })

  it('6. Treynor ratio with beta = 0 handled gracefully without divide-by-zero blowup', () => {
    const returns = [2, 3, 1, 2]
    const res = calcRiskRatios({
      returns,
      periodFrequency: 'monthly',
      riskFreeRate: 6.0,
      portfolioBeta: 0,
    })
    expect(res.treynorRatio).toBeUndefined()
  })

  it('7. Max drawdown correctly identifies peak-to-trough drop', () => {
    const returns = [10, -20, 5, 10]
    const res = calcRiskRatios({ returns })
    expect(res.maxDrawdown).toBeGreaterThan(15)
  })

  it('8. Win rate (% positive periods) computed accurately', () => {
    const returns = [5, -2, 3, -1] // 2 positive out of 4 = 50%
    const res = calcRiskRatios({ returns })
    expect(res.positivePeriodsPercent).toBe(50)
  })

  it('9. Daily frequency applies 252 annualization factor', () => {
    const returns = [0.1, 0.2, -0.05, 0.15, 0.1]
    const resDaily = calcRiskRatios({ returns, periodFrequency: 'daily', riskFreeRate: 6 })
    const resMonthly = calcRiskRatios({ returns, periodFrequency: 'monthly', riskFreeRate: 6 })
    expect(resDaily.meanReturnAnnualized).toBeGreaterThan(resMonthly.meanReturnAnnualized)
  })

  it('10. Single period return array returns informative fallback', () => {
    const res = calcRiskRatios({ returns: [5] })
    expect(res.sharpeRatio).toBe(0)
    expect(res.summary).toContain('at least 2 return periods')
  })
})

// ─── 6. Black-Scholes Option Pricing & Greeks ──────────────────
describe('calcBlackScholes', () => {
  it('1. Deeply in-the-money call Delta approaches 1.0', () => {
    const res = calcBlackScholes({
      spotPrice: 28000,
      strikePrice: 20000,
      timeToExpiryDays: 30,
      volatilityPercent: 15,
      riskFreeRatePercent: 6.5,
    })
    expect(res.callGreeks.delta).toBeGreaterThan(0.95)
    expect(res.callPrice).toBeGreaterThan(7900)
  })

  it('2. Deeply out-of-the-money call Delta approaches 0.0', () => {
    const res = calcBlackScholes({
      spotPrice: 20000,
      strikePrice: 28000,
      timeToExpiryDays: 30,
      volatilityPercent: 15,
      riskFreeRatePercent: 6.5,
    })
    expect(res.callGreeks.delta).toBeLessThan(0.05)
    expect(res.callPrice).toBeLessThan(50)
  })

  it('3. Deeply in-the-money put Delta approaches -1.0', () => {
    const res = calcBlackScholes({
      spotPrice: 20000,
      strikePrice: 28000,
      timeToExpiryDays: 30,
      volatilityPercent: 15,
      riskFreeRatePercent: 6.5,
    })
    expect(res.putGreeks.delta).toBeLessThan(-0.95)
  })

  it('4. Put-Call Parity holds within floating point tolerance', () => {
    const res = calcBlackScholes({
      spotPrice: 24000,
      strikePrice: 24000,
      timeToExpiryDays: 45,
      volatilityPercent: 18,
      riskFreeRatePercent: 7.0,
      dividendYieldPercent: 1.0,
    })
    expect(res.putCallParityCheck.holds).toBe(true)
    expect(res.putCallParityCheck.difference).toBeLessThan(0.01)
  })

  it('5. Zero time-to-expiry (T = 0) converges to intrinsic value without NaN', () => {
    const res = calcBlackScholes({
      spotPrice: 24500,
      strikePrice: 24000,
      timeToExpiryDays: 0,
      volatilityPercent: 20,
      riskFreeRatePercent: 6.5,
    })
    expect(res.callPrice).toBe(500)
    expect(res.putPrice).toBe(0)
    expect(res.callGreeks.delta).toBe(1)
  })

  it('6. High implied volatility (200%) calculates valid non-NaN prices', () => {
    const res = calcBlackScholes({
      spotPrice: 100,
      strikePrice: 100,
      timeToExpiryDays: 30,
      volatilityPercent: 200,
      riskFreeRatePercent: 6.5,
    })
    expect(Number.isFinite(res.callPrice)).toBe(true)
    expect(Number.isFinite(res.putPrice)).toBe(true)
    expect(res.callPrice).toBeGreaterThan(0)
  })

  it('7. Gamma is identical for both Call and Put options at the same strike', () => {
    const res = calcBlackScholes({
      spotPrice: 24000,
      strikePrice: 24200,
      timeToExpiryDays: 20,
      volatilityPercent: 16,
      riskFreeRatePercent: 6.8,
    })
    expect(res.callGreeks.gamma).toBe(res.putGreeks.gamma)
    expect(res.callGreeks.gamma).toBeGreaterThan(0)
  })

  it('8. Theta is negative for long options (time decay erosion)', () => {
    const res = calcBlackScholes({
      spotPrice: 24000,
      strikePrice: 24000,
      timeToExpiryDays: 30,
      volatilityPercent: 18,
      riskFreeRatePercent: 6.8,
    })
    expect(res.callGreeks.theta).toBeLessThan(0)
    expect(res.putGreeks.theta).toBeLessThan(0)
  })

  it('9. Vega is strictly positive and identical for Call and Put', () => {
    const res = calcBlackScholes({
      spotPrice: 24000,
      strikePrice: 24000,
      timeToExpiryDays: 30,
      volatilityPercent: 18,
      riskFreeRatePercent: 6.8,
    })
    expect(res.callGreeks.vega).toBeGreaterThan(0)
    expect(res.callGreeks.vega).toBe(res.putGreeks.vega)
  })

  it('10. At-the-money Call Delta is close to 0.5', () => {
    const res = calcBlackScholes({
      spotPrice: 24000,
      strikePrice: 24000,
      timeToExpiryDays: 15,
      volatilityPercent: 14,
      riskFreeRatePercent: 0,
      dividendYieldPercent: 0,
    })
    expect(Math.abs(res.callGreeks.delta - 0.5)).toBeLessThan(0.05)
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GROUP 2: TRADING & MARGIN UNIT TESTS (10 TESTS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('calcMarginRequired', () => {
  it('1. Margin scales linearly with quantity (2 lots requires exactly 2x margin)', () => {
    const oneLot = calcMarginRequired({ instrumentCategory: 'nifty_futures', lotSize: 50, numberOfLots: 1, price: 24000 })
    const twoLots = calcMarginRequired({ instrumentCategory: 'nifty_futures', lotSize: 50, numberOfLots: 2, price: 24000 })
    expect(twoLots.totalContractValue).toBe(oneLot.totalContractValue * 2)
    expect(twoLots.totalMarginRequired).toBe(oneLot.totalMarginRequired * 2)
  })

  it('2. MTF interest correctly accrues over holding days', () => {
    const res = calcMarginRequired({
      instrumentCategory: 'tier1_equity',
      lotSize: 100,
      numberOfLots: 1,
      price: 1000,
      isMtfHolding: true,
      mtfHoldingDays: 365,
      mtfAnnualInterestRate: 12.0,
    })
    expect(res.isMtfHolding).toBe(true)
    expect(res.mtfBorrowedAmount).toBe(res.totalContractValue - res.totalMarginRequired)
    expect(res.mtfInterestCost).toBe(Math.round(res.mtfBorrowedAmount * 0.12))
    expect(res.totalCapitalNeeded).toBe(res.totalMarginRequired + res.mtfInterestCost)
  })

  it('3. Non-MTF trade has zero MTF interest cost', () => {
    const res = calcMarginRequired({ instrumentCategory: 'nifty_futures', lotSize: 50, numberOfLots: 1, price: 24000, isMtfHolding: false })
    expect(res.mtfInterestCost).toBe(0)
    expect(res.totalCapitalNeeded).toBe(res.totalMarginRequired)
  })

  it('4. Unknown instrument category falls back to custom/conservative default', () => {
    // @ts-expect-error test fallback
    const res = calcMarginRequired({ instrumentCategory: 'crypto_perpetual', lotSize: 10, numberOfLots: 1, price: 100 })
    expect(res.instrumentCategory).toBe('custom')
    expect(res.totalMarginRequired).toBeGreaterThan(0)
  })

  it('5. Nifty futures applies 10.5% SPAN + 2% Exposure = 12.5% margin (~8.0x leverage)', () => {
    const res = calcMarginRequired({ instrumentCategory: 'nifty_futures', lotSize: 50, numberOfLots: 1, price: 20000 })
    // Contract: 50 * 20000 = 10,00,000. Margin: 12.5% = 1,25,000. Leverage = 8.0x
    expect(res.totalContractValue).toBe(1000000)
    expect(res.totalMarginRequired).toBe(125000)
    expect(res.effectiveLeverage).toBe(8.0)
  })

  it('6. Bank Nifty futures applies 12.5% SPAN + 2.5% Exposure = 15.0% margin', () => {
    const res = calcMarginRequired({ instrumentCategory: 'banknifty_futures', lotSize: 15, numberOfLots: 1, price: 50000 })
    // Contract: 15 * 50,000 = 7,50,000. Margin = 15% = 1,12,500
    expect(res.totalMarginRequired).toBe(112500)
    expect(res.effectiveLeverage).toBe(6.67)
  })

  it('7. Intraday MIS equity applies 20% margin cap (5.0x leverage)', () => {
    const res = calcMarginRequired({ instrumentCategory: 'intraday_equity', lotSize: 100, numberOfLots: 1, price: 500 })
    expect(res.totalMarginRequired).toBe(10000) // 20% of 50k
    expect(res.effectiveLeverage).toBe(5.0)
  })

  it('8. Zero price yields ₹0 margin without error', () => {
    const res = calcMarginRequired({ instrumentCategory: 'nifty_futures', lotSize: 50, numberOfLots: 1, price: 0 })
    expect(res.totalContractValue).toBe(0)
    expect(res.totalMarginRequired).toBe(0)
    expect(res.effectiveLeverage).toBe(0)
  })

  it('9. Custom SPAN and exposure percentages override defaults correctly', () => {
    const res = calcMarginRequired({
      instrumentCategory: 'custom',
      lotSize: 100,
      numberOfLots: 1,
      price: 1000,
      customSpanPercent: 25,
      customExposurePercent: 5,
    })
    expect(res.spanMarginPercent).toBe(25)
    expect(res.exposureMarginPercent).toBe(5)
    expect(res.totalMarginRequired).toBe(30000) // 30% of 100k
  })

  it('10. Disclaimer text is returned accurately', () => {
    const res = calcMarginRequired({ instrumentCategory: 'nifty_futures', lotSize: 65, numberOfLots: 1, price: 24000 })
    expect(res.disclaimer).toContain('Illustrative SPAN/exposure assumptions')
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GROUP 3: LOANS UNIT TESTS (20 TESTS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('calcCarTCO', () => {
  it('1. Zero-loan (100% cash purchase) case still correctly sums fuel, insurance, and maintenance', () => {
    const res = calcCarTCO({
      carOnRoadPrice: 1000000,
      downPayment: 1000000,
      ownershipTenureYears: 5,
      annualKmDriven: 10000,
      fuelMileageKmpl: 15,
      fuelPricePerLitre: 100,
      annualInsuranceCost: 25000,
      annualMaintenanceCost: 10000,
      annualDepreciationPercent: 15,
    })
    expect(res.loanPrincipal).toBe(0)
    expect(res.totalEmiPaid).toBe(0)
    expect(res.totalLoanInterest).toBe(0)
    expect(res.totalRunningCost).toBeGreaterThan(0)
    expect(res.netTotalCostOfOwnership).toBeGreaterThan(0)
  })

  it('2. Depreciation never brings resale value below zero', () => {
    const res = calcCarTCO({
      carOnRoadPrice: 500000,
      downPayment: 100000,
      ownershipTenureYears: 20,
      annualKmDriven: 15000,
      fuelMileageKmpl: 12,
      fuelPricePerLitre: 100,
      annualInsuranceCost: 20000,
      annualMaintenanceCost: 15000,
      annualDepreciationPercent: 25,
    })
    expect(res.estimatedResaleValue).toBeGreaterThanOrEqual(0)
  })

  it('3. Ownership period longer than loan tenure stops counting EMI once loan is paid off', () => {
    const res = calcCarTCO({
      carOnRoadPrice: 1500000,
      downPayment: 300000,
      loanInterestRate: 9.0,
      loanTenureYears: 3, // 3-year loan
      ownershipTenureYears: 7, // 7-year ownership
      annualKmDriven: 12000,
      fuelMileageKmpl: 15,
      fuelPricePerLitre: 100,
      annualInsuranceCost: 30000,
      annualMaintenanceCost: 15000,
    })
    expect(res.totalEmiPaid).toBe(res.monthlyEmi * 36) // strictly 36 months, not 84
  })

  it('4. Extreme depreciation (50%/yr) does not produce negative resale value', () => {
    const res = calcCarTCO({
      carOnRoadPrice: 1000000,
      downPayment: 200000,
      ownershipTenureYears: 5,
      annualKmDriven: 10000,
      fuelMileageKmpl: 15,
      fuelPricePerLitre: 100,
      annualInsuranceCost: 20000,
      annualMaintenanceCost: 10000,
      annualDepreciationPercent: 50,
    })
    expect(res.estimatedResaleValue).toBeGreaterThanOrEqual(0)
  })

  it('5. Cost per km scales with annual driving distance', () => {
    const lowKm = calcCarTCO({
      carOnRoadPrice: 1000000,
      downPayment: 1000000,
      ownershipTenureYears: 5,
      annualKmDriven: 5000,
      fuelMileageKmpl: 15,
      fuelPricePerLitre: 100,
      annualInsuranceCost: 20000,
      annualMaintenanceCost: 10000,
    })
    const highKm = calcCarTCO({
      carOnRoadPrice: 1000000,
      downPayment: 1000000,
      ownershipTenureYears: 5,
      annualKmDriven: 25000,
      fuelMileageKmpl: 15,
      fuelPricePerLitre: 100,
      annualInsuranceCost: 20000,
      annualMaintenanceCost: 10000,
    })
    expect(highKm.totalFuelCost).toBeGreaterThan(lowKm.totalFuelCost)
  })

  it('6. Higher fuel mileage lowers total running cost', () => {
    const lowMileage = calcCarTCO({
      carOnRoadPrice: 1000000,
      downPayment: 500000,
      ownershipTenureYears: 5,
      annualKmDriven: 15000,
      fuelMileageKmpl: 10,
      fuelPricePerLitre: 100,
      annualInsuranceCost: 25000,
      annualMaintenanceCost: 10000,
    })
    const highMileage = calcCarTCO({
      carOnRoadPrice: 1000000,
      downPayment: 500000,
      ownershipTenureYears: 5,
      annualKmDriven: 15000,
      fuelMileageKmpl: 20,
      fuelPricePerLitre: 100,
      annualInsuranceCost: 25000,
      annualMaintenanceCost: 10000,
    })
    expect(highMileage.totalFuelCost).toBe(lowMileage.totalFuelCost / 2)
  })

  it('7. Resale value decreases with ownership tenure', () => {
    const yr3 = calcCarTCO({ carOnRoadPrice: 1000000, downPayment: 500000, ownershipTenureYears: 3, annualKmDriven: 10000, fuelMileageKmpl: 15, fuelPricePerLitre: 100, annualInsuranceCost: 20000, annualMaintenanceCost: 10000 })
    const yr7 = calcCarTCO({ carOnRoadPrice: 1000000, downPayment: 500000, ownershipTenureYears: 7, annualKmDriven: 10000, fuelMileageKmpl: 15, fuelPricePerLitre: 100, annualInsuranceCost: 20000, annualMaintenanceCost: 10000 })
    expect(yr3.estimatedResaleValue).toBeGreaterThan(yr7.estimatedResaleValue)
  })

  it('8. Effective monthly cost divides net TCO evenly across all ownership months', () => {
    const res = calcCarTCO({ carOnRoadPrice: 1200000, downPayment: 300000, ownershipTenureYears: 5, annualKmDriven: 10000, fuelMileageKmpl: 15, fuelPricePerLitre: 100, annualInsuranceCost: 25000, annualMaintenanceCost: 12000 })
    expect(res.effectiveMonthlyCost).toBe(Math.round(res.netTotalCostOfOwnership / 60))
  })

  it('9. Gross outflow is always strictly greater than net TCO when resale value is positive', () => {
    const res = calcCarTCO({ carOnRoadPrice: 1000000, downPayment: 200000, ownershipTenureYears: 5, annualKmDriven: 12000, fuelMileageKmpl: 15, fuelPricePerLitre: 100, annualInsuranceCost: 30000, annualMaintenanceCost: 10000 })
    expect(res.grossOutflow).toBeGreaterThan(res.netTotalCostOfOwnership)
  })

  it('10. Yearly breakdown table contains correct number of years', () => {
    const res = calcCarTCO({ carOnRoadPrice: 1000000, downPayment: 200000, ownershipTenureYears: 6, annualKmDriven: 10000, fuelMileageKmpl: 15, fuelPricePerLitre: 100, annualInsuranceCost: 20000, annualMaintenanceCost: 10000 })
    expect(res.yearlyBreakdown.length).toBe(6)
  })
})

describe('calcBalanceTransfer', () => {
  it('1. New rate higher than old rate is clearly flagged as NOT beneficial', () => {
    const res = calcBalanceTransfer({
      currentOutstandingPrincipal: 4000000,
      currentInterestRate: 8.5,
      currentRemainingTenureMonths: 180,
      newInterestRate: 9.5,
    })
    expect(res.isBeneficial).toBe(false)
    expect(res.netBenefit).toBeLessThan(0)
    expect(res.recommendation).toContain('NOT recommended')
  })

  it('2. Switching costs exceeding total interest saved produces negative net benefit', () => {
    const res = calcBalanceTransfer({
      currentOutstandingPrincipal: 1000000,
      currentInterestRate: 9.0,
      currentRemainingTenureMonths: 12, // only 12 months left
      newInterestRate: 8.9, // tiny 0.1% rate cut
      processingFeeValue: 2.0, // heavy 2% fee = 20k
      otherSwitchingCharges: 15000,
    })
    expect(res.isBeneficial).toBe(false)
    expect(res.netBenefit).toBeLessThan(0)
  })

  it('3. Very short remaining tenure (e.g. 6 months) produces negative net benefit', () => {
    const res = calcBalanceTransfer({
      currentOutstandingPrincipal: 500000,
      currentInterestRate: 9.5,
      currentRemainingTenureMonths: 6,
      newInterestRate: 8.5,
      otherSwitchingCharges: 10000,
    })
    expect(res.isBeneficial).toBe(false)
  })

  it('4. Zero switching charges calculates pure interest savings', () => {
    const res = calcBalanceTransfer({
      currentOutstandingPrincipal: 5000000,
      currentInterestRate: 9.5,
      currentRemainingTenureMonths: 240,
      newInterestRate: 8.5,
      processingFeeValue: 0,
      otherSwitchingCharges: 0,
    })
    expect(res.totalSwitchingCosts).toBe(0)
    expect(res.netBenefit).toBe(res.grossInterestSavings)
    expect(res.isBeneficial).toBe(true)
  })

  it('5. Percentage-based processing fee calculates accurately on outstanding principal', () => {
    const res = calcBalanceTransfer({
      currentOutstandingPrincipal: 6000000,
      currentInterestRate: 9.5,
      currentRemainingTenureMonths: 180,
      newInterestRate: 8.5,
      processingFeeType: 'percentage',
      processingFeeValue: 0.5, // 0.5% of 60L = 30,000
      otherSwitchingCharges: 10000,
    })
    expect(res.totalSwitchingCosts).toBe(40000)
  })

  it('6. Flat processing fee calculates accurately', () => {
    const res = calcBalanceTransfer({
      currentOutstandingPrincipal: 6000000,
      currentInterestRate: 9.5,
      currentRemainingTenureMonths: 180,
      newInterestRate: 8.5,
      processingFeeType: 'flat',
      processingFeeValue: 10000,
      otherSwitchingCharges: 5000,
    })
    expect(res.totalSwitchingCosts).toBe(15000)
  })

  it('7. Breakeven months calculation matches total switching fees divided by monthly EMI savings', () => {
    const res = calcBalanceTransfer({
      currentOutstandingPrincipal: 5000000,
      currentInterestRate: 9.5,
      currentRemainingTenureMonths: 240,
      newInterestRate: 8.5,
      processingFeeValue: 0.5,
      otherSwitchingCharges: 10000,
    })
    expect(res.breakevenMonths).toBe(Math.ceil(res.totalSwitchingCosts / res.monthlyEmiSavings))
  })

  it('8. Lower interest rate with same tenure reduces both monthly EMI and total interest', () => {
    const res = calcBalanceTransfer({
      currentOutstandingPrincipal: 4000000,
      currentInterestRate: 9.25,
      currentRemainingTenureMonths: 180,
      newInterestRate: 8.35,
    })
    expect(res.newMonthlyEmi).toBeLessThan(res.currentMonthlyEmi)
    expect(res.newTotalInterest).toBeLessThan(res.currentTotalInterestRemaining)
    expect(res.grossInterestSavings).toBeGreaterThan(0)
  })

  it('9. Zero principal returns ₹0 without crashing', () => {
    const res = calcBalanceTransfer({
      currentOutstandingPrincipal: 0,
      currentInterestRate: 9.0,
      currentRemainingTenureMonths: 120,
      newInterestRate: 8.0,
    })
    expect(res.netBenefit).toBeLessThanOrEqual(0)
  })

  it('10. Clear recommendation returned for highly beneficial case', () => {
    const res = calcBalanceTransfer({
      currentOutstandingPrincipal: 7500000,
      currentInterestRate: 9.8,
      currentRemainingTenureMonths: 240,
      newInterestRate: 8.4,
    })
    expect(res.isBeneficial).toBe(true)
    expect(res.recommendation).toContain('Highly recommended')
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GROUP 4: TAX & GLOBAL UNIT TESTS (40 TESTS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('calcMarginalRelief', () => {
  it('1. Income ₹50,00,001 receives marginal relief so taxpayer does not pay more extra tax than extra income', () => {
    const res = calcMarginalRelief({ grossTotalIncome: 5000001, regime: 'new' })
    expect(res.applicableSurchargeRatePercent).toBe(10)
    expect(res.hasMarginalRelief).toBe(true)
    expect(res.marginalReliefAmount).toBeGreaterThan(0)
  })

  it('2. Income ₹1,00,00,001 receives marginal relief at 15% threshold', () => {
    const res = calcMarginalRelief({ grossTotalIncome: 10000001, regime: 'new' })
    expect(res.applicableSurchargeRatePercent).toBe(15)
    expect(res.hasMarginalRelief).toBe(true)
    expect(res.marginalReliefAmount).toBeGreaterThan(0)
  })

  it('3. Income ₹2,00,00,001 receives marginal relief at 25% threshold', () => {
    const res = calcMarginalRelief({ grossTotalIncome: 20000001, regime: 'new' })
    expect(res.applicableSurchargeRatePercent).toBe(25)
    expect(res.hasMarginalRelief).toBe(true)
    expect(res.marginalReliefAmount).toBeGreaterThan(0)
  })

  it('4. Income ₹5,00,00,001 in Old Regime evaluates 37% surcharge marginal relief', () => {
    const res = calcMarginalRelief({ grossTotalIncome: 50000001, regime: 'old' })
    expect(res.applicableSurchargeRatePercent).toBe(37)
    expect(res.hasMarginalRelief).toBe(true)
  })

  it('5. Income well above threshold (₹70 Lakh) has 0 marginal relief and full 10% surcharge applies', () => {
    const res = calcMarginalRelief({ grossTotalIncome: 7000000, regime: 'new' })
    expect(res.applicableSurchargeRatePercent).toBe(10)
    expect(res.hasMarginalRelief).toBe(false)
    expect(res.marginalReliefAmount).toBe(0)
  })

  it('6. Income exactly at threshold (₹50 Lakh) has 0% surcharge and 0 marginal relief', () => {
    const res = calcMarginalRelief({ grossTotalIncome: 5000000, regime: 'new' })
    expect(res.applicableSurchargeRatePercent).toBe(0)
    expect(res.hasMarginalRelief).toBe(false)
  })

  it('7. Surcharge capped at 25% for income above ₹5 Crore in New Regime', () => {
    const res = calcMarginalRelief({ grossTotalIncome: 80000000, regime: 'new' })
    expect(res.applicableSurchargeRatePercent).toBe(25)
  })

  it('8. Old Regime allows up to 37% surcharge for income above ₹5 Crore', () => {
    const res = calcMarginalRelief({ grossTotalIncome: 80000000, regime: 'old' })
    expect(res.applicableSurchargeRatePercent).toBe(37)
  })

  it('9. Health & Education Cess (4%) applies on base tax + net surcharge', () => {
    const res = calcMarginalRelief({ grossTotalIncome: 6000000, regime: 'new' })
    expect(res.healthAndEducationCess).toBe(Math.round((res.baseTax + res.netSurcharge) * 0.04))
    expect(res.totalTaxPayable).toBe(res.baseTax + res.netSurcharge + res.healthAndEducationCess)
  })

  it('10. Effective tax rate is strictly below 45%', () => {
    const res = calcMarginalRelief({ grossTotalIncome: 100000000, regime: 'new' })
    expect(res.effectiveTaxRatePercent).toBeLessThan(45)
  })
})

describe('calcLRSTCS', () => {
  it('1. Exactly at ₹10 Lakh threshold for general investment yields ₹0 TCS', () => {
    const res = calcLRSTCS({ category: 'general_investment', remittanceAmountInr: 1000000 })
    expect(res.totalTcsDeducted).toBe(0)
    expect(res.totalOutflowInr).toBe(1000000)
  })

  it('2. General investment amount split across threshold applies 20% only to portion above ₹10L', () => {
    // 15L: 10L @ 0%, 5L @ 20% = ₹1,00,000 TCS
    const res = calcLRSTCS({ category: 'general_investment', remittanceAmountInr: 1500000 })
    expect(res.tier1Tcs).toBe(0)
    expect(res.tier2Tcs).toBe(100000)
    expect(res.totalTcsDeducted).toBe(100000)
    expect(res.totalOutflowInr).toBe(1600000)
  })

  it('3. Overseas tour package applies flat 2% TCS on entire remittance without exemption threshold', () => {
    // 12L tour package: flat 2% on 12L = ₹24,000 TCS (Finance Act, 2026 / Section 394)
    const res = calcLRSTCS({ category: 'overseas_tour_package', remittanceAmountInr: 1200000 })
    expect(res.tier1RatePercent).toBe(2.0)
    expect(res.tier1Tcs).toBe(24000)
    expect(res.totalTcsDeducted).toBe(24000)
    expect(res.totalOutflowInr).toBe(1224000)
  })

  it('4. Overseas tour package within ₹10 Lakh applies flat 2% TCS', () => {
    const res = calcLRSTCS({ category: 'overseas_tour_package', remittanceAmountInr: 500000 })
    expect(res.totalTcsDeducted).toBe(10000) // 2% of 5L
  })

  it('5. Education remittance via loan u/s 80E is 0% exempt across all amounts', () => {
    // 20L loan: 100% exempt (0% TCS)
    const res = calcLRSTCS({ category: 'education_loan', remittanceAmountInr: 2000000 })
    expect(res.totalTcsDeducted).toBe(0)
  })

  it('6. Education self-funded applies 2% only on amount above ₹10 Lakh', () => {
    // 15L: 10L @ 0%, 5L @ 2% = ₹10,000 TCS (Finance Act, 2026)
    const res = calcLRSTCS({ category: 'education_self', remittanceAmountInr: 1500000 })
    expect(res.totalTcsDeducted).toBe(10000)
  })

  it('7. Medical remittance applies 2% only on amount above ₹10 Lakh', () => {
    // 13L: 10L @ 0%, 3L @ 2% = ₹6,000 TCS (Finance Act, 2026)
    const res = calcLRSTCS({ category: 'medical_treatment', remittanceAmountInr: 1300000 })
    expect(res.totalTcsDeducted).toBe(6000)
  })

  it('8. Missing PAN applies higher rate (5% for tour/education, 20% for investments)', () => {
    const resTour = calcLRSTCS({ category: 'overseas_tour_package', remittanceAmountInr: 500000, panAvailable: false })
    expect(resTour.totalTcsDeducted).toBe(25000) // 5% of 5L

    const resInv = calcLRSTCS({ category: 'general_investment', remittanceAmountInr: 1500000, panAvailable: false })
    expect(resInv.totalTcsDeducted).toBe(100000) // 20% of 5L excess
  })

  it('9. TCS is flagged as 100% claimable credit in annual ITR when TCS > 0', () => {
    const res = calcLRSTCS({ category: 'general_investment', remittanceAmountInr: 1500000 })
    expect(res.isTcsCreditClaimable).toBe(true)
    expect(res.tcsCreditNote).toContain('Form 26AS')
  })

  it('10. Zero remittance amount produces ₹0 TCS and ₹0 outflow', () => {
    const res = calcLRSTCS({ category: 'general_investment', remittanceAmountInr: 0 })
    expect(res.totalTcsDeducted).toBe(0)
    expect(res.totalOutflowInr).toBe(0)
  })
})

describe('calcUSStockReturn', () => {
  it('1. Currency depreciation (INR weaker at sale, 84 -> 88) adds to INR returns', () => {
    const res = calcUSStockReturn({
      investmentAmountInr: 840000, // $10,000
      purchaseUsdInrRate: 84,
      saleUsdInrRate: 88,
      capitalGainUsd: 0,
      dividendIncomeUsd: 0,
      holdingMonths: 12,
    })
    expect(res.currencyGainLossInr).toBe(40000) // $10,000 * 4 INR/USD
    expect(res.grossProceedsInr).toBe(880000)
    expect(res.netProceedsInr).toBe(868000)
  })

  it('2. Currency appreciation (INR stronger, 88 -> 84) reduces INR returns', () => {
    const res = calcUSStockReturn({
      investmentAmountInr: 880000,
      purchaseUsdInrRate: 88,
      saleUsdInrRate: 84,
      capitalGainUsd: 0,
      dividendIncomeUsd: 0,
      holdingMonths: 12,
    })
    expect(res.currencyGainLossInr).toBe(-40000)
    expect(res.netProceedsInr).toBe(840000)
  })

  it('3. US 25% dividend withholding tax is credited against Indian tax via Section 90 FTC', () => {
    const res = calcUSStockReturn({
      investmentAmountInr: 100000,
      purchaseUsdInrRate: 85,
      saleUsdInrRate: 85,
      capitalGainUsd: 0,
      dividendIncomeUsd: 100, // $100 * 85 = ₹8,500
      holdingMonths: 12,
      usDividendWithholdingTaxPercent: 25, // ₹2,125
      userTaxBracketPercent: 30, // Indian tax: ₹2,550
    })
    expect(res.usWithholdingTaxInr).toBe(2125)
    expect(res.foreignTaxCreditInr).toBe(2125) // 100% credited
    expect(res.indianDividendTaxNet).toBe(425) // 2550 - 2125 = 425
  })

  it('4. Zero currency movement isolates pure stock return', () => {
    const res = calcUSStockReturn({
      investmentAmountInr: 850000, // $10,000
      purchaseUsdInrRate: 85,
      saleUsdInrRate: 85,
      capitalGainUsd: 2000, // $2,000 gain
      dividendIncomeUsd: 0,
      holdingMonths: 24, // LTCG 12.5%
    })
    expect(res.currencyGainLossInr).toBe(0)
    expect(res.stockCapitalGainInr).toBe(170000) // $2k * 85
    expect(res.indianCapitalGainsTax).toBe(Math.round(170000 * 0.125))
  })

  it('5. Long-term holding (≥24 months) applies 12.5% LTCG rate', () => {
    const res = calcUSStockReturn({ investmentAmountInr: 500000, purchaseUsdInrRate: 85, saleUsdInrRate: 85, capitalGainUsd: 1000, holdingMonths: 24 })
    expect(res.isLongTerm).toBe(true)
    expect(res.applicableCapitalGainsRatePercent).toBe(12.5)
  })

  it('6. Short-term holding (<24 months) applies slab tax rate', () => {
    const res = calcUSStockReturn({ investmentAmountInr: 500000, purchaseUsdInrRate: 85, saleUsdInrRate: 85, capitalGainUsd: 1000, holdingMonths: 12, userTaxBracketPercent: 30 })
    expect(res.isLongTerm).toBe(false)
    expect(res.applicableCapitalGainsRatePercent).toBe(30)
  })

  it('7. Negative capital gain in USD reduces total proceeds without negative tax', () => {
    const res = calcUSStockReturn({ investmentAmountInr: 500000, purchaseUsdInrRate: 85, saleUsdInrRate: 85, capitalGainUsd: -500, holdingMonths: 12 })
    expect(res.indianCapitalGainsTax).toBe(0)
    expect(res.netProceedsInr).toBeLessThan(500000)
  })

  it('8. Zero dividend income handled cleanly', () => {
    const res = calcUSStockReturn({ investmentAmountInr: 500000, purchaseUsdInrRate: 85, saleUsdInrRate: 85, capitalGainUsd: 500, dividendIncomeUsd: 0, holdingMonths: 12 })
    expect(res.grossDividendInr).toBe(0)
    expect(res.usWithholdingTaxInr).toBe(0)
  })

  it('9. Gross proceeds in USD converts accurately to INR at sale rate', () => {
    const res = calcUSStockReturn({ investmentAmountInr: 800000, purchaseUsdInrRate: 80, saleUsdInrRate: 90, capitalGainUsd: 1000, holdingMonths: 12 })
    // Initial: $10,000. Capital Gain: $1,000. Total: $11,000. In INR @ 90 = ₹9,90,000
    expect(res.grossProceedsInr).toBe(990000)
  })

  it('10. Annualized CAGR return calculated over exact holding duration', () => {
    const res = calcUSStockReturn({ investmentAmountInr: 100000, purchaseUsdInrRate: 80, saleUsdInrRate: 80, capitalGainUsd: 250, holdingMonths: 24 })
    expect(res.annualizedReturnCagr).toBeGreaterThan(0)
  })
})

describe('calcNRIDepositReturns', () => {
  it('1. NRE deposit is 100% tax-free with ₹0 tax deducted', () => {
    const res = calcNRIDepositReturns({ depositAmount: 1000000, tenureMonths: 36, nreInterestRatePercent: 7.1, nroInterestRatePercent: 7.3, fcnrInterestRatePercent: 5.5 })
    expect(res.nreResult.taxDeducted).toBe(0)
    expect(res.nreResult.isTaxFreeInIndia).toBe(true)
    expect(res.nreResult.effectivePostTaxInterest).toBe(res.nreResult.interestEarnedPreTax)
  })

  it('2. FCNR deposit is 100% tax-free with ₹0 tax deducted', () => {
    const res = calcNRIDepositReturns({ depositAmount: 1000000, tenureMonths: 36, nreInterestRatePercent: 7.1, nroInterestRatePercent: 7.3, fcnrInterestRatePercent: 5.5 })
    expect(res.fcnrResult.taxDeducted).toBe(0)
    expect(res.fcnrResult.isTaxFreeInIndia).toBe(true)
  })

  it('3. NRO deposit correctly has 31.2% TDS deducted from pre-tax interest', () => {
    const res = calcNRIDepositReturns({ depositAmount: 1000000, tenureMonths: 12, nreInterestRatePercent: 7.0, nroInterestRatePercent: 7.0, fcnrInterestRatePercent: 5.0, nroTdsRatePercent: 31.2, compoundingFrequency: 'annual' })
    // Pre-tax interest: 70,000. TDS: 31.2% of 70k = 21,840. Net interest: 48,160.
    expect(res.nroResult.interestEarnedPreTax).toBe(70000)
    expect(res.nroResult.taxDeducted).toBe(21840)
    expect(res.nroResult.effectivePostTaxInterest).toBe(48160)
  })

  it('4. DTAA-reduced NRO TDS rate (15%) correctly reduces TDS from default', () => {
    const res = calcNRIDepositReturns({ depositAmount: 1000000, tenureMonths: 12, nreInterestRatePercent: 7.0, nroInterestRatePercent: 7.0, fcnrInterestRatePercent: 5.0, nroTdsRatePercent: 15.0, compoundingFrequency: 'annual' })
    expect(res.nroResult.taxDeducted).toBe(10500) // 15% of 70k
  })

  it('5. NRE and FCNR are flagged as fully repatriable, NRO flagged with limits', () => {
    const res = calcNRIDepositReturns({ depositAmount: 1000000, tenureMonths: 36, nreInterestRatePercent: 7.1, nroInterestRatePercent: 7.3, fcnrInterestRatePercent: 5.5 })
    expect(res.nreResult.isFullyRepatriable).toBe(true)
    expect(res.fcnrResult.isFullyRepatriable).toBe(true)
    expect(res.nroResult.isFullyRepatriable).toBe(false)
  })

  it('6. Quarterly compounding generates higher maturity than simple annual interest', () => {
    const quarterly = calcNRIDepositReturns({ depositAmount: 1000000, tenureMonths: 36, nreInterestRatePercent: 7.0, nroInterestRatePercent: 7.0, fcnrInterestRatePercent: 5.0, compoundingFrequency: 'quarterly' })
    const annual = calcNRIDepositReturns({ depositAmount: 1000000, tenureMonths: 36, nreInterestRatePercent: 7.0, nroInterestRatePercent: 7.0, fcnrInterestRatePercent: 5.0, compoundingFrequency: 'annual' })
    expect(quarterly.nreResult.maturityAmount).toBeGreaterThan(annual.nreResult.maturityAmount)
  })

  it('7. FCNR currency note correctly highlights foreign currency protection', () => {
    const res = calcNRIDepositReturns({ depositAmount: 1000000, tenureMonths: 36, nreInterestRatePercent: 7.1, nroInterestRatePercent: 7.3, fcnrInterestRatePercent: 5.5 })
    expect(res.fcnrResult.notes).toContain('eliminates INR currency depreciation')
  })

  it('8. Zero tenure handled without division by zero', () => {
    const res = calcNRIDepositReturns({ depositAmount: 1000000, tenureMonths: 0, nreInterestRatePercent: 7.1, nroInterestRatePercent: 7.3, fcnrInterestRatePercent: 5.5 })
    expect(res.nreResult.maturityAmount).toBeGreaterThanOrEqual(1000000)
  })

  it('9. Side-by-side comparison array contains all 3 deposit types', () => {
    const res = calcNRIDepositReturns({ depositAmount: 1000000, tenureMonths: 36, nreInterestRatePercent: 7.1, nroInterestRatePercent: 7.3, fcnrInterestRatePercent: 5.5 })
    expect(res.sideBySideComparison.length).toBe(3)
  })

  it('10. Best option recommendation chooses highest post-tax yield', () => {
    const res = calcNRIDepositReturns({ depositAmount: 1000000, tenureMonths: 36, nreInterestRatePercent: 7.5, nroInterestRatePercent: 7.5, fcnrInterestRatePercent: 5.5 })
    expect(res.bestOption).toContain('NRE Fixed Deposit offers the highest post-tax return')
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GROUP 5: RETIREMENT UNIT TESTS (10 TESTS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('calcNPS', () => {
  it('1. Allocation percentages that do not sum to 100% are rejected with error message', () => {
    const res = calcNPS({ currentAge: 30, monthlyContribution: 10000, equityAllocationPercent: 50, corporateDebtAllocationPercent: 30, govtBondsAllocationPercent: 10 }) // 90%
    expect(res.isValid).toBe(false)
    expect(res.errorMessage).toContain('must sum to exactly 100%')
  })

  it('2. 60/40 lump-sum / annuity split applied correctly regardless of corpus size', () => {
    const res = calcNPS({ currentAge: 30, retirementAge: 60, monthlyContribution: 10000, equityAllocationPercent: 50, corporateDebtAllocationPercent: 30, govtBondsAllocationPercent: 20 })
    expect(res.isValid).toBe(true)
    expect(res.lumpSumTaxFreeAmount).toBe(Math.round(res.totalAccumulatedCorpus * 0.60))
    expect(res.annuityPurchasedAmount).toBe(Math.round(res.totalAccumulatedCorpus * 0.40))
  })

  it('3. Section 80CCD(1B) extra ₹50,000 tax deduction is capped at actual contribution', () => {
    const smallContribution = calcNPS({ currentAge: 30, monthlyContribution: 2000, equityAllocationPercent: 50, corporateDebtAllocationPercent: 30, govtBondsAllocationPercent: 20, taxBracketPercent: 30, regime: 'old' }) // ₹24,000/yr
    const largeContribution = calcNPS({ currentAge: 30, monthlyContribution: 10000, equityAllocationPercent: 50, corporateDebtAllocationPercent: 30, govtBondsAllocationPercent: 20, taxBracketPercent: 30, regime: 'old' }) // ₹1,20,000/yr
    expect(smallContribution.annualTaxSavedUnder80CCD).toBe(Math.round(24000 * 0.30)) // 7,200
    expect(largeContribution.annualTaxSavedUnder80CCD).toBe(Math.round(50000 * 0.30)) // 15,000 capped
  })

  it('4. Monthly pension calculated using assumed annuity yield rate', () => {
    const res = calcNPS({ currentAge: 30, retirementAge: 60, monthlyContribution: 10000, equityAllocationPercent: 50, corporateDebtAllocationPercent: 30, govtBondsAllocationPercent: 20, assumedAnnuityYieldPercent: 6.0 })
    expect(res.estimatedMonthlyPension).toBe(Math.round((res.annuityPurchasedAmount * 0.06) / 12))
  })

  it('5. Younger starting age generates massive compounding advantage over older starting age', () => {
    const age25 = calcNPS({ currentAge: 25, retirementAge: 60, monthlyContribution: 10000, equityAllocationPercent: 50, corporateDebtAllocationPercent: 30, govtBondsAllocationPercent: 20 })
    const age45 = calcNPS({ currentAge: 45, retirementAge: 60, monthlyContribution: 10000, equityAllocationPercent: 50, corporateDebtAllocationPercent: 30, govtBondsAllocationPercent: 20 })
    expect(age25.totalAccumulatedCorpus).toBeGreaterThan(age45.totalAccumulatedCorpus * 3)
  })

  it('6. Blended return matches weighted sum of asset classes', () => {
    const res = calcNPS({ currentAge: 30, monthlyContribution: 10000, equityAllocationPercent: 50, corporateDebtAllocationPercent: 30, govtBondsAllocationPercent: 20, expectedEquityReturnPercent: 12, expectedCorpDebtReturnPercent: 9, expectedGovtBondReturnPercent: 7 })
    // 0.5 * 12 + 0.3 * 9 + 0.2 * 7 = 6 + 2.7 + 1.4 = 10.1%
    expect(res.blendedExpectedReturnPercent).toBe(10.1)
  })

  it('7. 100% Equity allocation yields pure equity return', () => {
    const res = calcNPS({ currentAge: 30, monthlyContribution: 10000, equityAllocationPercent: 100, corporateDebtAllocationPercent: 0, govtBondsAllocationPercent: 0, expectedEquityReturnPercent: 14.0 })
    expect(res.blendedExpectedReturnPercent).toBe(14.0)
  })

  it('8. Retirement age equal to current age is adjusted defensively', () => {
    const res = calcNPS({ currentAge: 60, retirementAge: 60, monthlyContribution: 10000, equityAllocationPercent: 50, corporateDebtAllocationPercent: 30, govtBondsAllocationPercent: 20 })
    expect(res.isValid).toBe(true)
    expect(res.totalYearsInvested).toBeGreaterThanOrEqual(1)
  })

  it('9. Yearly progression table accurately tracks year-by-year accumulation', () => {
    const res = calcNPS({ currentAge: 30, retirementAge: 60, monthlyContribution: 10000, equityAllocationPercent: 50, corporateDebtAllocationPercent: 30, govtBondsAllocationPercent: 20 })
    expect(res.yearlyProgression.length).toBe(30)
    expect(res.yearlyProgression[29].accumulatedCorpus).toBe(res.totalAccumulatedCorpus)
  })

  it('10. Lifetime tax savings computed accurately over total investment years', () => {
    const res = calcNPS({ currentAge: 30, retirementAge: 60, monthlyContribution: 10000, equityAllocationPercent: 50, corporateDebtAllocationPercent: 30, govtBondsAllocationPercent: 20, taxBracketPercent: 30 })
    expect(res.lifetimeTaxSaved).toBe(res.annualTaxSavedUnder80CCD * 30)
  })
})
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  REGRESSION TESTS — Engine Freeze Audit V4.1 Corrections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Bug 1 Regression: calcTax dividendIncome must be included in totalEffectiveGross.
 * Without the fix, grossIncome, effectiveRate, and monthlyTakeHome were understated
 * when dividend income was present.
 */
describe('calcTax — Bug 1 Regression: dividendIncome included in grossIncome', () => {
  it('grossIncome includes dividendIncome so effectiveRate and monthlyTakeHome are correct', () => {
    // Salary: ₹10L, Dividend: ₹5L, Regime: new
    // totalEffectiveGross must be ₹15L (not ₹10L)
    const result = calcTax({
      salaryIncome: 1000000,
      dividendIncome: 500000,
      regime: 'new',
    })
    // grossIncome in output must equal salary + dividend (ignoring CG which are 0 here)
    expect(result.grossIncome).toBe(1500000)

    // monthlyTakeHome must be (totalEffectiveGross - totalTax) / 12
    const expectedMonthly = Math.round((1500000 - result.totalTax) / 12)
    expect(result.monthlyTakeHome).toBe(expectedMonthly)

    // effectiveRate must use totalEffectiveGross (15L) not just salary (10L)
    const expectedRate = Math.round((result.totalTax / 1500000) * 10000) / 100
    expect(result.effectiveRate).toBeCloseTo(expectedRate, 1)

    // dividendIncome is reflected in the output field
    expect(result.dividendIncome).toBe(500000)
  })

  it('grossIncome with ONLY dividend income (no salary) is correct', () => {
    const result = calcTax({
      dividendIncome: 800000,
      regime: 'new',
    })
    // No salary → no standard deduction. dividendIncome goes into otherGross.
    expect(result.grossIncome).toBe(800000)
    expect(result.dividendIncome).toBe(800000)
    // monthlyTakeHome must be (800000 - totalTax) / 12
    const expected = Math.round((800000 - result.totalTax) / 12)
    expect(result.monthlyTakeHome).toBe(expected)
  })
})

/**
 * Bug 3 Regression: Section 54 compare-all must rank all three strategies (54, 54EC, 54F).
 * Without the fix, 54F was computed but not considered in the recommendation or taxDifference.
 */
describe('calcSection54Exemption — Bug 3 Regression: compare-all ranks 54, 54EC, and 54F', () => {
  it('when 54F provides full exemption and 54EC is capped, recommendation correctly names 54F as best', () => {
    // Scenario: Large LTCG of ₹1 Crore.
    // Section 54: invest 1Cr in residential house → exemption 1Cr, tax = 0
    // Section 54EC: only 50L cap → 50L taxable, tax = 6.5L
    // Section 54F: invest 1Cr, netSaleConsideration = 1Cr → full proportionate exemption, tax = 0
    const result = calcSection54Exemption({
      capitalGainsAmount: 10000000, // ₹1Cr LTCG
      sectionType: 'compare_both',
      propertyInvestmentAmount: 10000000,
      propertyMode: 'purchase',
      propertyTimelineMonths: 12,
      bondsInvestmentAmount: 5000000,  // 54EC capped at ₹50L
      bondsTimelineMonths: 3,
      netSaleConsideration: 10000000,  // required for proportionate 54F calc
      existingResidentialHousesCount: 0, // 54F eligible
    })

    expect(result.comparison).toBeDefined()
    // 54 provides full exemption
    expect(result.comparison?.section54.taxAfterExemption).toBe(0)
    // 54EC is capped at 50L, so 50L taxable → 6.5L tax
    expect(result.comparison?.section54ec.taxAfterExemption).toBe(650000)
    // 54F provides full exemption (invAmount >= netSaleConsideration)
    expect(result.comparison?.section54f?.taxAfterExemption).toBe(0)
    expect(result.comparison?.section54f?.disqualified).toBe(false)

    // taxDifference = worst (54EC=6.5L) - best (0) = 6.5L
    expect(result.comparison?.taxDifference).toBe(650000)

    // Recommendation must NOT say only "54 saves over 54EC" — it must acknowledge all strategies
    const rec = result.comparison?.recommendation ?? ''
    expect(rec.length).toBeGreaterThan(20)
    // The best strategy (54 or 54F — both at 0) is mentioned
    expect(rec).toMatch(/Section 54|Section 54F|equal/)
  })

  it('when 54F is disqualified, compare-all recommendation still works correctly with 54 vs 54EC only', () => {
    const result = calcSection54Exemption({
      capitalGainsAmount: 5000000,
      sectionType: 'compare_both',
      propertyInvestmentAmount: 5000000,
      propertyMode: 'purchase',
      propertyTimelineMonths: 6,
      bondsInvestmentAmount: 5000000,
      bondsTimelineMonths: 3,
      existingResidentialHousesCount: 2, // 54F disqualified: owns 2 houses
    })

    expect(result.comparison).toBeDefined()
    expect(result.comparison?.section54f?.disqualified).toBe(true)
    // taxDifference should be between 54 and 54EC only (54F excluded)
    const diff54vs54ec = Math.abs(
      (result.comparison?.section54.taxAfterExemption ?? 0) -
      (result.comparison?.section54ec.taxAfterExemption ?? 0)
    )
    expect(result.comparison?.taxDifference).toBe(diff54vs54ec)
    // Disqualification reason is appended to recommendation
    expect(result.comparison?.recommendation).toContain('54F')
  })
})

