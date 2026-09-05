"use client";

import { useState, useEffect } from "react";
import { Info, X, ExternalLink, ShieldCheck } from "lucide-react";
import { RegulatoryMetadata } from "@/lib/calculator-contracts";

interface AssumptionsDrawerProps {
  calcName: string;
  metadata?: RegulatoryMetadata;
  assumptions?: string[];
  sources?: Array<{ label: string; url: string }>;
}

export default function AssumptionsDrawer({
  calcName,
  metadata,
  assumptions,
  sources,
}: AssumptionsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard Escape listener & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // If no metadata or assumptions, don't show the trigger
  if (!metadata && (!assumptions || assumptions.length === 0) && (!sources || sources.length === 0)) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Info className="w-3.5 h-3.5" />
        <span className="underline underline-offset-2">View assumptions & statutory sources</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Assumptions & Sources for ${calcName}`}
        >
          <div
            className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">
                  Assumptions & Statutory Basis
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 py-4 space-y-4 text-xs">
              {metadata && (
                <div className="bg-muted/40 p-3.5 rounded-lg border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Tax / Assessment Year:</span>
                    <span className="font-bold text-primary tabular-nums">{metadata.taxYear || "2026–27"}</span>
                  </div>
                  {metadata.currentAct && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Applicable Statute:</span>
                      <span className="text-foreground/90">{metadata.currentAct}</span>
                    </div>
                  )}
                  {metadata.currentSections && metadata.currentSections.length > 0 && (
                    <div>
                      <span className="font-semibold text-foreground block mb-1">
                        Governing Provisions:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {metadata.currentSections.map((sec, idx) => (
                          <span
                            key={idx}
                            className="bg-card border border-border px-2 py-0.5 rounded text-[11px] font-mono text-foreground"
                          >
                            {sec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {metadata.effectiveFrom && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Effective Date:</span>
                      <span className="text-foreground/90">{metadata.effectiveFrom}</span>
                    </div>
                  )}
                </div>
              )}

              {assumptions && assumptions.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-foreground uppercase tracking-wider text-[11px] text-muted-foreground">
                    Model Assumptions
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground leading-relaxed">
                    {assumptions.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {((sources && sources.length > 0) || (metadata?.officialSources && metadata.officialSources.length > 0)) && (
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <h4 className="font-semibold text-foreground uppercase tracking-wider text-[11px] text-muted-foreground">
                    Official Reference Sources
                  </h4>
                  <div className="space-y-1.5">
                    {sources?.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-primary hover:underline text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{s.label}</span>
                      </a>
                    ))}
                    {metadata?.officialSources?.map((src, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-muted-foreground flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{src}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                <strong>Disclaimer:</strong> FinCalc India provides calculations for informational and planning purposes only. It does not constitute formal legal, tax, or investment advisory. Verify complex filings with a licensed professional.
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-border flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
