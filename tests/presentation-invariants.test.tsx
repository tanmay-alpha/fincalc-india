// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

// Mock next-auth
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock dynamic charts
vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="mock-chart">Mock Chart</div>,
}));

// Import key representative calculators across all categories
import TaxCalculator from "@/components/calculators/tax/TaxCalculator";
import SIPCalculator from "@/components/calculators/sip/SIPCalculator";
import EMICalculator from "@/components/calculators/emi/EMICalculator";
import LoanPrepaymentCalculator from "@/components/calculators/loan-prepayment/LoanPrepaymentCalculator";
import FIRECalculator from "@/components/calculators/fire/FIRECalculator";
import NoCostEMICalculator from "@/components/calculators/no-cost-emi/NoCostEMICalculator";
import LrsTcsCalculator from "@/components/calculators/lrs-tcs/LrsTcsCalculator";
import NpsCalculator from "@/components/calculators/nps/NpsCalculator";
import BalanceTransferCalculator from "@/components/calculators/balance-transfer/BalanceTransferCalculator";
import Section54Calculator from "@/components/calculators/section-54/Section54Calculator";
import MarginCalculator from "@/components/calculators/margin/MarginCalculator";
import XirrCalculator from "@/components/calculators/xirr/XirrCalculator";
import StepUpSIPCalculator from "@/components/calculators/step-up-sip/StepUpSIPCalculator";
import PPFCalculator from "@/components/calculators/ppf/PPFCalculator";
import FDCalculator from "@/components/calculators/fd/FDCalculator";
import HRACalculator from "@/components/calculators/hra/HRACalculator";
import FnoBrokerageCalculator from "@/components/calculators/fno-brokerage/FnOBrokerageCalculator";
import CarTcoCalculator from "@/components/calculators/car-tco/CarTcoCalculator";
import DCFCalculator from "@/components/calculators/dcf/DcfCalculator";
import DuPontCalculator from "@/components/calculators/dupont/DuPontCalculator";
import WACCCalculator from "@/components/calculators/wacc/WaccCalculator";
import ResultHero from "@/components/ui/ResultHero";

const CALCULATOR_SUITE = [
  { name: "TaxCalculator", component: <TaxCalculator /> },
  { name: "SIPCalculator", component: <SIPCalculator /> },
  { name: "EMICalculator", component: <EMICalculator /> },
  { name: "LoanPrepaymentCalculator", component: <LoanPrepaymentCalculator /> },
  { name: "FIRECalculator", component: <FIRECalculator /> },
  { name: "NoCostEMICalculator", component: <NoCostEMICalculator /> },
  { name: "LrsTcsCalculator", component: <LrsTcsCalculator /> },
  { name: "NpsCalculator", component: <NpsCalculator /> },
  { name: "BalanceTransferCalculator", component: <BalanceTransferCalculator /> },
  { name: "Section54Calculator", component: <Section54Calculator /> },
  { name: "MarginCalculator", component: <MarginCalculator /> },
  { name: "XirrCalculator", component: <XirrCalculator /> },
  { name: "StepUpSIPCalculator", component: <StepUpSIPCalculator /> },
  { name: "PPFCalculator", component: <PPFCalculator /> },
  { name: "FDCalculator", component: <FDCalculator /> },
  { name: "HRACalculator", component: <HRACalculator /> },
  { name: "FnoBrokerageCalculator", component: <FnoBrokerageCalculator /> },
  { name: "CarTcoCalculator", component: <CarTcoCalculator /> },
  { name: "DCFCalculator", component: <DCFCalculator /> },
  { name: "DuPontCalculator", component: <DuPontCalculator /> },
  { name: "WACCCalculator", component: <WACCCalculator /> },
];

function getRenderedTextWithSpacing(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue || "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }
  const el = node as HTMLElement;
  const tagName = el.tagName.toLowerCase();

  if (tagName === "script" || tagName === "style") return "";

  if (tagName === "input") {
    const input = el as HTMLInputElement;
    if (input.type !== "hidden" && input.value) {
      return ` ${input.value} `;
    }
  }

  const isBlock = [
    "div", "p", "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "section", "article", "header",
    "footer", "table", "tr", "td", "th", "button", "form"
  ].includes(tagName);

  let text = "";
  for (const child of Array.from(el.childNodes)) {
    text += getRenderedTextWithSpacing(child);
  }

  return isBlock ? ` ${text} ` : text;
}

function assertPresentationInvariants(root: HTMLElement, calculatorName: string) {
  const textContent = getRenderedTextWithSpacing(root);

  // 1. No duplicate currency symbols
  expect(textContent, `${calculatorName} must not contain duplicate currency symbols ₹₹`).not.toMatch(/₹\s*₹/);
  expect(textContent, `${calculatorName} must not contain -₹₹`).not.toMatch(/-₹\s*₹/);
  expect(textContent, `${calculatorName} must not contain ₹-₹`).not.toMatch(/₹\s*-₹/);

  // 2. No duplicate percentage signs
  expect(textContent, `${calculatorName} must not contain duplicate percentage signs %%`).not.toMatch(/%\s*%/);

  // 3. No duplicate unit / frequency phrases
  expect(textContent, `${calculatorName} must not contain duplicate p.a.`).not.toMatch(/p\.a\.\s*p\.a\./i);
  expect(textContent, `${calculatorName} must not contain duplicate year phrases`).not.toMatch(/years\s*Years/i);

  // 4. No unrendered numeric leaks
  expect(textContent, `${calculatorName} must not contain NaN`).not.toMatch(/\bNaN\b/);
  expect(textContent, `${calculatorName} must not contain Infinity`).not.toMatch(/\bInfinity\b/);
  expect(textContent, `${calculatorName} must not leak undefined`).not.toMatch(/\bundefined\b/);
}

describe("Presentation Invariants Across Calculator Suite", () => {
  for (const { name, component } of CALCULATOR_SUITE) {
    it(`guarantees clean presentation invariants for ${name}`, () => {
      const { container } = render(component);
      assertPresentationInvariants(container, name);
    });
  }

  it("guarantees ResultHero presentation invariants under edge cases", () => {
    const { container } = render(
      <ResultHero
        label="Net Position"
        value={-150000}
        interpretation="Calculated"
        breakdown={[
          { label: "Ordinary Loss", value: -50000, color: "red" },
          { label: "Deductions", value: 100000, color: "green" },
        ]}
      />
    );
    assertPresentationInvariants(container, "ResultHero");
  });

  it("fails if any invariant is violated", () => {
    const badDiv = document.createElement("div");
    badDiv.innerHTML = "<p>Total: ₹₹500</p>";
    expect(() => assertPresentationInvariants(badDiv, "BadComponent")).toThrow(/duplicate currency symbols/);
  });
});
