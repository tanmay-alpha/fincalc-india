import { describe, it, expect } from "vitest";
import { getSafeCallbackUrl } from "@/components/auth/InteractiveCalculatorGate";

describe("getSafeCallbackUrl — Open Redirect Defense", () => {
  it("allows valid local calculator routes", () => {
    expect(getSafeCallbackUrl("/sip")).toBe("/sip");
    expect(getSafeCallbackUrl("/tax")).toBe("/tax");
    expect(getSafeCallbackUrl("/xirr-cagr-twrr")).toBe("/xirr-cagr-twrr");
    expect(getSafeCallbackUrl("/balance-transfer")).toBe("/balance-transfer");
  });

  it("allows local routes with query params", () => {
    expect(getSafeCallbackUrl("/tax?regime=new&year=2026")).toBe(
      "/tax?regime=new&year=2026"
    );
  });

  it("rejects absolute external URLs", () => {
    expect(getSafeCallbackUrl("https://attacker.com/malicious")).toBe("/calculators");
    expect(getSafeCallbackUrl("http://attacker.com")).toBe("/calculators");
  });

  it("rejects protocol-relative open redirect attacks", () => {
    expect(getSafeCallbackUrl("//attacker.com")).toBe("/calculators");
    expect(getSafeCallbackUrl("///attacker.com")).toBe("/calculators");
  });

  it("rejects backslash obfuscation attacks", () => {
    expect(getSafeCallbackUrl("/\\attacker.com")).toBe("/calculators");
    expect(getSafeCallbackUrl("\\attacker.com")).toBe("/calculators");
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
