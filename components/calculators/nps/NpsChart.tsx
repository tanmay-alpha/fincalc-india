"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { formatCompact, formatINR } from "@/lib/format";
import type { NPSYearRow } from "@/lib/math";

interface NpsChartProps {
  yearlyProgression: NPSYearRow[];
}

export default function NpsChart({ yearlyProgression }: NpsChartProps) {
  const data = yearlyProgression.map((r) => ({
    name: `Age ${r.age}`,
    "Total Invested": r.totalInvested,
    "Accumulated Corpus": r.accumulatedCorpus,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        No progression data
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="npsCorpus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="npsInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            tickFormatter={(val) => formatCompact(val)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "0.75rem",
              fontSize: "0.75rem",
              color: "#fff",
            }}
            formatter={(value: any) => [formatINR(Number(value) || 0), ""]}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }}
          />
          <Area
            type="monotone"
            dataKey="Accumulated Corpus"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#npsCorpus)"
          />
          <Area
            type="monotone"
            dataKey="Total Invested"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#npsInvested)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
