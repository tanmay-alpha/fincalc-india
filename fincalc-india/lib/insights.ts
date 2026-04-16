/**
 * FinCalc India — Insight Generator
 *
 * Generates human-readable insight cards for each calculator result.
 * Uses formatINR/formatCompact from the canonical format module.
 */

import type { InsightCardData } from "@/components/ui/InsightCard";
import { formatINR, formatCompact, formatPercent } from "@/lib/format";
import type {
  SipOutput,
  EmiOutput,
  FdOutput,
  PpfOutput,
  LumpsumOutput,
  TaxOutput,
} from "@/lib/math";

// ─── SIP ──────────────────────────────────────────────────────

export function generateSIPInsights(r: SipOutput): InsightCardData[] {
  const insights: InsightCardData[] = [];
  const ratio = r.totalInvested > 0 ? (r.totalCorpus / r.totalInvested).toFixed(1) : "0";
  const years = r.yearlyBreakdown.length;

  insights.push({
    icon: "🎯",
    text: `You will have ${formatCompact(r.totalCorpus)} in ${years} years`,
    type: r.absoluteReturn > 100 ? "good" : "info",
  });

  insights.push({
    icon: "📈",
    text: `${formatPercent(r.absoluteReturn)} gain on your investment`,
    highlight: formatCompact(r.estimatedReturns) + " returns",
    type: r.absoluteReturn > 100 ? "good" : "info",
  });

  insights.push({
    icon: "💡",
    text: `Every ₹1 invested became`,
    highlight: `₹${ratio}`,
    type: "info",
  });

  if (r.totalCorpus >= 1_00_00_000) {
    insights.push({
      icon: "🏆",
      text: "Your investment crosses the Crore mark!",
      type: "good",
    });
  }

  return insights;
}

// ─── EMI ──────────────────────────────────────────────────────

export function generateEMIInsights(r: EmiOutput): InsightCardData[] {
  const insights: InsightCardData[] = [];
  const interestPct = r.interestPercentage;

  insights.push({
    icon: "🏠",
    text: `Monthly EMI is`,
    highlight: formatINR(r.emi),
    type: "info",
  });

  insights.push({
    icon: "💸",
    text: `You pay ${formatINR(r.totalInterest)} extra as interest`,
    highlight: `${interestPct.toFixed(1)}% of total payment`,
    type: interestPct > 50 ? "warn" : "info",
  });

  if (interestPct > 50) {
    insights.push({
      icon: "⚠️",
      text: "Consider shorter tenure to save interest",
      highlight: "Interest exceeds principal",
      type: "warn",
    });
  }

  insights.push({
    icon: "📊",
    text: `Total payment over ${r.amortizationSchedule.length} months:`,
    highlight: formatINR(r.totalPayment),
    type: "info",
  });

  return insights;
}

// ─── FD ───────────────────────────────────────────────────────

export function generateFDInsights(r: FdOutput): InsightCardData[] {
  const insights: InsightCardData[] = [];
  const principal = r.maturityAmount - r.totalInterest;
  const gainPct = principal > 0 ? (r.totalInterest / principal) * 100 : 0;

  insights.push({
    icon: "🔒",
    text: "Maturity amount:",
    highlight: formatCompact(r.maturityAmount),
    type: "good",
  });

  insights.push({
    icon: "💰",
    text: `You earn ${formatCompact(r.totalInterest)} as interest`,
    highlight: `${gainPct.toFixed(1)}% total gain`,
    type: gainPct > 30 ? "good" : "info",
  });

  if (r.totalInterest > 40000) {
    insights.push({
      icon: "📋",
      text: "TDS may apply on interest above ₹40,000/year",
      type: "warn",
    });
  }

  return insights;
}

// ─── PPF ──────────────────────────────────────────────────────

export function generatePPFInsights(r: PpfOutput): InsightCardData[] {
  const insights: InsightCardData[] = [];
  const ratio = r.totalInvested > 0 ? (r.maturityValue / r.totalInvested).toFixed(1) : "0";

  insights.push({
    icon: "🏛️",
    text: "PPF maturity value:",
    highlight: formatCompact(r.maturityValue),
    type: "good",
  });

  insights.push({
    icon: "🛡️",
    text: `Tax-free returns under EEE: ${formatCompact(r.totalInterest)}`,
    type: "good",
  });

  insights.push({
    icon: "💡",
    text: `Every ₹1 invested became`,
    highlight: `₹${ratio}`,
    type: "info",
  });

  const withdrawYear = r.yearlyData.find((y) => y.withdrawalAllowed);
  if (withdrawYear) {
    insights.push({
      icon: "📅",
      text: `Partial withdrawal allowed from Year ${withdrawYear.year}`,
      type: "info",
    });
  }

  return insights;
}

// ─── LUMPSUM ──────────────────────────────────────────────────

export function generateLumpsumInsights(r: LumpsumOutput): InsightCardData[] {
  const insights: InsightCardData[] = [];

  insights.push({
    icon: "🎯",
    text: `Your investment grows to`,
    highlight: formatCompact(r.totalCorpus),
    type: r.absoluteReturn > 100 ? "good" : "info",
  });

  insights.push({
    icon: "📈",
    text: `${formatPercent(r.absoluteReturn)} absolute return (CAGR: ${formatPercent(r.CAGR)})`,
    type: "info",
  });

  insights.push({
    icon: "🔢",
    text: `Wealth multiplier:`,
    highlight: `${r.wealthRatio}x`,
    type: r.wealthRatio >= 3 ? "good" : "info",
  });

  if (r.totalCorpus >= 1_00_00_000) {
    insights.push({
      icon: "🏆",
      text: "Your investment crosses the Crore mark!",
      type: "good",
    });
  }

  return insights;
}

// ─── TAX ──────────────────────────────────────────────────────

export function generateTaxInsights(r: TaxOutput): InsightCardData[] {
  const insights: InsightCardData[] = [];

  insights.push({
    icon: "🧾",
    text: `Effective tax rate:`,
    highlight: formatPercent(r.effectiveRate),
    type: r.effectiveRate > 20 ? "warn" : "info",
  });

  insights.push({
    icon: "💰",
    text: "Monthly take-home:",
    highlight: formatINR(r.monthlyTakeHome),
    type: "info",
  });

  const { comparison: comp } = r;
  if (comp.recommendation === "new" && comp.savings > 0) {
    insights.push({
      icon: "✅",
      text: `New Regime saves ${formatINR(comp.savings)} — switch recommended`,
      type: "good",
    });
  } else if (comp.recommendation === "old" && comp.savings > 0) {
    insights.push({
      icon: "✅",
      text: `Old Regime saves ${formatINR(comp.savings)} with your deductions`,
      type: "good",
    });
  }

  if (r.surcharge > 0) {
    insights.push({
      icon: "⚠️",
      text: `Surcharge of ${formatINR(r.surcharge)} applies to your income`,
      type: "warn",
    });
  }

  return insights;
}
