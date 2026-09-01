# FinCalc India Full Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Repair the foundation, add the requested personal-finance features, and prove every calculator locally and on Vercel.

**Architecture:** Financial formulas live only in lib/math.ts and statutory figures remain in lib/constants/tax-year-2026-27.ts. Each UI reads a typed result, renders calculated insights, and passes display rows to shared portability actions. Charts consume result data and do not recompute finance values.

**Tech Stack:** Next.js 15, TypeScript, React, Tailwind, Vitest, Recharts, Lucide, jsPDF.

**Spec:** docs/superpowers/specs/2026-09-01-fincalc-hardening-and-expansion-design.md

## Global Constraints

- All 31 existing calculator routes are in scope.
- Write a failing test before every engine correction or new behavior.
- Reuse calcTax, calcHRAExemption, calcEMI, calcFD, calcPPF, and calcFIRE instead of parallel formulas.
- New icons use Lucide. Every insight derives from actual result fields.
- Share URLs contain only validated public inputs. Scenario state is in-memory and capped at three.
- Small-savings rates are adjustable and date-stamped. The aggregate employer PF 7.5 lakh perquisite threshold is reported for manual statutory verification.
- PDF output is client-only, text-checked and PNG-rendered before release.
- Each commit passes lint, typecheck, tests and build. Deployed verification records status, heading, headers, timing, changed-input behavior and console state.

---

### Task 1: Fix the CII input boundary

**Files:**
- Modify: components/calculators/capital-gains/CapitalGainsCalculator.tsx
- Modify: tests/regression.test.ts

**Produces:** A sale CII maximum derived from CURRENT_CII_YEAR, not literal 2025.

- [ ] **Step 1: Write the regression test**

~~~ts
it("calculates an indexed 2026 sale", () => {
  const result = calcCapitalGains({
    assetClass: "real_estate", purchasePrice: 1_000_000, salePrice: 2_000_000,
    transferExpenses: 0, holdingMonths: 48, purchaseCiiYear: 2018,
    saleCiiYear: 2026, isPurchasedBeforeCutoff: true, investorSlabRatePercent: 30,
  });
  expect(result.realEstateComparison?.indexedCost).toBeGreaterThan(1_000_000);
});
~~~

- [ ] **Step 2: Run the test before editing UI**

Run: npx vitest run tests/regression.test.ts

Expected: engine test passes, confirming the remaining defect is the UI max.

- [ ] **Step 3: Implement canonical UI bound**

~~~tsx
import { CURRENT_CII_YEAR } from "@/lib/math";
const currentCiiStartYear = Number.parseInt(CURRENT_CII_YEAR, 10);
<HybridInput label="Sale FY (CII)" max={currentCiiStartYear} />
~~~

- [ ] **Step 4: Verify and commit**

Run: npm run lint; npx tsc --noEmit; npm test; npm run build

~~~bash
git add components/calculators/capital-gains/CapitalGainsCalculator.tsx tests/regression.test.ts
git commit -m "fix(capital-gains): allow current CII sale year"
~~~

### Task 2: Add shared URL, scenario and PDF behavior

**Files:**
- Create: lib/calculation-state.ts, lib/calculation-pdf.ts, tests/calculation-state.test.ts, tests/calculation-pdf.test.ts, components/ui/CalculationActions.tsx
- Modify: package.json, package-lock.json

**Produces:** encodeCalculationInputs, decodeCalculationInputs, saveScenario, buildCalculationPdfData and exportCalculationPdf.

- [ ] **Step 1: Write failing state tests**

~~~ts
it("round-trips SIP inputs to an identical result", () => {
  const input = { monthlyAmount: 5000, annualRate: 12, years: 10 };
  expect(calcSIP(decodeCalculationInputs(encodeCalculationInputs(input), isSipInput)!)).toEqual(calcSIP(input));
});
it("rejects malformed state", () => expect(decodeCalculationInputs("?i=Infinity&x=1", isSipInput)).toBeNull());
it("keeps three latest scenarios", () => expect(saveScenario(saveScenario(saveScenario([], one), two), three)).toHaveLength(3));
~~~

- [ ] **Step 2: Run RED**

Run: npx vitest run tests/calculation-state.test.ts

Expected: FAIL because the state module is absent.

- [ ] **Step 3: Implement validation-first state and run GREEN**

~~~ts
export interface ScenarioSnapshot<T> { id: string; name: string; inputs: T; }
export const saveScenario = <T>(items: ScenarioSnapshot<T>[], next: ScenarioSnapshot<T>) =>
  [...items.filter((item) => item.id !== next.id), next].slice(-3);
~~~

- [ ] **Step 4: Write and run failing PDF model test**

~~~ts
it("keeps final displayed value in PDF rows", () => {
  expect(buildCalculationPdfData("SIP", [], [{ label: "Total Corpus", value: "Rs 11,61,695" }])
    .sections.at(-1)?.rows[0]?.value).toBe("Rs 11,61,695");
});
~~~

Run: npx vitest run tests/calculation-pdf.test.ts

Expected: FAIL before the PDF model exists.

- [ ] **Step 5: Install jsPDF, implement, visually verify and commit**

Run: npm install jspdf

~~~ts
export function exportCalculationPdf(data: CalculationPdfData) {
  const pdf = new jsPDF();
  pdf.save(data.slug + ".pdf");
}
~~~

Run: npx vitest run tests/calculation-pdf.test.ts; npm test

After a browser download, run pdftotext on the PDF and search for Total Corpus. Render with pdftoppm into tmp/pdfs and inspect the PNG for clipping.

~~~bash
git add package.json package-lock.json lib components tests
git commit -m "feat: add calculator share state scenarios and PDF export"
~~~

### Task 3: Add CTC to in-hand salary

**Files:**
- Modify: lib/math.ts, lib/insights.ts, tests/math.test.ts, app/page.tsx, app/sitemap.ts
- Create: app/ctc-in-hand/page.tsx, components/calculators/ctc/CTCCalculator.tsx, components/calculators/ctc/CTCFlowChart.tsx

**Produces:** calcInHandFromCTC using calcTax and calcHRAExemption.

- [ ] **Step 1: Write eight RED cases**

~~~ts
expect(calcInHandFromCTC(overThreshold).taxableEmployerContribution).toBe(100_000);
expect(calcInHandFromCTC(withGratuity).monthlyInHand).toBeLessThan(withGratuity.annualCtc / 12);
expect(() => calcInHandFromCTC(overAllocated)).toThrow(/CTC/i);
expect(calcInHandFromCTC(oldRegime).annualInHand).not.toBe(calcInHandFromCTC(newRegime).annualInHand);
~~~

Add zero bonus, metro HRA, non-metro HRA, zero CTC, negative-input and annual-breakup reconciliation cases.

- [ ] **Step 2: Run RED, implement, and run GREEN**

Run: npx vitest run tests/math.test.ts

~~~ts
const hra = calcHRAExemption({ basicSalary, hraReceived, rentPaid, cityType, regime });
const tax = calcTax({ salaryIncome: taxableSalary + employerContributionPerquisite, hraExemption: hra.annualExemptHra, regime });
~~~

- [ ] **Step 3: Build the page, calculated insights and Sankey**

~~~tsx
<Sankey data={{ nodes: result.flowNodes, links: result.flowLinks }} nodePadding={18} />
<InsightCard {...getCtcInsights(result)} />
~~~

- [ ] **Step 4: Verify and commit**

Run: npm test; npm run lint; npx tsc --noEmit; npm run build

~~~bash
git add lib app components tests
git commit -m "feat: add CTC in-hand salary calculator"
~~~

### Task 4: Add SWP and fixed-income comparison

**Files:**
- Modify: lib/math.ts, lib/insights.ts, tests/math.test.ts, app/page.tsx, app/sitemap.ts
- Create: app/swp/page.tsx, components/calculators/swp/SWPCalculator.tsx, components/calculators/swp/SWPChart.tsx, app/fixed-income-comparison/page.tsx, components/calculators/fixed-income/FixedIncomeCalculator.tsx

**Produces:** calcSWP and calcFixedIncomeComparison.

- [ ] **Step 1: Write SWP RED cases**

~~~ts
expect(calcSWP(depleting).depletionMonth).toBe(expectedMonth);
expect(calcSWP(growing).isPerpetual).toBe(true);
expect(calcSWP({ ...base, withdrawalAmount: 0 }).endingCorpus).toBeGreaterThan(base.startingCorpus);
expect(calcSWP(longHorizon).monthlyRows.every((row) => row.endingBalance >= 0)).toBe(true);
~~~

Add fixed/percentage withdrawal, zero corpus, return total and 480-month stability.

- [ ] **Step 2: Write fixed-income RED cases**

~~~ts
expect(calcFixedIncomeComparison(rdExample).schemes.RD.maturity).toBeCloseTo(handCalculatedRd, 2);
expect(calcFixedIncomeComparison(scss).schemes.SCSS.totalPayout).toBeCloseTo(quarterlyInterest * quarters, 2);
expect(calcFixedIncomeComparison(ssy).notices.some((notice) => /girl child/i.test(notice))).toBe(true);
~~~

Add rate adjustment, effective-yield ranking, zero deposit and no SCSS compounding.

- [ ] **Step 3: Run RED, implement schedules and run GREEN**

Run: npx vitest run tests/math.test.ts

- [ ] **Step 4: Build responsive tables, charts and insights**

~~~tsx
<InsightCard {...getSwpInsights(result, inputs.currentAge)} />
<InsightCard {...getFixedIncomeInsights(result)} />
~~~

- [ ] **Step 5: Verify and commit separately**

~~~bash
git add lib app components tests && git commit -m "feat: add systematic withdrawal calculator"
git add lib app components tests && git commit -m "feat: compare fixed-income schemes"
~~~

### Task 5: Add buy-vs-rent and Human Life Value

**Files:**
- Modify: lib/math.ts, lib/insights.ts, tests/math.test.ts, app/page.tsx, app/sitemap.ts
- Create: app/buy-vs-rent/page.tsx, components/calculators/buy-vs-rent/BuyVsRentCalculator.tsx, components/calculators/buy-vs-rent/BuyVsRentChart.tsx, app/human-life-value/page.tsx, components/calculators/hlv/HumanLifeValueCalculator.tsx

**Produces:** calcBuyVsRent reusing calcEMI and calcHumanLifeValue.

- [ ] **Step 1: Write buy/rent RED cases**

~~~ts
expect(calcBuyVsRent({ ...base, propertyAppreciationRate: 0 }).buyWealth).toBeFinite();
expect(calcBuyVsRent(escalatingRent).yearlyRows[1].rent).toBeGreaterThan(calcBuyVsRent(escalatingRent).yearlyRows[0].rent);
expect(calcBuyVsRent(base).buyingUpfrontCosts).toBe(base.registrationCost + base.stampDuty + base.brokerage);
~~~

Add 25-year stability, investment-difference reconciliation, no crossover and first crossover.

- [ ] **Step 2: Write HLV RED cases**

~~~ts
expect(calcHumanLifeValue({ ...base, existingCover: 99_999_999 }).additionalCoverNeeded).toBe(0);
expect(calcHumanLifeValue({ ...base, currentAge: 58, retirementAge: 60 }).presentValueOfIncome).toBeGreaterThan(0);
~~~

Add zero liabilities/dependants, growth above discount, zero income and future goals.

- [ ] **Step 3: Run RED, implement, run GREEN and build pages**

~~~tsx
<ResultHero label="Recommended additional term cover" value={result.additionalCoverNeeded} />
<InsightCard {...getBuyVsRentInsights(result)} />
~~~

- [ ] **Step 4: Verify and commit**

~~~bash
npm test && npm run lint && npx tsc --noEmit && npm run build
git add lib app components tests && git commit -m "feat: add buy versus rent calculator"
git add lib app components tests && git commit -m "feat: add human life value calculator"
~~~

### Task 6: Add Coast FIRE to existing FIRE

**Files:**
- Modify: lib/math.ts, lib/insights.ts, tests/math.test.ts, components/calculators/fire/FIRECalculator.tsx, components/calculators/fire/FIREChart.tsx
- Create: components/calculators/fire/CoastFireGauge.tsx

**Produces:** optional coast object in calcFIRE output.

- [ ] **Step 1: Write Coast FIRE RED tests**

~~~ts
expect(calcFIRE(alreadyCoast).coast?.hasReachedCoast).toBe(true);
expect(calcFIRE(shortfall).coast?.monthlySavingToCoast).toBeGreaterThan(0);
expect(calcFIRE(base).standardFireCorpus).toBe(calcFIRE({ ...base, coast }).standardFireCorpus);
~~~

Add exact equality, zero return, zero years, target-date shortfall and 40-year finite output.

- [ ] **Step 2: Run RED, reuse corpus target, then GREEN**

~~~ts
const coastNumberToday = standardFireCorpus / Math.pow(1 + preRetirementReturn / 100, yearsToRetirement);
~~~

- [ ] **Step 3: Add mode, insight and radial gauge**

~~~tsx
<RadialBarChart data={[{ name: "Coast progress", value: result.coast.progressPercent }]} />
~~~

- [ ] **Step 4: Verify and commit**

~~~bash
npm test && npm run lint && npx tsc --noEmit && npm run build
git add lib components tests && git commit -m "feat: add Coast FIRE mode"
~~~

### Task 7: Add Net Worth

**Files:**
- Modify: lib/math.ts, lib/insights.ts, tests/math.test.ts, app/page.tsx, app/sitemap.ts
- Create: app/net-worth/page.tsx, components/calculators/net-worth/NetWorthCalculator.tsx, components/calculators/net-worth/NetWorthTreemap.tsx, components/calculators/net-worth/NetWorthFlowChart.tsx

**Produces:** calcNetWorth with net worth, allocation and liquidity.

- [ ] **Step 1: Write Net Worth RED cases**

~~~ts
expect(calcNetWorth({ assets: { cash: 10 }, liabilities: { creditCard: 100 } }).netWorth).toBe(-90);
expect(calcNetWorth(mixed).allocation.reduce((sum, row) => sum + row.percent, 0)).toBe(100);
expect(calcNetWorth(liquidityCase).liquidAssets).toBe(liquidityCase.assets.cash + liquidityCase.assets.fd);
~~~

Add zero liabilities, no assets, one category, all categories, zero total and invalid input.

- [ ] **Step 2: Run RED, normalize allocation, then GREEN**

~~~ts
const displayed = rows.map((row, index) => ({ ...row, percent: index === last ? 100 - accumulated : round2(row.value / totalAssets * 100) }));
~~~

- [ ] **Step 3: Build calculator, Treemap, Sankey and liquidity insight**

~~~tsx
<Treemap data={result.treemapData} dataKey="value" nameKey="label" />
<InsightCard {...getNetWorthInsights(result, monthlyExpenses)} />
~~~

- [ ] **Step 4: Verify and commit**

~~~bash
npm test && npm run lint && npx tsc --noEmit && npm run build
git add lib app components tests && git commit -m "feat: add personal net worth statement"
~~~

### Task 8: Add Budget Variance waterfall

**Files:**
- Modify: lib/math.ts, lib/insights.ts, tests/math.test.ts, app/page.tsx, app/sitemap.ts
- Create: app/budget-variance/page.tsx, components/calculators/budget/BudgetVarianceCalculator.tsx, components/calculators/budget/BudgetWaterfallChart.tsx

**Produces:** calcBudgetVariance with categories, reconciled waterfall data and primary driver.

- [ ] **Step 1: Write Budget RED cases**

~~~ts
expect(calcBudgetVariance({ planned: { Food: 5000 }, actual: {} }).rows[0].variance).toBe(-5000);
expect(calcBudgetVariance({ planned: {}, actual: { Dining: 4200 } }).unbudgetedCategories).toEqual(["Dining"]);
expect(result.plannedTotal + result.waterfallRows.reduce((sum, row) => sum + row.delta, 0)).toBe(result.actualTotal);
expect(result.primaryOverspendDriver.summary).toContain("Dining");
~~~

Add exact budget, favorable categories, zero totals, category order, under-spend and 100 categories.

- [ ] **Step 2: Run RED, implement union/reconciliation, then GREEN**

~~~ts
const categories = [...new Set([...Object.keys(planned), ...Object.keys(actual)])].sort();
const actualTotal = rows.reduce((sum, row) => sum + row.actual, 0);
~~~

- [ ] **Step 3: Build form, waterfall and insight**

~~~tsx
<Bar dataKey="positive" stackId="variance" fill="var(--chart-2)" />
<Bar dataKey="negative" stackId="variance" fill="var(--chart-5)" />
<InsightCard {...getBudgetVarianceInsights(result)} />
~~~

- [ ] **Step 4: Verify and commit**

~~~bash
npm test && npm run lint && npx tsc --noEmit && npm run build
git add lib app components tests && git commit -m "feat: add monthly budget variance calculator"
~~~

### Task 9: Roll portability actions across every calculator

**Files:**
- Modify: all components/calculators/*/*Calculator.tsx
- Modify: app/page.tsx, app/sitemap.ts, README.md

**Produces:** URL hydration, PDF export and two/three-scenario comparison for every existing and new calculator.

- [ ] **Step 1: Write adapter RED test**

~~~ts
it("reproduces EMI after URL hydration", () => {
  const input = { principal: 3_000_000, annualRate: 8.5, tenureMonths: 240 };
  expect(calcEMI(decodeCalculationInputs(encodeCalculationInputs(input), isEmiInput)!)).toEqual(calcEMI(input));
});
~~~

- [ ] **Step 2: Run RED then integrate adapters**

~~~tsx
<CalculationActions calculatorId="sip" inputs={inputs} onRestore={setInputs}
  resultRows={[{ label: "Total Corpus", value: formatINR(results.totalCorpus) }]} />
~~~

- [ ] **Step 3: Verify every route**

For each calculator test URL reload, two scenarios, three scenarios, PDF export, keyboard action controls, 390px view and 1440px view. Run full lint, typecheck, tests and build after every complete integration batch.

- [ ] **Step 4: Commit**

~~~bash
git add components app tests README.md
git commit -m "feat: add portable calculator actions"
~~~

### Task 10: Hostile QA, production verification and remote proof

**Files:**
- Modify only reproduced-failure source and test files.
- Modify README only after deployment proof.

**Produces:** final evidence table; no unverified pass claims.

- [ ] **Step 1: Add high-risk engine regression tests**

~~~ts
expect(calcTax({ salaryIncome: 1_200_000, equityLtcg: 200_000, regime: "new" }).specialRateTax).toBeGreaterThan(0);
expect(calcFnOBreakeven(currentOptionTrade).charges.stt).toBeGreaterThan(0);
expect(calcEMI({ principal: 100_000, annualRate: 0, tenureMonths: 12 }).amortizationSchedule.at(-1)?.balance).toBe(0);
~~~

- [ ] **Step 2: Run quality gates**

Run: npm run lint; npx tsc --noEmit; npm test; npm run build

Expected: zero lint/type/build errors and all tests pass.

- [ ] **Step 3: Browser-test local and live routes**

For all 39 routes verify heading, default result, an input modification, result change, no console error, focus behavior and unclipped chart/table. On every live route record response status, body heading, response headers and timing. Open a fresh tab for each shared URL and inspect every PDF page PNG.

- [ ] **Step 4: Review, commit, push and verify state**

~~~bash
git status --short
git diff --check
git push origin HEAD
git fetch origin
git log --oneline origin/main -20
git rev-list --left-right --count origin/main...HEAD
~~~

Expected: clean tree and feature commits on the tracked remote branch. Treat origin/main as landed only after merge or direct main push authority.

