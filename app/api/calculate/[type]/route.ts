import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
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
import {
  calcSIP,
  calcEMI,
  calcFD,
  calcPPF,
  calcLumpsum,
  calcTax,
} from "@/lib/math";

const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 30;
const ipRequestMap = new Map<string, { count: number; timestamp: number }>();

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Recomputes the result server-side from validated inputs.
 * Client-submitted result values are NEVER trusted or stored.
 */
function computeResult(type: string, validatedInputs: unknown): unknown {
  switch (type) {
    case "SIP":
      return calcSIP(validatedInputs as Parameters<typeof calcSIP>[0]);
    case "EMI":
      return calcEMI(validatedInputs as Parameters<typeof calcEMI>[0]);
    case "FD":
      return calcFD(validatedInputs as Parameters<typeof calcFD>[0]);
    case "PPF":
      return calcPPF(validatedInputs as Parameters<typeof calcPPF>[0]);
    case "LUMPSUM":
      return calcLumpsum(validatedInputs as Parameters<typeof calcLumpsum>[0]);
    case "TAX":
      return calcTax(validatedInputs as Parameters<typeof calcTax>[0]);
    default:
      throw new Error(`Unknown calculator type: ${type}`);
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    validateEnv();
    const { type: calculatorType } = await params;

    // Basic rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const clientLimit = ipRequestMap.get(ip);

    if (clientLimit && now - clientLimit.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (clientLimit.count > MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { success: false, error: "Rate limit exceeded" },
          { status: 429 }
        );
      }
      clientLimit.count += 1;
    } else {
      ipRequestMap.set(ip, { count: 1, timestamp: now });
    }

    // Auth required to save
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: unknown = await req.json();
    if (!isRecord(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Only read `inputs` from client — `results` is intentionally ignored
    const { inputs } = body;

    if (!isRecord(inputs)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid inputs" },
        { status: 400 }
      );
    }

    const type = calculatorType.toUpperCase();

    // Select the right validation schema
    const schemaMap: Record<string, Parameters<typeof validateInput>[0]> = {
      SIP: sipSchema,
      EMI: emiSchema,
      FD: fdSchema,
      PPF: ppfSchema,
      LUMPSUM: lumpsumSchema,
      TAX: taxSchema,
    };

    const schema = schemaMap[type];
    if (!schema) {
      return NextResponse.json(
        { success: false, error: "Invalid calculator type" },
        { status: 400 }
      );
    }

    // Validate inputs server-side
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

    // Recompute result server-side — client result is NEVER used
    let serverComputedResult: unknown;
    try {
      serverComputedResult = computeResult(type, validation.data);
    } catch {
      return NextResponse.json(
        { success: false, error: "Calculation failed" },
        { status: 500 }
      );
    }

    // Persist trusted server-computed result
    let shareId: string | null = null;
    let warning: string | undefined;

    try {
      const calculation = await prisma.calculation.create({
        data: {
          type,
          inputs: validation.data as Prisma.InputJsonValue,
          outputs: serverComputedResult as Prisma.InputJsonValue,
          userId: session.user.id,
        },
      });
      shareId = calculation.shareId;
    } catch (dbError) {
      console.warn("DB save warning:", dbError);
      warning = "DATABASE_UNAVAILABLE_FALLBACK";
    }

    return NextResponse.json({
      success: true,
      data: { shareId, result: serverComputedResult },
      warning,
    });
  } catch (error) {
    console.error("Calculation unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
