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

interface DuPontChartProps {
  netProfitMargin: number;
  assetTurnover: number;
  financialLeverage: number;
}

export default function DuPontChart({
  netProfitMargin,
  assetTurnover,
  financialLeverage,
}: DuPontChartProps) {
  const data = [
    {
      driver: "Margin (%)",
      value: netProfitMargin,
      description: "Operating Efficiency",
    },
    {
      driver: "Turnover (x)",
      value: assetTurnover * 10, // scaled for visual comparison
      description: "Asset Utilization",
    },
    {
      driver: "Leverage (x)",
      value: financialLeverage * 5, // scaled for visual comparison
      description: "Financial Gearing",
    },
  ];

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="driver" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "0.75rem",
              fontSize: "0.75rem",
              color: "#fff",
            }}
            formatter={(_: any, __: any, props: any) => [
              props.payload.driver.includes("(x)")
                ? `${(props.payload.value / (props.payload.driver.includes("Turnover") ? 10 : 5)).toFixed(2)}x`
                : `${props.payload.value}%`,
              props.payload.description,
            ]}
          />
          <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
