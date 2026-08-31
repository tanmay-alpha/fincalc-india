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

interface LrsTcsChartProps {
  remittanceAmount: number;
  tcsDeducted: number;
}

const COLORS = ["#3b82f6", "#f59e0b"];

export default function LrsTcsChart({
  remittanceAmount,
  tcsDeducted,
}: LrsTcsChartProps) {
  const data = [
    { name: "Net Remittance to Foreign Account", value: remittanceAmount },
    ...(tcsDeducted > 0 ? [{ name: "TCS Upfront Deduction (Claimable)", value: tcsDeducted }] : []),
  ];

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        No remittance data
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
