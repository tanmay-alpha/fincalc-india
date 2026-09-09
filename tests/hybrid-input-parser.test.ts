import { describe, expect, it } from "vitest";
import {
  parseFinancialInput,
  valueToSliderPosition,
  sliderPositionToValue,
  SLIDER_STEPS,
} from "@/components/ui/HybridInput";

describe("parseFinancialInput", () => {
  it("parses Indian financial shorthand exactly", () => {
    expect(parseFinancialInput("₹1.5Cr")).toBe(15_000_000);
    expect(parseFinancialInput("5L")).toBe(500_000);
    expect(parseFinancialInput("10k")).toBe(10_000);
    expect(parseFinancialInput("10K")).toBe(10_000);
    expect(parseFinancialInput("1,25,000")).toBe(125_000);
    expect(parseFinancialInput("₹ 25 L")).toBe(2_500_000);
    expect(parseFinancialInput("0.5CR")).toBe(5_000_000);
    expect(parseFinancialInput("2.5k")).toBe(2_500);
  });

  it("rejects partial or malformed numeric strings instead of parseFloat-prefix acceptance", () => {
    expect(Number.isNaN(parseFinancialInput("12abc"))).toBe(true);
    expect(Number.isNaN(parseFinancialInput("1.2.3L"))).toBe(true);
    expect(Number.isNaN(parseFinancialInput("Cr10"))).toBe(true);
    expect(Number.isNaN(parseFinancialInput(""))).toBe(true);
    expect(Number.isNaN(parseFinancialInput("   "))).toBe(true);
    expect(Number.isNaN(parseFinancialInput("abc"))).toBe(true);
    expect(Number.isNaN(parseFinancialInput("12CrX"))).toBe(true);
  });
});

describe("HybridInput non-linear slider scaling", () => {
  const min = 500;
  const max = 10_000_000;
  const step = 500;

  it("maps boundaries correctly for wide ranges", () => {
    expect(valueToSliderPosition(min, min, max, true)).toBe(0);
    expect(valueToSliderPosition(max, min, max, true)).toBe(SLIDER_STEPS);
    expect(sliderPositionToValue(0, min, max, step, true)).toBe(min);
    expect(sliderPositionToValue(SLIDER_STEPS, min, max, step, true)).toBe(max);
  });

  it("allocates substantial slider real estate to retail amounts rather than compressing to 0.25%", () => {
    // Retail ₹25,000 in linear scale is (25000-500)/10000000 = 0.245% of the track (pos ~2.4)
    // In our non-linear logarithmic curve:
    const pos25k = valueToSliderPosition(25_000, min, max, true);
    expect(pos25k).toBeGreaterThan(350); // Takes > 35% of track!
    expect(pos25k).toBeLessThan(450);

    // Retail ₹1,00,000:
    const pos1L = valueToSliderPosition(100_000, min, max, true);
    expect(pos1L).toBeGreaterThan(500); // Takes > 50% of track!
    expect(pos1L).toBeLessThan(600);
  });

  it("roundtrips retail values cleanly", () => {
    const pos = valueToSliderPosition(25_000, min, max, true);
    const restored = sliderPositionToValue(pos, min, max, step, true);
    expect(restored).toBe(25_000);
  });

  it("preserves linear scaling when isWideRange is false", () => {
    const rateMin = 1;
    const rateMax = 21;
    const rateStep = 0.5;

    const midPos = valueToSliderPosition(11, rateMin, rateMax, false);
    expect(midPos).toBe(500); // Exactly 50%

    const midVal = sliderPositionToValue(500, rateMin, rateMax, rateStep, false);
    expect(midVal).toBe(11);
  });
});
