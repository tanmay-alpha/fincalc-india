import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  PiggyBank, TrendingUp, Banknote, Landmark, Shield, Flame,
  Briefcase, BarChart3, CreditCard, ArrowLeftRight, AlertTriangle,
  Car, RefreshCw, Receipt, SlidersHorizontal, ArrowUpRight, Home,
  Store, Building, Globe, DollarSign, Wallet, Tag, Activity,
  FlaskConical, Target, Gauge, ShieldAlert, Calculator, Percent,
  Layers, FileText, LineChart, Building2, Scale,
} from "lucide-react";
import {
  type CalculatorCategory,
  type CalculatorIconName,
  getCalculatorById,
} from "@/lib/registry";

export const CATEGORY_ICON_MAP: Record<CalculatorCategory, LucideIcon> = {
  investments: TrendingUp,
  taxation: FileText,
  trading: LineChart,
  loans: Building2,
  corporate: Scale,
};

export const CALC_ICON_MAP: Record<CalculatorIconName, LucideIcon> = {
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
 * Universal resolver returning the canonical LucideIcon for a calculator ID or Category.
 */
export function getCategoryIcon(idOrCategory: string): LucideIcon {
  const normalized = idOrCategory.toLowerCase();

  // 1. Check if ID matches a calculator
  const calc = getCalculatorById(normalized);
  if (calc && calc.iconName && CALC_ICON_MAP[calc.iconName]) {
    return CALC_ICON_MAP[calc.iconName];
  }

  // 2. Check if ID matches a category
  if (normalized in CATEGORY_ICON_MAP) {
    return CATEGORY_ICON_MAP[normalized as CalculatorCategory];
  }

  return Calculator;
}

/**
 * Universal CalculatorIcon Component
 */
export default function CalculatorIcon({
  id,
  className = "w-4 h-4",
  "aria-hidden": ariaHidden = true,
}: {
  id: string;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}) {
  const Icon = getCategoryIcon(id);
  return <Icon className={className} aria-hidden={Boolean(ariaHidden)} />;
}

/**
 * Dedicated CategoryIcon Component
 */
export function CategoryIcon({
  category,
  className = "w-4 h-4",
  "aria-hidden": ariaHidden = true,
}: {
  category: CalculatorCategory;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}) {
  const Icon = CATEGORY_ICON_MAP[category] || Calculator;
  return <Icon className={className} aria-hidden={Boolean(ariaHidden)} />;
}
