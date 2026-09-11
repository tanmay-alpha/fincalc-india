# FinCalc India: hardening and expansion design

## Scope and delivery order

The current application contains 31 calculator routes. This change hardens all
31 rather than treating the historical count of 25 as a boundary. Delivery is
strictly ordered: baseline repair, feature engines with tests, feature UI,
cross-cutting export/share/compare, then live deployment verification.

Each corrective change and each feature is committed independently. A commit is
pushed only after its focused tests, full suite, lint, typecheck, and production
build pass. Deployment checks are performed after the deployed revision is
available and are reported separately from local verification.

## Existing-code boundary

`lib/math.ts` remains the sole calculator engine. Statutory values remain in
`lib/constants/tax-year-2026-27.ts`; calculators must not duplicate them.
Calculator UIs retain the existing component pattern: client input state,
debounced pure calculation, `ResultHero`, chart island, and calculated
`InsightCard` data. New visual components are thin views over typed engine
output, never a second source of financial logic.

## Hardening

The first repair widens the Capital Gains sale-CII input through the current
engine-supported tax year. Its regression test proves the UI/engine boundary
can select that year. All existing engine functions receive a coverage map,
negative/zero/boundary checks, and explicit checks for statutory calculations
that have a user-visible label. Console calls remain permissible only in API
error handling and React error boundaries.

The audit has already confirmed 423 passing tests, clean lint/typecheck, and a
successful production build. It also confirmed that all 31 deployed calculator
pages render a primary heading without an application-error surface.

## New financial engines

Each function is pure, typed, finite-number safe, and tested before its
implementation.

- `calcInHandFromCTC`: builds the salary breakup, employer benefits, PF
  perquisite treatment, HRA exemption, and current tax-engine deduction into
  annual and monthly cash in hand. Percentages are validated against CTC and
  gratuity is displayed but excluded from cash salary.
- `calcSWP`: produces monthly beginning balance, withdrawal, growth and ending
  balance rows. It stops exactly at depletion without negative corpus and
  reports a perpetual-growth case.
- `calcFixedIncomeComparison`: compares adjustable RD, NSC, SCSS, SSY, PPF and
  FD inputs. RD uses monthly deposits; SCSS exposes periodic payout rather
  than pretending it compounds. Eligibility messages are descriptive, not
  artificial blocks.
- `calcBuyVsRent`: uses the canonical EMI schedule and an annual cash-flow
  model. Purchase includes upfront costs, recurring maintenance and home
  equity; rent includes escalation and investment of the cash-flow difference.
- `calcHumanLifeValue`: discounts income-replacement cash flows and adjusts
  for liabilities, future goals, assets, and existing cover. Extra cover is
  clamped only at zero.
- `calcFIRE` gains an optional Coast-FIRE projection which reuses its target
  corpus formula. It returns today's coast number, shortfall, and the monthly
  saving needed to reach coast status by the chosen target date.
- `calcNetWorth`: aggregates typed asset and liability categories without
  clamping a negative result; it returns allocation, liquid assets and a
  liquidity ratio.
- `calcBudgetVariance`: normalizes the union of planned and actual categories,
  returns reconciled waterfall rows and detects the largest adverse driver.

## Cross-cutting calculation portability

A small calculator-metadata registry will describe each calculator's route,
title, serializable input schema, result summary, and export labels. It avoids
copying URL/PDF/compare behavior into 39 pages.

- A versioned URL codec serializes only validated public inputs. Decoding
  rejects malformed, unknown or non-finite values and falls back to defaults.
- Scenario comparison stores up to three named validated input snapshots in
  local component state for the active session. It has no account or server
  persistence.
- A client-only PDF module produces a textual inputs/results document using a
  lightweight maintained PDF package. PDF construction receives formatted
  values from calculator output rather than recomputing amounts.

Rollout is by an adapter on every existing and new calculator. The adapter is
tested independently; representative integration tests cover two and three
scenario layouts, URL round trips, and rendered PDF result text.

## UI and visual design

No second icon library is introduced: Lucide remains the component-icon source.
Existing emoji in user-selected scheme labels are not treated as a new library.

- CTC uses a Recharts Sankey flow for CTC to cash/benefit/tax movement.
- Net Worth uses a Recharts Treemap and an assets-to-liabilities Sankey flow.
- Coast FIRE adds a radial progress gauge next to the existing timeline chart.
- Budget Variance uses a reconciliation-safe waterfall chart. A calendar
  heatmap is deliberately deferred: a single-month, session-only feature has
  no month history to show honestly.
- Capital Gains may receive a gross-gain-to-net-proceeds waterfall only if it
  can consume the existing typed result without duplicating tax logic.

All additions use keyboard-operable controls, visible focus states, responsive
one-column behavior at small widths, empty/zero states, and reduced-motion-safe
transitions. The aesthetic pass favors clear financial hierarchy: a readable
result, a one-line computed insight, then optional visual detail.

## Verification standard

For every engine or correction: write a focused Vitest test first, run it to
expected failure, implement the minimum behavior, rerun it, then run the full
suite. New engines receive at least eight edge/boundary tests; statutory inputs
also receive source-linked rule tests.

For every UI route: local desktop and mobile smoke tests cover rendering,
default calculation, a changed input, invalid input feedback, and chart/table
reconciliation. URL and scenario tests verify exact result reproduction. PDF
tests inspect generated text and a rendered page spot-check. Production checks
verify HTTP response, visible heading, changed-input result, browser console,
and responsive layout after Vercel deploy.

The final report distinguishes locally verified behavior, deployed behavior,
and legal/rate assumptions that require manual confirmation. In particular,
the aggregate employer PF contribution threshold and all quarterly small-savings
rates remain clearly date-stamped assumptions.
