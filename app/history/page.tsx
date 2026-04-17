import Link from "next/link";
import { TrendingUp, Building2, Lock, Landmark, Coins, FileText, Clock } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculation History",
};

const typeConfig: Record<string, { icon: typeof TrendingUp; label: string; color: string; href: string }> = {
  SIP: { icon: TrendingUp, label: "SIP", color: "text-blue-600", href: "/sip" },
  EMI: { icon: Building2, label: "EMI", color: "text-emerald-600", href: "/emi" },
  FD: { icon: Lock, label: "FD", color: "text-amber-600", href: "/fd" },
  PPF: { icon: Landmark, label: "PPF", color: "text-purple-600", href: "/ppf" },
  LUMPSUM: { icon: Coins, label: "Lumpsum", color: "text-pink-600", href: "/lumpsum" },
  TAX: { icon: FileText, label: "Tax", color: "text-cyan-600", href: "/tax" },
};

function getResultSummary(type: string, outputs: Record<string, unknown>): string {
  switch (type) {
    case "SIP": return `Corpus: ${formatINR(Number(outputs.totalCorpus || 0))}`;
    case "EMI": return `EMI: ${formatINR(Number(outputs.emi || 0))}`;
    case "FD": return `Maturity: ${formatINR(Number(outputs.maturityAmount || 0))}`;
    case "PPF": return `Maturity: ${formatINR(Number(outputs.maturityValue || 0))}`;
    case "LUMPSUM": return `Corpus: ${formatINR(Number(outputs.totalCorpus || 0))}`;
    case "TAX": return `Tax: ${formatINR(Number(outputs.totalTax || 0))}`;
    default: return "";
  }
}

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="calc-card text-center py-16">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Sign in to see your history</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Sign in with Google to save calculations and view your history.
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-flex px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            Sign In
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-7 h-7 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Calculation History</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          {calculations.length} saved calculation{calculations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {calculations.length === 0 ? (
        <div className="calc-card text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">No calculations yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Start using the calculators — your results will be saved automatically.
          </p>
          <Link
            href="/"
            className="inline-flex px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            Start Calculating
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {calculations.map((calc) => {
            const config = typeConfig[calc.type] || typeConfig.SIP;
            const Icon = config.icon;
            const summary = getResultSummary(calc.type, calc.outputs as Record<string, unknown>);
            return (
              <div key={calc.id} className="calc-card flex items-center gap-4 py-4 hover:shadow-card-hover transition-all">
                <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{config.label} Calculator</span>
                    {calc.label && (
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded">{calc.label}</span>
                    )}
                  </div>
                  <p className="text-sm text-primary font-medium">{summary}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(calc.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <Link
                  href={`/result/${calc.shareId}`}
                  className="text-xs font-medium text-primary hover:underline flex-shrink-0"
                >
                  View →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
