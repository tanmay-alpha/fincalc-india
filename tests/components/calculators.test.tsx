// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import LrsTcsCalculator from "../../components/calculators/lrs-tcs/LrsTcsCalculator";
import NpsCalculator from "../../components/calculators/nps/NpsCalculator";
import BalanceTransferCalculator from "../../components/calculators/balance-transfer/BalanceTransferCalculator";
import Section54Calculator from "../../components/calculators/section-54/Section54Calculator";

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
  });

  describe("NpsCalculator UI", () => {
    it("renders Tier-1 allocation and PFRDA 2026 rules badge", () => {
      render(<NpsCalculator />);

      expect(screen.getByText(/NPS Contribution & Allocation/i)).toBeDefined();
      expect(screen.getByText(/PFRDA 2026 Rules/i)).toBeDefined();
      expect(screen.getByText(/Configure Tax Regime & Corporate NPS/i)).toBeDefined();
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
});
