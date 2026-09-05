// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import ResultHero from "@/components/ui/ResultHero";

describe("ResultHero Visual Semantics & Breakdown Modes", () => {
  it("renders proportional stacked bar for all-positive composition", () => {
    const { container } = render(
      <ResultHero
        label="Total Corpus"
        value={1000000}
        breakdownMode="composition"
        breakdown={[
          { label: "Principal", value: 600000, color: "blue" },
          { label: "Returns", value: 400000, color: "green" },
        ]}
      />
    );

    const bar = container.querySelector('[data-testid="breakdown-bar"]');
    expect(bar).not.toBeNull();
    expect(screen.getByText(/Principal:/i)).toBeDefined();
    expect(screen.getByText(/Returns:/i)).toBeDefined();
  });

  it("does NOT render proportional stacked bar for mixed-sign metrics (+5L, -5L)", () => {
    const { container } = render(
      <ResultHero
        label="XIRR Portfolio"
        value={15.5}
        breakdownMode="composition"
        breakdown={[
          { label: "Total Invested", value: 500000, color: "blue" },
          { label: "Net Portfolio Loss", value: -500000, color: "red" },
        ]}
      />
    );

    // Never visually transform a loss into a positive contribution merely to make a bar fit
    const bar = container.querySelector('[data-testid="breakdown-bar"]');
    expect(bar).toBeNull();

    // But legend and metrics are cleanly rendered
    expect(screen.getByText(/Total Invested:/i)).toBeDefined();
    expect(screen.getByText(/Net Portfolio Loss:/i)).toBeDefined();
  });

  it("does NOT render proportional stacked bar for all-negative values", () => {
    const { container } = render(
      <ResultHero
        label="Total Charges"
        value={-1200}
        breakdown={[
          { label: "Brokerage", value: -500, color: "red" },
          { label: "STT", value: -700, color: "amber" },
        ]}
      />
    );

    const bar = container.querySelector('[data-testid="breakdown-bar"]');
    expect(bar).toBeNull();
    expect(screen.getByText(/Brokerage:/i)).toBeDefined();
    expect(screen.getByText(/STT:/i)).toBeDefined();
  });

  it("does NOT render proportional stacked bar when total is zero", () => {
    const { container } = render(
      <ResultHero
        label="Zero Balance"
        value={0}
        breakdown={[
          { label: "Portion A", value: 0 },
          { label: "Portion B", value: 0 },
        ]}
      />
    );

    const bar = container.querySelector('[data-testid="breakdown-bar"]');
    expect(bar).toBeNull();
  });

  it("renders single component composition correctly", () => {
    const { container } = render(
      <ResultHero
        label="Sole Asset"
        value={100000}
        breakdown={[{ label: "Equity", value: 100000, color: "green" }]}
      />
    );

    const bar = container.querySelector('[data-testid="breakdown-bar"]');
    expect(bar).not.toBeNull();
    expect(screen.getByText(/Equity:/i)).toBeDefined();
  });

  it("does NOT render stacked bar when breakdownMode='metrics' is explicitly requested", () => {
    const { container } = render(
      <ResultHero
        label="Independent Metrics"
        value={50000}
        breakdownMode="metrics"
        breakdown={[
          { label: "Gross Yield", value: 8.5 },
          { label: "Expense Ratio", value: 0.75 },
        ]}
      />
    );

    const bar = container.querySelector('[data-testid="breakdown-bar"]');
    expect(bar).toBeNull();
    expect(screen.getByText(/Gross Yield:/i)).toBeDefined();
    expect(screen.getByText(/Expense Ratio:/i)).toBeDefined();
  });

  it("never outputs duplicate currency symbols in legend or secondary metrics", () => {
    const { container } = render(
      <ResultHero
        label="Currency Verification"
        value={500000}
        secondaryMetrics={[
          { label: "Metric One", value: "₹25,000" },
          { label: "Metric Two", value: "₹1,50,000" },
        ]}
        breakdown={[
          { label: "Item A", value: 200000, formattedValue: "₹2,00,000" },
          { label: "Item B", value: 300000, formattedValue: "₹3,00,000" },
        ]}
      />
    );

    const text = container.textContent || "";
    expect(text).not.toContain("₹₹");
    expect(text).not.toContain("-₹₹");
    expect(text).not.toContain("₹-₹");
  });
});
