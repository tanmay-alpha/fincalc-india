// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import LrsTcsCalculator from "../../components/calculators/lrs-tcs/LrsTcsCalculator";
import NpsCalculator from "../../components/calculators/nps/NpsCalculator";
import BalanceTransferCalculator from "../../components/calculators/balance-transfer/BalanceTransferCalculator";
import Section54Calculator from "../../components/calculators/section-54/Section54Calculator";
import MarginCalculator from "../../components/calculators/margin/MarginCalculator";
import XirrCalculator from "../../components/calculators/xirr/XirrCalculator";
import PdfExportButton from "../../components/ui/PdfExportButton";
import { FNO_CONTRACT_DEFAULTS } from "../../lib/math";
import * as mathModule from "../../lib/math";
import * as calculationPdfModule from "../../lib/calculation-pdf";

// Mock next-auth
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="mock-chart">Mock Chart</div>,
}));

describe("Calculator Component Suite UI Tests", () => {
  describe("LrsTcsCalculator UI", () => {
    it("renders Finance Act, 2026 Section 394 rules and categories", () => {
      render(<LrsTcsCalculator />);

      expect(screen.getByText(/Section 394 \/ FA 2026/i)).toBeDefined();
      expect(screen.getByText(/Overseas Tour Package/i)).toBeDefined();
      expect(screen.getByText(/Education Abroad self-funded/i)).toBeDefined();
      expect(screen.getByText(/Foreign Stocks \/ Real Estate/i)).toBeDefined();
    });

    it("displays flat 2% TCS tier 1 rate for Overseas Tour Packages", async () => {
      render(<LrsTcsCalculator />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "overseas_tour_package" } });

      await waitFor(() => {
        expect(screen.getByText(/TCS Rate \(Flat\)/i)).toBeDefined();
        expect(screen.getByText("2%")).toBeDefined();
      });
    });
  });

  describe("NpsCalculator UI", () => {
    it("renders Tier-1 allocation and PFRDA 2026 rules badge", () => {
      render(<NpsCalculator />);

      expect(screen.getByText(/NPS Contribution & Allocation/i)).toBeDefined();
      expect(screen.getByText(/PFRDA 2026 Rules/i)).toBeDefined();
      expect(screen.getByText(/Configure Tax Regime & Corporate NPS/i)).toBeDefined();
    });

    it("toggles advanced tax options and displays 80CCD(2) salary ceiling fields", () => {
      render(<NpsCalculator />);

      const toggleBtn = screen.getByText(/Configure Tax Regime & Corporate NPS/i);
      fireEvent.click(toggleBtn);

      expect(screen.getByText(/Annual Basic Salary \+ Eligible DA/i)).toBeDefined();
      expect(screen.getByText(/Applicable Tax Regime/i)).toBeDefined();
    });

    it("displays separate tiles for Permitted Lump Sum, Tax-Exempt, Potentially Taxable, and Regulatory Category", () => {
      render(<NpsCalculator />);

      expect(screen.getByText(/Regulatory Exit Category:/i)).toBeDefined();
      expect(screen.getByText(/Permitted Lump Sum/i)).toBeDefined();
      expect(screen.getByText(/Tax-Exempt Lump Sum/i)).toBeDefined();
      expect(screen.getByText(/Potentially Taxable Lump Sum/i)).toBeDefined();
      expect(screen.getByText(/Mandatory \/ Selected Annuity/i)).toBeDefined();

      // Ensure no hardcoded "<₹6L" or "fully tax-free" claims exist in the document
      const bodyText = document.body.textContent || "";
      expect(bodyText).not.toContain("<₹6L");
      expect(bodyText).not.toContain("fully tax-free");
    });
  });

  describe("BalanceTransferCalculator UI", () => {
    it("renders existing and new loan parameters with Refinance Truth Modeler", () => {
      render(<BalanceTransferCalculator />);

      expect(screen.getByText(/Existing & New Loan Parameters/i)).toBeDefined();
      expect(screen.getByText(/Refinance Truth Modeler/i)).toBeDefined();
      expect(screen.getByText(/Switching & Refinancing Costs/i)).toBeDefined();
    });
  });

  describe("Section54Calculator UI", () => {
    it("renders 4-route exemption selector including Section 54F", () => {
      render(<Section54Calculator />);

      expect(screen.getAllByText(/Section 54/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Section 54EC/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Section 54F/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Compare All/i).length).toBeGreaterThan(0);
    });
  });

  describe("MarginCalculator UI", () => {
    it("renders F&O Margin Estimator title, disclaimer, and canonical Nifty lot size of 65", () => {
      render(<MarginCalculator />);

      expect(screen.getByText(/F&O Margin Estimator Parameters/i)).toBeDefined();
      expect(screen.getByText(/Illustrative SPAN\/exposure assumptions/i)).toBeDefined();

      // Initial lot size matches canonical FNO_CONTRACT_DEFAULTS.nifty.lotSize (65)
      const lotInputs = screen.getAllByDisplayValue(String(FNO_CONTRACT_DEFAULTS.nifty.lotSize));
      expect(lotInputs.length).toBeGreaterThan(0);
    });

    it("switches to Bank Nifty (30) and FinNifty (60) matching canonical constants", async () => {
      render(<MarginCalculator />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "banknifty_futures" } });

      await waitFor(() => {
        const bankLots = screen.getAllByDisplayValue(String(FNO_CONTRACT_DEFAULTS.banknifty.lotSize));
        expect(bankLots.length).toBeGreaterThan(0);
      });

      fireEvent.change(select, { target: { value: "finnifty_futures" } });

      await waitFor(() => {
        const finLots = screen.getAllByDisplayValue(String(FNO_CONTRACT_DEFAULTS.finnifty.lotSize));
        expect(finLots.length).toBeGreaterThan(0);
      });
    });
  });

  describe("XirrCalculator UI", () => {
    it("renders signed outputs and does not mask loss with Math.max or +- in CAGR tab", () => {
      render(<XirrCalculator />);

      // Switch to CAGR tab
      const cagrTab = screen.getByRole("button", { name: /CAGR/i });
      fireEvent.click(cagrTab);

      // Default CAGR values are initial 1,00,000, final 2,00,000 (gain)
      expect(screen.getByText(/Capital Gain/i)).toBeDefined();

      // Change final value to 70,000 (loss) using text input
      const finalInputs = screen.getAllByLabelText(/Final Valuation \/ Maturity Amount/i);
      const textInput = finalInputs.find((el) => el.getAttribute("type") === "text") || finalInputs[0];
      fireEvent.change(textInput, { target: { value: "70000" } });

      // Verify Capital Loss and negative percentage without "+-"
      expect(screen.getByText(/Capital Loss/i)).toBeDefined();
      const bodyText = document.body.textContent || "";
      expect(bodyText).not.toContain("+-");
    });

    it("renders multiple-root ambiguity warning when multiple roots are detected", () => {
      vi.spyOn(mathModule, "calcXIRR").mockReturnValueOnce({
        cashflows: [],
        xirr: 10,
        totalInvested: 232,
        totalWithdrawn: 230,
        netGain: -2,
        absoluteGainPercent: -0.86,
        firstDate: "2020-01-01",
        lastDate: "2022-01-01",
        durationYears: 2,
        multipleRootsDetected: true,
        candidateRoots: [10, 20],
        rootCount: 2,
        warning: "Multiple Internal Rates of Return detected",
        isValid: true,
        summary: "Multiple IRRs detected",
      });

      render(<XirrCalculator />);
      expect(
        screen.getByText(/Multiple mathematically valid IRRs were detected\. XIRR is ambiguous\./i)
      ).toBeDefined();
      expect(screen.getByText(/10\.00%, 20\.00%/i)).toBeDefined();
    });
  });

  describe("PdfExportButton UI", () => {
    it("renders download button and handles click", () => {
      const saveSpy = vi.fn();
      vi.spyOn(calculationPdfModule, "generateCalculationPdf").mockReturnValueOnce({
        save: saveSpy,
      } as unknown as ReturnType<typeof calculationPdfModule.generateCalculationPdf>);

      render(
        <PdfExportButton
          filename="test-calc"
          calculatorTitle="Test Calculator"
          calculatorRoute="/test"
          inputs={[{ label: "Principal", value: "₹1,00,000" }]}
          results={[{ label: "Maturity", value: "₹1,25,000" }]}
        />
      );

      const btn = screen.getByRole("button", { name: /Download calculation as PDF/i });
      expect(btn).toBeDefined();
      expect(btn.textContent).toContain("Download PDF");

      fireEvent.click(btn);
      expect(saveSpy).toHaveBeenCalledWith("test-calc.pdf");
    });
  });
});


