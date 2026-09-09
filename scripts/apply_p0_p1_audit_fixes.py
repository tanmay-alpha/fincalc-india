from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def write(rel: str, content: str) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def replace_exact(rel: str, old: str, new: str, expected: int | None = 1) -> None:
    text = read(rel)
    count = text.count(old)
    if expected is not None and count != expected:
        raise RuntimeError(f"{rel}: expected {expected} occurrences of {old!r}, found {count}")
    if count == 0:
        raise RuntimeError(f"{rel}: replacement source not found: {old!r}")
    write(rel, text.replace(old, new))


def insert_once(rel: str, anchor: str, addition: str, *, after: bool = True) -> None:
    text = read(rel)
    if addition.strip() in text:
        return
    if text.count(anchor) != 1:
        raise RuntimeError(f"{rel}: expected one insertion anchor {anchor!r}, found {text.count(anchor)}")
    replacement = anchor + addition if after else addition + anchor
    write(rel, text.replace(anchor, replacement, 1))


# ---------------------------------------------------------------------------
# 1) Statutory correction: Income-tax Act, 2025 rebate is Section 156.
# ---------------------------------------------------------------------------
# Replace only source/documentation text; the repository has no salary-arrears
# relief calculator, so every existing textual Section 157 reference is part of
# the mislabelled 87A -> new-Act rebate migration.
for path in ROOT.rglob("*"):
    if not path.is_file() or path.suffix.lower() not in {".ts", ".tsx", ".md", ".json"}:
        continue
    if "node_modules" in path.parts or ".next" in path.parts:
        continue
    text = path.read_text(encoding="utf-8")
    updated = (
        text.replace("Section 157", "Section 156")
        .replace("SECTION 157", "SECTION 156")
        .replace("section 157", "section 156")
    )
    if updated != text:
        path.write_text(updated, encoding="utf-8")

# Make Section 156 canonical in the statutory constants while retaining a
# deprecated symbol alias so older saved code/imports do not break abruptly.
constants_rel = "lib/constants/tax-year-2026-27.ts"
constants = read(constants_rel)
pattern = re.compile(
    r"export const REBATE_SECTION_157 = \{(?P<body>.*?)\} as const;\n\n"
    r"// Backward-compatibility alias\nexport const REBATE_SECTION_156 = REBATE_SECTION_157;",
    re.S,
)
match = pattern.search(constants)
if not match:
    raise RuntimeError("Unable to locate rebate constant block for canonical Section 156 migration")
body = match.group("body")
canonical = (
    "export const REBATE_SECTION_156 = {" + body + "} as const;\n\n"
    "/** @deprecated Use REBATE_SECTION_156. Kept only for source compatibility. */\n"
    "export const REBATE_SECTION_157 = REBATE_SECTION_156;"
)
constants = pattern.sub(canonical, constants, count=1)
write(constants_rel, constants)

# Migrate all TypeScript consumers to the canonical symbol; keep only the
# deprecated alias declaration in the constants file.
for path in ROOT.rglob("*.ts"):
    if path.as_posix().endswith(constants_rel):
        continue
    text = path.read_text(encoding="utf-8")
    updated = text.replace("REBATE_SECTION_157", "REBATE_SECTION_156")
    # math.ts historically imported/exported both names; symbol migration can
    # leave adjacent duplicates, so collapse them deterministically.
    updated = updated.replace(
        "  REBATE_SECTION_156,\n  REBATE_SECTION_156,\n",
        "  REBATE_SECTION_156,\n",
    )
    if updated != text:
        path.write_text(updated, encoding="utf-8")

for path in ROOT.rglob("*.tsx"):
    text = path.read_text(encoding="utf-8")
    updated = text.replace("REBATE_SECTION_157", "REBATE_SECTION_156")
    if updated != text:
        path.write_text(updated, encoding="utf-8")

replace_exact(
    "lib/calculator-contracts.ts",
    'currentSections: ["157"],',
    'currentSections: ["156"],',
)
replace_exact(
    "components/calculators/tax/TaxCalculator.tsx",
    "Tax Parameters (AY 2026-27)",
    "Tax Parameters (Tax Year 2026-27)",
)
replace_exact(
    "components/seo/TaxInfo.tsx",
    "Statutory Tax Slabs — AY 2026-27 (Finance Act, 2026)",
    "Statutory Tax Slabs — Tax Year 2026-27 (Finance Act, 2026)",
)
replace_exact(
    "components/seo/TaxInfo.tsx",
    "New Regime (Section 115BAC Default)",
    "New Regime (Section 202; formerly Section 115BAC)",
)
replace_exact(
    "lib/registry.ts",
    "Income Tax Calculator (AY 2026-27)",
    "Income Tax Calculator (Tax Year 2026-27)",
)
replace_exact(
    "README.md",
    "### 3. ⚖️ Taxation & Statutory Planning (Tax Year 2026-27 / AY 2027-28)",
    "### 3. ⚖️ Taxation & Statutory Planning (Tax Year 2026-27)",
)

# ---------------------------------------------------------------------------
# 2) Public calculator access: calculations are available without login.
#    Authentication is reserved for account features (save/history/share).
# ---------------------------------------------------------------------------
write(
    "components/auth/InteractiveCalculatorGate.tsx",
    '''"use client";\n\nimport { useSession } from "next-auth/react";\nimport type { ReactNode } from "react";\n\ninterface InteractiveCalculatorGateProps {\n  children: ReactNode;\n  calcName?: string;\n}\n\n/**\n * Validates that a callback destination is a safe relative internal URL.\n * Kept as a shared utility for sign-in entry points even though calculators\n * themselves are now publicly interactive.\n */\nexport function getSafeCallbackUrl(\n  pathname?: string | null,\n  searchParams?: string | URLSearchParams | null,\n  fallback = "/calculators"\n): string {\n  if (typeof pathname !== "string" || !pathname.trim()) {\n    return fallback;\n  }\n  const cleanPath = pathname.trim();\n\n  if (\n    !cleanPath.startsWith("/") ||\n    cleanPath.startsWith("//") ||\n    cleanPath.includes("\\\\") ||\n    /^[a-z0-9+.-]+:/i.test(cleanPath)\n  ) {\n    return fallback;\n  }\n\n  let queryString = "";\n  if (typeof searchParams === "string") {\n    const trimmed = searchParams.trim().replace(/^\\?/, "");\n    if (trimmed) {\n      if (trimmed.includes("\\\\") || trimmed.includes("//") || /^[a-z0-9+.-]+:/i.test(trimmed)) {\n        return fallback;\n      }\n      queryString = `?${trimmed}`;\n    }\n  } else if (searchParams && typeof searchParams.toString === "function") {\n    const str = searchParams.toString();\n    if (str) {\n      if (str.includes("\\\\") || str.includes("//") || /^[a-z0-9+.-]+:/i.test(str)) {\n        return fallback;\n      }\n      queryString = `?${str}`;\n    }\n  }\n\n  const combined = `${cleanPath}${queryString}`;\n  if (\n    !combined.startsWith("/") ||\n    combined.startsWith("//") ||\n    combined.includes("\\\\") ||\n    /^[a-z0-9+.-]+:/i.test(combined)\n  ) {\n    return fallback;\n  }\n\n  return combined;\n}\n\n/**\n * Public calculator surface.\n *\n * Calculator math and inputs are intentionally available to guests. Session\n * state is exposed only as metadata so account-aware child actions can decide\n * whether to offer persistence/history/share capabilities.\n */\nexport default function InteractiveCalculatorGate({\n  children,\n}: InteractiveCalculatorGateProps) {\n  const { status } = useSession();\n  const authState =\n    status === "authenticated"\n      ? "authenticated"\n      : status === "loading"\n        ? "loading"\n        : "guest";\n\n  return (\n    <div\n      data-testid="interactive-calculator-surface"\n      data-auth-state={authState}\n    >\n      {children}\n    </div>\n  );\n}\n''',
)

write(
    "tests/components/interactive-gate-component.test.tsx",
    '''// @vitest-environment jsdom\nimport "@testing-library/jest-dom";\nimport { describe, it, expect, vi, beforeEach } from "vitest";\nimport { render, screen } from "@testing-library/react";\nimport React from "react";\nimport InteractiveCalculatorGate from "@/components/auth/InteractiveCalculatorGate";\n\nlet mockStatus = "unauthenticated";\n\nvi.mock("next-auth/react", () => ({\n  useSession: () => ({\n    data: mockStatus === "authenticated" ? { user: { name: "Test User" } } : null,\n    status: mockStatus,\n  }),\n}));\n\ndescribe("InteractiveCalculatorGate Component", () => {\n  beforeEach(() => {\n    mockStatus = "unauthenticated";\n  });\n\n  it("renders calculator content for unauthenticated guests", () => {\n    render(\n      <InteractiveCalculatorGate calcName="SIP Calculator">\n        <div data-testid="calculator-widget">Active Calculator Content</div>\n      </InteractiveCalculatorGate>\n    );\n\n    expect(screen.getByTestId("interactive-calculator-surface")).toHaveAttribute(\n      "data-auth-state",\n      "guest"\n    );\n    expect(screen.getByTestId("calculator-widget")).toBeInTheDocument();\n    expect(screen.queryByTestId("interactive-auth-gate")).not.toBeInTheDocument();\n  });\n\n  it("keeps calculator content visible while session state is loading", () => {\n    mockStatus = "loading";\n    render(\n      <InteractiveCalculatorGate>\n        <div data-testid="calculator-widget">Active Calculator Content</div>\n      </InteractiveCalculatorGate>\n    );\n\n    expect(screen.getByTestId("interactive-calculator-surface")).toHaveAttribute(\n      "data-auth-state",\n      "loading"\n    );\n    expect(screen.getByTestId("calculator-widget")).toBeInTheDocument();\n  });\n\n  it("marks the public calculator surface authenticated when session resolves", () => {\n    mockStatus = "authenticated";\n    render(\n      <InteractiveCalculatorGate>\n        <div data-testid="calculator-widget">Active Calculator Content</div>\n      </InteractiveCalculatorGate>\n    );\n\n    expect(screen.getByTestId("interactive-calculator-surface")).toHaveAttribute(\n      "data-auth-state",\n      "authenticated"\n    );\n    expect(screen.getByTestId("calculator-widget")).toBeInTheDocument();\n  });\n});\n''',
)

write(
    "e2e/auth-gating.spec.ts",
    '''import { test, expect } from "@playwright/test";\nimport { ALL_CALCULATOR_ROUTES } from "../lib/calculators";\nimport { CALCULATOR_REGISTRY } from "../lib/registry";\n\ntest.describe("Public Calculator Access & Account Boundaries", () => {\n  for (const route of ALL_CALCULATOR_ROUTES) {\n    test(`Unauthenticated calculator remains interactive on ${route}`, async ({ page }) => {\n      const response = await page.goto(route, { waitUntil: "domcontentloaded" });\n      expect(response?.status()).toBe(200);\n\n      await expect(page.locator("h1:visible").first()).toBeVisible();\n      await expect(page.locator("nav[aria-label='Breadcrumb']:visible").first()).toBeVisible();\n\n      const surface = page.locator('[data-testid="interactive-calculator-surface"]:visible');\n      await expect(surface).toBeVisible();\n      await expect(surface).toHaveAttribute("data-auth-state", /guest|loading/);\n      await expect(page.locator('[data-testid="interactive-auth-gate"]')).not.toBeVisible();\n\n      const bodyText = await page.innerText("body");\n      expect(bodyText).not.toMatch(/Sign in to use .*Calculator/i);\n    });\n  }\n\n  test("Calculators directory is public and displays all tools", async ({ page }) => {\n    const response = await page.goto("/calculators", { waitUntil: "domcontentloaded" });\n    expect(response?.status()).toBe(200);\n    await expect(page.locator("h1")).toContainText(/All calculators|Directory & Search/i);\n    expect(await page.locator("[role='tablist'] [role='tab']").count()).toBeGreaterThanOrEqual(6);\n  });\n\n  test("Root homepage explains that account features are optional", async ({ page }) => {\n    const response = await page.goto("/", { waitUntil: "domcontentloaded" });\n    expect(response?.status()).toBe(200);\n    await expect(page.locator("h1")).toContainText(/Financial calculations for India/i);\n    await expect(page.getByRole("link", { name: /browse calculators|explore all 31 calculators/i })).toBeVisible();\n  });\n});\n\ntest.describe("Authenticated User Experience", () => {\n  test.beforeEach(async ({ context, baseURL }) => {\n    const targetUrl = baseURL || "http://localhost:3000";\n    await context.addCookies([\n      { name: "authjs.session-token", value: "test-e2e-session-token", url: targetUrl },\n      { name: "next-auth.session-token", value: "test-e2e-session-token", url: targetUrl },\n    ]);\n  });\n\n  test("Authenticated root renders WorkspaceHome", async ({ page }) => {\n    const response = await page.goto("/", { waitUntil: "domcontentloaded" });\n    expect(response?.status()).toBe(200);\n    await expect(page.locator("h1")).toContainText(/Welcome back, Test/i);\n  });\n\n  for (const route of ["/sip", "/tax", "/emi", "/fno-brokerage", "/dcf-valuation"]) {\n    test(`Authenticated calculator surface remains available on ${route}`, async ({ page }) => {\n      const response = await page.goto(route, { waitUntil: "domcontentloaded" });\n      expect(response?.status()).toBe(200);\n      const surface = page.locator('[data-testid="interactive-calculator-surface"]');\n      await expect(surface).toBeVisible();\n      await expect(surface).toHaveAttribute("data-auth-state", "authenticated");\n      await expect(page.locator('[data-testid="interactive-auth-gate"]')).not.toBeVisible();\n    });\n  }\n});\n\ntest.describe("Registry-Driven Public Surface Invariants", () => {\n  test("All 31 calculators remain registered at canonical routes", () => {\n    expect(CALCULATOR_REGISTRY.length).toBe(31);\n    for (const calc of CALCULATOR_REGISTRY) {\n      expect(calc.route).toMatch(/^\\/[a-z0-9-]+$/);\n      expect(ALL_CALCULATOR_ROUTES).toContain(calc.route);\n    }\n  });\n});\n''',
)

# ---------------------------------------------------------------------------
# 3) Canonical supported-vs-UI numeric ranges for saveable calculators.
#    UI ranges may intentionally be narrower, but must never exceed the server
#    supported range (which previously caused high-value SIP saves to fail).
# ---------------------------------------------------------------------------
write(
    "lib/constants/calculator-input-limits.ts",
    '''export interface NumericInputRange {\n  min: number;\n  max: number;\n  step?: number;\n}\n\nexport interface NumericInputContract {\n  supported: NumericInputRange;\n  ui: NumericInputRange;\n}\n\nexport const CALCULATOR_INPUT_LIMITS = {\n  sip: {\n    monthlyAmount: {\n      supported: { min: 100, max: 10_000_000 },\n      ui: { min: 500, max: 10_000_000, step: 500 },\n    },\n    annualRate: {\n      supported: { min: 0.1, max: 50 },\n      ui: { min: 1, max: 40, step: 0.5 },\n    },\n    years: {\n      supported: { min: 1, max: 50 },\n      ui: { min: 1, max: 40, step: 1 },\n    },\n  },\n  emi: {\n    principal: {\n      supported: { min: 1_000, max: 1_000_000_000 },\n      ui: { min: 10_000, max: 1_000_000_000, step: 10_000 },\n    },\n    annualRate: {\n      supported: { min: 0.1, max: 50 },\n      ui: { min: 1, max: 36, step: 0.1 },\n    },\n    tenureMonths: {\n      supported: { min: 1, max: 600 },\n      ui: { min: 12, max: 360, step: 1 },\n    },\n  },\n  fd: {\n    principal: {\n      supported: { min: 1_000, max: 1_000_000_000 },\n      ui: { min: 1_000, max: 1_000_000_000, step: 5_000 },\n    },\n    annualRate: {\n      supported: { min: 0.1, max: 20 },\n      ui: { min: 1, max: 20, step: 0.1 },\n    },\n    tenureYears: {\n      supported: { min: 0.25, max: 30 },\n      ui: { min: 1, max: 30, step: 1 },\n    },\n  },\n  ppf: {\n    yearlyInvestment: {\n      supported: { min: 500, max: 150_000 },\n      ui: { min: 500, max: 150_000, step: 500 },\n    },\n    years: {\n      supported: { min: 15, max: 50 },\n      ui: { min: 15, max: 50, step: 1 },\n    },\n    rate: {\n      supported: { min: 1, max: 15 },\n      ui: { min: 1, max: 15, step: 0.1 },\n    },\n  },\n  lumpsum: {\n    principal: {\n      supported: { min: 100, max: 1_000_000_000 },\n      ui: { min: 1_000, max: 1_000_000_000, step: 10_000 },\n    },\n    annualRate: {\n      supported: { min: 0.1, max: 50 },\n      ui: { min: 1, max: 50, step: 0.5 },\n    },\n    years: {\n      supported: { min: 1, max: 50 },\n      ui: { min: 1, max: 50, step: 1 },\n    },\n  },\n} as const;\n''',
)

# Wire validation schemas to supported limits. The only behavior expansion is
# SIP monthlyAmount max 10L -> 1Cr, matching the already-shipped UI maximum.
validations_rel = "lib/validations.ts"
insert_once(
    validations_rel,
    'import { MAX_INPUT_LIMITS } from "@/lib/constants/tax-year-2026-27";\n',
    'import { CALCULATOR_INPUT_LIMITS } from "@/lib/constants/calculator-input-limits";\n',
)
validation_replacements = {
    '.min(100, "Minimum monthly investment is ₹100")\n    .max(10_00_000, "Maximum monthly investment is ₹10,00,000")':
        '.min(CALCULATOR_INPUT_LIMITS.sip.monthlyAmount.supported.min, "Minimum monthly investment is ₹100")\n    .max(CALCULATOR_INPUT_LIMITS.sip.monthlyAmount.supported.max, "Maximum monthly investment is ₹1 Crore")',
    '.min(0.1, "Minimum rate is 0.1%")\n    .max(50, "Maximum rate is 50%")':
        '.min(CALCULATOR_INPUT_LIMITS.sip.annualRate.supported.min, "Minimum rate is 0.1%")\n    .max(CALCULATOR_INPUT_LIMITS.sip.annualRate.supported.max, "Maximum rate is 50%")',
    '.min(1, "Minimum period is 1 year")\n    .max(50, "Maximum period is 50 years")':
        '.min(CALCULATOR_INPUT_LIMITS.sip.years.supported.min, "Minimum period is 1 year")\n    .max(CALCULATOR_INPUT_LIMITS.sip.years.supported.max, "Maximum period is 50 years")',
}
text = read(validations_rel)
for old, new in validation_replacements.items():
    # The rate and period fragments also occur in lumpsum; replace only first now.
    if old not in text:
        raise RuntimeError(f"{validations_rel}: missing SIP validation fragment {old!r}")
    text = text.replace(old, new, 1)
write(validations_rel, text)

# Remaining saveable schemas use their supported limit constants while keeping
# existing semantics/messages.
validation_exact = [
    ('    .min(1000, "Minimum loan amount is ₹1,000")\n    .max(100_00_00_000, "Maximum loan amount is ₹100 Crore")',
     '    .min(CALCULATOR_INPUT_LIMITS.emi.principal.supported.min, "Minimum loan amount is ₹1,000")\n    .max(CALCULATOR_INPUT_LIMITS.emi.principal.supported.max, "Maximum loan amount is ₹100 Crore")'),
    ('    .min(0.1, "Minimum rate is 0.1%")\n    .max(50, "Maximum rate is 50%")',
     '    .min(CALCULATOR_INPUT_LIMITS.emi.annualRate.supported.min, "Minimum rate is 0.1%")\n    .max(CALCULATOR_INPUT_LIMITS.emi.annualRate.supported.max, "Maximum rate is 50%")'),
    ('    .min(1, "Minimum tenure is 1 month")\n    .max(600, "Maximum tenure is 600 months (50 years)")',
     '    .min(CALCULATOR_INPUT_LIMITS.emi.tenureMonths.supported.min, "Minimum tenure is 1 month")\n    .max(CALCULATOR_INPUT_LIMITS.emi.tenureMonths.supported.max, "Maximum tenure is 600 months (50 years)")'),
    ('    .min(1000, "Minimum deposit is ₹1,000")\n    .max(100_00_00_000, "Maximum deposit is ₹100 Crore")',
     '    .min(CALCULATOR_INPUT_LIMITS.fd.principal.supported.min, "Minimum deposit is ₹1,000")\n    .max(CALCULATOR_INPUT_LIMITS.fd.principal.supported.max, "Maximum deposit is ₹100 Crore")'),
    ('    .min(0.1, "Minimum rate is 0.1%")\n    .max(20, "Maximum rate is 20%")',
     '    .min(CALCULATOR_INPUT_LIMITS.fd.annualRate.supported.min, "Minimum rate is 0.1%")\n    .max(CALCULATOR_INPUT_LIMITS.fd.annualRate.supported.max, "Maximum rate is 20%")'),
    ('    .min(0.25, "Minimum tenure is 3 months")\n    .max(30, "Maximum tenure is 30 years")',
     '    .min(CALCULATOR_INPUT_LIMITS.fd.tenureYears.supported.min, "Minimum tenure is 3 months")\n    .max(CALCULATOR_INPUT_LIMITS.fd.tenureYears.supported.max, "Maximum tenure is 30 years")'),
    ('    .min(500, "Minimum yearly investment is ₹500")\n    .max(150000, "Maximum yearly investment is ₹1,50,000 (Section 80C limit)")',
     '    .min(CALCULATOR_INPUT_LIMITS.ppf.yearlyInvestment.supported.min, "Minimum yearly investment is ₹500")\n    .max(CALCULATOR_INPUT_LIMITS.ppf.yearlyInvestment.supported.max, "Maximum yearly investment is ₹1,50,000 (Section 80C limit)")'),
    ('    .min(15, "PPF has a minimum lock-in of 15 years")\n    .max(50, "Maximum period is 50 years")',
     '    .min(CALCULATOR_INPUT_LIMITS.ppf.years.supported.min, "PPF has a minimum lock-in of 15 years")\n    .max(CALCULATOR_INPUT_LIMITS.ppf.years.supported.max, "Maximum period is 50 years")'),
    ('    .min(1, "Minimum rate is 1%")\n    .max(15, "Maximum rate is 15%")',
     '    .min(CALCULATOR_INPUT_LIMITS.ppf.rate.supported.min, "Minimum rate is 1%")\n    .max(CALCULATOR_INPUT_LIMITS.ppf.rate.supported.max, "Maximum rate is 15%")'),
    ('    .min(100, "Minimum investment is ₹100")\n    .max(100_00_00_000, "Maximum investment is ₹100 Crore")',
     '    .min(CALCULATOR_INPUT_LIMITS.lumpsum.principal.supported.min, "Minimum investment is ₹100")\n    .max(CALCULATOR_INPUT_LIMITS.lumpsum.principal.supported.max, "Maximum investment is ₹100 Crore")'),
    ('    .min(0.1, "Minimum rate is 0.1%")\n    .max(50, "Maximum rate is 50%")',
     '    .min(CALCULATOR_INPUT_LIMITS.lumpsum.annualRate.supported.min, "Minimum rate is 0.1%")\n    .max(CALCULATOR_INPUT_LIMITS.lumpsum.annualRate.supported.max, "Maximum rate is 50%")'),
    ('    .min(1, "Minimum period is 1 year")\n    .max(50, "Maximum period is 50 years")',
     '    .min(CALCULATOR_INPUT_LIMITS.lumpsum.years.supported.min, "Minimum period is 1 year")\n    .max(CALCULATOR_INPUT_LIMITS.lumpsum.years.supported.max, "Maximum period is 50 years")'),
]
text = read(validations_rel)
for old, new in validation_exact:
    if text.count(old) != 1:
        raise RuntimeError(f"{validations_rel}: expected one validation fragment, found {text.count(old)}: {old!r}")
    text = text.replace(old, new, 1)
write(validations_rel, text)

# Client UI controls consume the UI subset of the same contracts.
component_specs = [
    (
        "components/calculators/sip/SIPCalculator.tsx",
        'import { cn } from "@/lib/utils";\n',
        "SIP_LIMITS",
        "sip",
        [
            ('min={500}\n                max={10000000}\n                step={500}', 'min={SIP_LIMITS.monthlyAmount.ui.min}\n                max={SIP_LIMITS.monthlyAmount.ui.max}\n                step={SIP_LIMITS.monthlyAmount.ui.step}'),
            ('min={1}\n                max={40}\n                step={0.5}', 'min={SIP_LIMITS.annualRate.ui.min}\n                max={SIP_LIMITS.annualRate.ui.max}\n                step={SIP_LIMITS.annualRate.ui.step}'),
            ('min={1}\n                max={40}\n                step={1}', 'min={SIP_LIMITS.years.ui.min}\n                max={SIP_LIMITS.years.ui.max}\n                step={SIP_LIMITS.years.ui.step}'),
        ],
    ),
    (
        "components/calculators/emi/EMICalculator.tsx",
        'import { clsx } from "clsx";\n',
        "EMI_LIMITS",
        "emi",
        [
            ('min={10000} max={1000000000} step={10000}', 'min={EMI_LIMITS.principal.ui.min} max={EMI_LIMITS.principal.ui.max} step={EMI_LIMITS.principal.ui.step}'),
            ('min={1} max={36} step={0.1}', 'min={EMI_LIMITS.annualRate.ui.min} max={EMI_LIMITS.annualRate.ui.max} step={EMI_LIMITS.annualRate.ui.step}'),
            ('min={1} max={30} step={1}', 'min={EMI_LIMITS.tenureMonths.ui.min / 12} max={EMI_LIMITS.tenureMonths.ui.max / 12} step={1}'),
            ('min={12} max={360} step={1}', 'min={EMI_LIMITS.tenureMonths.ui.min} max={EMI_LIMITS.tenureMonths.ui.max} step={EMI_LIMITS.tenureMonths.ui.step}'),
        ],
    ),
    (
        "components/calculators/fd/FDCalculator.tsx",
        'import { clsx } from "clsx";\n',
        "FD_LIMITS",
        "fd",
        [
            ('min={1000} max={1000000000} step={5000}', 'min={FD_LIMITS.principal.ui.min} max={FD_LIMITS.principal.ui.max} step={FD_LIMITS.principal.ui.step}'),
            ('min={1} max={20} step={0.1}', 'min={FD_LIMITS.annualRate.ui.min} max={FD_LIMITS.annualRate.ui.max} step={FD_LIMITS.annualRate.ui.step}'),
            ('min={1} max={30} step={1}', 'min={FD_LIMITS.tenureYears.ui.min} max={FD_LIMITS.tenureYears.ui.max} step={FD_LIMITS.tenureYears.ui.step}'),
        ],
    ),
    (
        "components/calculators/ppf/PPFCalculator.tsx",
        'import { generatePPFInsights } from "@/lib/insights";\n',
        "PPF_LIMITS",
        "ppf",
        [
            ('min={500} max={150000} step={500}', 'min={PPF_LIMITS.yearlyInvestment.ui.min} max={PPF_LIMITS.yearlyInvestment.ui.max} step={PPF_LIMITS.yearlyInvestment.ui.step}'),
            ('min={15} max={50} step={1}', 'min={PPF_LIMITS.years.ui.min} max={PPF_LIMITS.years.ui.max} step={PPF_LIMITS.years.ui.step}'),
            ('min={1} max={15} step={0.1}', 'min={PPF_LIMITS.rate.ui.min} max={PPF_LIMITS.rate.ui.max} step={PPF_LIMITS.rate.ui.step}'),
        ],
    ),
    (
        "components/calculators/lumpsum/LumpsumCalculator.tsx",
        'import { generateLumpsumInsights } from "@/lib/insights";\n',
        "LUMPSUM_LIMITS",
        "lumpsum",
        [
            ('min={1000} max={1000000000} step={10000}', 'min={LUMPSUM_LIMITS.principal.ui.min} max={LUMPSUM_LIMITS.principal.ui.max} step={LUMPSUM_LIMITS.principal.ui.step}'),
            ('min={1} max={50} step={0.5}', 'min={LUMPSUM_LIMITS.annualRate.ui.min} max={LUMPSUM_LIMITS.annualRate.ui.max} step={LUMPSUM_LIMITS.annualRate.ui.step}'),
            ('min={1} max={50} step={1}', 'min={LUMPSUM_LIMITS.years.ui.min} max={LUMPSUM_LIMITS.years.ui.max} step={LUMPSUM_LIMITS.years.ui.step}'),
        ],
    ),
]

for rel, import_anchor, alias, key, replacements in component_specs:
    insert_once(
        rel,
        import_anchor,
        'import { CALCULATOR_INPUT_LIMITS } from "@/lib/constants/calculator-input-limits";\n',
    )
    text = read(rel)
    function_anchor = "export default function "
    idx = text.find(function_anchor)
    if idx < 0:
        raise RuntimeError(f"{rel}: cannot locate component function")
    alias_line = f"const {alias} = CALCULATOR_INPUT_LIMITS.{key};\n\n"
    if alias_line not in text:
        text = text[:idx] + alias_line + text[idx:]
    for old, new in replacements:
        if text.count(old) != 1:
            raise RuntimeError(f"{rel}: expected one UI bounds fragment, found {text.count(old)}: {old!r}")
        text = text.replace(old, new, 1)
    write(rel, text)

write(
    "tests/input-contract-parity.test.ts",
    '''import { describe, expect, it } from "vitest";\nimport { CALCULATOR_INPUT_LIMITS } from "@/lib/constants/calculator-input-limits";\nimport { emiSchema, fdSchema, lumpsumSchema, ppfSchema, sipSchema } from "@/lib/validations";\n\ntype RangeContract = {\n  supported: { min: number; max: number };\n  ui: { min: number; max: number; step?: number };\n};\n\nfunction expectUiWithinSupported(contract: RangeContract) {\n  expect(contract.ui.min).toBeGreaterThanOrEqual(contract.supported.min);\n  expect(contract.ui.max).toBeLessThanOrEqual(contract.supported.max);\n  expect(contract.ui.min).toBeLessThanOrEqual(contract.ui.max);\n}\n\ndescribe("saveable calculator input contract parity", () => {\n  it("keeps every shipped UI range inside its server-supported range", () => {\n    for (const calculator of Object.values(CALCULATOR_INPUT_LIMITS)) {\n      for (const contract of Object.values(calculator)) {\n        expectUiWithinSupported(contract as RangeContract);\n      }\n    }\n  });\n\n  it("accepts both UI extremes for SIP, including the ₹1Cr/month high-value case", () => {\n    const limits = CALCULATOR_INPUT_LIMITS.sip;\n    const base = { monthlyAmount: 25_000, annualRate: 12, years: 10 };\n    expect(sipSchema.safeParse({ ...base, monthlyAmount: limits.monthlyAmount.ui.min }).success).toBe(true);\n    expect(sipSchema.safeParse({ ...base, monthlyAmount: limits.monthlyAmount.ui.max }).success).toBe(true);\n    expect(sipSchema.safeParse({ ...base, annualRate: limits.annualRate.ui.min }).success).toBe(true);\n    expect(sipSchema.safeParse({ ...base, annualRate: limits.annualRate.ui.max }).success).toBe(true);\n    expect(sipSchema.safeParse({ ...base, years: limits.years.ui.min }).success).toBe(true);\n    expect(sipSchema.safeParse({ ...base, years: limits.years.ui.max }).success).toBe(true);\n  });\n\n  it("accepts UI extremes for EMI, FD, PPF and lumpsum", () => {\n    const emi = CALCULATOR_INPUT_LIMITS.emi;\n    const emiBase = { principal: 3_000_000, annualRate: 8.5, tenureMonths: 240 };\n    expect(emiSchema.safeParse({ ...emiBase, principal: emi.principal.ui.max }).success).toBe(true);\n    expect(emiSchema.safeParse({ ...emiBase, annualRate: emi.annualRate.ui.max }).success).toBe(true);\n    expect(emiSchema.safeParse({ ...emiBase, tenureMonths: emi.tenureMonths.ui.max }).success).toBe(true);\n\n    const fd = CALCULATOR_INPUT_LIMITS.fd;\n    const fdBase = { principal: 100_000, annualRate: 7, tenureYears: 3, compoundingFrequency: 4 as const };\n    expect(fdSchema.safeParse({ ...fdBase, principal: fd.principal.ui.max }).success).toBe(true);\n    expect(fdSchema.safeParse({ ...fdBase, tenureYears: fd.tenureYears.ui.min }).success).toBe(true);\n\n    const ppf = CALCULATOR_INPUT_LIMITS.ppf;\n    const ppfBase = { yearlyInvestment: 150_000, years: 15, rate: 7.1 };\n    expect(ppfSchema.safeParse({ ...ppfBase, yearlyInvestment: ppf.yearlyInvestment.ui.max }).success).toBe(true);\n    expect(ppfSchema.safeParse({ ...ppfBase, years: ppf.years.ui.max }).success).toBe(true);\n\n    const lumpsum = CALCULATOR_INPUT_LIMITS.lumpsum;\n    const lumpsumBase = { principal: 500_000, annualRate: 12, years: 10 };\n    expect(lumpsumSchema.safeParse({ ...lumpsumBase, principal: lumpsum.principal.ui.max }).success).toBe(true);\n    expect(lumpsumSchema.safeParse({ ...lumpsumBase, annualRate: lumpsum.annualRate.ui.max }).success).toBe(true);\n  });\n});\n''',
)

# ---------------------------------------------------------------------------
# 4) Strict financial shorthand parsing: reject partial garbage like "12abc".
# ---------------------------------------------------------------------------
hybrid_rel = "components/ui/HybridInput.tsx"
hybrid = read(hybrid_rel)
parse_pattern = re.compile(
    r"function parseInput\(raw: string\): number \{.*?\n\}\n\nfunction formatDisplayValue",
    re.S,
)
strict_parser = '''export function parseFinancialInput(raw: string): number {\n  const cleaned = raw\n    .trim()\n    .replace(/₹/g, "")\n    .replace(/,/g, "")\n    .replace(/\\s/g, "")\n    .toUpperCase();\n\n  if (!cleaned) return NaN;\n\n  const match = cleaned.match(/^([+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))(CR|L|K)?$/);\n  if (!match) return NaN;\n\n  const base = Number(match[1]);\n  if (!Number.isFinite(base)) return NaN;\n\n  const multiplier =\n    match[2] === "CR" ? 10_000_000 : match[2] === "L" ? 100_000 : match[2] === "K" ? 1_000 : 1;\n  const value = base * multiplier;\n  return Number.isFinite(value) ? value : NaN;\n}\n\nfunction formatDisplayValue'''
if len(parse_pattern.findall(hybrid)) != 1:
    raise RuntimeError("HybridInput parser block did not match exactly once")
hybrid = parse_pattern.sub(strict_parser, hybrid, count=1)
hybrid = hybrid.replace("parseInput(", "parseFinancialInput(")
write(hybrid_rel, hybrid)

write(
    "tests/hybrid-input-parser.test.ts",
    '''import { describe, expect, it } from "vitest";\nimport { parseFinancialInput } from "@/components/ui/HybridInput";\n\ndescribe("parseFinancialInput", () => {\n  it("parses Indian financial shorthand exactly", () => {\n    expect(parseFinancialInput("₹1.5Cr")).toBe(15_000_000);\n    expect(parseFinancialInput("5L")).toBe(500_000);\n    expect(parseFinancialInput("10k")).toBe(10_000);\n    expect(parseFinancialInput("1,25,000")).toBe(125_000);\n  });\n\n  it("rejects partial or malformed numeric strings instead of parseFloat-prefix acceptance", () => {\n    expect(Number.isNaN(parseFinancialInput("12abc"))).toBe(true);\n    expect(Number.isNaN(parseFinancialInput("1.2.3L"))).toBe(true);\n    expect(Number.isNaN(parseFinancialInput("Cr10"))).toBe(true);\n    expect(Number.isNaN(parseFinancialInput(""))).toBe(true);\n  });\n});\n''',
)

# ---------------------------------------------------------------------------
# 5) Regression tests for the statutory mapping and public tax copy.
# ---------------------------------------------------------------------------
write(
    "tests/tax-year-2026-27-statute.test.ts",
    '''import { describe, expect, it } from "vitest";\nimport fs from "fs";\nimport path from "path";\nimport { calcTax } from "@/lib/math";\nimport { REBATE_SECTION_156, REBATE_SECTION_157 } from "@/lib/constants/tax-year-2026-27";\n\ndescribe("Income-tax Act, 2025 Section 156 statutory mapping", () => {\n  it("uses Section 156 as the canonical individual rebate provision", () => {\n    expect(REBATE_SECTION_156.sectionName).toContain("Section 156");\n    expect(REBATE_SECTION_157).toBe(REBATE_SECTION_156);\n\n    const result = calcTax({ grossIncome: 1_275_000, regime: "new" });\n    expect(result.totalTax).toBe(0);\n    expect(result.rebateSection).toContain("Section 156");\n    expect(result.rebateSection).not.toContain("Section 157");\n  });\n\n  it("does not expose the incorrect Section 157 rebate label in user-facing tax surfaces", () => {\n    const files = [\n      "app/tax/page.tsx",\n      "components/calculators/tax/TaxCalculator.tsx",\n      "components/seo/TaxInfo.tsx",\n      "lib/registry.ts",\n      "lib/calculator-contracts.ts",\n    ];\n\n    for (const file of files) {\n      const content = fs.readFileSync(path.resolve(process.cwd(), file), "utf-8");\n      expect(content, file).not.toMatch(/Section 157/i);\n    }\n  });\n});\n''',
)

write(
    "e2e/core-parameter-interactions.spec.ts",
    '''import { test, expect } from "@playwright/test";\n\nconst cases = [\n  { route: "/sip", label: "Monthly Investment", value: "50000" },\n  { route: "/emi", label: "Loan Amount", value: "5000000" },\n  { route: "/fd", label: "Principal Amount", value: "500000" },\n  { route: "/ppf", label: "Yearly Investment", value: "100000" },\n  { route: "/lumpsum", label: "Investment Amount", value: "1000000" },\n] as const;\n\ntest.describe("Core calculator parameter interactions for public guests", () => {\n  for (const scenario of cases) {\n    test(`${scenario.route} accepts direct numeric input without authentication`, async ({ page }) => {\n      const pageErrors: Error[] = [];\n      page.on("pageerror", (error) => pageErrors.push(error));\n\n      await page.goto(scenario.route, { waitUntil: "domcontentloaded" });\n      const surface = page.locator('[data-testid="interactive-calculator-surface"]');\n      await expect(surface).toBeVisible();\n\n      const input = page.getByLabel(scenario.label, { exact: true });\n      await expect(input).toBeVisible();\n      await input.fill(scenario.value);\n      await input.press("Enter");\n\n      const bodyText = await page.innerText("body");\n      expect(bodyText).not.toMatch(/\\bNaN\\b|\\bundefined\\b|\\bInfinity\\b/);\n      expect(pageErrors).toEqual([]);\n    });\n  }\n});\n''',
)

# Final sanity assertions before CI takes over.
constants = read(constants_rel)
if 'export const REBATE_SECTION_156 = {' not in constants:
    raise RuntimeError("Section 156 canonical constant missing after migration")
if 'export const REBATE_SECTION_157 = REBATE_SECTION_156;' not in constants:
    raise RuntimeError("Deprecated Section 157 compatibility alias missing")

math = read("lib/math.ts")
if "REBATE_SECTION_157" in math or "Section 157" in math:
    raise RuntimeError("math.ts still contains deprecated Section 157 rebate references")

print("P0/P1 audit codemod applied successfully.")
