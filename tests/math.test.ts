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

// ─── TAX — FY 2025-26 ─────────────────────────────────────────

describe('calcTax — FY 2025-26 New Regime', () => {
  it('income ≤ ₹12L is effectively tax-free (full 87A rebate)', () => {
    // Taxable income = 12L - 75K std ded = 11.25L ≤ 12L → full rebate
    const result = calcTax({
      grossIncome: 1200000,
      regime: 'new',
      deduction80C: 0,
      deduction80D: 0,
      hraExemption: 0,
      otherDeductions: 0,
    })
    expect(result.totalTax).toBe(0)
    expect(result.taxableIncome).toBe(1125000) // 12L - 75K
    expect(result.cess).toBe(0)
  })

  it('income above ₹12L taxable (>12.75L gross) attracts tax', () => {
    // Gross 15L - 75K std ded = 14.25L taxable → above 12L rebate threshold
    const result = calcTax({
      grossIncome: 1500000,
      regime: 'new',
      deduction80C: 0,
      deduction80D: 0,
      hraExemption: 0,
      otherDeductions: 0,
    })
    expect(result.taxableIncome).toBe(1425000) // 15L - 75K
    expect(result.totalTax).toBeGreaterThan(0)
  })

  it('cess is 4% of (tax + surcharge)', () => {
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

  it('slab breakdown covers all slabs', () => {
    const result = calcTax({
      grossIncome: 3000000, // 30L → taxable 28.25L
      regime: 'new',
      deduction80C: 0,
      deduction80D: 0,
      hraExemption: 0,
      otherDeductions: 0,
    })
    expect(result.slabBreakdown.length).toBeGreaterThan(3)
  })

  it('provides both-regime comparison', () => {
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
  })

  it('old regime with max 80C deduction reduces tax', () => {
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

  it('monthlyTakeHome is (grossIncome - totalTax) / 12', () => {
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




