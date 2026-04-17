import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { shareId: string } }
) {
  try {
    const calculation = await prisma.calculation.findUnique({
      where: { shareId: params.shareId },
    });

    if (!calculation) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Set cache headers - immutable for shared results
    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");

    return NextResponse.json({
      success: true,
      data: {
        inputs: calculation.inputs,
        outputs: calculation.outputs,
        type: calculation.type,
        createdAt: calculation.createdAt,
      }
    }, {
      headers
    });
  } catch (error) {
    console.error("Fetch result error:", error);
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 });
  }
}
