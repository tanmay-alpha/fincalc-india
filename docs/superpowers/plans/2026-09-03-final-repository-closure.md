# Final Repository Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Safely freeze the current 31-calculator engine by aligning contracts, persistence, statutory calculations, testing, accessibility, security, and documentation.

**Architecture:** Keep `CALCULATOR_REGISTRY` as the route catalog and add typed calculator contracts that bind each saveable calculator to exactly one input schema and canonical engine function. The save API resolves a contract, parses untrusted inputs, recomputes output, and persists only server output; sharing becomes a separately activated public capability.

**Tech Stack:** Next.js 15 App Router, TypeScript, Zod 4, Prisma/PostgreSQL, NextAuth, Vitest, Testing Library, Playwright, Axe.

**Spec:** `docs/superpowers/specs/2026-09-03-final-repository-closure-design.md`

## Global Constraints

- Do not add calculators, routes, or UI redesigns.
- Derive calculator ids and routes from `CALCULATOR_REGISTRY`; never re-create an API id switch.
- Write and run a focused failing test before every financial or persistence behavior change.
- Persist canonical server output only; input URL state and request bodies are untrusted.
- Prefer explicit validation or `cannot determine` output to invented financial data or silent clamping.
- Use primary official sources for Tax Year 2026-27 and retain legacy references only as labelled crosswalks.
- Make private save the default; publishing must be explicit, revocable, ownership-checked, and token-safe.
- Do not use `npm audit fix --force` and do not merge the final PR.

---

### Task 1: Contract registry and audit invariants

**Files:**
- Create: `lib/calculator-contracts.ts`, `tests/calculator-contracts.test.ts`
- Modify: `lib/calculators.ts`, `docs/final-audit-matrix.md`

**Interfaces:**
- Produces `CalculatorContract<I, O>`, `CALCULATOR_CONTRACTS`, and `getCalculatorContract(id)`.
- `CalculatorContract` contains `id`, `route`, `inputSchema`, `calculate`, `saveSupported`, `shareSupported`, and optional regulatory metadata.

- [ ] Write tests that assert every registered id and route is unique, every contract points to a registered route, save support always includes schema/calculation, and contract count equals registry count.
- [ ] Run `npm test -- tests/calculator-contracts.test.ts` and record the expected missing-module failure.
- [ ] Add the registry with all 31 entries; unsupported persistence remains `saveSupported: false` rather than being guessed.
- [ ] Run the focused test and `npm test`; update the audit matrix with final contract state.
- [ ] Commit `test: establish calculator contract invariants`.

### Task 2: Inputs-only save and bounded API body parsing

**Files:**
- Modify: `app/api/calculate/[type]/route.ts`, `components/SaveCalculationButton.tsx`, `tests/api/api-routes.test.ts`
- Test: `tests/api/calculate-integrity.test.ts`

**Interfaces:**
- Request shape is `{ inputs: Record<string, unknown> }`; `results` is optional diagnostic data and never persisted.
- Route resolves `getCalculatorContract(type)`, calls `inputSchema.safeParse(inputs)`, then `calculate(parsed.data)`.

- [ ] Add failing API tests for forged SIP and tax outputs, missing inputs, arrays, malformed JSON, declared oversized payload, and actual oversized chunked payload.
- [ ] Run the focused API tests to observe client-output persistence and unbounded-body failures.
- [ ] Implement byte-bounded text reading before JSON parsing, input-object validation, contract lookup, server calculation, and a 400/413 error contract.
- [ ] Change the Save component to send inputs only and require a persisted calculation id rather than a public token.
- [ ] Run API tests and `npm test`.
- [ ] Commit `fix: recompute saved calculations on the server`.

### Task 3: Private persistence and explicit sharing

**Files:**
- Create: `prisma/migrations/<timestamp>_private_calculation_sharing/migration.sql`, `app/api/history/[id]/share/route.ts`, `tests/api/sharing.test.ts`
- Modify: `prisma/schema.prisma`, `app/api/result/[shareId]/route.ts`, `app/result/[shareId]/page.tsx`, `app/api/history/route.ts`, `app/api/history/[id]/route.ts`, `app/history/HistoryClient.tsx`, `components/ui/ShareButton.tsx`

**Interfaces:**
- `Calculation` has `isShared Boolean @default(false)` and nullable, unique `shareId`.
- `POST /api/history/:id/share` activates or rotates a token; `DELETE /api/history/:id/share` revokes it.
- Public reads query `{ shareId, isShared: true }` and omit owner identity.

- [ ] Add failing tests for private read denial, publish, revoke, rotate, malformed/nonexistent token, delete invalidation, and cross-user mutation denial.
- [ ] Run the sharing suite and observe existing public-by-default behavior.
- [ ] Add the migration and ownership-checked publish/revoke route; make history/private UI copy and ShareButton invoke explicit sharing.
- [ ] Run Prisma generation, sharing/API tests, and the full unit suite.
- [ ] Commit `fix: make saved calculations private by default`.

### Task 4: Tax contract, 112A total-income and surcharge regression fixtures

**Files:**
- Modify: `lib/validations.ts`, `lib/math.ts`, `lib/constants/tax-year-2026-27.ts`, `components/calculators/tax/TaxCalculator.tsx`
- Create: `tests/tax-112a-boundaries.test.ts`, `tests/fixtures/statutory/tax-112a-boundaries.json`

**Interfaces:**
- Tax input accepts the actual UI fields: salary, other income, dividends, business, equity/other gains, residency, age, regime, deductions, and HRA.
- Output separately exposes total-income inclusion, special-rate chargeable gain, annual threshold used, rebate, surcharge, cess, and final tax.

- [ ] Verify the current statutory source and record its URL/date in fixture metadata.
- [ ] Add failing boundaries around ₹12L rebate and ₹50L/₹1Cr/₹2Cr/₹5Cr surcharge thresholds with mixed special-rate income.
- [ ] Run only the new fixture test to establish the current defect.
- [ ] Implement component-aware total-income, rebate, surcharge, and marginal-relief calculation without treating unsupported taxpayer categories as individuals.
- [ ] Run the tax suites and full unit suite.
- [ ] Commit `fix: preserve equity LTCG in total income`.

### Task 5: Capital gains and statutory exemption correctness

**Files:**
- Modify: `lib/math.ts`, `lib/constants/tax-year-2026-27.ts`, `components/calculators/capital-gains/CapitalGainsCalculator.tsx`, `components/calculators/section-54/Section54Calculator.tsx`
- Create: `tests/capital-gains-classification.test.ts`, `tests/section82-85-86.test.ts`, `tests/fixtures/statutory/capital-gains.json`

- [ ] Add failing tests for equity threshold display semantics, CII invalid year rejection, SGB qualifying/nonqualifying paths, specified-fund conditions, STCL/LTCL scoped copy, Section 82 prior-use status/two timelines, and Section 85 aggregate cap.
- [ ] Verify and record each source before changing the related formula or crosswalk.
- [ ] Implement explicit asset classifications and inputs; reject unsupported classifications rather than applying a generic tax rate.
- [ ] Implement explicit Section 82 prior-use status, independent house timing, and prior-window Section 85 cap.
- [ ] Run focused suites and all unit tests.
- [ ] Commit `fix: harden capital gains and exemption eligibility`.

### Task 6: NPS, presumptive, HRA, NRI, US-stock, and zero-value semantics

**Files:**
- Modify: `lib/math.ts`, affected calculator components, `lib/constants/tax-year-2026-27.ts`, `README.md`
- Create: `tests/zero-input-semantics.test.ts`, `tests/nps-tax-scope.test.ts`, `tests/presumptive-scope.test.ts`

- [ ] Add failing tests for NPS employer contribution without eligible salary, zero FIRE/No-cost-EMI/Black-Scholes inputs, NRI consistent ranking metric, HRA qualifying-commission scope, and presumptive missing eligibility history.
- [ ] Verify primary sources for NPS and tax labels; add scoped rather than universal statements where the input model is insufficient.
- [ ] Replace `||` defaults only where zero is valid with `??`; provide validation or analytical results for zero-invalid/special cases.
- [ ] Run focused suites and the unit suite.
- [ ] Commit `fix: make financial input scope explicit`.

### Task 7: Analytics and state/PDF integrity

**Files:**
- Modify: `lib/math.ts`, `lib/calculation-state.ts`, `lib/calculation-pdf.ts`, option/portfolio components
- Create: `tests/option-payoff-asymptotic.test.ts`, `tests/portfolio-risk-pairing.test.ts`, `tests/calculation-state-hardening.test.ts`, `tests/calculation-pdf-pagination.test.ts`

- [ ] Add failing tests for analytical unlimited payoff, paired benchmark filtering, future codec version rejection, decoded-byte limit, invalid calculator state, and multi-page Unicode PDF layout.
- [ ] Implement exact asymptotic payoff slopes and paired observation construction.
- [ ] Require known state version/id/object payload, schema validation before calculation, and neutral PDF metadata with rendered-line pagination.
- [ ] Run focused suites and all unit tests.
- [ ] Commit `fix: harden analytics state and PDF output`.

### Task 8: Deterministic accessibility and browser workflows

**Files:**
- Modify: reusable controls, calculator components, `e2e/a11y.spec.ts`, `playwright.config.ts`
- Create: targeted workflow specs under `e2e/`
- Modify: `.github/workflows/ci.yml`

- [ ] Add failing component/a11y tests for icon labels, labelled dates, keyboard tabs/selectors/toggles/dynamic rows, and contrast with no disabled Axe rule.
- [ ] Add stable semantic Playwright workflows for tax, capital gains, Sections 82/85, NPS, LRS, XIRR, save integrity, sharing, and history.
- [ ] Remove global contrast suppression and correct source controls/styles.
- [ ] Add an a11y CI job with retries zero; keep smoke retry policy separately documented.
- [ ] Run component tests, Chromium/mobile workflows, and the retry-zero accessibility suite.
- [ ] Commit `fix: enforce deterministic calculator accessibility`.

### Task 9: Security, coverage, CSP, documentation, and CI

**Files:**
- Modify: `next.config.mjs`, `middleware.ts`, `lib/env.ts`, `.github/workflows/ci.yml`, `README.md`, `SECURITY.md`, `docs/final-audit-matrix.md`
- Create/modify: dependency overrides only when a compatible verified patch exists

- [ ] Capture `npm audit --json` before counts and identify direct/transitive/runtime exposure.
- [ ] Add coverage configuration based on measured baseline and per-critical-module/API thresholds.
- [ ] Add production CSP compatible with Next/Auth behavior; validate production secret requirements without logging secret values.
- [ ] Correct calculator count, legal wording, test/fuzz/a11y claims, current/legacy labels, and all audit statuses from measured evidence.
- [ ] Run audit, coverage, lint, typecheck, and build.
- [ ] Commit `chore: enforce closure security and evidence gates`.

### Task 10: Final clean verification and PR handoff

**Files:**
- Modify only evidence/docs produced by real verification.

- [ ] From a clean tree run `npm ci`, `npm audit --json`, `npx prisma generate`, lint, TypeScript, unit tests, coverage, build, Playwright install, desktop/mobile E2E, retry-zero a11y, and migration/integration validation.
- [ ] Inspect the final diff, current branch SHA, remote tracking state, GitHub Actions, and Vercel preview after pushing the one branch.
- [ ] Open one PR to `main`; do not merge it.
- [ ] Report only measured counts/statuses and set every freeze flag false unless its stated evidence exists.
