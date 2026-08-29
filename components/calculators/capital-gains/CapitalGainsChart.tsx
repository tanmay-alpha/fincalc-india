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

interface CapitalGainsChartProps {
  purchasePrice: number;
  taxableGain: number;
  totalTaxPayable: number;
  netInPocket: number;
}

const COLORS = ["#3b82f6", "#10b981", "#ef4444"];

export default function CapitalGainsChart({
  purchasePrice,
  totalTaxPayable,
  netInPocket,
}: CapitalGainsChartProps) {
  const data = [
    { name: "Original Investment", value: purchasePrice },
    { name: "Net Profit (Post-Tax)", value: Math.max(0, netInPocket - purchasePrice) },
    { name: "Tax Payable", value: totalTaxPayable },
  ].filter((d) => d.value > 0);

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
          <Legend
            wrapperStyle={{ paddingTop: "12px", fontSize: "13px" }}
            formatter={(value: string) => (
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
