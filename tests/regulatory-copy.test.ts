import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Regulatory & Statutory UI Copy Regression Suite", () => {
  it("enforces current PFRDA All Citizen exit rules (up to 80% lump sum, 20% annuity, separate 60% tax-free treatment) in app/nps/page.tsx", () => {
    const npsPath = path.resolve(process.cwd(), "app/nps/page.tsx");
    const content = fs.readFileSync(npsPath, "utf-8");

    // Must NOT mandate 40% annuity under normal exit
    expect(content).not.toMatch(/at least 40%.*must be used to purchase an annuity/i);

    // Must correctly state PFRDA normal exit lump sum up to 80% and minimum 20% annuity
    expect(content).toMatch(/up to 80% as lump sum/i);
    expect(content).toMatch(/minimum of 20%.*annuity/i);

    // Must explain that 60% tax exemption is distinct under Section 10(12A)
    expect(content).toMatch(/60%.*tax-exempt.*Section 10\(12A\)/i);
  });

  it("enforces Section 394 of Income-tax Act, 2025 for LRS TCS in app/lrs-tcs/page.tsx", () => {
    const lrsPath = path.resolve(process.cwd(), "app/lrs-tcs/page.tsx");
    const content = fs.readFileSync(lrsPath, "utf-8");

    // Must reference Section 394 of the Income-tax Act, 2025
    expect(content).toMatch(/Section 394 of the Income-tax Act, 2025/);

    // Must retain historical reference for SEO/familiarity
    expect(content).toMatch(/formerly Section 206C\(1G\)/);
  });
});
