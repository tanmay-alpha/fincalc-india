import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  calculationFindFirst: vi.fn(),
  calculationFindMany: vi.fn(),
  calculationCreate: vi.fn(),
  calculationDeleteMany: vi.fn(),
  calculationUpdate: vi.fn(),
  calculationUpdateMany: vi.fn(),
  userFindUnique: vi.fn(),
  userDelete: vi.fn(),
  userCreate: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/env", () => ({
  validateEnv: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    calculation: {
      findFirst: mocks.calculationFindFirst,
      findMany: mocks.calculationFindMany,
      create: mocks.calculationCreate,
      deleteMany: mocks.calculationDeleteMany,
      update: mocks.calculationUpdate,
      updateMany: mocks.calculationUpdateMany,
    },
    user: {
      findUnique: mocks.userFindUnique,
      delete: mocks.userDelete,
      create: mocks.userCreate,
    },
  },
}));

import { GET as getHistory } from "@/app/api/history/route";
import {
  GET as getHistoryItem,
  DELETE as deleteHistoryItem,
} from "@/app/api/history/[id]/route";
import {
  POST as publishShare,
  DELETE as unshareCalculation,
} from "@/app/api/history/[id]/share/route";
import { POST as saveCalculation } from "@/app/api/calculate/[type]/route";
import {
  GET as getAccount,
  DELETE as deleteAccount,
} from "@/app/api/account/route";

const USER_A_ID = "clhuseralpha000000000001";
const USER_B_ID = "clhuserbeta0000000000002";
const CALC_A_ID = "clhcalc00000000000000001";

describe("AUTH & DATABASE SECURITY AUDIT SUITE", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── B1.3 & B5: Cross-User Data Isolation (IDOR Prevention) ─────────────
  describe("B1.3 Cross-User Data Isolation (Anti-IDOR)", () => {
    it("strictly rejects User B from reading User A's saved calculation by ID", async () => {
      // Authenticated as User B
      mocks.auth.mockResolvedValue({ user: { id: USER_B_ID } });

      // DB query receives { id: CALC_A_ID, userId: USER_B_ID } which returns null
      mocks.calculationFindFirst.mockResolvedValue(null);

      const response = await getHistoryItem(
        new Request(`http://localhost:3000/api/history/${CALC_A_ID}`),
        { params: Promise.resolve({ id: CALC_A_ID }) }
      );

      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Record not found or forbidden");

      // Verify the query strictly enforced userId: USER_B_ID at the database query level
      expect(mocks.calculationFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: CALC_A_ID,
            userId: USER_B_ID,
          },
        })
      );
    });

    it("permits User A to read their own saved calculation by ID", async () => {
      mocks.auth.mockResolvedValue({ user: { id: USER_A_ID } });
      mocks.calculationFindFirst.mockResolvedValue({
        id: CALC_A_ID,
        userId: USER_A_ID,
        type: "sip",
        inputs: { monthlyAmount: 15000 },
        outputs: { totalCorpus: 5000000 },
      });

      const response = await getHistoryItem(
        new Request(`http://localhost:3000/api/history/${CALC_A_ID}`),
        { params: Promise.resolve({ id: CALC_A_ID }) }
      );

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.id).toBe(CALC_A_ID);
    });

    it("strictly rejects User B from deleting User A's saved calculation", async () => {
      mocks.auth.mockResolvedValue({ user: { id: USER_B_ID } });
      // Database deleteMany with userId = USER_B_ID finds 0 records
      mocks.calculationDeleteMany.mockResolvedValue({ count: 0 });

      const response = await deleteHistoryItem(
        new Request(`http://localhost:3000/api/history/${CALC_A_ID}`, { method: "DELETE" }),
        { params: Promise.resolve({ id: CALC_A_ID }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.calculationDeleteMany).toHaveBeenCalledWith({
        where: {
          id: CALC_A_ID,
          userId: USER_B_ID,
        },
      });
    });

    it("strictly rejects User B from modifying share visibility of User A's calculation", async () => {
      mocks.auth.mockResolvedValue({ user: { id: USER_B_ID } });
      mocks.calculationFindFirst.mockResolvedValue(null);

      const response = await publishShare(
        new Request(`http://localhost:3000/api/history/${CALC_A_ID}/share`, { method: "POST" }),
        { params: Promise.resolve({ id: CALC_A_ID }) }
      );

      expect(response.status).toBe(404);
      expect(mocks.calculationUpdate).not.toHaveBeenCalled();
    });

    it("strictly scopes history listing query to the authenticated session's user ID", async () => {
      mocks.auth.mockResolvedValue({ user: { id: USER_A_ID } });
      mocks.calculationFindMany.mockResolvedValue([]);

      const response = await getHistory();
      expect(response.status).toBe(200);

      expect(mocks.calculationFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: USER_A_ID },
        })
      );
    });
  });

  // ─── B2 & B5: Unauthenticated Access Rejections ─────────────────────────
  describe("B2 & B5 Unauthenticated Access Protection", () => {
    it("rejects unauthenticated GET /api/history with 401", async () => {
      mocks.auth.mockResolvedValue(null);

      const res = await getHistory();
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe("Unauthorized");
    });

    it("rejects unauthenticated GET /api/history/[id] with 401", async () => {
      mocks.auth.mockResolvedValue(null);

      const res = await getHistoryItem(
        new Request(`http://localhost:3000/api/history/${CALC_A_ID}`),
        { params: Promise.resolve({ id: CALC_A_ID }) }
      );
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated DELETE /api/history/[id] with 401", async () => {
      mocks.auth.mockResolvedValue(null);

      const res = await deleteHistoryItem(
        new Request(`http://localhost:3000/api/history/${CALC_A_ID}`, { method: "DELETE" }),
        { params: Promise.resolve({ id: CALC_A_ID }) }
      );
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated POST /api/calculate/[type] with 401", async () => {
      mocks.auth.mockResolvedValue(null);

      const res = await saveCalculation(
        new Request("http://localhost:3000/api/calculate/sip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inputs: { monthlyAmount: 10000, annualRate: 12, years: 10 },
          }),
        }),
        { params: Promise.resolve({ type: "sip" }) }
      );
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated DELETE /api/account with 401", async () => {
      mocks.auth.mockResolvedValue(null);

      const res = await deleteAccount();
      expect(res.status).toBe(401);
    });
  });

  // ─── B4 & B5: Account Deletion and Cascade Scoping ──────────────────────
  describe("B4 & B5 Account Deletion & Cascade Verification", () => {
    it("deletes user account by authenticated session ID triggering DB cascade", async () => {
      mocks.auth.mockResolvedValue({ user: { id: USER_A_ID } });
      mocks.userDelete.mockResolvedValue({ id: USER_A_ID });

      const response = await deleteAccount();
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);

      expect(mocks.userDelete).toHaveBeenCalledWith({
        where: { id: USER_A_ID },
      });
    });

    it("provides account profile transparency via GET /api/account", async () => {
      mocks.auth.mockResolvedValue({ user: { id: USER_A_ID } });
      mocks.userFindUnique.mockResolvedValue({
        id: USER_A_ID,
        email: "investor@example.com",
        name: "FinCalc User",
        image: null,
        createdAt: new Date("2026-05-01T00:00:00.000Z"),
        _count: { calculations: 8 },
      });

      const response = await getAccount();
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.data.email).toBe("investor@example.com");
      expect(json.data.savedCalculationsCount).toBe(8);
    });
  });

  // ─── Calculation Input Validation & Server-Side Execution ───────────────
  describe("Calculation Persistence Integrity", () => {
    it("binds created calculation strictly to the session user ID and runs server-side math", async () => {
      mocks.auth.mockResolvedValue({ user: { id: USER_A_ID } });
      mocks.calculationCreate.mockResolvedValue({ id: CALC_A_ID });

      const res = await saveCalculation(
        new Request("http://localhost:3000/api/calculate/sip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inputs: {
              monthlyAmount: 10000,
              annualRate: 12,
              years: 10,
            },
          }),
        }),
        { params: Promise.resolve({ type: "sip" }) }
      );

      expect(res.status).toBe(200);
      expect(mocks.calculationCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: USER_A_ID,
            type: "sip",
          }),
        })
      );
    });
  });
});
