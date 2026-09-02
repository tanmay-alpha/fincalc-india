import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateEnv } from "@/lib/env";
import {
  getCalculatorContract,
  isSaveSupportedContract,
} from "@/lib/calculator-contracts";

/**
 * Best-effort per-user rate limiting using a process-local sliding-window map.
 *
 * NOTE: Vercel serverless functions can run in many parallel instances per
 * region, so an in-memory map is best-effort. For production-grade limits,
 * swap this for an Upstash/Redis backed counter. It is not a distributed
 * security boundary because serverless instances do not share this map.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;

type Bucket = { count: number; timestamp: number };
const ipRequestMap = new Map<string, Bucket>();

// Cleanup old buckets periodically to prevent memory growth.
function cleanupRateLimit(now: number) {
  if (ipRequestMap.size < 500) return;
  for (const [ip, bucket] of ipRequestMap) {
    if (now - bucket.timestamp > RATE_LIMIT_WINDOW_MS * 5) {
      ipRequestMap.delete(ip);
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJsonValue(value: unknown): value is Prisma.InputJsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isRecord(value) && Object.values(value).every(isJsonValue);
}

// Cap the size of nested JSON we will accept to prevent payload DoS.
const MAX_PAYLOAD_BYTES = 32 * 1024; // 32 KB is plenty for calculator outputs

async function readBoundedJsonBody(req: Request): Promise<
  | { ok: true; body: unknown }
  | { ok: false; status: 400 | 413; error: string }
> {
  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_PAYLOAD_BYTES) {
    return { ok: false, status: 413, error: "Request body too large." };
  }

  if (!req.body) return { ok: false, status: 400, error: "Invalid JSON body" };

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_PAYLOAD_BYTES) {
        await reader.cancel();
        return { ok: false, status: 413, error: "Request body too large." };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, body: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON body" };
  }
}

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    validateEnv();
    const { type: calculatorType } = await params;

    // ─── Auth ───────────────────────────────────────────────────
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to save calculations." },
        { status: 401 }
      );
    }

    // ─── Best-effort authenticated rate limit ────────────────────
    const now = Date.now();
    cleanupRateLimit(now);
    const bucket = ipRequestMap.get(session.user.id);
    if (bucket && now - bucket.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { success: false, error: "Rate limit exceeded. Please wait a minute." },
          {
            status: 429,
            headers: {
              "Retry-After": String(
                Math.ceil((RATE_LIMIT_WINDOW_MS - (now - bucket.timestamp)) / 1000)
              ),
            },
          }
        );
      }
      bucket.count += 1;
    } else {
      ipRequestMap.set(session.user.id, { count: 1, timestamp: now });
    }

    // ─── Body size + parse ──────────────────────────────────────
    const parsedBody = await readBoundedJsonBody(req);
    if (!parsedBody.ok) {
      return NextResponse.json(
        { success: false, error: parsedBody.error },
        { status: parsedBody.status }
      );
    }

    const body = parsedBody.body;
    if (!isRecord(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { inputs } = body;

    if (!isRecord(inputs)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid inputs" },
        { status: 400 }
      );
    }

    const contract = getCalculatorContract(calculatorType.toLowerCase());
    if (!contract) {
      return NextResponse.json(
        { success: false, error: "Invalid calculator type" },
        { status: 400 }
      );
    }

    if (!isSaveSupportedContract(contract)) {
      return NextResponse.json(
        { success: false, error: "Saving is not supported for this calculator" },
        { status: 400 }
      );
    }

    const validation = contract.inputSchema.safeParse(inputs);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const outputs = contract.calculate(validation.data);
    if (!isRecord(outputs) || !isJsonValue(outputs)) {
      console.error("[calculate] canonical calculator returned non-serializable output", {
        calculatorType: contract.id,
      });
      return NextResponse.json(
        { success: false, error: "Calculator produced an invalid result" },
        { status: 500 }
      );
    }

    // ─── Persist ────────────────────────────────────────────────
    let shareId: string | null = null;

    try {
      const calculation = await prisma.calculation.create({
        data: {
          type: contract.id,
          inputs: validation.data as Prisma.InputJsonValue,
          outputs,
          userId: session.user.id,
        },
        select: { shareId: true },
      });
      shareId = calculation.shareId;
    } catch (dbError) {
      console.error("[calculate] DB save failure:", dbError);
      return NextResponse.json(
        { success: false, error: "Unable to save calculation right now." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { shareId },
    });
  } catch (error) {
    console.error("[calculate] unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
