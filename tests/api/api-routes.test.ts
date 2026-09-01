import { describe, it, expect, vi } from "vitest";
import { GET as healthGet } from "../../app/api/health/route";
import { POST as calculatePost } from "../../app/api/calculate/[type]/route";

// Mock env validation and prisma
vi.mock("@/lib/env", () => ({
  validateEnv: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null), // Unauthenticated by default
}));

describe("API Route Integration Tests", () => {
  describe("GET /api/health", () => {
    it("returns 200 with status ok and ISO timestamp", async () => {
      const res = await healthGet();
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.status).toBe("ok");
      expect(typeof json.timestamp).toBe("string");
      expect(typeof json.uptime).toBe("number");
    });
  });

  describe("POST /api/calculate/[type]", () => {
    it("returns 401 Unauthorized when session is missing", async () => {
      const req = new Request("http://localhost:3000/api/calculate/sip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: { monthlyAmount: 10000, annualRate: 12, years: 10 },
          results: { totalCorpus: 2323391 },
        }),
      });

      const res = await calculatePost(req, {
        params: Promise.resolve({ type: "sip" }),
      });

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Unauthorized");
    });
  });
});
