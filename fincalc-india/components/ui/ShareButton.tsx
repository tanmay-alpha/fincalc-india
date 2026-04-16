"use client";

import { useCallback, useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

interface ShareButtonProps {
  /** Calculator type for the share URL, e.g. "sip" */
  calcType: string;
  /** Summary text shown in copied link, e.g. "₹1.16Cr" */
  resultText: string;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────

export default function ShareButton({ calcType, resultText, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareId = btoa(JSON.stringify({ type: calcType, result: resultText, ts: Date.now() }));
    const url = `${window.location.origin}/result/${encodeURIComponent(shareId)}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!", {
        description: "Share this link with anyone to show your calculation.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2500);
    }
  }, [calcType, resultText]);

  return (
    <button
      onClick={handleShare}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200",
        copied
          ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
          : "bg-white dark:bg-slate-800 border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-sm active:scale-95",
        className
      )}
    >
      {copied ? (
        <><Check className="w-4 h-4" /> Copied!</>
      ) : (
        <><Share2 className="w-4 h-4" /> Share Result</>
      )}
    </button>
  );
}
