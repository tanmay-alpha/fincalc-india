# Final Repository Closure Design

**Goal:** Make the existing 31-calculator product internally consistent and safe to freeze for UI/UX work, without adding calculators or redesigning the UI.

## Baseline and scope

The branch starts at `c0ea00662a97f80ffcf528f44ee506209e4ac876`, which is also the current remote `main` tip. The product has 31 canonical calculator registrations. Its persistence API currently accepts client-supplied output, exposes every saved record by its generated token, and only knows six input schemas despite Save controls being present across many more calculators.

This closure is intentionally limited to existing calculator contracts, financial/statutory correctness, persistence/privacy, security, accessibility determinism, test/CI enforcement, and accurate documentation. It does not add routes, calculators, product data, or UI redesigns.

## Architecture

`CALCULATOR_REGISTRY` remains the authoritative route catalog. A second typed `CALCULATOR_CONTRACTS` registry links a calculator id to its route, Zod input schema, canonical engine calculation function, persistence capability, sharing capability, and optional regulatory metadata. The registry is the only source used by the save API; it computes the output on the server after parsing inputs and never trusts the submitted result.

Persistence separates a private saved calculation from a public share. A private calculation has no active public token. Explicit sharing activates an unpredictable token; unsharing revokes it. Public reads must filter on the active shared state and return only result data. Ownership remains enforced on mutable history operations.

Statutory fixes are driven by official primary sources and regression fixtures. Each confirmed incorrect result first receives a focused failing test, then the minimum engine change required to make the test pass. Explicit unsupported or insufficient-input results are preferred to inference or silent clamping.

## Delivery sequence

1. Commit the 31-calculator audit matrix and contract invariants.
2. Introduce the calculator contract registry, canonical schemas, and server recomputation.
3. Add private-by-default persistence and explicit publish/revoke operations with API tests and a safe migration.
4. Repair confirmed statutory and calculator-engine defects under regression tests.
5. Repair deterministic accessibility and baseline security/CSP issues.
6. Align browser/API/coverage CI, PDF/state/docs, then run the clean verification suite.

## Error and scope rules

- Invalid or unsupported inputs return a validation error; they are never silently normalized into a statutory-looking result.
- A database failure returns a failed save; it is not represented as a successful persistence operation.
- The initial contract rollout leaves a calculator non-saveable when a complete input/output contract cannot be demonstrated safely. The UI must not call the save endpoint for that calculator.
- Tax and regulatory metadata record both the current Income-tax Act, 2025 reference and a clearly-labelled legacy 1961-Act crosswalk only after primary-source verification.

## Verification

Every implementation commit is preceded by a focused red test and followed by its green result. The final gate runs the full command suite in the closure request, including audit, Prisma generation, lint, type check, unit/coverage, build, Chromium/mobile browser workflows, and accessibility with critical retries set to zero. No PR is merged automatically.
