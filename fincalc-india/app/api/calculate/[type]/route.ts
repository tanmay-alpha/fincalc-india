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

export async function POST(
  req: Request,
  { params }: { params: { type: string } }
) {
  try {
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

    const calculation = await prisma.calculation.create({
      data: {
        type,
        inputs: inputs,
        outputs: results,
        userId: session?.user?.id ? session.user.id : null,
      },
    });

    return NextResponse.json({
      success: true,
      shareId: calculation.shareId,
    });
  } catch (error) {
    console.error("Calculation save error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save calculation" },
      { status: 500 }
    );
  }
}
