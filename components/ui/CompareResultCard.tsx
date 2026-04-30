"use client";

import { formatINR } from "@/lib/format";
import { TrendingUp, TrendingDown, Equal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareResultCardProps {
  label: string;
  valueA: number;
  valueB: number;
  labelA?: string;
  labelB?: string;
}

export default function CompareResultCard({
  label,
  valueA,
  valueB,
  labelA = "Scenario A",
  labelB = "Scenario B",
}: CompareResultCardProps) {
  const diff = valueB - valueA;
  const pctDiff = valueA > 0 ? (diff / valueA) * 100 : 0;
  
  const isPositive = diff > 0;
  const isZero = diff === 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-sm overflow-hidden mb-6">
      <div className="bg-blue-50/50 dark:bg-blue-900/10 px-5 py-4 border-b border-blue-100 dark:border-blue-900/50">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
          <span>Comparison: {label}</span>
          <span className={cn(
            "flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-full",
            isZero ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400" :
            isPositive ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : 
            "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
          )}>
            {!isZero && (isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />)}
            {isZero && <Equal className="w-3.5 h-3.5" />}
            {isZero ? "Identical" : `${isPositive ? "+" : ""}${formatINR(diff)} (${pctDiff.toFixed(1)}%)`}
          </span>
        </h3>
      </div>
      
      <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-700">
        <div className="p-5">
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">{labelA}</p>
          <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{formatINR(valueA)}</p>
        </div>
        <div className="p-5 bg-slate-50/30 dark:bg-slate-800/20">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase mb-1">{labelB}</p>
          <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{formatINR(valueB)}</p>
        </div>
      </div>
    </div>
  );
}
