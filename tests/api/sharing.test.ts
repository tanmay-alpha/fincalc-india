import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  findFirst: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    calculation: {
      findFirst: mocks.findFirst,
      update: mocks.update,
      updateMany: mocks.updateMany,
    },
  },
}));

import { GET as getPublicResult } from "@/app/api/result/[shareId]/route";
import {
  DELETE as unshare,
  POST as publish,
} from "@/app/api/history/[id]/share/route";

const CALCULATION_ID = "clh012345678901234567890";
const PUBLIC_TOKEN = "e4b5a41b-03dd-4a76-aaf2-7d3a9e1c5a40";

describe("saved-calculation sharing", () => {
  beforeEach(() => {
    mocks.auth.mockReset();
    mocks.findFirst.mockReset();
    mocks.update.mockReset();
    mocks.updateMany.mockReset();
  });

  it("does not expose a private calculation through the public result route", async () => {
    mocks.findFirst.mockResolvedValue(null);

    const response = await getPublicResult(new Request("http://localhost/result/private-token"), {
      params: Promise.resolve({ shareId: CALCULATION_ID }),
    });

    expect(response.status).toBe(404);
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(response.headers.get("X-Robots-Tag")).toContain("noindex");
    expect(mocks.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { shareId: CALCULATION_ID, isShared: true } })
    );
  });

  it("reads an explicitly shared calculation through a UUID public token", async () => {
    mocks.findFirst.mockResolvedValue({
      inputs: { monthlyAmount: 10_000 },
      outputs: { totalCorpus: 2_323_391 },
      type: "sip",
      createdAt: new Date("2026-09-03T00:00:00.000Z"),
    });

    const response = await getPublicResult(new Request(`http://localhost/result/${PUBLIC_TOKEN}`), {
      params: Promise.resolve({ shareId: PUBLIC_TOKEN }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(response.headers.get("X-Robots-Tag")).toContain("noindex");
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: { type: "sip", outputs: { totalCorpus: 2_323_391 } },
    });
  });

  it("publishes an owned private calculation with a new public token", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-a" } });
    mocks.findFirst.mockResolvedValue({ id: CALCULATION_ID, isShared: false, shareId: null });
    mocks.update.mockResolvedValue({ shareId: "shared-token", isShared: true });

    const response = await publish(
      new Request(`http://localhost/api/history/${CALCULATION_ID}/share`, { method: "POST" }),
      { params: Promise.resolve({ id: CALCULATION_ID }) }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: { shareId: "shared-token", isShared: true },
    });
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: CALCULATION_ID },
        data: expect.objectContaining({ isShared: true }),
      })
    );
  });

  it("revokes a previously published token for its owner", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-a" } });
    mocks.updateMany.mockResolvedValue({ count: 1 });

    const response = await unshare(
      new Request(`http://localhost/api/history/${CALCULATION_ID}/share`, { method: "DELETE" }),
      { params: Promise.resolve({ id: CALCULATION_ID }) }
    );

    expect(response.status).toBe(200);
    expect(mocks.updateMany).toHaveBeenCalledWith({
      where: { id: CALCULATION_ID, userId: "user-a" },
      data: { isShared: false, shareId: null },
    });
  });

  it("rotates an active public token only when the owner requests rotation", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-a" } });
    mocks.findFirst.mockResolvedValue({ id: CALCULATION_ID, isShared: true, shareId: "old-public-token" });
    mocks.update.mockResolvedValue({ shareId: "new-public-token", isShared: true });

    const response = await publish(
      new Request(`http://localhost/api/history/${CALCULATION_ID}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rotate: true }),
      }),
      { params: Promise.resolve({ id: CALCULATION_ID }) }
    );

    expect(response.status).toBe(200);
    expect(mocks.update.mock.calls[0][0].data.shareId).not.toBe("old-public-token");
  });
});
