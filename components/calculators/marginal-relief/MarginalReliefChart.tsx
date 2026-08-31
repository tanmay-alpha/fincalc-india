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

interface MarginalReliefChartProps {
  baseTax: number;
  netSurcharge: number;
  cess: number;
  marginalReliefSaved: number;
}

export default function MarginalReliefChart({
  baseTax,
  netSurcharge,
  cess,
  marginalReliefSaved,
}: MarginalReliefChartProps) {
  const data = [
    {
      category: "Tax Breakdown",
      "Base Slab Tax": baseTax,
      "Net Surcharge": netSurcharge,
      "4% Health & Ed Cess": cess,
    },
    ...(marginalReliefSaved > 0
      ? [
          {
            category: "Relief Saved",
            "Base Slab Tax": 0,
            "Net Surcharge": marginalReliefSaved,
            "4% Health & Ed Cess": 0,
          },
        ]
      : []),
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
          <Bar dataKey="Base Slab Tax" fill="#3b82f6" stackId="a" />
          <Bar dataKey="Net Surcharge" fill="#f59e0b" stackId="a" />
          <Bar dataKey="4% Health & Ed Cess" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
