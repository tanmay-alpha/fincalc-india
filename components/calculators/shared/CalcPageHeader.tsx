/**
 * CalcPageHeader — standardised calculator page header component.
 *
 * Renders: unique calculator icon + name + description + category badge + optional statutory badge.
 * Uses the per-calculator iconName from lib/registry (not the generic category icon).
 */

import {
  PiggyBank, TrendingUp, Banknote, Landmark, Shield, Flame,
  Briefcase, BarChart3, CreditCard, ArrowLeftRight, AlertTriangle,
  Car, RefreshCw, Receipt, SlidersHorizontal, ArrowUpRight, Home,
  Store, Building, Globe, DollarSign, Wallet, Tag, Activity,
  FlaskConical, Target, Gauge, ShieldAlert, Calculator, Percent,
  Layers, LucideIcon,
} from "lucide-react";
import type { CalculatorIconName } from "@/lib/registry";

// ─── Icon resolve map ───────────────────────────────────────────────────────
const ICON_MAP: Record<CalculatorIconName, LucideIcon> = {
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

const CATEGORY_LABEL: Record<string, string> = {
  investments: "Invest & Grow",
  taxation: "Tax & Compliance",
  loans: "Loans & Credit",
  trading: "Trading & Risk",
  corporate: "Corporate & Valuation",
};

interface CalcPageHeaderProps {
  iconName: CalculatorIconName;
  name: string;
  description: string;
  category: string;
  badge?: string;
  /** e.g. "Updated for Tax Year 2026–27" — shown as a small muted footnote */
  updatedFor?: string;
}

export default function CalcPageHeader({
  iconName,
  name,
  description,
  category,
  badge,
  updatedFor,
}: CalcPageHeaderProps) {
  const Icon = ICON_MAP[iconName] ?? Calculator;
  const categoryLabel = CATEGORY_LABEL[category] ?? category;

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>FinCalc India</span>
        <span aria-hidden="true">›</span>
        <span>{categoryLabel}</span>
        <span aria-hidden="true">›</span>
        <span className="text-foreground font-medium">{name}</span>
      </div>

      {/* Icon + heading row */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center text-primary shrink-0 mt-0.5">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-tight">
              {name}
            </h1>
            {badge && (
              <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                {badge}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>

          {updatedFor && (
            <p className="mt-1 text-xs text-muted-foreground">
              {updatedFor}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
