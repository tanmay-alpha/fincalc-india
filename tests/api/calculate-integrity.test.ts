import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { calcSIP, calcTax } from "@/lib/math";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  create: vi.fn(),
  validateEnv: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/env", () => ({ validateEnv: mocks.validateEnv }));
vi.mock("@/lib/prisma", () => ({
  prisma: { calculation: { create: mocks.create } },
}));

import { POST } from "@/app/api/calculate/[type]/route";

describe("POST /api/calculate/[type] persistence integrity", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.auth.mockReset();
    mocks.create.mockReset();
    mocks.validateEnv.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("recomputes SIP output instead of persisting a forged client result", async () => {
    const inputs = { monthlyAmount: 10_000, annualRate: 12, years: 10 };
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.create.mockResolvedValue({ shareId: "clh012345678901234567890" });

    const response = await POST(
      new Request("http://localhost:3000/api/calculate/sip", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.10" },
        body: JSON.stringify({
          inputs,
          results: { totalCorpus: 9_999_999_999_999 },
        }),
      }),
      { params: Promise.resolve({ type: "sip" }) }
    );

    expect(response.status).toBe(200);
    expect(mocks.create.mock.calls[0][0].data.outputs).toEqual(calcSIP(inputs));
  });

  it("accepts current tax inputs without requiring a legacy grossIncome field", async () => {
    const inputs = {
      salaryIncome: 1_200_000,
      interestAndOtherIncome: 25_000,
      dividendIncome: 10_000,
      businessIncome: 0,
      equityLtcg: 125_000,
      equityStcg: 0,
      otherLtcg: 0,
      residency: "resident_individual",
      ageCategory: "below_60",
      regime: "new",
      deduction80C: 0,
      deduction80D: 0,
      deduction80CCD1B: 0,
      hraExemption: 0,
      otherDeductions: 0,
    } as const;
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.create.mockResolvedValue({ shareId: "clh012345678901234567891" });

    const response = await POST(
      new Request("http://localhost:3000/api/calculate/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.11" },
        body: JSON.stringify({ inputs, results: { totalTax: 1 } }),
      }),
      { params: Promise.resolve({ type: "tax" }) }
    );

    expect(response.status).toBe(200);
    expect(mocks.create.mock.calls[0][0].data.outputs).toEqual(calcTax(inputs));
  });

  it("accepts inputs without any client result payload", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.create.mockResolvedValue({ shareId: "clh012345678901234567892" });

    const response = await POST(
      new Request("http://localhost:3000/api/calculate/sip", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.12" },
        body: JSON.stringify({
          inputs: { monthlyAmount: 10_000, annualRate: 12, years: 10 },
        }),
      }),
      { params: Promise.resolve({ type: "sip" }) }
    );

    expect(response.status).toBe(200);
    expect(mocks.create.mock.calls[0][0].data.outputs).toEqual(
      calcSIP({ monthlyAmount: 10_000, annualRate: 12, years: 10 })
    );
  });

  it("returns a failed save when persistence is unavailable", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.create.mockRejectedValue(new Error("database unavailable"));

    const response = await POST(
      new Request("http://localhost:3000/api/calculate/sip", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.13" },
        body: JSON.stringify({
          inputs: { monthlyAmount: 10_000, annualRate: 12, years: 10 },
        }),
      }),
      { params: Promise.resolve({ type: "sip" }) }
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ success: false });
  });
});
