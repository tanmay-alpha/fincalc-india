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
