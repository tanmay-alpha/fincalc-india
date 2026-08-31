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

interface USStockChartProps {
  stockGain: number;
  currencyGain: number;
  dividendIncome: number;
  totalTax: number;
}

export default function USStockChart({
  stockGain,
  currencyGain,
  dividendIncome,
  totalTax,
}: USStockChartProps) {
  const data = [
    {
      category: "Gains Breakdown",
      "Stock Price Appreciation": Math.max(0, stockGain),
      "USD-INR Currency Boost": Math.max(0, currencyGain),
      "Dividend Inflows": dividendIncome,
      "Indian + US Taxes Paid": totalTax,
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
          <Bar dataKey="Stock Price Appreciation" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="USD-INR Currency Boost" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Dividend Inflows" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Indian + US Taxes Paid" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
