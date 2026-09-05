"use client";

/**
 * PdfExportButton — Downloads a PDF summary of the current calculation.
 * Wraps jsPDF + lib/calculation-pdf.ts with a consistent button UI.
 */
import { useCallback, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { generateCalculationPdf } from "@/lib/calculation-pdf";
import type { PdfExportOptions } from "@/lib/calculation-pdf";

interface PdfExportButtonProps extends PdfExportOptions {
  filename: string;
}

export default function PdfExportButton({ filename, ...options }: PdfExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);
    try {
      const doc = generateCalculationPdf(options);
      doc.save(`${filename}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setLoading(false);
    }
  }, [options, filename]);

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      aria-label="Download calculation as PDF"
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Download PDF
    </button>
  );
}
