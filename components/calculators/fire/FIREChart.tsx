"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { FireTimelinePoint } from "@/lib/math";
import { formatCompact, formatINR } from "@/lib/format";

interface FIREChartProps {
  timeline: FireTimelinePoint[];
  retirementAge: number;
}

export default function FIREChart({ timeline }: FIREChartProps) {
  const chartData = timeline.map((pt) => ({
    age: `Age ${pt.age}`,
    "Net Corpus": pt.corpus,
    "Annual Expenses": pt.annualExpenses,
    Phase: pt.phase === "accumulation" ? "Accumulation" : "Retirement",
  }));

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 15, right: 15, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="corpusGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis
            dataKey="age"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            interval={Math.max(1, Math.floor(timeline.length / 8))}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            tickFormatter={(val: number) => formatCompact(val).replace("₹", "")}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgb(15 23 42 / 0.95)",
              border: "1px solid rgb(51 65 85)",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              color: "#f8fafc",
            }}
            formatter={(value: any) => [formatINR(Number(value)), ""]}
          />
          <Legend
            wrapperStyle={{ paddingTop: "12px", fontSize: "13px" }}
          />
          <Area
            type="monotone"
            dataKey="Net Corpus"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#corpusGradient)"
          />
          <Area
            type="monotone"
            dataKey="Annual Expenses"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#expenseGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
