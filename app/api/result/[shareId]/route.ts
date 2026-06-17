import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// shareId values are cuids (~24 chars alphanumeric) — reject anything else
// early to avoid hitting the DB with garbage.
const SHARE_ID_PATTERN = /^[a-z0-9]{20,32}$/i;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;

    if (!SHARE_ID_PATTERN.test(shareId)) {
      return NextResponse.json(
        { success: false, error: "Invalid share id" },
        { status: 400 }
      );
    }

    const calculation = await prisma.calculation.findUnique({
      where: { shareId },
      select: {
        inputs: true,
        outputs: true,
        type: true,
        createdAt: true,
      },
    });

    if (!calculation) {
      return NextResponse.json(
        { success: false, error: "Result not found" },
        { status: 404 }
      );
    }

    // Shared results are immutable: cache aggressively at the edge.
    return NextResponse.json(
      {
        success: true,
        data: {
          inputs: calculation.inputs,
          outputs: calculation.outputs,
          type: calculation.type,
          createdAt: calculation.createdAt,
        },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("[result] fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}