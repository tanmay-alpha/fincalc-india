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
    <div className="surface-card mb-6 overflow-hidden">
      <div className="border-b border-border bg-primary/10 px-5 py-4">
        <h3 className="flex items-center justify-between text-base font-bold text-card-foreground">
          <span>Comparison: {label}</span>
          <span className={cn(
            "flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-full",
            isZero ? "bg-muted text-muted-foreground" :
            isPositive ? "bg-success/10 text-success" :
            "bg-destructive/10 text-destructive"
          )}>
            {!isZero && (isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />)}
            {isZero && <Equal className="w-3.5 h-3.5" />}
            {isZero ? "Identical" : `${isPositive ? "+" : ""}${formatINR(diff)} (${pctDiff.toFixed(1)}%)`}
          </span>
        </h3>
      </div>
      
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="p-5">
          <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-1">{labelA}</p>
          <p className="text-xl md:text-2xl font-bold text-foreground">{formatINR(valueA)}</p>
        </div>
        <div className="bg-muted/60 p-5">
          <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-1">{labelB}</p>
          <p className="text-xl md:text-2xl font-bold text-foreground">{formatINR(valueB)}</p>
        </div>
      </div>
    </div>
  );
}
