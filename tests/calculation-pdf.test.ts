import { describe, expect, it } from "vitest";
import { buildCalculationPdfData } from "@/lib/calculation-pdf";

describe("calculation PDF model", () => {
  it("preserves formatted final numbers in the result section", () => {
    const pdf = buildCalculationPdfData(
      "SIP Calculator",
      [{ label: "Investment period", value: "10 years" }],
      [{ label: "Total Corpus", value: "₹11,61,695" }],
    );

    expect(pdf.sections).toContainEqual({
      heading: "Results",
      rows: [{ label: "Total Corpus", value: "₹11,61,695" }],
    });
  });
});
