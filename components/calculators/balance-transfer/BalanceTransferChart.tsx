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

interface BalanceTransferChartProps {
  currentInterest: number;
  newInterest: number;
  switchingCosts: number;
}

export default function BalanceTransferChart({
  currentInterest,
  newInterest,
  switchingCosts,
}: BalanceTransferChartProps) {
  const data = [
    {
      category: "Current Lender",
      "Total Interest Remaining": currentInterest,
      "Switching Fees": 0,
    },
    {
      category: "New Lender",
      "Total Interest Remaining": newInterest,
      "Switching Fees": switchingCosts,
    },
  ];

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
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
          <Bar dataKey="Total Interest Remaining" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Switching Fees" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
