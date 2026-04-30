"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReactNode } from "react";
import type { EmiAmortizationRow } from "@/lib/math";
import { formatCompact, formatINR } from "@/lib/format";

const COLORS = {
  invested: "rgb(var(--chart-1))",
  returns: "rgb(var(--chart-2))",
  interest: "rgb(var(--destructive))",
  balance: "rgb(var(--chart-5))",
  corpus: "rgb(var(--primary))",
  grid: "rgb(var(--border))",
  tick: "rgb(var(--muted-foreground))",
};

interface PieProps {
  principal: number;
  totalInterest: number;
}

interface AreaProps {
  schedule: EmiAmortizationRow[];
}

interface TooltipPayload {
  color?: string;
  name?: string;
  value?: number | string;
  payload?: Record<string, unknown>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}

interface PieLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-700 dark:text-slate-300 shadow-[var(--shadow-card)]">
      <p className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-xs">{p.name}:</span>
          <span className="font-semibold text-xs">
            {formatINR(Number(p.value ?? 0))}
          </span>
        </div>
      ))}
    </div>
  );
};

const RADIAN = Math.PI / 180;

const renderPieLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: PieLabelProps): ReactNode => {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={700}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

function getYearlyBalance(schedule: EmiAmortizationRow[]) {
  const yearly = schedule.filter((row) => row.month % 12 === 0);
  const last = schedule[schedule.length - 1];
  if (last && !yearly.some((row) => row.month === last.month)) {
    yearly.push(last);
  }

  return yearly.map((row) => ({
    year: Math.ceil(row.month / 12),
    balance: row.balance,
  }));
}

export function EMIPieChart({ principal, totalInterest }: PieProps) {
  const data = [
    { name: "Principal", value: Math.round(principal), color: COLORS.invested },
    { name: "Interest", value: Math.round(totalInterest), color: COLORS.interest },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="48%"
          outerRadius="78%"
          labelLine={false}
          label={renderPieLabel}
          paddingAngle={2}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground text-sm font-semibold"
        >
          Loan
        </text>
        <text
          x="50%"
          y="56%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-muted-foreground text-xs"
        >
          Breakup
        </text>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function EMIBalanceChart({ schedule }: AreaProps) {
  const data = getYearlyBalance(schedule);
  const first = schedule[0];
  const initialPrincipal = first ? first.balance + first.principal : 0;
  const halfway = initialPrincipal / 2;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="emiBalanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.balance} stopOpacity={0.28} />
            <stop offset="95%" stopColor={COLORS.balance} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: COLORS.tick }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `Yr ${v}`}
        />
        <YAxis
          tick={{ fontSize: 11, fill: COLORS.tick }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
          width={64}
        />
        {halfway > 0 && (
          <ReferenceLine
            y={halfway}
            stroke={COLORS.tick}
            strokeDasharray="4 4"
            label={{ value: "50% mark", fill: COLORS.tick, fontSize: 11, position: "insideTopRight" }}
          />
        )}
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="balance"
          name="Remaining Balance"
          stroke={COLORS.balance}
          strokeWidth={2.5}
          fill="url(#emiBalanceGradient)"
          dot={false}
          activeDot={{ r: 4, fill: COLORS.balance }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function EMIChart({
  principal,
  totalInterest,
  schedule,
}: PieProps & AreaProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="h-[260px]">
        <EMIPieChart principal={principal} totalInterest={totalInterest} />
      </div>
      <div className="h-[260px]">
        <EMIBalanceChart schedule={schedule} />
      </div>
    </div>
  );
}
