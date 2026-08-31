/**
 * FinCalc India — Insights Engine Unit Tests
 */

import { describe, it, expect } from "vitest";
import {
  getSIPInsights,
  getEMIInsights,
  getFDInsights,
  getPPFInsights,
  getLumpsumInsights,
  getTaxInsights,
  getStepUpSipInsights,
  getGoalSipInsights,
  getPrepaymentVsInvestInsights,
  getNoCostEmiInsights,
  getFireInsights,
  getCapitalGainsInsights,
  getFnOBreakevenInsights,
  getOptionPayoffInsights,
  getHraInsights,
  getPresumptiveTaxInsights,
  getPositionSizeInsights,
  getSection54Insights,
  getDCFInsights,
  getWACCInsights,
  getDuPontInsights,
  getXIRRInsights,
  getRiskRatiosInsights,
  getBlackScholesInsights,
  getMarginRequiredInsights,
  getCarTCOInsights,
  getBalanceTransferInsights,
  getMarginalReliefInsights,
  getLRSTCSInsights,
  getUSStockReturnInsights,
  getNRIDepositInsights,
  getNPSInsights,
} from "../lib/insights";
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
  calcHRAExemption,
  calcPresumptiveTax,
  calcPositionSize,
  calcSection54Exemption,
  calcDCF,
  calcWACC,
  calcDuPont,
  calcXIRR,
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
} from "../lib/math";

describe("Insights & Suggestions Engine", () => {
  it("generates valid non-empty SIP insights", () => {
    const res = calcSIP({ monthlyAmount: 10000, annualRate: 12, years: 10 });
    const insights = getSIPInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    insights.forEach((item) => {
      expect(item.title.length).toBeGreaterThan(0);
      expect(["info", "good", "warning"]).toContain(item.type);
    });
  });

  it("generates valid EMI insights with interest warning when >50%", () => {
    const res = calcEMI({ principal: 5000000, annualRate: 9, tenureMonths: 240 });
    const insights = getEMIInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(3);
    const warning = insights.find((i) => i.type === "warning");
    expect(warning).toBeDefined();
  });

  it("generates valid Step-Up SIP insights highlighting extra wealth", () => {
    const res = calcStepUpSIP({
      monthlyAmount: 10000,
      annualRate: 12,
      years: 15,
      stepUpType: "percentage",
      stepUpValue: 10,
    });
    const insights = getStepUpSipInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Step-Up creates");
  });

  it("generates valid Goal SIP insights", () => {
    const res = calcGoalSIP({
      targetCorpus: 10000000,
      annualRate: 12,
      years: 10,
      stepUpType: "percentage",
      stepUpValue: 10,
    });
    const insights = getGoalSipInsights(res, 10000000);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Starting SIP");
  });

  it("generates Prepayment vs Investment insights", () => {
    const res = calcPrepaymentVsInvest({
      principal: 4000000,
      annualRate: 8.5,
      tenureMonths: 240,
      prepaymentType: "monthly_topup",
      prepaymentAmount: 5000,
      investmentRate: 12,
    });
    const insights = getPrepaymentVsInvestInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Interest Saved");
  });

  it("generates No-Cost EMI insights with APR cost", () => {
    const res = calcNoCostEMITruth({
      productPrice: 50000,
      tenureMonths: 6,
      processingFee: 199,
      upfrontDiscountForfeited: 3000,
    });
    const insights = getNoCostEmiInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[1].title).toContain("APR");
  });

  it("generates FIRE retirement corpus insights", () => {
    const res = calcFIRE({
      currentAge: 30,
      retirementAge: 50,
      lifeExpectancy: 85,
      currentMonthlyExpenses: 50000,
      preRetirementReturn: 12,
      postRetirementReturn: 8,
      inflationRate: 6,
    });
    const insights = getFireInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Target FIRE Corpus");
  });

  it("generates Capital Gains Tax insights for Tax Year 2026-27", () => {
    const res = calcCapitalGains({
      assetClass: "equity",
      purchasePrice: 100000,
      salePrice: 300000,
      holdingMonths: 24,
    });
    const insights = getCapitalGainsInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].subtitle).toContain("Tax Year 2026-27");
  });

  it("generates F&O Breakeven insights", () => {
    const res = calcFnOBreakeven({
      instrument: "options",
      buyPrice: 100,
      sellPrice: 120,
      quantity: 500,
    });
    const insights = getFnOBreakevenInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Break-even Exit");
  });

  it("generates HRA Exemption insights", () => {
    const res = calcHRAExemption({
      basicSalary: 60000,
      hraReceived: 30000,
      rentPaid: 25000,
      cityType: "metro",
    });
    const insights = getHraInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Annual Exempt HRA");
  });

  it("generates Presumptive Tax insights", () => {
    const res = calcPresumptiveTax({
      professionType: "44ADA_professional",
      grossTurnover: 5000000,
    });
    const insights = getPresumptiveTaxInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Deemed Profit");
  });

  it("generates Position Size & Risk insights", () => {
    const res = calcPositionSize({
      capital: 500000,
      riskPercent: 1,
      entryPrice: 2500,
      stopLossPrice: 2450,
      riskRewardRatio: 2,
    });
    const insights = getPositionSizeInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Recommended Qty");
  });

  it("generates Section 54 Exemption insights", () => {
    const res = calcSection54Exemption({
      capitalGainsAmount: 5000000,
      sectionType: "section_54ec_bonds",
      bondsInvestmentAmount: 5000000,
    });
    const insights = getSection54Insights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Tax Saved");
  });

  it("generates DCF Valuation insights", () => {
    const res = calcDCF({
      fcfProjections: [10000000, 11500000, 13225000, 15208750, 17490000],
      forecastYears: 5,
      growthRateYears1to5: 15,
      terminalGrowthRate: 4.5,
      discountRate: 11.5,
    });
    const insights = getDCFInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Intrinsic Value");
  });

  it("generates WACC insights", () => {
    const res = calcWACC({
      equityValue: 70000000,
      debtValue: 30000000,
      costOfEquity: 14.0,
      costOfDebt: 9.0,
      taxRate: 25.0,
    });
    const insights = getWACCInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("WACC");
  });

  it("generates DuPont Analysis insights", () => {
    const res = calcDuPont({
      netIncome: 15000000,
      revenue: 100000000,
      totalAssets: 80000000,
      shareholdersEquity: 50000000,
    });
    const insights = getDuPontInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Reported ROE");
  });

  it("generates XIRR insights", () => {
    const res = calcXIRR([
      { date: "2023-01-01", amount: -100000 },
      { date: "2024-01-01", amount: -100000 },
      { date: "2025-01-01", amount: 250000 },
    ]);
    const insights = getXIRRInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("XIRR");
  });

  it("generates Portfolio Risk Ratios insights", () => {
    const res = calcRiskRatios({
      returns: [12, -4, 18, 8, -2, 22, 14, -6, 16, 10],
      riskFreeRate: 6.5,
    });
    const insights = getRiskRatiosInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Sharpe");
  });

  it("generates Black-Scholes Greeks insights", () => {
    const res = calcBlackScholes({
      spotPrice: 24000,
      strikePrice: 24000,
      timeToExpiryDays: 30,
      volatilityPercent: 15,
      riskFreeRatePercent: 6.5,
    });
    const insights = getBlackScholesInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Call");
  });

  it("generates Margin Required insights", () => {
    const res = calcMarginRequired({
      instrumentCategory: "nifty_futures",
      lotSize: 50,
      numberOfLots: 1,
      price: 24000,
    });
    const insights = getMarginRequiredInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Total Margin");
  });

  it("generates Car Loan TCO insights", () => {
    const res = calcCarTCO({
      carOnRoadPrice: 1500000,
      downPayment: 300000,
      ownershipTenureYears: 5,
    });
    const insights = getCarTCOInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Cost of Ownership");
  });

  it("generates Home Loan Balance Transfer insights", () => {
    const res = calcBalanceTransfer({
      currentOutstandingPrincipal: 5000000,
      currentInterestRate: 9.5,
      currentRemainingTenureMonths: 180,
      newInterestRate: 8.4,
    });
    const insights = getBalanceTransferInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Save");
  });

  it("generates Marginal Relief insights", () => {
    const res = calcMarginalRelief({
      grossTotalIncome: 5050000,
      regime: "new",
    });
    const insights = getMarginalReliefInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
  });

  it("generates LRS TCS insights", () => {
    const res = calcLRSTCS({
      category: "general_investment",
      remittanceAmountInr: 1000000,
    });
    const insights = getLRSTCSInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Total TCS");
  });

  it("generates US Stock Return insights", () => {
    const res = calcUSStockReturn({
      investmentAmountInr: 800000,
      purchaseUsdInrRate: 80,
      saleUsdInrRate: 88,
      capitalGainUsd: 2000,
      holdingMonths: 24,
    });
    const insights = getUSStockReturnInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Net Proceeds");
  });

  it("generates NRI Deposits insights", () => {
    const res = calcNRIDepositReturns({
      depositAmount: 1000000,
      tenureMonths: 36,
      nreInterestRatePercent: 7.1,
      nroInterestRatePercent: 7.3,
      fcnrInterestRatePercent: 5.5,
    });
    const insights = getNRIDepositInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Best Choice");
  });

  it("generates NPS Retirement insights", () => {
    const res = calcNPS({
      currentAge: 30,
      retirementAge: 60,
      monthlyContribution: 10000,
      equityAllocationPercent: 50,
      corporateDebtAllocationPercent: 30,
      govtBondsAllocationPercent: 20,
    });
    const insights = getNPSInsights(res);
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0].title).toContain("Retirement Corpus");
  });
});
