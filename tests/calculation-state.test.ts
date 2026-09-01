import { describe, it, expect } from "vitest";
import {
  encodeCalculationState,
  decodeCalculationState,
  buildShareableUrl,
} from "../lib/calculation-state";

describe("Calculation State Serialization & URL Sharing", () => {
  it("encodes and decodes standard calculator input payload cleanly", () => {
    const input = {
      monthlyInvestment: 25000,
      annualRate: 12.5,
      timeHorizonYears: 15,
      stepUpPercent: 10,
    };

    const encoded = encodeCalculationState("sip", input);
    expect(typeof encoded).toBe("string");
    expect(encoded.length).toBeGreaterThan(10);

    const decoded = decodeCalculationState<typeof input>(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe("sip");
    expect(decoded?.v).toBe(1);
    expect(decoded?.data).toEqual(input);
  });

  it("handles Unicode strings and currency symbols (e.g. ₹, emojis) safely", () => {
    const input = {
      customLabel: "Retirement Goal for 2035 🎯 ₹10 Crore Corpus",
      currencySymbol: "₹",
      nested: { notes: "Section 80CCD(2) @ 14% tax saving 🚀" },
    };

    const encoded = encodeCalculationState("retirement", input);
    const decoded = decodeCalculationState<typeof input>(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded?.data.customLabel).toBe("Retirement Goal for 2035 🎯 ₹10 Crore Corpus");
    expect(decoded?.data.currencySymbol).toBe("₹");
    expect(decoded?.data.nested.notes).toBe("Section 80CCD(2) @ 14% tax saving 🚀");
  });

  it("builds a well-formed shareable URL", () => {
    const input = { principal: 5000000, rate: 8.5, tenureYears: 20 };
    const url = buildShareableUrl("https://fincalcindia.com", "/home-loan-emi", input);

    expect(url).toContain("https://fincalcindia.com/home-loan-emi?state=");
    const stateParam = new URL(url).searchParams.get("state");
    expect(stateParam).not.toBeNull();

    const decoded = decodeCalculationState(stateParam!);
    expect(decoded?.id).toBe("home-loan-emi");
    expect(decoded?.data).toEqual(input);
  });

  it("rejects malformed Base64, non-JSON strings, and empty payloads without throwing", () => {
    expect(decodeCalculationState("")).toBeNull();
    expect(decodeCalculationState("not-valid-base64-%%$!@#")).toBeNull();
    expect(decodeCalculationState("SGVsbG8gV29ybGQ=")).toBeNull(); // Valid base64 ("Hello World"), but not valid JSON state
    expect(decodeCalculationState(null as unknown as string)).toBeNull();
    expect(decodeCalculationState(undefined as unknown as string)).toBeNull();
  });

  it("rejects excessively large payloads to protect against DoS attacks", () => {
    const massiveString = "A".repeat(100 * 1024); // 100 KB
    expect(decodeCalculationState(massiveString)).toBeNull();
  });
});
