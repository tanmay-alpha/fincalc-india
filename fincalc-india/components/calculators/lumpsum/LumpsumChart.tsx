"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import type { LumpsumGrowthPoint } from "@/lib/math";
import { formatCompact, formatINR } from "@/lib/format";

interface Props {
  data: LumpsumGrowthPoint[];
  principal: number;
}

export default function LumpsumChart({ data, principal }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="lumpsumGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          width={60}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const val = Number(payload[0].value);
            const gain = val - principal;
            return (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 text-xs space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-200">Year {label}</p>
                <p className="text-slate-500 dark:text-slate-400">Value: <span className="font-semibold text-slate-800 dark:text-slate-100">{formatINR(val)}</span></p>
                <p className="text-green-600 dark:text-green-400 font-medium">+{formatINR(gain)} returns</p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#2563EB"
          strokeWidth={2.5}
          fill="url(#lumpsumGrad)"
          dot={false}
          activeDot={{ r: 5, fill: "#2563EB" }}
          isAnimationActive={true}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
