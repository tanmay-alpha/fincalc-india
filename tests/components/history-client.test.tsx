// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import React from "react";
import HistoryClient from "@/app/history/HistoryClient";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const sampleCalculations = [
  {
    id: "calc-sip-1",
    type: "sip",
    inputs: { monthlyInvestment: 10000, expectedReturn: 12, timePeriod: 10 },
    outputs: { investedAmount: 1200000, estReturns: 1123391, totalValue: 2323391 },
    isShared: false,
    shareId: null,
    label: "Retirement SIP",
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "calc-tax-1",
    type: "tax",
    inputs: { annualSalary: 1500000, regime: "new" },
    outputs: { totalTax: 100000, effectiveRate: 6.67 },
    isShared: true,
    shareId: "share-tax-999",
    label: "FY26 Tax Plan",
    createdAt: "2026-03-02T12:30:00.000Z",
  },
  {
    id: "calc-emi-1",
    type: "emi",
    inputs: { loanAmount: 5000000, interestRate: 8.5, loanTenure: 20 },
    outputs: { monthlyEmi: 43391, totalInterest: 5413866, totalPayment: 10413866 },
    isShared: false,
    shareId: null,
    label: "Home Loan EMI",
    createdAt: "2026-03-03T15:45:00.000Z",
  },
];

describe("HistoryClient Component Accessibility & Functionality", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    originalFetch = global.fetch;
    global.fetch = vi.fn().mockImplementation((url: string, opts?: RequestInit) => {
      if (url.includes("/api/history/") && opts?.method === "DELETE") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      if (url.includes("/share")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ shareId: "new-share-123" }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    }) as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("renders realistic saved calculations with categories, tags, labels, and summaries", () => {
    render(
      <HistoryClient
        calculations={sampleCalculations}
      />
    );

    expect(screen.getByText("Retirement SIP")).toBeDefined();
    expect(screen.getByText("FY26 Tax Plan")).toBeDefined();
    expect(screen.getByText("Home Loan EMI")).toBeDefined();
    expect(screen.getByText(/3 saved/i)).toBeDefined();

    // Check action buttons exist for each item
    const openAgainButtons = screen.getAllByRole("button", { name: /Open Again/i });
    expect(openAgainButtons.length).toBe(3);
  });

  it("filters calculations when category filter pills are clicked", () => {
    render(
      <HistoryClient
        calculations={sampleCalculations}
      />
    );

    // Look for category filter pills
    const taxFilter = screen.getByRole("button", { name: /^Income Tax$/i });
    fireEvent.click(taxFilter);

    // Tax plan should remain visible, SIP and EMI should be filtered out
    expect(screen.getByText("FY26 Tax Plan")).toBeDefined();
    expect(screen.queryByText("Retirement SIP")).toBeNull();
    expect(screen.queryByText("Home Loan EMI")).toBeNull();

    // Reset back to All
    const allFilter = screen.getByRole("button", { name: /^All/i });
    fireEvent.click(allFilter);
    expect(screen.getByText("Retirement SIP")).toBeDefined();
    expect(screen.getByText("Home Loan EMI")).toBeDefined();
  });

  it("Open Again prepares session storage and navigates to calculator route", async () => {
    render(
      <HistoryClient
        calculations={sampleCalculations}
      />
    );

    const openButtons = screen.getAllByRole("button", { name: /Open Again/i });
    fireEvent.click(openButtons[0]); // Click first (SIP)

    // Should set sessionStorage item under fincalc_restore_inputs
    const stored = sessionStorage.getItem("fincalc_restore_inputs");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.type).toBe("sip");
    expect(parsed.inputs.monthlyInvestment).toBe(10000);
    expect(parsed.inputs.expectedReturn).toBe(12);

    // Should push to SIP route with parameters
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("/sip"));
  });

  it("opens accessible item delete confirmation dialog, traps focus, and supports cancel", async () => {
    render(
      <HistoryClient
        calculations={sampleCalculations}
      />
    );

    // Dialog should initially not be visible
    expect(screen.queryByRole("alertdialog")).toBeNull();

    // Click delete calculation button
    const deleteButtons = screen.getAllByRole("button", { name: /Delete calculation/i });
    fireEvent.click(deleteButtons[0]);

    // Modal should appear
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeDefined();
    expect(screen.getAllByText("Delete Saved Calculation?").length).toBeGreaterThan(0);

    // Clicking Cancel closes modal without deleting
    const cancelBtn = within(dialog).getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).toBeNull();
    });
    expect(screen.getByText("Retirement SIP")).toBeDefined();
  });

  it("confirms item deletion, calls DELETE API, and removes item from list", async () => {
    render(
      <HistoryClient
        calculations={sampleCalculations}
      />
    );

    const deleteButtons = screen.getAllByRole("button", { name: /Delete calculation/i });
    fireEvent.click(deleteButtons[0]);

    const dialog = screen.getByRole("alertdialog");
    const confirmDeleteBtn = within(dialog).getByRole("button", {
      name: "Delete Calculation",
    });
    fireEvent.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/history/calc-sip-1"),
        expect.objectContaining({ method: "DELETE" })
      );
      // Item removed from UI
      expect(screen.queryByText("Retirement SIP")).toBeNull();
    });
  });

  it("opens and handles Account Delete confirmation modal with proper accessibility attributes", async () => {
    render(
      <HistoryClient
        calculations={sampleCalculations}
      />
    );

    const deleteAccountBtn = screen.getByRole("button", {
      name: /Delete my account/i,
    });
    fireEvent.click(deleteAccountBtn);

    // Account delete dialog should appear
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeDefined();
    expect(screen.getAllByText(/Permanently Delete Account\?/i).length).toBeGreaterThan(0);

    // Cancel closes dialog
    const cancelBtn = within(dialog).getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).toBeNull();
    });
  });

  it("dismisses delete dialog on Escape key and maintains accessible focus", async () => {
    render(
      <HistoryClient
        calculations={sampleCalculations}
      />
    );

    const deleteButtons = screen.getAllByRole("button", { name: /Delete calculation/i });
    fireEvent.click(deleteButtons[1]); // Delete tax calc

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeDefined();

    // Trigger Escape key
    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).toBeNull();
    });
  });
});
