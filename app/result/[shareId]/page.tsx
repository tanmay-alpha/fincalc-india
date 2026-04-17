import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatINR, formatPercent } from "@/lib/format";
import { TrendingUp, Building2, Lock, Landmark, Coins, FileText, ArrowLeft, Share2 } from "lucide-react";

interface Props {
  params: Promise<{ shareId: string }>;
}

const typeConfig: Record<string, { icon: typeof TrendingUp; label: string; color: string }> = {
  SIP: { icon: TrendingUp, label: "SIP Calculator", color: "from-blue-500 to-blue-600" },
  EMI: { icon: Building2, label: "EMI Calculator", color: "from-emerald-500 to-emerald-600" },
  FD: { icon: Lock, label: "FD Calculator", color: "from-amber-500 to-amber-600" },
  PPF: { icon: Landmark, label: "PPF Calculator", color: "from-purple-500 to-purple-600" },
  LUMPSUM: { icon: Coins, label: "Lumpsum Calculator", color: "from-pink-500 to-pink-600" },
  TAX: { icon: FileText, label: "Income Tax Estimator", color: "from-cyan-500 to-cyan-600" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareId } = await params;
  const calc = await prisma.calculation.findUnique({ where: { shareId } });
  if (!calc) return { title: "Not Found" };
  const config = typeConfig[calc.type] || typeConfig.SIP;
  return {
    title: `Shared ${config.label} | FinCalc India`,
    description: `View a shared ${config.label} result on FinCalc India`,
  };
}

function renderOutputs(type: string, outputs: Record<string, unknown>, inputs: Record<string, unknown>) {
  const rows: { label: string; value: string }[] = [];
  
  switch (type) {
    case "SIP":
      rows.push({ label: "Monthly Investment", value: formatINR(Number(inputs.monthly || 0)) });
      rows.push({ label: "Return Rate", value: formatPercent(Number(inputs.ratePA || 0)) });
      rows.push({ label: "Time Period", value: `${inputs.years} years` });
      rows.push({ label: "Total Invested", value: formatINR(Number(outputs.totalInvested || 0)) });
      rows.push({ label: "Estimated Returns", value: formatINR(Number(outputs.estimatedReturns || 0)) });
      rows.push({ label: "Total Corpus", value: formatINR(Number(outputs.totalCorpus || 0)) });
      break;
    case "EMI":
      rows.push({ label: "Loan Amount", value: formatINR(Number(inputs.principal || 0)) });
      rows.push({ label: "Monthly EMI", value: formatINR(Number(outputs.emi || 0)) });
      rows.push({ label: "Total Interest", value: formatINR(Number(outputs.totalInterest || 0)) });
      rows.push({ label: "Total Payment", value: formatINR(Number(outputs.totalPayment || 0)) });
      break;
    case "FD":
      rows.push({ label: "Principal", value: formatINR(Number(inputs.principal || 0)) });
      rows.push({ label: "Interest Earned", value: formatINR(Number(outputs.totalInterest || 0)) });
      rows.push({ label: "Maturity Amount", value: formatINR(Number(outputs.maturityAmount || 0)) });
      break;
    case "PPF":
      rows.push({ label: "Yearly Investment", value: formatINR(Number(inputs.yearlyInvestment || 0)) });
      rows.push({ label: "Total Invested", value: formatINR(Number(outputs.totalInvested || 0)) });
      rows.push({ label: "Maturity Value", value: formatINR(Number(outputs.maturityValue || 0)) });
      break;
    case "LUMPSUM":
      rows.push({ label: "Investment", value: formatINR(Number(inputs.principal || 0)) });
      rows.push({ label: "Returns", value: formatINR(Number(outputs.estimatedReturns || 0)) });
      rows.push({ label: "Total Corpus", value: formatINR(Number(outputs.totalCorpus || 0)) });
      break;
    case "TAX":
      rows.push({ label: "Gross Income", value: formatINR(Number(inputs.grossIncome || 0)) });
      rows.push({ label: "Total Tax", value: formatINR(Number(outputs.totalTax || 0)) });
      rows.push({ label: "Monthly Take-Home", value: formatINR(Number(outputs.monthlyTakeHome || 0)) });
      break;
  }
  return rows;
}

export default async function SharedResultPage({ params }: Props) {
  const { shareId } = await params;
  const calc = await prisma.calculation.findUnique({ where: { shareId } });

  if (!calc) {
    notFound();
  }

  const config = typeConfig[calc.type] || typeConfig.SIP;
  const Icon = config.icon;
  const outputs = renderOutputs(
    calc.type,
    calc.outputs as Record<string, unknown>,
    calc.inputs as Record<string, unknown>
  );
  const headline = outputs[outputs.length - 1];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to calculators
      </Link>

      <div className="calc-card overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.color} p-6 -mx-6 -mt-6 mb-6`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{config.label}</h1>
              <p className="text-sm text-white/70">
                Shared on {new Date(calc.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* Headline result */}
        {headline && (
          <div className="result-highlight text-center mb-6">
            <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">{headline.label}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{headline.value}</p>
          </div>
        )}

        {/* All outputs */}
        <div className="space-y-0">
          {outputs.slice(0, -1).map((row, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <span className="text-sm text-slate-600 dark:text-slate-400">{row.label}</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Copy Link
          </button>
          <Link
            href={`/${calc.type.toLowerCase()}`}
            className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-700 transition-colors"
          >
            Try this calculator →
          </Link>
        </div>
      </div>
    </div>
  );
}
