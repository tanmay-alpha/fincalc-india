"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Calculation {
  id: string;
  type: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  shareId: string;
  label: string | null;
  createdAt: string;
}

const calcIcons: Record<string, string> = {
  SIP: '\uD83D\uDCC8', EMI: '\uD83C\uDFE6', FD: '\uD83D\uDD12',
  PPF: '\uD83C\uDFDB\uFE0F', LUMPSUM: '\uD83D\uDCB0', TAX: '\uD83E\uDDFE',
};

const calcNames: Record<string, string> = {
  SIP: 'SIP Calculator', EMI: 'EMI Calculator',
  FD: 'FD Calculator', PPF: 'PPF Calculator',
  LUMPSUM: 'Lumpsum Calculator', TAX: 'Income Tax Calculator',
};

function formatIST(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatNum(v: unknown): string {
  const n = Number(v);
  if (isNaN(n)) return '0';
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  return n.toLocaleString('en-IN');
}

function generateLabel(type: string, inputs: Record<string, unknown>): string {
  switch (type) {
    case 'SIP':
      return `\u20B9${formatNum(inputs.monthlyAmount)}/mo \u00B7 ${inputs.annualRate}% \u00B7 ${inputs.years}yr`;
    case 'EMI':
      return `\u20B9${formatNum(inputs.principal)} \u00B7 ${inputs.annualRate}% \u00B7 ${Math.round(Number(inputs.tenureMonths) / 12)}yr`;
    case 'FD':
      return `\u20B9${formatNum(inputs.principal)} \u00B7 ${inputs.annualRate}% \u00B7 ${inputs.tenureYears}yr`;
    case 'PPF':
      return `\u20B9${formatNum(inputs.yearlyInvestment)}/yr \u00B7 ${inputs.years}yr`;
    case 'LUMPSUM':
      return `\u20B9${formatNum(inputs.principal)} \u00B7 ${inputs.annualRate}% \u00B7 ${inputs.years}yr`;
    case 'TAX':
      return `\u20B9${formatNum(inputs.grossIncome)} \u00B7 ${String(inputs.regime || 'new').toUpperCase()} Regime`;
    default:
      return type;
  }
}

const FILTER_OPTIONS = ['all', 'SIP', 'EMI', 'FD', 'PPF', 'LUMPSUM', 'TAX'] as const;

export default function HistoryClient({ calculations }: { calculations: Calculation[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [deleted, setDeleted] = useState<Set<string>>(new Set());

  const filtered = calculations
    .filter(c => !deleted.has(c.id))
    .filter(c => filter === 'all' || c.type === filter);

  const copyLink = (shareId: string) => {
    const url = `${window.location.origin}/result/${shareId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied!', { description: url });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this calculation?')) return;
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleted(prev => new Set(prev).add(id));
        toast.success('Deleted');
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Calculations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {filtered.length} saved calculation{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_OPTIONS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(calc => (
          <div
            key={calc.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center text-xl shrink-0">
              {calcIcons[calc.type] || '\uD83D\uDCCA'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-white">
                {calcNames[calc.type] || calc.type}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {generateLabel(calc.type, calc.inputs)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {formatIST(calc.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Link
                href={`/result/${calc.shareId}`}
                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                title="Open calculation"
              >
                <ExternalLink size={14} />
              </Link>
              <button
                onClick={() => copyLink(calc.shareId)}
                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                title="Copy share link"
              >
                <Share2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(calc.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
