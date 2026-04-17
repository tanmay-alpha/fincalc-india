"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { PpfYearRow } from "@/lib/math";
import { formatCompact, formatINR } from "@/lib/format";

interface Props {
  data: PpfYearRow[];
}

export default function PPFChart({ data }: Props) {
  // Build chart data: deposit vs interest per year
  const chartData = data.map((row) => ({
    year: `Yr ${row.year}`,
    deposit: row.deposit,
    interest: row.interest,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
          width={60}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
                {payload.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 py-0.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{formatINR(Number(p.value))}</span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
        <Bar
          dataKey="deposit"
          name="Deposit"
          stackId="a"
          fill="#2563EB"
          maxBarSize={20}
          isAnimationActive={true}
          animationDuration={800}
        />
        <Bar
          dataKey="interest"
          name="Interest"
          stackId="a"
          fill="#16A34A"
          radius={[3, 3, 0, 0]}
          maxBarSize={20}
          isAnimationActive={true}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
