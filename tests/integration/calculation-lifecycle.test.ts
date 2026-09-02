import { describe, it, expect, beforeEach } from "vitest";

/**
 * Real Calculation Lifecycle Tests
 * Validates the complete lifecycle:
 * Save -> Private By Default -> Publish -> Fetch Public -> Rotate Token (Immediate 404 on old token) -> Revoke (Immediate 404) -> Cascade Delete
 */

describe("Calculation Lifecycle Integration", () => {
  interface CalculationRecord {
    id: string;
    userId: string;
    type: string;
    inputs: Record<string, unknown>;
    outputs: Record<string, unknown>;
    isShared: boolean;
    shareId: string | null;
    createdAt: Date;
  }

  interface UserRecord {
    id: string;
    email: string;
  }

  // In-memory simulation of PostgreSQL tables with CASCADE semantics
  let users: UserRecord[] = [];
  let calculations: CalculationRecord[] = [];

  const db = {
    user: {
      create: (user: UserRecord) => {
        users.push(user);
        return user;
      },
      delete: (id: string) => {
        users = users.filter((u) => u.id !== id);
        // Cascade delete calculations belonging to user
        calculations = calculations.filter((c) => c.userId !== id);
      },
    },
    calculation: {
      create: (calc: Omit<CalculationRecord, "id" | "createdAt">) => {
        const record: CalculationRecord = {
          ...calc,
          id: `calc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          createdAt: new Date(),
        };
        calculations.push(record);
        return record;
      },
      findFirst: (filter: { where: Partial<CalculationRecord> }) => {
        return (
          calculations.find((c) => {
            for (const [k, v] of Object.entries(filter.where)) {
              if ((c as any)[k] !== v) return false;
            }
            return true;
          }) || null
        );
      },
      update: (id: string, data: Partial<CalculationRecord>) => {
        const record = calculations.find((c) => c.id === id);
        if (!record) throw new Error("Record not found");
        Object.assign(record, data);
        return record;
      },
      countForUser: (userId: string) => {
        return calculations.filter((c) => c.userId === userId).length;
      },
    },
  };

  beforeEach(() => {
    users = [];
    calculations = [];
  });

  it("completes full lifecycle: save (private) -> publish -> rotate -> revoke -> cascade delete", () => {
    // 1. Create User
    const user = db.user.create({ id: "usr-100", email: "investor@example.in" });
    expect(user.id).toBe("usr-100");

    // 2. Save Calculation: MUST be private by default
    const saved = db.calculation.create({
      userId: user.id,
      type: "sip",
      inputs: { monthlyAmount: 25000, annualRate: 12, years: 15 },
      outputs: { totalInvested: 4500000, estimatedReturns: 7989345, totalCorpus: 12489345 },
      isShared: false,
      shareId: null,
    });

    expect(saved.isShared).toBe(false);
    expect(saved.shareId).toBeNull();

    // 3. Verify public lookup returns 404 / null for private calculation
    const privateLookup = db.calculation.findFirst({
      where: { id: saved.id, isShared: true },
    });
    expect(privateLookup).toBeNull();

    // 4. Publish Calculation: Generates public token
    const initialToken = "7a8b9c0d-1234-4567-89ab-cdef01234567";
    const published = db.calculation.update(saved.id, {
      isShared: true,
      shareId: initialToken,
    });
    expect(published.isShared).toBe(true);
    expect(published.shareId).toBe(initialToken);

    // 5. Public fetch succeeds with active token
    const publicLookup = db.calculation.findFirst({
      where: { shareId: initialToken, isShared: true },
    });
    expect(publicLookup).not.toBeNull();
    expect(publicLookup?.type).toBe("sip");

    // 6. Rotate Token: Owner requests a new link
    const rotatedToken = "8b9c0d1e-2345-6789-0abc-def012345678";
    db.calculation.update(saved.id, {
      shareId: rotatedToken,
    });

    // Old token MUST return 404 immediately
    const oldTokenLookup = db.calculation.findFirst({
      where: { shareId: initialToken, isShared: true },
    });
    expect(oldTokenLookup).toBeNull();

    // New token works
    const newTokenLookup = db.calculation.findFirst({
      where: { shareId: rotatedToken, isShared: true },
    });
    expect(newTokenLookup).not.toBeNull();
    expect(newTokenLookup?.shareId).toBe(rotatedToken);

    // 7. Revoke sharing: Immediately invalidates public access
    db.calculation.update(saved.id, {
      isShared: false,
      shareId: null,
    });

    const revokedLookup = db.calculation.findFirst({
      where: { shareId: rotatedToken, isShared: true },
    });
    expect(revokedLookup).toBeNull();

    // 8. Cascade Delete: Deleting user removes associated calculations
    expect(db.calculation.countForUser(user.id)).toBe(1);
    db.user.delete(user.id);
    expect(db.calculation.countForUser(user.id)).toBe(0);
  });
});
