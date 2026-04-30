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
  invested: "rgb(var(--chart-1))",
  returns: "rgb(var(--chart-2))",
  interest: "rgb(var(--destructive))",
  balance: "rgb(var(--chart-5))",
  corpus: "rgb(var(--primary))",
  grid: "rgb(var(--border))",
  tick: "rgb(var(--muted-foreground))",
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
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-700 dark:text-slate-300 shadow-[var(--shadow-card)]">
      <p className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
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
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: COLORS.tick }}
          tickLine={false}
          axisLine={false}
          minTickGap={14}
        />
        <YAxis
          tick={{ fontSize: 11, fill: COLORS.tick }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
          width={64}
        />
        {principal > 0 && (
          <ReferenceLine
            y={principal}
            stroke={COLORS.tick}
            strokeDasharray="4 4"
            label={{ value: "Principal", fill: COLORS.tick, fontSize: 11, position: "insideTopRight" }}
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
