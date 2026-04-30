"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SipYearRow } from "@/lib/math";
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
  data: SipYearRow[];
  compareData?: SipYearRow[];
  isCompareMode?: boolean;
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
        Year {label}
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

export default function SIPChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: COLORS.tick }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: COLORS.tick }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
          width={64}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} verticalAlign="bottom" />
        <Bar
          dataKey="invested"
          name="Invested"
          stackId="corpus"
          fill={COLORS.invested}
          maxBarSize={32}
          isAnimationActive={false}
        />
        <Bar
          dataKey="returns"
          name="Returns"
          stackId="corpus"
          fill={COLORS.returns}
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
