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
  invested: "rgb(var(--chart-1))",
  returns: "rgb(var(--chart-2))",
  interest: "rgb(var(--destructive))",
  balance: "rgb(var(--chart-5))",
  corpus: "rgb(var(--primary))",
  grid: "rgb(var(--border))",
  tick: "rgb(var(--muted-foreground))",
  comparison: "rgb(var(--muted-foreground))",
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
    <div className="rounded-xl border border-border bg-popover p-3 text-sm text-popover-foreground shadow-card">
      <p className="mb-1.5 text-xs text-muted-foreground">
        Year {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-popover-foreground">
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
            <stop offset="0%" stopColor={COLORS.comparison} stopOpacity={0.14} />
            <stop offset="95%" stopColor={COLORS.comparison} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: COLORS.tick }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `Yr ${v}`}
        />
        <YAxis
          tick={{ fontSize: 11, fill: COLORS.tick }}
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
          stroke={COLORS.comparison}
          strokeWidth={1.8}
          strokeDasharray="4 4"
          fill="url(#lumpsumFdGradient)"
          dot={false}
          activeDot={{ r: 3, fill: COLORS.comparison }}
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
