import { describe, it, expect } from "vitest";
import { generateCalculationPdf, PdfExportOptions } from "../lib/calculation-pdf";

describe("Calculation PDF Export Generator", () => {
  it("generates a valid jsPDF instance with formatted tables and sections", () => {
    const options: PdfExportOptions = {
      calculatorTitle: "SIP & Wealth Compounder",
      calculatorRoute: "/sip",
      statutoryReference: "SEBI Mutual Fund Investment Planning Guidelines",
      taxYear: "FY 2026-27 (AY 2027-28)",
      inputs: [
        { label: "Monthly SIP Investment", value: "₹25,000" },
        { label: "Expected Annual Return", value: "12.0%" },
        { label: "Investment Tenure", value: "15 Years" },
      ],
      results: [
        { label: "Total Amount Invested", value: "₹45,00,000" },
        { label: "Estimated Wealth Gain", value: "₹79,48,354" },
        { label: "Total Maturity Corpus", value: "₹1,24,48,354" },
      ],
      summaryText: "Your monthly investment of ₹25,000 compounds to ₹1.24 Crore in 15 years at 12% p.a.",
      notes: [
        "Equity mutual fund long-term capital gains above ₹1.25 Lakh per financial year are taxed at 12.5% u/s 112A.",
        "Returns are market-linked and subject to portfolio risk.",
      ],
    };

    const doc = generateCalculationPdf(options);
    expect(doc).toBeDefined();
    expect(doc.internal.pages.length).toBeGreaterThan(0);

    // Verify output buffer creation without error
    const outputBuffer = doc.output("arraybuffer");
    expect(outputBuffer.byteLength).toBeGreaterThan(500);
  });
});

