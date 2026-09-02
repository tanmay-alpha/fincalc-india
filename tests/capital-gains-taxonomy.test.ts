import { describe, it, expect } from "vitest";
import { calcCapitalGains } from "@/lib/math";

describe("Capital Gains Asset Taxonomy (Finance Act 2024 / 2026 & Income-tax Act, 2025)", () => {
  it("1. SGB originally subscribed by individual held to maturity is 100% tax exempt u/s 70(1)(x)", () => {
    const res = calcCapitalGains({
      assetClass: "sovereign_gold_bond",
      taxpayerCategory: "resident_individual",
      purchasePrice: 500000,
      salePrice: 1200000,
      holdingMonths: 96,
      sgbSubscriptionType: "original_issue",
      sgbRedemptionType: "maturity_redemption",
      isContinuouslyHeldByIndividual: true,
    });

    expect(res.rawCapitalGain).toBe(700000);
    expect(res.exemptionAllowed).toBe(700000);
    expect(res.taxableGain).toBe(0);
    expect(res.totalTaxPayable).toBe(0);
    expect(res.baseTaxPayable).toBe(0);
    expect(res.cessAmount).toBe(0);
    expect(res.explanation).toContain("Section 70(1)(x)");
  });

  it("2. SGB sold via secondary market after 18 months is taxed at 12.5% LTCG without indexation", () => {
    const res = calcCapitalGains({
      assetClass: "sovereign_gold_bond",
      purchasePrice: 500000,
      salePrice: 700000,
      holdingMonths: 18,
      sgbSubscriptionType: "secondary_market",
      sgbRedemptionType: "market_sale",
    });

    expect(res.gainType).toBe("LTCG");
    expect(res.taxRatePercent).toBe(12.5);
    expect(res.rawCapitalGain).toBe(200000);
    expect(res.taxableGain).toBe(200000);
    expect(res.totalTaxPayable).toBe(25000); // 12.5% of 2L
    expect(res.cessAmount).toBe(1000); // 4% of 25k
    expect(res.totalTaxWithCess).toBe(26000);
  });

  it("3. Specified Mutual Fund (Section 50AA / Sec 76) is deemed STCG regardless of holding period", () => {
    const res = calcCapitalGains({
      assetClass: "specified_mutual_fund",
      purchasePrice: 1000000,
      salePrice: 1500000,
      holdingMonths: 48, // held 4 years
      investorSlabRatePercent: 30,
      isSpecifiedMutualFund: true,
    });

    expect(res.gainType).toBe("STCG");
    expect(res.taxRatePercent).toBe(30);
    expect(res.rawCapitalGain).toBe(500000);
    expect(res.capitalGainIncludedInTotalIncome).toBe(500000);
    expect(res.specialRateChargeableGain).toBe(0);
    expect(res.totalTaxPayable).toBe(150000);
    expect(res.cessAmount).toBe(6000);
    expect(res.totalTaxWithCess).toBe(156000);
    expect(res.explanation).toContain("Section 50AA");
  });

  it("4. Non-specified debt/hybrid mutual fund held > 24m is taxed at 12.5% LTCG", () => {
    const res = calcCapitalGains({
      assetClass: "non_specified_debt_mf",
      purchasePrice: 1000000,
      salePrice: 1500000,
      holdingMonths: 36,
      investorSlabRatePercent: 30,
    });

    expect(res.gainType).toBe("LTCG");
    expect(res.taxRatePercent).toBe(12.5);
    expect(res.rawCapitalGain).toBe(500000);
    expect(res.specialRateChargeableGain).toBe(500000);
    expect(res.capitalGainIncludedInTotalIncome).toBe(0);
    expect(res.totalTaxPayable).toBe(62500); // 12.5% of 5L
    expect(res.cessAmount).toBe(2500);
    expect(res.totalTaxWithCess).toBe(65000);
  });

  it("5. Listed Gold ETF held > 12 months is LTCG at 12.5%", () => {
    const res = calcCapitalGains({
      assetClass: "listed_gold_etf",
      purchasePrice: 200000,
      salePrice: 300000,
      holdingMonths: 14,
    });

    expect(res.gainType).toBe("LTCG");
    expect(res.taxRatePercent).toBe(12.5);
    expect(res.totalTaxPayable).toBe(12500);
  });

  it("6. Physical Gold held > 24 months is LTCG at 12.5%", () => {
    const res = calcCapitalGains({
      assetClass: "physical_gold",
      purchasePrice: 500000,
      salePrice: 800000,
      holdingMonths: 26,
    });

    expect(res.gainType).toBe("LTCG");
    expect(res.taxRatePercent).toBe(12.5);
    expect(res.totalTaxPayable).toBe(37500);
  });
});
