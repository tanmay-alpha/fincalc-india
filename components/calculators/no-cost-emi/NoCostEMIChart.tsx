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

interface NoCostEMIChartProps {
  productPrice: number;
  totalCostUpfront: number;
  hiddenGst: number;
  processingFeeWithGst: number;
}

export default function NoCostEMIChart({
  productPrice,
  totalCostUpfront,
  hiddenGst,
  processingFeeWithGst,
}: NoCostEMIChartProps) {
  const chartData = [
    {
      name: "Upfront Cash/Card",
      "Base Price": totalCostUpfront,
      "Hidden GST (18%)": 0,
      "Processing Fee": 0,
    },
    {
      name: "No-Cost EMI",
      "Base Price": productPrice,
      "Hidden GST (18%)": hiddenGst,
      "Processing Fee": processingFeeWithGst,
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
            dataKey="name"
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
            dataKey="Base Price"
            stackId="a"
            fill="#3b82f6"
            radius={[0, 0, 0, 0]}
            maxBarSize={50}
          />
          <Bar
            dataKey="Hidden GST (18%)"
            stackId="a"
            fill="#f59e0b"
            radius={[0, 0, 0, 0]}
            maxBarSize={50}
          />
          <Bar
            dataKey="Processing Fee"
            stackId="a"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
