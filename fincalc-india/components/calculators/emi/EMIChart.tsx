"use client";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import type { EmiAmortizationRow } from "@/lib/math";
import { formatINR, formatCompact } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────

interface PieProps {
  principal: number;
  totalInterest: number;
}

interface AreaProps {
  schedule: EmiAmortizationRow[];
}

const PIE_COLORS = ["#2563EB", "#DC2626"];

// ─── Pie Chart (Principal vs Interest) ────────────────────────

export function EMIPieChart({ principal, totalInterest }: PieProps) {
  const data = [
    { name: "Principal", value: Math.round(principal), fill: PIE_COLORS[0] },
    { name: "Interest", value: Math.round(totalInterest), fill: PIE_COLORS[1] },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
          isAnimationActive={true}
          animationDuration={800}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const item = payload[0];
            return (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.payload.fill }} />
                  <span className="text-slate-500 dark:text-slate-400">{item.name}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{formatINR(Number(item.value))}</span>
                </div>
              </div>
            );
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Area Chart (Balance over time) ───────────────────────────

export function EMIBalanceChart({ schedule }: AreaProps) {
  // Sample every Nth row to keep chart clean
  const every = Math.max(1, Math.floor(schedule.length / 24));
  const filtered = schedule.filter((_, i) => i % every === 0 || i === schedule.length - 1);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={filtered} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="emiBalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `M${v}`}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
          width={60}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Month {label}</p>
                <p className="text-slate-500 dark:text-slate-400">Balance: <span className="font-semibold text-slate-800 dark:text-slate-100">{formatINR(Number(payload[0].value))}</span></p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#2563EB"
          strokeWidth={2}
          fill="url(#emiBalGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#2563EB" }}
          isAnimationActive={true}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
