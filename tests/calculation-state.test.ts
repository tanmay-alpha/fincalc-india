import { describe, expect, it } from "vitest";
import { calcSIP } from "@/lib/math";
import {
  decodeCalculationInputs,
  encodeCalculationInputs,
  saveScenario,
  type ScenarioSnapshot,
} from "@/lib/calculation-state";

const isSipInput = (value: unknown): value is { monthlyAmount: number; annualRate: number; years: number } => {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  return [input.monthlyAmount, input.annualRate, input.years].every(
    (item) => typeof item === "number" && Number.isFinite(item)
  );
};

describe("calculation URL state", () => {
  it("round-trips SIP inputs to an identical result", () => {
    const input = { monthlyAmount: 5000, annualRate: 12, years: 10 };
    const decoded = decodeCalculationInputs(encodeCalculationInputs(input), isSipInput);

    expect(decoded).toEqual(input);
    expect(calcSIP(decoded!)).toEqual(calcSIP(input));
  });

  it("rejects non-finite and unknown URL values", () => {
    expect(decodeCalculationInputs("?v=1&i=Infinity", isSipInput)).toBeNull();
    expect(decodeCalculationInputs(`${encodeCalculationInputs({ monthlyAmount: 5000, annualRate: 12, years: 10 })}&x=1`, isSipInput)).toBeNull();
  });
});

describe("scenario snapshots", () => {
  it("keeps the three latest scenarios", () => {
    const one: ScenarioSnapshot<{ amount: number }> = { id: "one", name: "One", inputs: { amount: 1 } };
    const two: ScenarioSnapshot<{ amount: number }> = { id: "two", name: "Two", inputs: { amount: 2 } };
    const three: ScenarioSnapshot<{ amount: number }> = { id: "three", name: "Three", inputs: { amount: 3 } };
    const four: ScenarioSnapshot<{ amount: number }> = { id: "four", name: "Four", inputs: { amount: 4 } };

    expect(saveScenario(saveScenario(saveScenario(saveScenario([], one), two), three), four)).toEqual([two, three, four]);
  });
});
