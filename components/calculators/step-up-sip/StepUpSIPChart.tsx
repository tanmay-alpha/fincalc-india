"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { StepUpSipYearRow } from "@/lib/math";
import { formatCompact, formatINR } from "@/lib/format";

interface StepUpSIPChartProps {
  data: StepUpSipYearRow[];
}

export default function StepUpSIPChart({ data }: StepUpSIPChartProps) {
  const chartData = data.map((d) => ({
    year: `Yr ${d.year}`,
    "Step-Up Corpus": d.corpus,
    "Flat SIP Corpus": d.flatCorpus,
    "Total Invested": d.totalInvested,
  }));

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis
            dataKey="year"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
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
          <Line
            type="monotone"
            dataKey="Step-Up Corpus"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 3, fill: "#3b82f6" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Flat SIP Corpus"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 2, fill: "#10b981" }}
          />
          <Line
            type="monotone"
            dataKey="Total Invested"
            stroke="#94a3b8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
