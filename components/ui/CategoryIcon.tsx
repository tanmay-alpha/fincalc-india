import type { LucideIcon } from "lucide-react";
import {
  TrendingUp,
  FileText,
  LineChart,
  Building2,
  Scale,
  Calculator,
  Receipt,
  PiggyBank,
  Percent,
} from "lucide-react";
import { CALCULATOR_REGISTRY, type CalculatorCategory } from "@/lib/calculators";

const CATEGORY_ICON_MAP: Record<CalculatorCategory, LucideIcon> = {
  investments: TrendingUp,
  taxation: FileText,
  trading: LineChart,
  loans: Building2,
  corporate: Scale,
};

const SPECIFIC_CALCULATOR_ICONS: Record<string, LucideIcon> = {
  sip: TrendingUp,
  "step-up-sip": TrendingUp,
  lumpsum: PiggyBank,
  fd: Building2,
  ppf: PiggyBank,
  emi: Building2,
  tax: Receipt,
  "fno-brokerage": LineChart,
  "option-payoff": LineChart,
  "dcf-valuation": Scale,
  "capital-gains-tax": FileText,
  "loan-prepayment": Percent,
  "no-cost-emi": Building2,
};

export function getCategoryIcon(idOrCategory: string): LucideIcon {
  const normalized = idOrCategory.toLowerCase();

  // 1. Direct specific calculator match
  if (SPECIFIC_CALCULATOR_ICONS[normalized]) {
    return SPECIFIC_CALCULATOR_ICONS[normalized];
  }

  // 2. Calculator category lookup
  const calc = CALCULATOR_REGISTRY.find(
    (c) => c.id.toLowerCase() === normalized || c.route === `/${normalized}`
  );
  if (calc && CATEGORY_ICON_MAP[calc.category]) {
    return CATEGORY_ICON_MAP[calc.category];
  }

  // 3. Direct category match
  if (normalized in CATEGORY_ICON_MAP) {
    return CATEGORY_ICON_MAP[normalized as CalculatorCategory];
  }

  return Calculator;
}
