"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { formatINR } from "@/lib/format";
import type { XirrCashflow } from "@/lib/math";

interface XirrChartProps {
  cashflows: XirrCashflow[];
}

export default function XirrChart({ cashflows }: XirrChartProps) {
  const data = cashflows.map((cf, idx) => ({
    name: cf.date || `Entry ${idx + 1}`,
    Inflows: cf.amount > 0 ? cf.amount : 0,
    Investments: cf.amount < 0 ? Math.abs(cf.amount) : 0,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        No cash flow transactions to display
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
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
          <Bar dataKey="Investments" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Inflows" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
