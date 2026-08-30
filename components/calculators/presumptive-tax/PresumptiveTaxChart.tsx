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

interface PresumptiveTaxChartProps {
  presumptiveIncome: number;
  presumptiveTax: number;
  actualProfit: number;
  actualTax: number;
}

export default function PresumptiveTaxChart({
  presumptiveIncome,
  presumptiveTax,
  actualProfit,
  actualTax,
}: PresumptiveTaxChartProps) {
  const data = [
    {
      name: "Presumptive Scheme",
      "Net Income": Math.max(0, presumptiveIncome - presumptiveTax),
      "Tax Payable": presumptiveTax,
    },
    {
      name: "Actual Books / Audit",
      "Net Income": Math.max(0, actualProfit - actualTax),
      "Tax Payable": actualTax,
    },
  ];

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgb(15 23 42 / 0.95)",
              border: "1px solid rgb(51 65 85)",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              color: "#f8fafc",
            }}
            formatter={(val: any) => [formatINR(Number(val)), ""]}
          />
          <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
          <Bar dataKey="Net Income" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
          <Bar dataKey="Tax Payable" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
