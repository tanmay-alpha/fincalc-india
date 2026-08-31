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
import type { BlackScholesGreeks } from "@/lib/math";

interface GreeksChartProps {
  callGreeks: BlackScholesGreeks;
  putGreeks: BlackScholesGreeks;
}

export default function GreeksChart({ callGreeks, putGreeks }: GreeksChartProps) {
  const data = [
    { greek: "Delta (Δ)", Call: callGreeks.delta, Put: putGreeks.delta },
    { greek: "Gamma (Γ)", Call: callGreeks.gamma * 100, Put: putGreeks.gamma * 100 },
    { greek: "Theta (θ/d)", Call: callGreeks.theta, Put: putGreeks.theta },
    { greek: "Vega (ν)", Call: callGreeks.vega, Put: putGreeks.vega },
  ];

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="greek" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "0.75rem",
              fontSize: "0.75rem",
              color: "#fff",
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }}
          />
          <Bar dataKey="Call" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Put" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
