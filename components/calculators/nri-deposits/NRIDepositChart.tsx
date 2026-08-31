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
import type { SingleNRIDepositResult } from "@/lib/math";

interface NRIDepositChartProps {
  nreResult: SingleNRIDepositResult;
  nroResult: SingleNRIDepositResult;
  fcnrResult: SingleNRIDepositResult;
}

export default function NRIDepositChart({
  nreResult,
  nroResult,
  fcnrResult,
}: NRIDepositChartProps) {
  const data = [
    {
      name: "NRE Deposit",
      "Principal Amount": nreResult.principal,
      "Post-Tax Interest": nreResult.effectivePostTaxInterest,
      "TDS Deducted": nreResult.taxDeducted,
    },
    {
      name: "NRO Deposit",
      "Principal Amount": nroResult.principal,
      "Post-Tax Interest": nroResult.effectivePostTaxInterest,
      "TDS Deducted": nroResult.taxDeducted,
    },
    {
      name: "FCNR Deposit",
      "Principal Amount": fcnrResult.principal,
      "Post-Tax Interest": fcnrResult.effectivePostTaxInterest,
      "TDS Deducted": fcnrResult.taxDeducted,
    },
  ];

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
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
          <Bar dataKey="Principal Amount" fill="#6366f1" stackId="a" />
          <Bar dataKey="Post-Tax Interest" fill="#10b981" stackId="a" />
          <Bar dataKey="TDS Deducted" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
