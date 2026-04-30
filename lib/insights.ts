import type {
  SipOutput,
  EmiOutput,
  FdOutput,
  PpfOutput,
  LumpsumOutput,
  TaxOutput,
} from "./math";
import { formatCompact, formatINR, formatPercent } from "./format";

export interface InsightItem {
  icon: string;
  title: string;
  subtitle?: string;
  type: "info" | "good" | "warning";
}

export function getSIPInsights(r: SipOutput): InsightItem[] {
  const ratio = r.totalInvested > 0 ? (r.totalCorpus / r.totalInvested).toFixed(2) : "0.00";
  const growthLabel =
    r.absoluteReturn > 200 ? "Wealth multiplication 🚀"
    : r.absoluteReturn > 100 ? "Excellent growth 📈"
    : r.absoluteReturn > 50 ? "Good growth 👍"
    : "Modest growth";

  return [
    {
      icon: "🎯",
      title: `You will have ${formatCompact(r.totalCorpus)} at maturity`,
      subtitle: `Based on ${formatPercent(
        Number(((r.estimatedReturns / Math.max(r.totalInvested, 1)) * 100).toFixed(1))
      )} annualized gain`,
      type: "info",
    },
    {
      icon: "📈",
      title: `${formatPercent(Math.round(r.absoluteReturn))} absolute return - ${growthLabel}`,
      subtitle: `Returns of ${formatCompact(r.estimatedReturns)} on ${formatCompact(r.totalInvested)} invested`,
      type: r.absoluteReturn > 100 ? "good" : "info",
    },
    {
      icon: "💡",
      title: `Every ₹1 you invest becomes ₹${ratio}`,
      subtitle: "Power of compounding over time",
      type: "good",
    },
  ];
}

export function getEMIInsights(r: EmiOutput): InsightItem[] {
  const interestPct = Math.round(r.interestPercentage);
  return [
    {
      icon: "🏠",
      title: `Your EMI is ${formatINR(r.emi)} per month`,
      subtitle: `For ${r.amortizationSchedule.length} months`,
      type: "info",
    },
    {
      icon: "💸",
      title: `You pay ${formatCompact(r.totalInterest)} extra as interest`,
      subtitle: `${interestPct}% of total payment is interest`,
      type: interestPct > 50 ? "warning" : "info",
    },
    ...(interestPct > 50 ? [{
      icon: "⚠️",
      title: "Interest exceeds principal",
      subtitle: "Consider a shorter loan tenure to save significantly",
      type: "warning" as const,
    }] : []),
    {
      icon: "📊",
      title: `Total payment: ${formatCompact(r.totalPayment)}`,
      subtitle: `Over ${r.amortizationSchedule.length} months`,
      type: "info",
    },
  ];
}

export function getFDInsights(r: FdOutput): InsightItem[] {
  const principal = r.maturityAmount - r.totalInterest;
  return [
    {
      icon: "🔒",
      title: `Maturity amount: ${formatCompact(r.maturityAmount)}`,
      subtitle: `Principal ${formatCompact(principal)} + interest ${formatCompact(r.totalInterest)}`,
      type: "good",
    },
    {
      icon: "💰",
      title: `You earn ${formatCompact(r.totalInterest)} as interest`,
      subtitle: `${formatPercent(r.totalReturnPct)} total return`,
      type: r.totalReturnPct > 30 ? "good" : "info",
    },
    {
      icon: r.totalInterest > 40000 ? "⚠️" : "📌",
      title: r.totalInterest > 40000 ? "TDS may apply on FD interest" : "Compounding improves your yield",
      subtitle: r.totalInterest > 40000
        ? "Interest above annual limits can attract TDS"
        : `Effective annual yield is ${formatPercent(r.effectiveAnnualYield)}`,
      type: r.totalInterest > 40000 ? "warning" : "info",
    },
  ];
}

export function getPPFInsights(r: PpfOutput): InsightItem[] {
  const ratio = r.totalInvested > 0 ? (r.maturityValue / r.totalInvested).toFixed(2) : "0.00";
  const withdrawalYear = r.yearlyData.find((row) => row.withdrawalAllowed)?.year;

  return [
    {
      icon: "🏛️",
      title: `PPF maturity value: ${formatCompact(r.maturityValue)}`,
      subtitle: `Invested ${formatCompact(r.totalInvested)} over the period`,
      type: "good",
    },
    {
      icon: "🛡️",
      title: `Tax-free interest earned: ${formatCompact(r.totalInterest)}`,
      subtitle: "PPF has EEE tax status",
      type: "good",
    },
    {
      icon: "💡",
      title: `Every ₹1 invested becomes ₹${ratio}`,
      subtitle: withdrawalYear
        ? `Partial withdrawal starts from Year ${withdrawalYear}`
        : "Tax-free compounding at work",
      type: "info",
    },
  ];
}

export function getLumpsumInsights(r: LumpsumOutput): InsightItem[] {
  return [
    {
      icon: "🎯",
      title: `Your investment grows to ${formatCompact(r.totalCorpus)}`,
      subtitle: `Returns of ${formatCompact(r.estimatedReturns)} on your investment`,
      type: r.absoluteReturn > 100 ? "good" : "info",
    },
    {
      icon: "📈",
      title: `${formatPercent(r.absoluteReturn)} absolute return`,
      subtitle: `CAGR: ${formatPercent(r.CAGR)}`,
      type: r.absoluteReturn > 100 ? "good" : "info",
    },
    {
      icon: "🔢",
      title: `Wealth multiplier: ${r.wealthRatio}x`,
      subtitle: "How many times your money grew",
      type: r.wealthRatio >= 3 ? "good" : "info",
    },
  ];
}

export function getTaxInsights(r: TaxOutput): InsightItem[] {
  const saves = r.comparison.savings;
  const rec = r.comparison.recommendation;
  return [
    {
      icon: "🧾",
      title: `Effective tax rate: ${r.effectiveRate.toFixed(1)}%`,
      subtitle: `Total tax: ${formatINR(r.totalTax)} (incl. cess)`,
      type: r.effectiveRate > 20 ? "warning" : "info",
    },
    {
      icon: "💰",
      title: `Monthly take-home: ${formatINR(r.monthlyTakeHome)}`,
      subtitle: "After all taxes and deductions",
      type: "good",
    },
    {
      icon: saves > 0 ? "✅" : "ℹ️",
      title: saves > 0
        ? `${rec === "new" ? "New" : "Old"} Regime saves ${formatCompact(saves)} - recommended`
        : "Both regimes have similar tax liability",
      subtitle: r.comparison.reason,
      type: saves > 0 ? "good" : "info",
    },
  ];
}

export const generateSIPInsights = getSIPInsights;
export const generateEMIInsights = getEMIInsights;
export const generateFDInsights = getFDInsights;
export const generatePPFInsights = getPPFInsights;
export const generateLumpsumInsights = getLumpsumInsights;
export const generateTaxInsights = getTaxInsights;
