"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FdGrowthPoint } from "@/lib/math";
import { formatCompact, formatINR } from "@/lib/format";

const COLORS = {
  invested: "#2563EB",
  returns: "#16A34A",
  interest: "#DC2626",
  balance: "#7C3AED",
  corpus: "#2563EB",
};

interface Props {
  data: FdGrowthPoint[];
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
        {label}
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

export default function FDChart({ data }: Props) {
  const principal = data[0]?.amount ?? 0;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fdGrowthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.corpus} stopOpacity={0.28} />
            <stop offset="95%" stopColor={COLORS.corpus} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
          minTickGap={14}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
          width={64}
        />
        {principal > 0 && (
          <ReferenceLine
            y={principal}
            stroke="#64748B"
            strokeDasharray="4 4"
            label={{ value: "Principal", fill: "#64748B", fontSize: 11, position: "insideTopRight" }}
          />
        )}
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="amount"
          name="Maturity Amount"
          stroke={COLORS.corpus}
          strokeWidth={2.5}
          fill="url(#fdGrowthGradient)"
          dot={false}
          activeDot={{ r: 4, fill: COLORS.corpus }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
