import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Account Management API:
 * Provides transparent user profile data access and GDPR/DPDP-compliant account deletion.
 */

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        _count: {
          select: { calculations: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt,
        savedCalculationsCount: user._count.calculations,
      },
    });
  } catch (error) {
    console.error("[account] get error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch account details" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/account
 * Deletes the authenticated user's account.
 * Cascades to delete all associated calculations, sessions, and OAuth accounts via schema foreign keys.
 */
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Delete user from database — cascades to Calculation, Account, and Session models
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "Account and associated data deleted successfully",
    });
  } catch (error) {
    console.error("[account] delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
