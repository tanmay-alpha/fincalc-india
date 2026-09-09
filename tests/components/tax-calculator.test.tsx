// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import TaxCalculator from "../../components/calculators/tax/TaxCalculator";

// Mock next-auth
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock dynamic chart imports
vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="mock-chart">Mock Chart</div>,
}));

describe("TaxCalculator Component UI", () => {
  it("renders input panel, regime toggle, and initial tax result", async () => {
    render(<TaxCalculator />);

    // Check title and badges
    expect(screen.getByText(/Tax Parameters/i)).toBeDefined();
    expect(screen.getByText(/Finance Act, 2026/i)).toBeDefined();

    // Check regime toggle buttons
    expect(screen.getByRole("button", { name: /New Regime/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Old Regime/i })).toBeDefined();

    // Check advanced options toggle
    expect(screen.getByText(/Configure Multiple Income Streams/i)).toBeDefined();
  });

  it("toggles advanced income streams when button is clicked", async () => {
    render(<TaxCalculator />);

    const toggleBtn = screen.getByText(/Configure Multiple Income Streams/i);
    fireEvent.click(toggleBtn);

    // Advanced inputs should appear
    expect(screen.getByText(/Interest & Other Income/i)).toBeDefined();
    expect(screen.getByText(/Business \/ Professional Income \(PGBP\)/i)).toBeDefined();
    expect(screen.getByText(/Taxpayer Residential Status/i)).toBeDefined();
  });

  it("explicitly asserts statutory Section 156 rebate labeling and absence of Section 157", () => {
    render(<TaxCalculator />);

    // Click '3. Profile' tab to reveal residency selector
    const profileTab = screen.getByText(/3\. Profile/i);
    fireEvent.click(profileTab);

    // Must display Section 156 in residency dropdown option
    expect(
      screen.getByText(/Resident Individual \(Section 156 Rebate Eligible\)/i)
    ).toBeDefined();

    // Click "Why?" explanation button
    const whyButton = screen.getByText(/Why\?/i);
    fireEvent.click(whyButton);

    // Must explain Section 156 in comparison details
    expect(screen.getByText(/Section 156 full tax rebate/i)).toBeDefined();

    // Must NOT contain any incorrect Section 157 rebate reference anywhere in document body
    expect(document.body.textContent).not.toContain("Section 157");
  });
});
