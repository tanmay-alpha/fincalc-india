// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import InteractiveCalculatorGate from "@/components/auth/InteractiveCalculatorGate";

describe("InteractiveCalculatorGate Component", () => {
  it("renders children cleanly within the authenticated workspace surface", () => {
    render(
      <InteractiveCalculatorGate calcName="SIP Calculator">
        <div data-testid="calculator-widget">Active Calculator Content</div>
      </InteractiveCalculatorGate>
    );

    const surface = screen.getByTestId("interactive-calculator-surface");
    expect(surface).toBeInTheDocument();
    expect(surface).toHaveAttribute("data-auth-state", "authenticated");
    expect(screen.getByTestId("calculator-widget")).toBeInTheDocument();
    expect(screen.getByText("Active Calculator Content")).toBeInTheDocument();
  });
});
