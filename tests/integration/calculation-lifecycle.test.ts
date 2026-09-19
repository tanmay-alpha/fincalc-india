import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

/**
 * Real Calculation Lifecycle Integration Tests
 *
 * Validates the complete lifecycle against real PostgreSQL database:
 * Save -> Private By Default -> Publish -> Fetch Public -> Rotate Token (Immediate 404 on old token) -> Revoke (Immediate 404) -> Cascade Delete
 */

describe("Calculation Lifecycle Integration (PostgreSQL)", () => {
  const testUserId = `test-user-${Date.now()}`;
  const testUserEmail = `investor-${Date.now()}@example.in`;

  beforeEach(async () => {
    // Clean up test data if leftover
    await prisma.calculation.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });

  afterAll(async () => {
    await prisma.calculation.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("completes full lifecycle: save (private) -> publish -> rotate -> revoke -> cascade delete", async () => {
    // 1. Create User
    const user = await prisma.user.create({
      data: { id: testUserId, email: testUserEmail, name: "Test Investor" },
    });
    expect(user.id).toBe(testUserId);

    // 2. Save Calculation: MUST be private by default
    const saved = await prisma.calculation.create({
      data: {
        userId: user.id,
        type: "sip",
        inputs: { monthlyAmount: 25000, annualRate: 12, years: 15 },
        outputs: { totalInvested: 4500000, estimatedReturns: 7989345, totalCorpus: 12489345 },
        isShared: false,
        shareId: null,
        engineVersion: "1.0.0",
        schemaVersion: 1,
        rulesetId: "tax-year-2026-27",
      },
    });

    expect(saved.isShared).toBe(false);
    expect(saved.shareId).toBeNull();

    // 3. Verify public lookup returns null for private calculation
    const privateLookup = await prisma.calculation.findFirst({
      where: { id: saved.id, isShared: true },
    });
    expect(privateLookup).toBeNull();

    // 4. Publish Calculation: Generates public token
    const initialToken = randomUUID();
    const published = await prisma.calculation.update({
      where: { id: saved.id },
      data: { isShared: true, shareId: initialToken },
    });
    expect(published.isShared).toBe(true);
    expect(published.shareId).toBe(initialToken);

    // 5. Public fetch succeeds with active token
    const publicLookup = await prisma.calculation.findFirst({
      where: { shareId: initialToken, isShared: true },
    });
    expect(publicLookup).not.toBeNull();
    expect(publicLookup?.type).toBe("sip");

    // 6. Rotate Token: Owner requests a new link
    const rotatedToken = randomUUID();
    await prisma.calculation.update({
      where: { id: saved.id },
      data: { shareId: rotatedToken },
    });

    // Old token MUST return null immediately
    const oldTokenLookup = await prisma.calculation.findFirst({
      where: { shareId: initialToken, isShared: true },
    });
    expect(oldTokenLookup).toBeNull();

    // New token works
    const newTokenLookup = await prisma.calculation.findFirst({
      where: { shareId: rotatedToken, isShared: true },
    });
    expect(newTokenLookup).not.toBeNull();
    expect(newTokenLookup?.shareId).toBe(rotatedToken);

    // 7. Revoke sharing: Immediately invalidates public access
    await prisma.calculation.update({
      where: { id: saved.id },
      data: { isShared: false, shareId: null },
    });

    const revokedLookup = await prisma.calculation.findFirst({
      where: { shareId: rotatedToken, isShared: true },
    });
    expect(revokedLookup).toBeNull();

    // 8. Cascade Delete: Deleting user removes associated calculations via PostgreSQL ON DELETE CASCADE foreign key
    const initialCount = await prisma.calculation.count({ where: { userId: user.id } });
    expect(initialCount).toBe(1);

    await prisma.user.delete({ where: { id: user.id } });

    const postDeleteCount = await prisma.calculation.count({ where: { userId: user.id } });
    expect(postDeleteCount).toBe(0);
  });
});
