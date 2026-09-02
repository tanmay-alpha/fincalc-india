"use client";

import { ResponsiveContainer, Sankey, Tooltip } from "recharts";
import type { CtcInHandOutput } from "@/lib/math";
import { formatCompact } from "@/lib/format";

export default function CTCFlowChart({ result }: { result: CtcInHandOutput }) {
  const data = {
    nodes: ["CTC", "Cash salary", "Employer PF", "Gratuity", "Employee PF", "Tax", "In hand"].map((name) => ({ name })),
    links: [
      { source: 0, target: 1, value: result.salaryCash }, { source: 0, target: 2, value: result.employerPfContribution },
      { source: 0, target: 3, value: result.gratuity }, { source: 1, target: 4, value: result.employeePfDeduction },
      { source: 1, target: 5, value: result.taxDeducted }, { source: 1, target: 6, value: result.annualInHand },
    ].filter((link) => link.value > 0),
  };
  return <ResponsiveContainer width="100%" height="100%"><Sankey data={data} nodePadding={24} nodeWidth={12} link={{ stroke: "#60a5fa" }}><Tooltip formatter={(v) => formatCompact(Number(v))} /></Sankey></ResponsiveContainer>;
}
