import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import HistoryClient from "./HistoryClient";

export const metadata: Metadata = {
  title: "Calculation History",
};

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center max-w-sm w-full shadow-sm">
          <div className="text-4xl mb-4">{'\uD83D\uDD10'}</div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Sign in to see your history</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Your saved calculations will appear here. Sign in with Google to save and access your calculation history anytime.
          </p>
          <Link
            href="/api/auth/signin"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
          >
            Sign in with Google
          </Link>
          <Link href="/" className="block mt-3 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
            {'\u2190'} Back to calculators
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
    shareId: c.shareId,
    label: c.label,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {serialized.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">{'\uD83D\uDCCA'}</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No saved calculations yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
              Use any calculator and click the Save button to build your history
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Go to Calculators
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <HistoryClient calculations={serialized} />
        )}

      </div>
    </div>
  );
}
