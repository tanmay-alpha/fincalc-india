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

interface Section54ChartProps {
  exemptionAllowed: number;
  taxableGainsRemaining: number;
  taxAfterExemption: number;
}

const COLORS = ["#10b981", "#3b82f6", "#ef4444"];

export default function Section54Chart({
  exemptionAllowed,
  taxableGainsRemaining,
  taxAfterExemption,
}: Section54ChartProps) {
  const netRetainedGain = Math.max(0, taxableGainsRemaining - taxAfterExemption);

  const data = [
    { name: "Tax-Exempt Capital Gain", value: exemptionAllowed },
    { name: "Taxable Gain (Post-Tax)", value: netRetainedGain },
    { name: "Tax Payable", value: taxAfterExemption },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        No capital gains data to display
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
