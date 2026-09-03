import Link from "next/link";
import { ArrowRight, Lock, History, Calculator } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import HistoryClient from "./HistoryClient";

export const metadata: Metadata = {
  title: "Calculation History | FinCalc India",
  description: "View and manage your securely saved financial calculations.",
};

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-card rounded-2xl border border-border/80 p-8 text-center max-w-sm w-full shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            Sign in to view your history
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
            Your saved calculations will appear here. Sign in with Google to securely save, share, and access your calculation history across devices.
          </p>
          <Link
            href="/api/auth/signin"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Sign in with Google
          </Link>
          <Link
            href="/"
            className="block mt-3 text-xs text-muted-foreground hover:text-foreground transition"
          >
            ← Back to calculators
          </Link>
        </div>
      </div>
    );
  }

  const calculations = await prisma.calculation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const serialized = calculations.map((c) => ({
    id: c.id,
    type: c.type,
    inputs: c.inputs as Record<string, unknown>,
    outputs: c.outputs as Record<string, unknown>,
    isShared: c.isShared,
    shareId: c.shareId,
    label: c.label,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {serialized.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/80 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              No saved calculations yet
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
              Use any financial calculator and click &quot;Save Calculation&quot; to record scenarios and build your personalized history.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Calculator className="w-4 h-4" />
              <span>Explore Calculators</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        ) : (
          <HistoryClient calculations={serialized} />
        )}
      </div>
    </div>
  );
}
