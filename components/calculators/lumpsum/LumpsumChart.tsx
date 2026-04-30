"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LumpsumGrowthPoint } from "@/lib/math";
import { formatCompact, formatINR } from "@/lib/format";

const COLORS = {
  invested: "#2563EB",
  returns: "#16A34A",
  interest: "#DC2626",
  balance: "#7C3AED",
  corpus: "#2563EB",
};

const FD_RATE = 0.04;

interface Props {
  data: LumpsumGrowthPoint[];
  principal: number;
}

interface TooltipPayload {
  color?: string;
  name?: string;
  value?: number | string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-3 text-sm">
      <p className="text-slate-500 dark:text-slate-400 text-xs mb-1.5">
        Year {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-xs">{p.name}:</span>
          <span className="font-semibold text-xs">
            {formatINR(Number(p.value ?? 0))}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function LumpsumChart({ data, principal }: Props) {
  const chartData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        fdComparison: Math.round(principal * Math.pow(1 + FD_RATE, item.year)),
      })),
    [data, principal]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="lumpsumGrowthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.corpus} stopOpacity={0.28} />
            <stop offset="95%" stopColor={COLORS.corpus} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="lumpsumFdGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.14} />
            <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `Yr ${v}`}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
          width={64}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} verticalAlign="bottom" />
        <Area
          type="monotone"
          dataKey="fdComparison"
          name="4% FD Comparison"
          stroke="#94A3B8"
          strokeWidth={1.8}
          strokeDasharray="4 4"
          fill="url(#lumpsumFdGradient)"
          dot={false}
          activeDot={{ r: 3, fill: "#94A3B8" }}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="value"
          name="Wealth Growth"
          stroke={COLORS.corpus}
          strokeWidth={2.5}
          fill="url(#lumpsumGrowthGradient)"
          dot={false}
          activeDot={{ r: 4, fill: COLORS.corpus }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
