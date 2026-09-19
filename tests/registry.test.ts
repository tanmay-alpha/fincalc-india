import { describe, it, expect } from "vitest";
import {
  getCalculatorById,
  getRelatedCalculators,
  searchCalculators,
  CALCULATOR_REGISTRY,
} from "@/lib/registry";

describe("lib/registry Calculator Directory & Search", () => {
  it("resolves calculators by ID and route", () => {
    expect(getCalculatorById("sip")).toBeDefined();
    expect(getCalculatorById("/sip")).toBeDefined();
    expect(getCalculatorById("non-existent")).toBeUndefined();
  });

  it("returns curated or fallback related calculators", () => {
    const relatedSip = getRelatedCalculators("sip", 3);
    expect(relatedSip.length).toBe(3);
    expect(relatedSip.some((c) => c.id === "sip")).toBe(false);

    const relatedFallback = getRelatedCalculators("non-existent", 3);
    expect(relatedFallback.length).toBe(3);
  });

  it("searches calculators by query string and category filter", () => {
    const allResults = searchCalculators("");
    expect(allResults.length).toBe(CALCULATOR_REGISTRY.length);

    const taxResults = searchCalculators("tax", "taxation");
    expect(taxResults.length).toBeGreaterThan(0);
    expect(taxResults.every((c) => c.category === "taxation")).toBe(true);

    const specificResults = searchCalculators("mutual fund sip");
    expect(specificResults.length).toBeGreaterThan(0);

    const emptyResults = searchCalculators("completely-unrelated-term-xyz123");
    expect(emptyResults).toEqual([]);
  });
});
