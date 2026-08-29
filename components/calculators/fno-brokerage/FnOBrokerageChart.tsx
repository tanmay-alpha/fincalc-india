"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCompact, formatINR } from "@/lib/format";

interface FnOBrokerageChartProps {
  grossPnl: number;
  totalCharges: number;
  netPnl: number;
  charges: {
    brokerage: number;
    stt: number;
    exchangeCharges: number;
    gst: number;
    sebiFees: number;
    stampDuty: number;
  };
}

export default function FnOBrokerageChart({
  grossPnl,
  totalCharges,
  netPnl,
  charges,
}: FnOBrokerageChartProps) {
  const pnlComparisonData = [
    {
      name: "Trade Outcome",
      "Gross P&L": grossPnl,
      "Statutory Charges": -totalCharges,
      "Net P&L (In Pocket)": netPnl,
    },
  ];

  const chargeBreakdownData = [
    { name: "Brokerage", value: charges.brokerage, fill: "#3b82f6" },
    { name: "STT (Govt)", value: charges.stt, fill: "#f59e0b" },
    { name: "Exchange Fee", value: charges.exchangeCharges, fill: "#8b5cf6" },
    { name: "GST (18%)", value: charges.gst, fill: "#ef4444" },
    { name: "Stamp Duty", value: charges.stampDuty, fill: "#06b6d4" },
    { name: "SEBI Fee", value: charges.sebiFees, fill: "#64748b" },
  ].filter((d) => d.value > 0);

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={pnlComparisonData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
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
              formatter={(value: any) => [formatINR(Number(value)), ""]}
            />
            <Legend wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }} />
            <Bar dataKey="Gross P&L" fill="#3b82f6" maxBarSize={45} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Statutory Charges" fill="#ef4444" maxBarSize={45} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Net P&L (In Pocket)" fill="#10b981" maxBarSize={45} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Charge breakdown mini bar summary */}
      <div className="pt-2 border-t border-border space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Itemized Charges Breakdown
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {chargeBreakdownData.map((c) => (
            <div key={c.name} className="p-2 rounded-lg bg-muted/40 border border-border">
              <span className="text-[11px] text-muted-foreground block">{c.name}</span>
              <span className="font-semibold text-foreground">₹{c.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
