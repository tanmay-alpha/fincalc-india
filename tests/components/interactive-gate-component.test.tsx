// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import InteractiveCalculatorGate from "@/components/auth/InteractiveCalculatorGate";

let mockStatus = "unauthenticated";

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: mockStatus === "authenticated" ? { user: { name: "Test User" } } : null,
    status: mockStatus,
  }),
}));

describe("InteractiveCalculatorGate Component", () => {
  beforeEach(() => {
    mockStatus = "unauthenticated";
  });

  it("renders calculator content for unauthenticated guests", () => {
    render(
      <InteractiveCalculatorGate calcName="SIP Calculator">
        <div data-testid="calculator-widget">Active Calculator Content</div>
      </InteractiveCalculatorGate>
    );

    expect(screen.getByTestId("interactive-calculator-surface")).toHaveAttribute(
      "data-auth-state",
      "guest"
    );
    expect(screen.getByTestId("calculator-widget")).toBeInTheDocument();
    expect(screen.queryByTestId("interactive-auth-gate")).not.toBeInTheDocument();
  });

  it("keeps calculator content visible while session state is loading", () => {
    mockStatus = "loading";
    render(
      <InteractiveCalculatorGate>
        <div data-testid="calculator-widget">Active Calculator Content</div>
      </InteractiveCalculatorGate>
    );

    expect(screen.getByTestId("interactive-calculator-surface")).toHaveAttribute(
      "data-auth-state",
      "loading"
    );
    expect(screen.getByTestId("calculator-widget")).toBeInTheDocument();
  });

  it("marks the public calculator surface authenticated when session resolves", () => {
    mockStatus = "authenticated";
    render(
      <InteractiveCalculatorGate>
        <div data-testid="calculator-widget">Active Calculator Content</div>
      </InteractiveCalculatorGate>
    );

    expect(screen.getByTestId("interactive-calculator-surface")).toHaveAttribute(
      "data-auth-state",
      "authenticated"
    );
    expect(screen.getByTestId("calculator-widget")).toBeInTheDocument();
  });
});
