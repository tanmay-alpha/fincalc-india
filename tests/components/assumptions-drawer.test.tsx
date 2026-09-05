// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import AssumptionsDrawer from "@/components/ui/AssumptionsDrawer";

describe("AssumptionsDrawer Regulatory Metadata & Accessibility", () => {
  it("renders tax year row when metadata.taxYear is explicitly provided", () => {
    render(
      <AssumptionsDrawer
        calcName="Income Tax"
        metadata={{
          taxYear: "Tax Year 2026-27",
          currentAct: "Income-tax Act, 2025",
        }}
      />
    );

    // Open modal
    const trigger = screen.getByRole("button", {
      name: /View assumptions & statutory sources/i,
    });
    fireEvent.click(trigger);

    expect(screen.getByText("Tax / Assessment Year:")).toBeDefined();
    expect(screen.getByText("Tax Year 2026-27")).toBeDefined();
    expect(screen.getByText("Income-tax Act, 2025")).toBeDefined();
  });

  it("completely omits tax year row when metadata.taxYear is missing (never guesses or invents 2026–27)", () => {
    render(
      <AssumptionsDrawer
        calcName="Corporate Valuation"
        metadata={{
          currentAct: "Companies Act, 2013",
          // taxYear is deliberately missing
        }}
      />
    );

    const trigger = screen.getByRole("button", {
      name: /View assumptions & statutory sources/i,
    });
    fireEvent.click(trigger);

    expect(screen.queryByText("Tax / Assessment Year:")).toBeNull();
    expect(screen.queryByText(/2026–27/)).toBeNull();
    expect(screen.getByText("Companies Act, 2013")).toBeDefined();
  });

  it("renders legacySections when provided", () => {
    render(
      <AssumptionsDrawer
        calcName="Income Tax"
        metadata={{
          taxYear: "2026-27",
          currentSections: ["157"],
          legacySections: ["87A"],
        }}
      />
    );

    const trigger = screen.getByRole("button", {
      name: /View assumptions & statutory sources/i,
    });
    fireEvent.click(trigger);

    expect(screen.getByText("Governing Provisions:")).toBeDefined();
    expect(screen.getByText("157")).toBeDefined();
    expect(screen.getByText("Legacy Reference Provisions:")).toBeDefined();
    expect(screen.getByText("87A")).toBeDefined();
  });

  it("closes on Close button and returns focus to opener trigger", () => {
    render(
      <AssumptionsDrawer
        calcName="Test Calc"
        assumptions={["Inflation assumption is 6% p.a."]}
      />
    );

    const trigger = screen.getByRole("button", {
      name: /View assumptions & statutory sources/i,
    });
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeDefined();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
