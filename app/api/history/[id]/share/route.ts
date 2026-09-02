import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ID_PATTERN = /^[a-z0-9]{20,32}$/i;

async function getOwnedCalculation(id: string, userId: string) {
  return prisma.calculation.findFirst({
    where: { id, userId },
    select: { id: true, isShared: true, shareId: true },
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!ID_PATTERN.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }

    const requestBody = await req.json().catch(() => ({}));
    const rotate = typeof requestBody === "object" && requestBody !== null && !Array.isArray(requestBody)
      && requestBody.rotate === true;

    const calculation = await getOwnedCalculation(id, session.user.id);
    if (!calculation) {
      return NextResponse.json({ success: false, error: "Record not found or forbidden" }, { status: 404 });
    }

    const shareId = calculation.isShared && calculation.shareId && !rotate
      ? calculation.shareId
      : randomUUID();
    const published = await prisma.calculation.update({
      where: { id: calculation.id },
      data: { isShared: true, shareId },
      select: { shareId: true, isShared: true },
    });

    return NextResponse.json({ success: true, data: published });
  } catch (error) {
    console.error("[history] publish error:", error);
    return NextResponse.json({ success: false, error: "Unable to publish calculation" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!ID_PATTERN.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }

    const result = await prisma.calculation.updateMany({
      where: { id, userId: session.user.id },
      data: { isShared: false, shareId: null },
    });
    if (result.count === 0) {
      return NextResponse.json({ success: false, error: "Record not found or forbidden" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { isShared: false } });
  } catch (error) {
    console.error("[history] unpublish error:", error);
    return NextResponse.json({ success: false, error: "Unable to revoke share link" }, { status: 500 });
  }
}
