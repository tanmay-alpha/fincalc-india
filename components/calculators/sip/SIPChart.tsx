"use client";

import {
  BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart
} from "recharts";
import type { SipYearRow } from "@/lib/math";
import { formatCompact, formatINR } from "@/lib/format";
import { useMemo } from "react";

interface Props {
  data: SipYearRow[];
  compareData?: SipYearRow[];
  isCompareMode?: boolean;
}

export default function SIPChart({ data, compareData, isCompareMode }: Props) {
  
  const mergedData = useMemo(() => {
    if (!isCompareMode || !compareData) return data;
    // Map them together based on year
    return data.map((d, i) => {
      const c = compareData[i] || { corpus: 0, invested: 0 };
      return {
        ...d,
        corpusB: c.corpus,
        investedB: c.invested,
      };
    });
  }, [data, compareData, isCompareMode]);

  if (isCompareMode && compareData) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={mergedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `Yr ${v}`} />
          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(Number(v))} width={50} />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[var(--shadow-hover)] border border-slate-200 dark:border-slate-700 p-3 text-xs">
                  <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Year {label}</p>
                  {payload.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 py-0.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-slate-500 dark:text-slate-400">{p.name === 'corpus' ? 'Scenario A' : p.name === 'corpusB' ? 'Scenario B' : p.name}:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{formatINR(Number(p.value))}</span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
          <Line type="monotone" dataKey="corpus" name="Scenario A" stroke="#2563EB" strokeWidth={3} dot={false} isAnimationActive={true} />
          <Line type="monotone" dataKey="corpusB" name="Scenario B" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" dot={false} isAnimationActive={true} />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `Yr ${v}`}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
          width={50}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[var(--shadow-hover)] border border-slate-200 dark:border-slate-700 p-3 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Year {label}</p>
                {payload.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 py-0.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{formatINR(Number(p.value))}</span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
        />
        <Bar dataKey="invested" name="Invested" stackId="a" fill="#2563EB" maxBarSize={28} isAnimationActive={true} animationDuration={800} />
        <Bar dataKey="returns" name="Returns" stackId="a" fill="#16A34A" radius={[3, 3, 0, 0]} maxBarSize={28} isAnimationActive={true} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  );
}
