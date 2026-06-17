import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Cuid id format — restrict to expected shape to avoid DB bloat.
const ID_PATTERN = /^[a-z0-9]{20,32}$/i;

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!ID_PATTERN.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid id" },
        { status: 400 }
      );
    }

    // Single round-trip: only delete if owned by current user.
    const result = await prisma.calculation.deleteMany({
      where: {
        id,
        userId: session.user.id, // ensures ownership; never delete other users' data
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, error: "Record not found or forbidden" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[history] delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete record" },
      { status: 500 }
    );
  }
}
