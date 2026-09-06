import type { LucideIcon } from "lucide-react";
import {
  PiggyBank, TrendingUp, Banknote, Landmark, Shield, Flame,
  Briefcase, BarChart3, CreditCard, ArrowLeftRight, AlertTriangle,
  Car, RefreshCw, Receipt, SlidersHorizontal, ArrowUpRight, Home,
  Store, Building, Globe, DollarSign, Wallet, Tag, Activity,
  FlaskConical, Target, Gauge, ShieldAlert, Calculator, Percent,
  Layers,
} from "lucide-react";
import type { CalculatorIconName } from "@/lib/registry";
import {
  type CalculatorCategory,
  getCalculatorById,
} from "@/lib/registry";

// ─── Category fallback icons ─────────────────────────────────────────────────
import { TrendingUp as TrendingUpCat, FileText, LineChart, Building2, Scale } from "lucide-react";

const CATEGORY_ICON_MAP: Record<CalculatorCategory, LucideIcon> = {
  investments: TrendingUpCat,
  taxation: FileText,
  trading: LineChart,
  loans: Building2,
  corporate: Scale,
};

// ─── Per-calculator icon map (mirrors registry iconName values) ──────────────
const CALC_ICON_MAP: Record<CalculatorIconName, LucideIcon> = {
  PiggyBank,
  TrendingUp,
  Banknote,
  Landmark,
  Shield,
  Flame,
  Briefcase,
  BarChart3,
  CreditCard,
  ArrowLeftRight,
  AlertTriangle,
  Car,
  RefreshCw,
  Receipt,
  SlidersHorizontal,
  ArrowUpRight,
  Home,
  Store,
  Building,
  Globe,
  DollarSign,
  Wallet,
  Tag,
  Activity,
  FlaskConical,
  Target,
  Gauge,
  ShieldAlert,
  Calculator,
  Percent,
  Layers,
};

/**
 * Resolve a Lucide icon component for a calculator ID or category string.
 * Priority: per-calculator registry icon → category fallback → Calculator.
 */
export function getCategoryIcon(idOrCategory: string): LucideIcon {
  const normalized = idOrCategory.toLowerCase();

  // 1. Calculator-specific icon from registry
  const calc = getCalculatorById(normalized);
  if (calc) {
    return CALC_ICON_MAP[calc.iconName] ?? Calculator;
  }

  // 2. Direct category match
  if (normalized in CATEGORY_ICON_MAP) {
    return CATEGORY_ICON_MAP[normalized as CalculatorCategory];
  }

  return Calculator;
}
