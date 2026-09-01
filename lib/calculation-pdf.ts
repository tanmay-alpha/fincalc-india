import { jsPDF } from "jspdf";

export interface CalculationDisplayRow {
  label: string;
  value: string;
}

export interface CalculationPdfData {
  title: string;
  slug: string;
  sections: Array<{
    heading: string;
    rows: CalculationDisplayRow[];
  }>;
}

export function buildCalculationPdfData(
  title: string,
  inputRows: CalculationDisplayRow[],
  resultRows: CalculationDisplayRow[],
): CalculationPdfData {
  return {
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    sections: [
      { heading: "Inputs", rows: inputRows },
      { heading: "Results", rows: resultRows },
    ],
  };
}

export function exportCalculationPdf(data: CalculationPdfData): void {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  let cursorY = 18;

  pdf.setFontSize(18);
  pdf.text(data.title, 16, cursorY);
  cursorY += 8;
  pdf.setFontSize(9);
  pdf.setTextColor(90);
  pdf.text(`Generated ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date())}`, 16, cursorY);
  cursorY += 10;

  for (const section of data.sections) {
    pdf.setTextColor(20);
    pdf.setFontSize(12);
    pdf.text(section.heading, 16, cursorY);
    cursorY += 6;

    pdf.setFontSize(10);
    for (const row of section.rows) {
      if (cursorY > 278) {
        pdf.addPage();
        cursorY = 18;
      }
      pdf.setTextColor(80);
      pdf.text(row.label, 16, cursorY);
      pdf.setTextColor(20);
      const valueLines = pdf.splitTextToSize(row.value, pageWidth - 92);
      pdf.text(valueLines, pageWidth - 16, cursorY, { align: "right" });
      cursorY += Math.max(6, valueLines.length * 5) + 2;
    }
    cursorY += 5;
  }

  pdf.setTextColor(100);
  pdf.setFontSize(8);
  pdf.text("Estimate only. Verify financial and tax decisions with a qualified professional.", 16, 288);
  pdf.save(`${data.slug}.pdf`);
}
