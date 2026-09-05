"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Share2,
  Trash2,
  RotateCcw,
  ShieldAlert,
  Play,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { CALCULATOR_REGISTRY, getCalculatorById } from "@/lib/registry";
import { getCategoryIcon } from "@/components/ui/CategoryIcon";
import { prepareOpenAgain } from "@/lib/storage-workflow";
import DialogPrimitive from "@/components/ui/DialogPrimitive";
import { cn } from "@/lib/utils";

interface Calculation {
  id: string;
  type: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  isShared: boolean;
  shareId: string | null;
  label: string | null;
  createdAt: string;
}

function formatIST(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatNum(v: unknown): string {
  const n = Number(v);
  if (isNaN(n)) return "0";
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  return n.toLocaleString("en-IN");
}

function generateLabel(type: string, inputs: Record<string, unknown>): string {
  const t = type.toLowerCase();
  if (t === "sip") {
    const amt = inputs.monthlyInvestment ?? inputs.monthlyAmount ?? 0;
    const rate = inputs.expectedReturn ?? inputs.annualRate ?? 12;
    const yrs = inputs.timePeriod ?? inputs.years ?? 10;
    return `₹${formatNum(amt)}/mo · ${rate}% · ${yrs}yr`;
  }
  if (t === "emi") {
    const principal = inputs.loanAmount ?? inputs.principal ?? 0;
    const rate = inputs.interestRate ?? inputs.annualRate ?? 8.5;
    const tenure = inputs.loanTenure ?? (inputs.tenureMonths ? Math.round(Number(inputs.tenureMonths) / 12) : 20);
    return `₹${formatNum(principal)} · ${rate}% · ${tenure}yr`;
  }
  if (t === "fd") {
    const principal = inputs.principal ?? inputs.investmentAmount ?? 0;
    const rate = inputs.interestRate ?? inputs.annualRate ?? 7;
    const yrs = inputs.tenureYears ?? inputs.years ?? 5;
    return `₹${formatNum(principal)} · ${rate}% · ${yrs}yr`;
  }
  if (t === "ppf") {
    const yearly = inputs.yearlyInvestment ?? inputs.annualInvestment ?? 150000;
    return `₹${formatNum(yearly)}/yr · 15yr`;
  }
  if (t === "lumpsum") {
    const principal = inputs.totalInvestment ?? inputs.principal ?? 0;
    const rate = inputs.expectedReturn ?? inputs.annualRate ?? 12;
    const yrs = inputs.timePeriod ?? inputs.years ?? 10;
    return `₹${formatNum(principal)} · ${rate}% · ${yrs}yr`;
  }
  if (t === "tax") {
    const income = inputs.annualSalary ?? inputs.grossIncome ?? inputs.salaryIncome ?? 0;
    return `₹${formatNum(income)} · ${String(inputs.regime || "new").toUpperCase()} Regime`;
  }
  return `Saved calculation (${type})`;
}

export default function HistoryClient({
  calculations = [],
}: {
  calculations?: Calculation[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const [sharedState, setSharedState] = useState<Record<string, boolean>>({});
  const [shareIds, setShareIds] = useState<Record<string, string | null>>({});
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [calculationToDelete, setCalculationToDelete] = useState<string | null>(null);

  // Close modal on Escape
  useEffect(() => {
    if (!calculationToDelete) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCalculationToDelete(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calculationToDelete]);

  // Available unique types in user's history
  const availableTypes = Array.from(
    new Set(calculations.map((c) => c.type.toLowerCase()))
  );

  const filtered = calculations
    .filter((c) => !deleted.has(c.id))
    .filter((c) => filter === "all" || c.type.toLowerCase() === filter);

  const copyLink = (shareId: string) => {
    const url = `${window.location.origin}/result/${shareId}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard!", { description: url });
  };

  const handleOpenAgain = (calc: Calculation) => {
    const typeKey = calc.type.toLowerCase();
    const meta = getCalculatorById(typeKey);
    const queryString = prepareOpenAgain(typeKey, calc.inputs);
    const targetRoute = meta?.route || `/${typeKey}`;
    router.push(queryString ? `${targetRoute}?${queryString}` : targetRoute);
  };

  const confirmDelete = async () => {
    if (!calculationToDelete) return;
    const id = calculationToDelete;
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleted((prev) => new Set(prev).add(id));
        toast.success("Calculation deleted from your history");
      } else {
        toast.error("Failed to delete calculation");
      }
    } catch {
      toast.error("Failed to delete calculation");
    } finally {
      setCalculationToDelete(null);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}/share`, { method: "POST" });
      const json = await res.json().catch(() => null);
      const shareId = json?.data?.shareId;
      if (!res.ok || !shareId) throw new Error("Publish failed");
      setSharedState((prev) => ({ ...prev, [id]: true }));
      setShareIds((prev) => ({ ...prev, [id]: shareId }));
      copyLink(shareId);
    } catch {
      toast.error("Could not create share link");
    }
  };

  const handleUnshare = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}/share`, { method: "DELETE" });
      if (!res.ok) throw new Error("Revoke failed");
      setSharedState((prev) => ({ ...prev, [id]: false }));
      setShareIds((prev) => ({ ...prev, [id]: null }));
      toast.success("Share link revoked (now private)");
    } catch {
      toast.error("Could not revoke share link");
    }
  };

  const handleAccountDeletion = async () => {
    setIsDeletingAccount(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (res.ok) {
        toast.success("Account and associated data deleted successfully");
        window.location.href = "/";
      } else {
        toast.error("Failed to delete account. Please try again.");
        setIsDeletingAccount(false);
      }
    } catch {
      toast.error("Network error during account deletion.");
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Calculation History
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {filtered.length} saved calculation{filtered.length !== 1 ? "s" : ""} securely stored
          </p>
        </div>

        {availableTypes.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "text-xs px-3 py-1 rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                filter === "all"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All ({calculations.length})
            </button>
            {availableTypes.map((t) => {
              const meta = CALCULATOR_REGISTRY.find((c) => c.id === t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilter(t)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-lg font-medium transition-all uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    filter === t
                      ? "bg-card text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {meta?.shortName || t}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filtered.map((calc) => {
          const isShared = sharedState[calc.id] ?? calc.isShared;
          const shareId = shareIds[calc.id] ?? calc.shareId;
          const typeKey = calc.type.toLowerCase();
          const meta = getCalculatorById(typeKey);
          const Icon = getCategoryIcon(typeKey);

          return (
            <div
              key={calc.id}
              className="bg-card rounded-2xl border border-border/80 p-4 sm:p-5 shadow-sm hover:border-border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={meta?.route || `/${typeKey}`}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {meta?.name || calc.type}
                    </Link>
                    {isShared && (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Shared Link Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {calc.label || generateLabel(typeKey, calc.inputs)}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1 font-mono">
                    {formatIST(calc.createdAt)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50 w-full sm:w-auto justify-end">
                {/* Open Again button */}
                <button
                  type="button"
                  onClick={() => handleOpenAgain(calc)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  title="Load inputs into calculator"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Open Again</span>
                </button>

                {isShared && shareId ? (
                  <>
                    <Link
                      href={`/result/${shareId}`}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      title="View public result"
                      aria-label="View public result"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => copyLink(shareId)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      title="Copy public link"
                      aria-label="Copy public link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnshare(calc.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      title="Make private"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revoke</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePublish(calc.id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-muted transition flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    title="Generate private share link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setCalculationToDelete(calc.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                  title="Delete calculation"
                  aria-label="Delete calculation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accessible Confirmation Modal for Item Deletion */}
      <DialogPrimitive
        isOpen={Boolean(calculationToDelete)}
        onClose={() => setCalculationToDelete(null)}
        title="Delete Saved Calculation?"
        role="alertdialog"
        className="max-w-md p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">
            Delete Saved Calculation?
          </h3>
          <button
            onClick={() => setCalculationToDelete(null)}
            className="p-1 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to delete this saved calculation? This will remove the record and any active shared links.
        </p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setCalculationToDelete(null)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Delete Calculation
          </button>
        </div>
      </DialogPrimitive>

      {/* Account Settings & Data Privacy Section */}
      <div className="mt-12 pt-8 border-t border-border/80">
        <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">
              Data Privacy & Account Controls
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            FinCalc India stores saved calculations privately in your dedicated account space. Your financial inputs are never sold, rented, or analyzed for advertising. You can permanently delete your account and all associated saved calculations at any time.
          </p>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs font-semibold text-destructive hover:underline pt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Delete my account and erase all calculation history →
          </button>

          {/* Accessible Account Deletion Confirmation Modal */}
          <DialogPrimitive
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            title="Permanently Delete Account?"
            role="alertdialog"
            className="max-w-md p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-destructive">
                Permanently Delete Account?
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure? This action will permanently erase your user account, OAuth links, and all saved calculations from the database. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={handleAccountDeletion}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition shadow-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isDeletingAccount ? "Erasing Data..." : "Yes, Permanently Delete My Account"}
              </button>
            </div>
          </DialogPrimitive>
        </div>
      </div>
    </div>
  );
}
