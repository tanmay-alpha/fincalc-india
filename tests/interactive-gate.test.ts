import { describe, it, expect } from "vitest";
import { getSafeCallbackUrl } from "@/components/auth/InteractiveCalculatorGate";

describe("getSafeCallbackUrl — Open Redirect Defense & Query Preservation", () => {
  it("allows valid local calculator routes", () => {
    expect(getSafeCallbackUrl("/sip")).toBe("/sip");
    expect(getSafeCallbackUrl("/tax")).toBe("/tax");
    expect(getSafeCallbackUrl("/xirr-cagr-twrr")).toBe("/xirr-cagr-twrr");
    expect(getSafeCallbackUrl("/balance-transfer")).toBe("/balance-transfer");
  });

  it("preserves safe query state (e.g., /tax?regime=new)", () => {
    expect(getSafeCallbackUrl("/tax?regime=new")).toBe("/tax?regime=new");
    expect(getSafeCallbackUrl("/tax", "regime=new")).toBe("/tax?regime=new");
    expect(getSafeCallbackUrl("/tax", "?regime=new")).toBe("/tax?regime=new");
    expect(getSafeCallbackUrl("/tax", new URLSearchParams({ regime: "new", year: "2026" }))).toBe(
      "/tax?regime=new&year=2026"
    );
  });

  it("rejects absolute external URLs", () => {
    expect(getSafeCallbackUrl("https://evil.com/malicious")).toBe("/calculators");
    expect(getSafeCallbackUrl("http://evil.com")).toBe("/calculators");
    expect(getSafeCallbackUrl("//evil.com")).toBe("/calculators");
    expect(getSafeCallbackUrl("///evil.com")).toBe("/calculators");
  });

  it("rejects backslash and encoded protocol attacks", () => {
    expect(getSafeCallbackUrl("/\\evil.com")).toBe("/calculators");
    expect(getSafeCallbackUrl("\\evil.com")).toBe("/calculators");
    expect(getSafeCallbackUrl("/tax", "\\evil.com")).toBe("/calculators");
    expect(getSafeCallbackUrl("/tax", "//evil.com")).toBe("/calculators");
    expect(getSafeCallbackUrl("/tax", "https://evil.com")).toBe("/calculators");
  });

  it("rejects script and data schemes", () => {
    expect(getSafeCallbackUrl("javascript:alert(1)")).toBe("/calculators");
    expect(getSafeCallbackUrl("data:text/html,malicious")).toBe("/calculators");
  });

  it("safely handles null, undefined, empty, or whitespace", () => {
    expect(getSafeCallbackUrl(null)).toBe("/calculators");
    expect(getSafeCallbackUrl(undefined)).toBe("/calculators");
    expect(getSafeCallbackUrl("")).toBe("/calculators");
    expect(getSafeCallbackUrl("   ")).toBe("/calculators");
  });
});
