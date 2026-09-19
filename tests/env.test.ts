import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { validateEnv, getBaseUrl } from "@/lib/env";

describe("lib/env Environment Validation", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns base URL from NEXT_PUBLIC_APP_URL when present", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://custom.fincalc.test/";
    expect(getBaseUrl()).toBe("https://custom.fincalc.test");
  });

  it("returns base URL from NEXTAUTH_URL when app URL is missing", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    process.env.NEXTAUTH_URL = "https://app.fincalc.test/";
    expect(getBaseUrl()).toBe("https://app.fincalc.test");
  });

  it("falls back to default vercel URL when no env vars are set", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXTAUTH_URL;
    expect(getBaseUrl()).toBe("https://fincalc-india.vercel.app");
  });

  it("validates environment variables correctly", () => {
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";
    process.env.NEXTAUTH_SECRET = "a-secret-string-that-is-at-least-32-chars-long";
    process.env.NEXTAUTH_URL = "http://localhost:3000";

    const env = validateEnv();
    expect(env.DATABASE_URL).toBe("postgresql://user:pass@localhost:5432/db");
  });
});
