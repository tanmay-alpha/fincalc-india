import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateEnv } from "@/lib/env";
import {
  validateInput,
  sipSchema,
  emiSchema,
  fdSchema,
  ppfSchema,
  lumpsumSchema,
  taxSchema,
} from "@/lib/validations";

/**
 * Per-IP rate limiting using a simple sliding-window map.
 *
 * NOTE: Vercel serverless functions can run in many parallel instances per
 * region, so an in-memory map is best-effort. For production-grade limits,
 * swap this for an Upstash/Redis backed counter. We make this safe by
 * enforcing a strict per-IP cap even if the map resets between invocations.
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

// Cap the size of nested JSON we will accept to prevent payload DoS.
const MAX_PAYLOAD_BYTES = 32 * 1024; // 32 KB is plenty for calculator outputs

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    validateEnv();
    const { type: calculatorType } = await params;

    // ─── Rate limit ─────────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    cleanupRateLimit(now);
    const bucket = ipRequestMap.get(ip);
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
      ipRequestMap.set(ip, { count: 1, timestamp: now });
    }

    // ─── Auth ───────────────────────────────────────────────────
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to save calculations." },
        { status: 401 }
      );
    }

    // ─── Body size + parse ──────────────────────────────────────
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { success: false, error: "Request body too large." },
        { status: 413 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!isRecord(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { inputs, results } = body;

    if (!isRecord(inputs) || !isRecord(results) || Object.keys(results).length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing inputs or results" },
        { status: 400 }
      );
    }

    const type = calculatorType.toUpperCase();

    // ─── Validation by calculator type ─────────────────────────
    let schema: z.ZodType<unknown>;
    switch (type) {
      case "SIP": schema = sipSchema; break;
      case "EMI": schema = emiSchema; break;
      case "FD": schema = fdSchema; break;
      case "PPF": schema = ppfSchema; break;
      case "LUMPSUM": schema = lumpsumSchema; break;
      case "TAX": schema = taxSchema; break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid calculator type" },
          { status: 400 }
        );
    }

    const validation = validateInput(schema, inputs);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // ─── Persist ────────────────────────────────────────────────
    let shareId: string | null = null;
    let warning: string | undefined = undefined;

    try {
      const calculation = await prisma.calculation.create({
        data: {
          type,
          inputs: validation.data as Prisma.InputJsonValue,
          outputs: results as Prisma.InputJsonValue,
          userId: session.user.id,
        },
        select: { shareId: true },
      });
      shareId = calculation.shareId;
    } catch (dbError) {
      // Don't crash the user's calculation if DB is briefly unavailable.
      console.warn("[calculate] DB save warning:", dbError);
      warning = "DATABASE_UNAVAILABLE_FALLBACK";
    }

    return NextResponse.json({
      success: true,
      data: { shareId },
      warning,
    });
  } catch (error) {
    console.error("[calculate] unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}