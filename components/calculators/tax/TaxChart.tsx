"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TaxSlabRow } from "@/lib/math";
import { formatCompact, formatINR } from "@/lib/format";

const COLORS = {
  invested: "#2563EB",
  returns: "#16A34A",
  interest: "#DC2626",
  balance: "#7C3AED",
  corpus: "#2563EB",
};

interface Props {
  slabs: TaxSlabRow[];
}

interface ChartRow {
  slab: string;
  amount: number;
  tax: number;
  rate: number;
  color: string;
}

interface TooltipPayload {
  color?: string;
  name?: string;
  value?: number | string;
  payload?: ChartRow;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}

const slabColor = (rate: number) => {
  if (rate <= 0) return COLORS.returns;
  if (rate <= 5) return "#22C55E";
  if (rate <= 10) return "#84CC16";
  if (rate <= 15) return "#F59E0B";
  if (rate <= 20) return "#F97316";
  return COLORS.interest;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  if (!row) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-3 text-sm">
      <p className="text-slate-500 dark:text-slate-400 text-xs mb-1.5">
        {label}
      </p>
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
        <span className="text-xs">Amount in slab:</span>
        <span className="font-semibold text-xs">{formatINR(row.amount)}</span>
      </div>
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
        <span className="text-xs">Tax paid:</span>
        <span className="font-semibold text-xs">{formatINR(row.tax)}</span>
      </div>
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
        <span className="text-xs">Rate:</span>
        <span className="font-semibold text-xs">{row.rate}%</span>
      </div>
    </div>
  );
};

export default function TaxChart({ slabs }: Props) {
  const chartData: ChartRow[] = slabs.map((slab) => ({
    slab: slab.slab,
    amount: slab.amount,
    tax: slab.tax,
    rate: slab.rate,
    color: slabColor(slab.rate),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 8, right: 56, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
        />
        <YAxis
          dataKey="slab"
          type="category"
          tick={{ fontSize: 11, fill: "#64748B" }}
          tickLine={false}
          axisLine={false}
          width={82}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
        <Bar
          dataKey="tax"
          name="Tax Paid"
          radius={[0, 4, 4, 0]}
          maxBarSize={28}
          isAnimationActive={false}
        >
          {chartData.map((entry) => (
            <Cell key={entry.slab} fill={entry.color} />
          ))}
          <LabelList
            dataKey="tax"
            position="right"
            formatter={(value) => formatCompact(Number(value ?? 0))}
            className="fill-slate-600 text-xs"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
