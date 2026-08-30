import type {
  SipOutput,
  EmiOutput,
  FdOutput,
  PpfOutput,
  LumpsumOutput,
  TaxOutput,
  StepUpSipOutput,
  GoalSipOutput,
  PrepaymentVsInvestOutput,
  NoCostEmiOutput,
  FireOutput,
  CapitalGainsOutput,
  FnOBreakevenOutput,
  OptionPayoffOutput,
  HRAExemptionOutput,
  PresumptiveTaxOutput,
  PositionSizeOutput,
  Section54ExemptionOutput,
} from "./math";
import { formatCompact, formatINR, formatPercent } from "./format";

export interface InsightItem {
  icon: string;
  title: string;
  subtitle?: string;
  type: "info" | "good" | "warning";
}

function safeDiv(n: number, d: number, fallback = 0): number {
  return d > 0 ? n / d : fallback;
}

export function getSIPInsights(r: SipOutput): InsightItem[] {
  const ratio =
    r.totalInvested > 0
      ? (r.totalCorpus / r.totalInvested).toFixed(2)
      : "0.00";
  const growthLabel =
    r.absoluteReturn > 200
      ? "Wealth multiplication 🚀"
      : r.absoluteReturn > 100
        ? "Excellent growth 📈"
        : r.absoluteReturn > 50
          ? "Good growth 👍"
          : "Modest growth";

  const annualized =
    r.totalInvested > 0
      ? (r.estimatedReturns / r.totalInvested) * 100
      : 0;

  return [
    {
      icon: "🎯",
      title: `You will have ${formatCompact(r.totalCorpus)} at maturity`,
      subtitle: `Based on ${formatPercent(
        Number(annualized.toFixed(1))
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
  const tenureMonths = r.amortizationSchedule.length;
  return [
    {
      icon: "🏠",
      title: `Your EMI is ${formatINR(r.emi)} per month`,
      subtitle: `For ${tenureMonths} months`,
      type: "info",
    },
    {
      icon: "💸",
      title: `You pay ${formatCompact(r.totalInterest)} extra as interest`,
      subtitle: `${interestPct}% of total payment is interest`,
      type: interestPct > 50 ? "warning" : "info",
    },
    ...(interestPct > 50
      ? [
          {
            icon: "⚠️",
            title: "Interest exceeds principal",
            subtitle: "Consider a shorter loan tenure to save significantly",
            type: "warning" as const,
          },
        ]
      : []),
    {
      icon: "📊",
      title: `Total payment: ${formatCompact(r.totalPayment)}`,
      subtitle: `Over ${tenureMonths} months`,
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
      title:
        r.totalInterest > 40000
          ? "TDS may apply on FD interest"
          : "Compounding improves your yield",
      subtitle:
        r.totalInterest > 40000
          ? "Interest above annual limits can attract TDS"
          : `Effective annual yield is ${formatPercent(r.effectiveAnnualYield)}`,
      type: r.totalInterest > 40000 ? "warning" : "info",
    },
  ];
}

export function getPPFInsights(r: PpfOutput): InsightItem[] {
  const ratio =
    r.totalInvested > 0
      ? (r.maturityValue / r.totalInvested).toFixed(2)
      : "0.00";
  const withdrawalYear = r.yearlyData.find(
    (row) => row.withdrawalAllowed
  )?.year;

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
      subtitle: `Total tax: ${formatINR(r.totalTax)} (Tax Year 2026-27)`,
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

export function getStepUpSipInsights(r: StepUpSipOutput): InsightItem[] {
  const extraGainPct = r.flatCorpus > 0 ? ((r.extraReturnsVsFlat / r.flatCorpus) * 100).toFixed(1) : "0";
  return [
    {
      icon: "🚀",
      title: `Step-Up creates ${formatCompact(r.extraReturnsVsFlat)} extra wealth (+${extraGainPct}%)`,
      subtitle: `Corpus: ${formatCompact(r.totalCorpus)} vs Flat SIP: ${formatCompact(r.flatCorpus)}`,
      type: "good",
    },
    {
      icon: "📈",
      title: `Total Gain: ${formatCompact(r.estimatedReturns)}`,
      subtitle: `Invested ${formatCompact(r.totalInvested)} over tenure`,
      type: "good",
    },
    {
      icon: "💡",
      title: "Compounding Acceleration",
      subtitle: "Increasing your SIP annually combats inflation automatically",
      type: "info",
    },
  ];
}

export function getGoalSipInsights(r: GoalSipOutput, targetCorpus: number): InsightItem[] {
  return [
    {
      icon: "🎯",
      title: `Starting SIP: ${formatINR(r.requiredStartingSip)} / month`,
      subtitle: `To reach ${formatCompact(targetCorpus)} target goal`,
      type: "good",
    },
    {
      icon: "💰",
      title: `Estimated wealth gain: ${formatCompact(r.estimatedReturns)}`,
      subtitle: `Total investment required: ${formatCompact(r.totalInvested)}`,
      type: "info",
    },
  ];
}

export function getPrepaymentVsInvestInsights(r: PrepaymentVsInvestOutput): InsightItem[] {
  return [
    {
      icon: r.interestSaved > 0 ? "🎉" : "ℹ️",
      title: `Interest Saved: ${formatCompact(r.interestSaved)}`,
      subtitle: `Cuts tenure by ${Math.floor(r.tenureSavedMonths / 12)} years ${r.tenureSavedMonths % 12} months`,
      type: r.interestSaved > 0 ? "good" : "info",
    },
    {
      icon: "⚖️",
      title: r.recommendation === "invest" ? "Investing beats Prepayment" : "Prepayment recommended",
      subtitle: `Net wealth delta: ${formatCompact(Math.abs(r.wealthDifference))}`,
      type: r.recommendation === "invest" ? "good" : "info",
    },
    {
      icon: "📊",
      title: `Break-even return: ${r.breakEvenRate}% p.a.`,
      subtitle: "If your investments yield more than this, investing is mathematically superior",
      type: "info",
    },
  ];
}

export function getNoCostEmiInsights(r: NoCostEmiOutput): InsightItem[] {
  return [
    {
      icon: r.cheaperOption === "upfront" ? "💡" : "⚡",
      title: r.cheaperOption === "upfront" ? "Upfront payment is cheaper" : "No-Cost EMI is viable",
      subtitle: r.verdict,
      type: r.cheaperOption === "upfront" ? "good" : "info",
    },
    {
      icon: "🔍",
      title: `Effective Annual Cost: ${r.effectiveApr}% APR`,
      subtitle: `Includes ₹${r.hiddenGst} hidden GST on subvention interest`,
      type: r.effectiveApr > 15 ? "warning" : "info",
    },
  ];
}

export function getFireInsights(r: FireOutput): InsightItem[] {
  return [
    {
      icon: "🔥",
      title: `Target FIRE Corpus: ${formatCompact(r.standardFireCorpus)}`,
      subtitle: `Lean FIRE: ${formatCompact(r.leanFireCorpus)} | Fat FIRE: ${formatCompact(r.fatFireCorpus)}`,
      type: "good",
    },
    {
      icon: "💰",
      title: `Required Savings: ${formatINR(r.requiredMonthlySavings)} / mo`,
      subtitle: `For the next ${r.yearsToRetirement} years until age ${r.yearsToRetirement + 30}`,
      type: "info",
    },
    {
      icon: r.isPerpetual ? "♾️" : "⏳",
      title: r.isPerpetual ? "Perpetual Corpus (Generational Wealth)" : `Depletion at Age ${r.depletionAge ?? "N/A"}`,
      subtitle: r.isPerpetual ? "Real return covers SWR fully" : "Consider adjusting savings or withdrawal rate",
      type: r.isPerpetual ? "good" : "warning",
    },
  ];
}

export function getCapitalGainsInsights(r: CapitalGainsOutput): InsightItem[] {
  return [
    {
      icon: r.isLoss ? "🛡️" : "🏛️",
      title: r.isLoss ? "Capital Loss (Carry Forward Eligible)" : `Tax Payable: ${formatINR(r.totalTaxPayable)}`,
      subtitle: `Effective tax rate: ${r.effectiveTaxRate}% (${r.taxYear})`,
      type: r.isLoss ? "info" : "good",
    },
    {
      icon: "📜",
      title: `${r.gainType}: ${formatINR(r.taxableGain)} Taxable Gain`,
      subtitle: r.exemptionAllowed > 0 ? `Exemption applied: ${formatINR(r.exemptionAllowed)}` : "No statutory exemption",
      type: "info",
    },
  ];
}

export function getFnOBreakevenInsights(r: FnOBreakevenOutput): InsightItem[] {
  return [
    {
      icon: "⚡",
      title: `Break-even Exit: ₹${r.breakevenSellPrice.toFixed(2)}`,
      subtitle: `Need +${r.pointsToBreakeven.toFixed(2)} pts to clear statutory charges`,
      type: "info",
    },
    {
      icon: r.isProfit ? "📈" : "⚠️",
      title: `Net P&L: ${formatINR(r.netPnl)}`,
      subtitle: `Total charges: ${formatINR(r.totalCharges)} (STT: ₹${r.charges.stt})`,
      type: r.isProfit ? "good" : "warning",
    },
  ];
}

export function getOptionPayoffInsights(r: OptionPayoffOutput): InsightItem[] {
  return [
    {
      icon: "🎯",
      title: `Max Profit: ${typeof r.maxProfit === "number" ? formatINR(r.maxProfit) : r.maxProfit}`,
      subtitle: `Max Loss: ${typeof r.maxLoss === "number" ? formatINR(r.maxLoss) : r.maxLoss}`,
      type: "info",
    },
    {
      icon: "⚖️",
      title: `Risk-Reward: ${r.riskRewardRatio}`,
      subtitle: r.isNetCredit ? `Net Credit: ${formatINR(r.netPremiumPaidOrReceived)}` : `Net Debit: ${formatINR(r.netPremiumPaidOrReceived)}`,
      type: "info",
    },
  ];
}

export function getHraInsights(r: HRAExemptionOutput): InsightItem[] {
  return [
    {
      icon: "🏠",
      title: `Annual Exempt HRA: ${formatINR(r.annualExemptHra)}`,
      subtitle: `Taxable HRA: ${formatINR(r.annualTaxableHra)} per year`,
      type: "good",
    },
    {
      icon: "💡",
      title: `Tax Saved: ${formatINR(r.taxSaved)}`,
      subtitle: `Binding limit: ${r.bindingConstraint.replace(/_/g, " ")}`,
      type: "good",
    },
  ];
}

export function getPresumptiveTaxInsights(r: PresumptiveTaxOutput): InsightItem[] {
  return [
    {
      icon: "💼",
      title: `Deemed Profit: ${formatINR(r.presumptiveIncome)} (${r.presumptiveRateEffective}%)`,
      subtitle: `Presumptive Tax: ${formatINR(r.presumptiveTaxPayable)}`,
      type: "good",
    },
    {
      icon: r.isPresumptiveCheaper ? "✅" : "📊",
      title: r.isPresumptiveCheaper ? "Presumptive Tax is Cheaper" : "Regular Books may be Cheaper",
      subtitle: r.recommendation,
      type: r.isPresumptiveCheaper ? "good" : "info",
    },
  ];
}

export function getPositionSizeInsights(r: PositionSizeOutput): InsightItem[] {
  return [
    {
      icon: "🎯",
      title: `Recommended Qty: ${r.quantity} shares`,
      subtitle: `Position Value: ${formatINR(r.positionValue)} (${r.tradeDirection.toUpperCase()})`,
      type: "good",
    },
    {
      icon: "🛡️",
      title: `Max Risk: ${formatINR(r.actualRiskAmount)} (${r.actualRiskPercent}%)`,
      subtitle: `Target Profit: ${formatINR(r.potentialProfit)} (R:R ${r.riskRewardRatio})`,
      type: "info",
    },
  ];
}

export function getSection54Insights(r: Section54ExemptionOutput): InsightItem[] {
  return [
    {
      icon: "🏡",
      title: `Tax Saved: ${formatINR(r.activeResult.taxSaved)}`,
      subtitle: `Exemption Claimed: ${formatINR(r.activeResult.exemptionAllowed)}`,
      type: "good",
    },
    {
      icon: "📜",
      title: `Remaining Taxable LTCG: ${formatINR(r.activeResult.taxableGainsRemaining)}`,
      subtitle: `Net Tax Payable: ${formatINR(r.activeResult.taxAfterExemption)}`,
      type: "info",
    },
  ];
}

export const generateSIPInsights = getSIPInsights;
export const generateEMIInsights = getEMIInsights;
export const generateFDInsights = getFDInsights;
export const generatePPFInsights = getPPFInsights;
export const generateLumpsumInsights = getLumpsumInsights;
export const generateTaxInsights = getTaxInsights;

// Touch safeDiv so it doesn't get tree-shaken
void safeDiv;
