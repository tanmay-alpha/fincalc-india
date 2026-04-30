"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PpfYearRow } from "@/lib/math";
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
  data: PpfYearRow[];
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
        {label}
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

export default function PPFChart({ data }: Props) {
  const chartData = data.map((row) => ({
    year: row.year,
    deposit: row.deposit,
    interest: row.interest,
    balance: row.balance,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: COLORS.tick }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `Yr ${v}`}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: COLORS.tick }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
          width={64}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11, fill: COLORS.tick }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
          width={64}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} verticalAlign="bottom" />
        <Bar
          yAxisId="left"
          dataKey="deposit"
          name="Deposit"
          stackId="ppf"
          fill={COLORS.invested}
          maxBarSize={28}
          isAnimationActive={false}
        />
        <Bar
          yAxisId="left"
          dataKey="interest"
          name="Interest"
          stackId="ppf"
          fill={COLORS.returns}
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
          isAnimationActive={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="balance"
          name="Balance"
          stroke={COLORS.balance}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: COLORS.balance }}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
