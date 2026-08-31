"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { formatINR } from "@/lib/format";

interface WaccChartProps {
  equityValue: number;
  debtValue: number;
  weightOfEquity: number;
  weightOfDebt: number;
}

const COLORS = ["#6366f1", "#f59e0b"];

export default function WaccChart({
  equityValue,
  debtValue,
  weightOfEquity,
  weightOfDebt,
}: WaccChartProps) {
  const data = [
    { name: `Equity (${weightOfEquity}%)`, value: equityValue },
    { name: `Debt (${weightOfDebt}%)`, value: debtValue },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        No capital structure data
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
