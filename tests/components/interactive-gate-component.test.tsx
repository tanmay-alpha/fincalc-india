// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import InteractiveCalculatorGate from "@/components/auth/InteractiveCalculatorGate";

const mockSignIn = vi.fn();
let mockStatus = "unauthenticated";

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: mockStatus === "authenticated" ? { user: { name: "Test User" } } : null,
    status: mockStatus,
  }),
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/sip",
}));

describe("InteractiveCalculatorGate Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStatus = "unauthenticated";
  });

  it("renders dignified inline sign-in card when unauthenticated", () => {
    mockStatus = "unauthenticated";

    render(
      <InteractiveCalculatorGate calcName="SIP Calculator">
        <div data-testid="calculator-widget">Active Calculator Content</div>
      </InteractiveCalculatorGate>
    );

    // Assert gate is present
    expect(screen.getByTestId("interactive-auth-gate")).toBeInTheDocument();
    expect(screen.getByText(/Sign in to use SIP Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Save scenarios to your workspace/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate secure share links/i)).toBeInTheDocument();

    // Assert child content is not visible
    expect(screen.queryByTestId("calculator-widget")).toBeNull();
  });

  it("triggers signIn with safe callback URL on button click", () => {
    mockStatus = "unauthenticated";

    render(
      <InteractiveCalculatorGate calcName="SIP Calculator">
        <div>Active Calculator Content</div>
      </InteractiveCalculatorGate>
    );

    const button = screen.getByTestId("gate-signin-btn");
    fireEvent.click(button);

    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/sip" });
  });

  it("renders interactive children when user is authenticated", () => {
    mockStatus = "authenticated";

    render(
      <InteractiveCalculatorGate calcName="SIP Calculator">
        <div data-testid="calculator-widget">Active Calculator Content</div>
      </InteractiveCalculatorGate>
    );

    expect(screen.queryByTestId("interactive-auth-gate")).toBeNull();
    expect(screen.getByTestId("calculator-widget")).toBeInTheDocument();
    expect(screen.getByText("Active Calculator Content")).toBeInTheDocument();
  });
});
