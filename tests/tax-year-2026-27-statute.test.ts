import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { calcTax } from "@/lib/math";
import { REBATE_SECTION_156, REBATE_SECTION_157 } from "@/lib/constants/tax-year-2026-27";

describe("Income-tax Act, 2025 Section 156 statutory mapping", () => {
  it("uses Section 156 as the canonical individual rebate provision", () => {
    expect(REBATE_SECTION_156.sectionName).toContain("Section 156");
    expect(REBATE_SECTION_157).toBe(REBATE_SECTION_156);

    const result = calcTax({ grossIncome: 1_275_000, regime: "new" });
    expect(result.totalTax).toBe(0);
    expect(result.rebateSection).toContain("Section 156");
    expect(result.rebateSection).not.toContain("Section 157");
  });

  it("does not expose the incorrect Section 157 rebate label in user-facing tax surfaces", () => {
    const files = [
      "app/tax/page.tsx",
      "components/calculators/tax/TaxCalculator.tsx",
      "components/seo/TaxInfo.tsx",
      "lib/registry.ts",
      "lib/calculator-contracts.ts",
    ];

    for (const file of files) {
      const content = fs.readFileSync(path.resolve(process.cwd(), file), "utf-8");
      expect(content, file).not.toMatch(/Section 157/i);
    }
  });
});
