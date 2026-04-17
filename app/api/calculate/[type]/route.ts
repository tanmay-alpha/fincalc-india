import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { 
  validateInput, 
  sipSchema, 
  emiSchema, 
  fdSchema, 
  ppfSchema, 
  lumpsumSchema, 
  taxSchema 
} from "@/lib/validations";

const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 30;
const ipRequestMap = new Map<string, { count: number; timestamp: number }>();

export async function POST(
  req: Request,
  { params }: { params: { type: string } }
) {
  try {
    // Basic Rate Limiting
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

    const session = await auth();
    const body = await req.json();
    const { inputs, results } = body;

    if (!inputs || !results) {
      return NextResponse.json(
        { success: false, error: "Missing inputs or results" },
        { status: 400 }
      );
    }

    const type = params.type.toUpperCase();

    // Validation
    let schema: any;
    switch (type) {
      case "SIP": schema = sipSchema; break;
      case "EMI": schema = emiSchema; break;
      case "FD": schema = fdSchema; break;
      case "PPF": schema = ppfSchema; break;
      case "LUMPSUM": schema = lumpsumSchema; break;
      case "TAX": schema = taxSchema; break;
      default:
        return NextResponse.json({ success: false, error: "Invalid calculator type" }, { status: 400 });
    }

    const validation = validateInput(schema, inputs);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: "Validation failed", 
        details: validation.errors 
      }, { status: 400 });
    }

    let shareId = null;
    let warning = undefined;

    try {
      const calculation = await prisma.calculation.create({
        data: {
          type,
          inputs: inputs,
          outputs: results,
          userId: session?.user?.id ? session.user.id : null,
        },
      });
      shareId = calculation.shareId;
    } catch (dbError) {
      console.warn("DB save Warning:", dbError);
      warning = "DATABASE_UNAVAILABLE_FALLBACK";
    }

    return NextResponse.json({
      success: true,
      data: { shareId },
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
