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
});
