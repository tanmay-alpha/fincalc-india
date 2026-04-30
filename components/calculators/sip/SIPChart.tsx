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
  invested: "#2563EB",
  returns: "#16A34A",
  interest: "#DC2626",
  balance: "#7C3AED",
  corpus: "#2563EB",
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

export default function SIPChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748B" }}
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
