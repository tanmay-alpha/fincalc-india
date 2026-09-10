import { describe, it, expect } from "vitest";
import { getSafeCallbackUrl } from "@/lib/url";

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
    expect(
      getSafeCallbackUrl("/tax", new URLSearchParams({ regime: "new", year: "2026" }))
    ).toBe("/tax?regime=new&year=2026");
  });

  it("rejects absolute external URLs and defaults to root workspace /", () => {
    expect(getSafeCallbackUrl("https://evil.com/malicious")).toBe("/");
    expect(getSafeCallbackUrl("http://evil.com")).toBe("/");
    expect(getSafeCallbackUrl("//evil.com")).toBe("/");
    expect(getSafeCallbackUrl("///evil.com")).toBe("/");
  });

  it("honors custom fallback when provided", () => {
    expect(getSafeCallbackUrl("https://evil.com/malicious", null, "/calculators")).toBe(
      "/calculators"
    );
  });

  it("rejects backslash and encoded protocol attacks", () => {
    expect(getSafeCallbackUrl("/\\evil.com")).toBe("/");
    expect(getSafeCallbackUrl("\\evil.com")).toBe("/");
    expect(getSafeCallbackUrl("/tax", "\\evil.com")).toBe("/");
    expect(getSafeCallbackUrl("/tax", "//evil.com")).toBe("/");
    expect(getSafeCallbackUrl("/tax", "https://evil.com")).toBe("/");
  });

  it("rejects script and data schemes", () => {
    expect(getSafeCallbackUrl("javascript:alert(1)")).toBe("/");
    expect(getSafeCallbackUrl("data:text/html,malicious")).toBe("/");
  });

  it("safely handles null, undefined, empty, or whitespace", () => {
    expect(getSafeCallbackUrl(null)).toBe("/");
    expect(getSafeCallbackUrl(undefined)).toBe("/");
    expect(getSafeCallbackUrl("")).toBe("/");
    expect(getSafeCallbackUrl("   ")).toBe("/");
  });
});
