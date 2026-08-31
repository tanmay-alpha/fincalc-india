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
import type { CarTCOYearRow } from "@/lib/math";

interface CarTcoChartProps {
  yearlyBreakdown: CarTCOYearRow[];
}

export default function CarTcoChart({ yearlyBreakdown }: CarTcoChartProps) {
  const data = yearlyBreakdown.map((r) => ({
    name: `Year ${r.year}`,
    "Loan EMI": r.loanEmiPaid,
    "Fuel Cost": r.fuelCost,
    "Insurance & Maintenance": r.insuranceCost + r.maintenanceCost,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        No TCO data to display
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
          <Bar dataKey="Loan EMI" fill="#6366f1" stackId="a" />
          <Bar dataKey="Fuel Cost" fill="#f59e0b" stackId="a" />
          <Bar dataKey="Insurance & Maintenance" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
