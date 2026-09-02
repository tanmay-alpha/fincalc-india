import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Legacy CUIDs and newly-issued UUIDv4 public tokens are accepted.
const SHARE_ID_PATTERN = /^(?:[a-z0-9]{20,32}|[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;

    if (!SHARE_ID_PATTERN.test(shareId)) {
      return NextResponse.json(
        { success: false, error: "Invalid share id" },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "X-Robots-Tag": "noindex, nofollow, noarchive",
          },
        }
      );
    }

    const calculation = await prisma.calculation.findFirst({
      where: { shareId, isShared: true },
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
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "X-Robots-Tag": "noindex, nofollow, noarchive",
          },
        }
      );
    }

    // Revocation privacy: Never cache shared calculations.
    // When revoked or rotated, results must immediately return 404.
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
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
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
