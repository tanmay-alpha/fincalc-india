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
    expect(screen.getByText(/⚡ New Regime/i)).toBeDefined();
    expect(screen.getByText(/📋 Old Regime/i)).toBeDefined();

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
});
