"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { formatCompact, formatINR } from "@/lib/format";
import type { PayoffDataPoint } from "@/lib/math";

interface OptionPayoffChartProps {
  chartData: PayoffDataPoint[];
  underlyingPrice: number;
  breakevens: number[];
}

export default function OptionPayoffChart({
  chartData,
  underlyingPrice,
  breakevens,
}: OptionPayoffChartProps) {
  if (!chartData || chartData.length === 0) return null;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 15, right: 15, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis
            dataKey="spot"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            tickFormatter={(val: number) => `₹${val}`}
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
            formatter={(value: any) => [formatINR(Number(value)), "Combined Net P&L"]}
            labelFormatter={(label: any) => `Spot Price at Expiry: ₹${label}`}
          />

          {/* Zero P&L reference line */}
          <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth={1.5} />

          {/* Current Spot Price vertical line */}
          <ReferenceLine
            x={underlyingPrice}
            stroke="#3b82f6"
            strokeDasharray="3 3"
            label={{
              value: "Current Spot",
              fill: "#3b82f6",
              fontSize: 11,
              position: "top",
            }}
          />

          {/* Breakeven lines */}
          {breakevens.map((be, idx) => (
            <ReferenceLine
              key={`be-${idx}`}
              x={be}
              stroke="#f59e0b"
              strokeDasharray="2 2"
              label={{
                value: `BE: ₹${be}`,
                fill: "#f59e0b",
                fontSize: 10,
                position: "insideBottomRight",
              }}
            />
          ))}

          <Area
            type="monotone"
            dataKey="pnl"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#pnlGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
