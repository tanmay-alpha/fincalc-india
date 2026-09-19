import { describe, expect, it } from "vitest";
import { CALCULATOR_REGISTRY } from "@/lib/calculators";
import {
  CALCULATOR_CONTRACTS,
  getCalculatorContract,
  isSaveSupportedContract,
} from "@/lib/calculator-contracts";

describe("calculator contracts", () => {
  it("covers each canonical calculator exactly once at its registered route", () => {
    const registryIds = CALCULATOR_REGISTRY.map((calculator) => calculator.id);
    const registryRoutes = CALCULATOR_REGISTRY.map((calculator) => calculator.route);
    const contractIds = CALCULATOR_CONTRACTS.map((contract) => contract.id);
    const contractRoutes = CALCULATOR_CONTRACTS.map((contract) => contract.route);

    expect(new Set(registryIds).size).toBe(registryIds.length);
    expect(new Set(registryRoutes).size).toBe(registryRoutes.length);
    expect(contractIds).toHaveLength(registryIds.length);
    expect(new Set(contractIds).size).toBe(contractIds.length);
    expect(new Set(contractRoutes).size).toBe(contractRoutes.length);
    expect(contractIds).toEqual(expect.arrayContaining(registryIds));
    expect(contractRoutes).toEqual(expect.arrayContaining(registryRoutes));
  });

  it("only exposes a save contract when validation and canonical calculation both exist", () => {
    for (const contract of CALCULATOR_CONTRACTS) {
      if (contract.saveSupported) {
        expect(isSaveSupportedContract(contract)).toBe(true);
        expect(contract.inputSchema).toBeDefined();
        expect(contract.calculate).toBeTypeOf("function");
      }
    }
  });

  it("resolves known ids and refuses unknown calculator ids", () => {
    expect(getCalculatorContract("sip")?.route).toBe("/sip");
    expect(getCalculatorContract("tax")?.saveSupported).toBe(true);
    expect(getCalculatorContract("not-a-calculator")).toBeUndefined();
  });

  it("successfully invokes calculate for all 31 calculator contracts", () => {
    const sampleInputs: Record<string, unknown> = {
      sip: { monthlyAmount: 10000, annualRate: 12, years: 10 },
      "step-up-sip": { initialMonthlyInvestment: 10000, annualStepUpPercent: 10, annualRate: 12, years: 10 },
      lumpsum: { principal: 100000, annualRate: 12, years: 10 },
      fd: { principal: 100000, annualRate: 7, tenureYears: 5, compoundingFrequency: 4 },
      ppf: { yearlyInvestment: 150000, years: 15, rate: 7.1 },
      fire: { currentAge: 30, retirementAge: 50, lifeExpectancy: 80, currentMonthlyExpenses: 50000 },
      nps: { currentAge: 30, retirementAge: 60, monthlyContribution: 10000, expectedReturnRate: 10 },
      "xirr-cagr-twrr": {
        activeTab: "xirr",
        cashflows: [{ date: "2024-01-01", amount: -100000 }, { date: "2025-01-01", amount: 120000 }],
        cagrInitial: 100000,
        cagrFinal: 200000,
        cagrYears: 5,
        twrrPeriods: [{ startValue: 100000, endValue: 120000, cashflow: 0 }],
      },
      emi: { principal: 1000000, annualRate: 8.5, tenureMonths: 120 },
      "loan-prepayment": { principal: 1000000, annualRate: 8.5, tenureMonths: 120, prepaymentType: "extra_emi_yearly", investmentRate: 12 },
      "no-cost-emi": { productPrice: 50000, tenureMonths: 6, discountAmount: 2000, processingFeePercent: 1, gstPercent: 18 },
      "car-loan-tco": {
        exShowroomPrice: 1000000,
        onRoadPrice: 1150000,
        downPayment: 200000,
        loanTenureMonths: 60,
        annualInterestRate: 9,
        annualFuelCost: 60000,
        annualInsuranceCost: 25000,
        annualMaintenanceCost: 15000,
        expectedOwnershipYears: 5,
        resaleValuePercent: 50,
      },
      "balance-transfer": {
        currentLoanBalance: 3000000,
        currentInterestRate: 9.5,
        remainingTenureMonths: 180,
        newInterestRate: 8.5,
        processingFeeType: "percent",
        processingFeeValue: 0.5,
      },
      tax: { salaryIncome: 1200000 },
      "marginal-relief": { income: 5050000, taxRegime: "new" },
      "capital-gains-tax": { assetType: "equity_shares_listed", buyDate: "2023-01-01", sellDate: "2024-08-01", buyPrice: 100000, sellPrice: 200000 },
      "hra-exemption": { basicSalary: 600000, da: 0, actualHraReceived: 240000, actualRentPaid: 200000, isMetroCity: true },
      "presumptive-tax": { scheme: "44ada", grossReceipts: 3000000, declaredProfit: 1500000, digitalReceiptsPercent: 100 },
      "section-54-exemption": { exemptionType: "54", capitalGainsOrNetConsideration: 5000000, costOfNewHouse: 5000000 },
      "lrs-tcs": { remittanceType: "foreign_investment", amountINR: 1000000, hasPan: true },
      "us-stock-tax": { buyDate: "2023-01-01", sellDate: "2025-01-01", buyPriceUSD: 1000, sellPriceUSD: 1500, buyFxRate: 80, sellFxRate: 84 },
      "nre-nro-fcnr": { depositType: "nre", principalINR: 1000000, annualRate: 7, tenureYears: 3, taxSlabPercent: 30 },
      "fno-brokerage": { tradeType: "options", segment: "options", buyLots: 1, lotSize: 50, buyPrice: 100, sellPrice: 150, brokerType: "discount" },
      "option-payoff": { lotSize: 50, underlyingPrice: 24000, legs: [{ strike: 24000, type: "call", position: "buy", premium: 100, lots: 1 }] },
      "black-scholes": { spotPrice: 24000, strikePrice: 24000, daysToExpiry: 30, volatilityPercent: 15, riskFreeRatePercent: 7 },
      "position-size": { capital: 500000, riskPercent: 1, entryPrice: 1000, stopLossPrice: 950 },
      "margin-calculator": { tradeType: "intraday_equity", entryPrice: 1000, quantity: 100 },
      "portfolio-risk": { returns: [10, 12, 8, 15, -5, 20] },
      "dcf-valuation": { currentCashFlow: 1000000, growthRateStage1: 15, yearsStage1: 5, terminalGrowthRate: 4, discountRate: 12, sharesOutstanding: 1000000 },
      wacc: { costOfEquityPercent: 14, costOfDebtPercent: 9, marketValueOfEquity: 70000000, marketValueOfDebt: 30000000, corporateTaxRatePercent: 25 },
      "dupont-analysis": { netIncome: 15000000, revenue: 100000000, totalAssets: 80000000, shareholdersEquity: 50000000 },
    };

    for (const contract of CALCULATOR_CONTRACTS) {
      expect(contract.calculate).toBeDefined();
      const input = sampleInputs[contract.id];
      expect(input, `Missing sample input for ${contract.id}`).toBeDefined();
      const result = contract.calculate!(input);
      expect(result).toBeDefined();
    }
  });
});
