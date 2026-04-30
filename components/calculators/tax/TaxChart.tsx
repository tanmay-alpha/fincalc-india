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
  invested: "rgb(var(--chart-1))",
  returns: "rgb(var(--chart-2))",
  interest: "rgb(var(--destructive))",
  balance: "rgb(var(--chart-5))",
  corpus: "rgb(var(--primary))",
  grid: "rgb(var(--border))",
  tick: "rgb(var(--muted-foreground))",
  warning: "rgb(var(--warning))",
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
  if (rate <= 5) return "rgb(var(--success))";
  if (rate <= 10) return "rgb(var(--chart-3))";
  if (rate <= 15) return COLORS.warning;
  if (rate <= 20) return "rgb(var(--chart-4))";
  return COLORS.interest;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  if (!row) return null;

  return (
    <div className="rounded-xl border border-border bg-popover p-3 text-sm text-popover-foreground shadow-card">
      <p className="mb-1.5 text-xs text-muted-foreground">
        {label}
      </p>
      <div className="flex items-center gap-2 text-popover-foreground">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
        <span className="text-xs">Amount in slab:</span>
        <span className="font-semibold text-xs">{formatINR(row.amount)}</span>
      </div>
      <div className="flex items-center gap-2 text-popover-foreground">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
        <span className="text-xs">Tax paid:</span>
        <span className="font-semibold text-xs">{formatINR(row.tax)}</span>
      </div>
      <div className="flex items-center gap-2 text-popover-foreground">
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
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: COLORS.tick }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
        />
        <YAxis
          dataKey="slab"
          type="category"
          tick={{ fontSize: 11, fill: COLORS.tick }}
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
            className="fill-muted-foreground text-xs"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
