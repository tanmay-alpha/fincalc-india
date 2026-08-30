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
});
