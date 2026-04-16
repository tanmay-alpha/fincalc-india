"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import type { FdGrowthPoint } from "@/lib/math";
import { formatCompact, formatINR } from "@/lib/format";

interface Props {
  data: FdGrowthPoint[];
}

export default function FDChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="fdGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
          width={60}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Period: {label}</p>
                <p className="text-slate-500 dark:text-slate-400">Amount: <span className="font-semibold text-slate-800 dark:text-slate-100">{formatINR(Number(payload[0].value))}</span></p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#2563EB"
          strokeWidth={2.5}
          fill="url(#fdGrad)"
          dot={false}
          activeDot={{ r: 5, fill: "#2563EB" }}
          isAnimationActive={true}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
