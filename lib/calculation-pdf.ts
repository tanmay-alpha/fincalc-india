/**
 * Calculation PDF Summary Generator
 *
 * Generates clean, downloadable calculation summary sheets with statutory branding,
 * input breakdown, output results, and legal disclaimers.
 */

import { jsPDF } from "jspdf";

export interface PdfExportItem {
  label: string;
  value: string | number;
}

export interface PdfExportOptions {
  calculatorTitle: string;
  calculatorRoute: string;
  statutoryReference?: string;
  taxYear?: string;
  inputs: PdfExportItem[];
  results: PdfExportItem[];
  summaryText?: string;
  notes?: string[];
}

export function generateCalculationPdf(options: PdfExportOptions): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setDocumentProperties({
    title: `${options.calculatorTitle} - FinCalc India Calculation Summary`,
    subject: options.statutoryReference || `${options.calculatorTitle} summary`,
    author: "FinCalc India (fincalc-india.in)",
    keywords: `fincalc, india, tax, finance, ${options.calculatorTitle.toLowerCase()}`,
    creator: "FinCalc India Financial Engine (Income-tax Act, 2025)",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 24, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("FinCalc India", margin + 6, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Authoritative Indian Financial & Tax Engine | FY 2026-27 (AY 2027-28)", margin + 6, y + 18);

  const timestamp = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.text(timestamp, pageWidth - margin - 6, y + 10, { align: "right" });

  y += 32;

  // Report Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(options.calculatorTitle, margin, y);
  y += 6;

  if (options.statutoryReference) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(options.statutoryReference, margin, y);
    y += 8;
  } else {
    y += 4;
  }

  // Summary Box if present
  if (options.summaryText) {
    doc.setFillColor(241, 245, 249); // slate-100
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(options.summaryText, margin + 4, y + 9, { maxWidth: contentWidth - 8 });
    y += 20;
  }

  // Section 1: Inputs
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("INPUT PARAMETERS", margin, y);
  y += 5;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const inp of options.inputs) {
    if (y > 260) {
      doc.addPage();
      y = margin;
    }
    doc.setTextColor(71, 85, 105);
    doc.text(inp.label, margin + 2, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(String(inp.value), pageWidth - margin - 2, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 6;
  }

  y += 6;

  // Section 2: Calculation Results
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("CALCULATION RESULTS", margin, y);
  y += 5;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const res of options.results) {
    if (y > 260) {
      doc.addPage();
      y = margin;
    }
    doc.setTextColor(71, 85, 105);
    doc.text(res.label, margin + 2, y);
    doc.setTextColor(16, 185, 129); // emerald-600
    doc.setFont("helvetica", "bold");
    doc.text(String(res.value), pageWidth - margin - 2, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 6;
  }

  // Section 3: Statutory Notes if present
  if (options.notes && options.notes.length > 0) {
    y += 6;
    if (y > 240) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("STATUTORY & COMPLIANCE NOTES", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    for (const note of options.notes) {
      doc.text(`• ${note}`, margin + 2, y, { maxWidth: contentWidth - 4 });
      y += 5;
    }
  }

  // Footer Disclaimer on bottom
  const footerY = doc.internal.pageSize.getHeight() - 12;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Disclaimer: For educational & estimation purposes only. Always consult a registered Chartered Accountant or SEBI-registered RIA.",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  return doc;
}
