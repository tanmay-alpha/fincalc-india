"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCompact, formatINR } from "@/lib/format";

interface LoanPrepaymentChartProps {
  prepayWealth: number;
  investWealth: number;
  interestSaved: number;
  originalInterest: number;
  newInterest: number;
}

export default function LoanPrepaymentChart({
  prepayWealth,
  investWealth,
  originalInterest,
  newInterest,
}: LoanPrepaymentChartProps) {
  const chartData = [
    {
      category: "Interest Cost",
      "With Prepayment": newInterest,
      "Without Prepayment": originalInterest,
    },
    {
      category: "Net Wealth at Loan End",
      "With Prepayment": prepayWealth,
      "Without Prepayment": investWealth,
    },
  ];

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 15, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis
            dataKey="category"
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
          <Bar
            dataKey="With Prepayment"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            maxBarSize={60}
          />
          <Bar
            dataKey="Without Prepayment"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
