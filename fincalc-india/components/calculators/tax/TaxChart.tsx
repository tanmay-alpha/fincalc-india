"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { TaxSlabRow } from "@/lib/math";
import { formatINR, formatCompact } from "@/lib/format";

interface Props {
  slabs: TaxSlabRow[];
}

const SLAB_COLORS = [
  "#10B981", // 0% green
  "#3B82F6", // 5% blue
  "#F59E0B", // 10% amber
  "#F97316", // 15% orange
  "#EF4444", // 20% red
  "#DC2626", // 30% deep red
];

export default function TaxChart({ slabs }: Props) {
  const chartData = slabs.map((s, i) => ({
    slab: s.slab,
    tax: s.tax,
    amount: s.amount,
    rate: s.rate,
    color: SLAB_COLORS[i % SLAB_COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
        />
        <YAxis
          dataKey="slab"
          type="category"
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 text-xs space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-200">{d.slab} ({d.rate}%)</p>
                <p className="text-slate-500 dark:text-slate-400">Taxable: <span className="font-semibold text-slate-800 dark:text-slate-100">{formatINR(d.amount)}</span></p>
                <p className="text-red-600 dark:text-red-400 font-medium">Tax: {formatINR(d.tax)}</p>
              </div>
            );
          }}
        />
        <Bar
          dataKey="tax"
          maxBarSize={24}
          radius={[0, 4, 4, 0]}
          isAnimationActive={true}
          animationDuration={800}
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
