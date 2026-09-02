# FinCalc India Final Audit Matrix

**Baseline:** `c0ea00662a97f80ffcf528f44ee506209e4ac876` on 2026-09-03. This inventory is derived from `lib/calculators.ts`, the corresponding route pages, calculator components, existing schemas, tests, and browser suites—not from the README.

## Status legend

- **VERIFIED**: present in the current implementation and source-inspected.
- **DEFECT**: an observed cross-layer, integrity, or documentation failure.
- **NOT APPLICABLE**: no statutory source or feature is relevant.
- **NEEDS SOURCE CHECK**: a regulatory claim requires primary-source verification before being carried into the contract metadata.

## Cross-cutting baseline findings

| Check | Status | Evidence |
| --- | --- | --- |
| Canonical calculator count | VERIFIED | `CALCULATOR_REGISTRY` has 31 entries. |
| Save contract alignment | DEFECT | 21 components render Save controls; `app/api/calculate/[type]/route.ts` handles only SIP, EMI, FD, PPF, Lumpsum, and Tax. |
| Saved-result integrity | DEFECT | Save API validates `inputs` then persists submitted `results`. |
| Private-by-default sharing | DEFECT | `Calculation.shareId` is always generated and public result queries do not require a publish flag. |
| DB failure semantics | DEFECT | Save API returns `success: true` after a persistence fallback. |
| Browser/a11y coverage | DEFECT | Existing browser tests are smoke/a11y-centric; CI has no dedicated retry-zero accessibility job. |
| PDF export | VERIFIED | No calculator component invokes the PDF generator; this is not currently a user-facing calculator capability. |

## Calculator contracts at baseline

“UI save/share” records what is rendered today, not whether a safe server contract exists. “Schema” is the existing state before the contract registry. All rows need a route-level browser workflow audit; current `all-calculators-smoke.spec.ts` and `a11y.spec.ts` are the shared browser coverage unless named otherwise.

| ID / route | Component / canonical calculation | Input schema / UI save-share | Regulatory metadata and constants | Tests / zero semantics / scope | Status |
| --- | --- | --- | --- | --- | --- |
| `sip` `/sip` | `SIPCalculator`; `calcSIP` | `sipSchema`; UI save/share; API supported but unsafe | N/A; `MAX_INPUT_LIMITS` needs alignment with schema | `math`, `engine`, `regression`, property tests; zero return is a boundary | DEFECT (server trust) |
| `step-up-sip` `/step-up-sip` | `StepUpSIPCalculator`; `calcStepUpSIP`, `calcGoalSIP` | no schema; no save/share | N/A | unit coverage is shared math/regression; zero increment needs audit | NEEDS SOURCE CHECK |
| `lumpsum` `/lumpsum` | `LumpsumCalculator`; `calcLumpsum` | `lumpsumSchema`; UI save/share; API supported but unsafe | N/A; `MAX_INPUT_LIMITS` needs alignment | math/regression tests; zero return boundary needs audit | DEFECT |
| `fd` `/fd` | `FDCalculator`; `calcFD` | `fdSchema`; UI save/share; API supported but unsafe | Deposit-rate assumptions are product inputs, not statutory | math/regression tests; zero rate must be explicit | DEFECT |
| `ppf` `/ppf` | `PPFCalculator`; `calcPPF` | `ppfSchema`; UI save/share; API supported but unsafe | PPF limits/rate: primary-source check required | math/regression tests; zero/nonzero contribution semantics need audit | DEFECT |
| `fire` `/fire` | `FIRECalculator`; `calcFIRE` | no schema; no save/share | N/A | zero default substitutions are a named audit target | DEFECT |
| `nps` `/nps` | `NpsCalculator`; `calcNPS` | no schema; UI save/share but API unsupported | `NPS_CONSTANTS`; current/legacy tax crosswalk needs source check | `nps-80ccd2`; missing eligible salary must not be inferred | DEFECT |
| `xirr-cagr-twrr` `/xirr-cagr-twrr` | `XirrCalculator`; `calcXIRR`, `calcCAGR`, `calcTWRR` | no schema; UI save/share but API unsupported | N/A | `xirr-multiroot`; negative/multiple root semantics are tested | DEFECT |
| `emi` `/emi` | `EMICalculator`; `calcEMI` | `emiSchema`; UI save/share; API supported but unsafe | N/A | math/regression tests; zero rate is analytical case | DEFECT |
| `loan-prepayment` `/loan-prepayment` | `LoanPrepaymentCalculator`; `calcPrepaymentVsInvest` | no schema; no save/share | N/A | shared tests; zero defaults need audit | NEEDS SOURCE CHECK |
| `no-cost-emi` `/no-cost-emi` | `NoCostEMICalculator`; `calcNoCostEMITruth` | no schema; no save/share | GST inputs require source check | shared tests; zero bank rate must not default | DEFECT |
| `car-loan-tco` `/car-loan-tco` | `CarTcoCalculator`; `calcCarTCO` | no schema; UI save/share but API unsupported | N/A | shared tests; zero/future-cost assumptions need audit | DEFECT |
| `balance-transfer` `/balance-transfer` | `BalanceTransferCalculator`; `calcBalanceTransfer` | no schema; UI save/share but API unsupported | Product input assumptions, no statutory reference | shared tests; zero fees/rates need audit | DEFECT |
| `tax` `/tax` | `TaxCalculator`; `calcTax` | stale `taxSchema`; UI save/share; API supported but unsafe | `tax-year-2026-27`; current/legacy crosswalk requires primary-source verification | `statutory-v3`, `golden-fixtures`, components; special-rate total-income boundaries are required | DEFECT |
| `marginal-relief` `/marginal-relief` | `MarginalReliefCalculator`; `calcMarginalRelief` | no schema; UI save/share but API unsupported | surcharge constants; primary-source check required | `dividend-surcharge`; mixed-income benchmark needs regression | DEFECT |
| `capital-gains-tax` `/capital-gains-tax` | `CapitalGainsCalculator`; `calcCapitalGains` | no schema; no save/share | `CAPITAL_GAINS_RATES`, `CII_TABLE`; current/legacy treatment needs source check | shared tests; asset classification, CII validation, loss scope and displayed gain semantics need audit | DEFECT |
| `hra-exemption` `/hra-exemption` | `HRACalculator`; `calcHRAExemption` | no schema; UI save/share but API unsupported | `HRA_CONSTANTS`; current/legacy crosswalk needs source check | shared tests; qualifying commission is not modeled | DEFECT |
| `presumptive-tax` `/presumptive-tax` | `PresumptiveTaxCalculator`; `calcPresumptiveTax` | no schema; UI save/share but API unsupported | `PRESUMPTIVE_TAX_CONSTANTS`; current provision/source check required | `pgbp-invariants`; eligibility and historical lockout need explicit scope | DEFECT |
| `section-54-exemption` `/section-54-exemption` | `Section54Calculator`; `calcSection54Exemption` | no schema; UI save/share but API unsupported | `SECTION_54_CONSTANTS`; current sections 82/85/86 plus legacy crosswalk need source check | `section54f`; prior-use, two-house timelines and aggregate cap need regression | DEFECT |
| `lrs-tcs` `/lrs-tcs` | `LrsTcsCalculator`; `calcLRSTCS` | no schema; UI save/share but API unsupported | `LRS_TCS_CONSTANTS`; current section 394/legacy crosswalk needs source check | golden fixture; exact source and threshold scope required | DEFECT |
| `us-stock-tax` `/us-stock-tax` | `USStockTaxCalculator`; `calcUSStockReturn` | no schema; UI save/share but API unsupported | tax/FTC/FX references require source check | shared tests; dividend-date FX and FTC are scoped estimates | DEFECT |
| `nre-nro-fcnr` `/nre-nro-fcnr` | `NRIDepositCalculator`; `calcNRIDepositReturns` | no schema; UI save/share but API unsupported | RBI/deposit-tax sources require check | `nri-old-regime`; ranking metric and USD-only copy need audit | DEFECT |
| `fno-brokerage` `/fno-brokerage` | `FnOBrokerageCalculator`; `calcFnOBreakeven` | no schema; no save/share | `STT_RATES_F_AND_O`, transaction charges; official exchange/source check required | shared tests; value/date assumptions need audit | NEEDS SOURCE CHECK |
| `option-payoff` `/option-payoff` | `OptionPayoffCalculator`; `calcOptionPayoff` | no schema; no save/share | N/A | shared tests; unlimited-profit/loss inference must be analytical | DEFECT |
| `black-scholes` `/black-scholes` | `BlackScholesCalculator`; `calcBlackScholes` | no schema; UI save/share but API unsupported | N/A | shared tests; zero volatility requires analytical handling | DEFECT |
| `position-size` `/position-size` | `PositionSizeCalculator`; `calcPositionSize` | no schema; UI save/share but API unsupported | N/A | regression/property tests; zero/negative stop logic needs audit | DEFECT |
| `margin-calculator` `/margin-calculator` | `MarginCalculator`; `calcMarginRequired` | no schema; UI save/share but API unsupported | exchange parameters are estimates; source/date must be shown | shared tests; zero/missing assumptions need audit | DEFECT |
| `portfolio-risk` `/portfolio-risk` | `PortfolioRiskCalculator`; `calcRiskRatios` | no schema; UI save/share but API unsupported | N/A | shared tests; paired benchmark observations required | DEFECT |
| `dcf-valuation` `/dcf-valuation` | `DcfCalculator`; `calcDCF` | no schema; UI save/share but API unsupported | N/A | shared tests; zero discount/growth edge cases need explicit validation | DEFECT |
| `wacc` `/wacc` | `WaccCalculator`; `calcWACC` | no schema; UI save/share but API unsupported | N/A | shared tests; zero debt/equity semantics need audit | DEFECT |
| `dupont-analysis` `/dupont-analysis` | `DuPontCalculator`; `calcDuPont` | no schema; no save/share | N/A | shared tests; zero denominator behavior needs audit | NEEDS SOURCE CHECK |

## Closure acceptance checks

1. Each save-supported row has one Zod schema, one canonical calculation function, and route/id invariants enforced in tests.
2. Save requests transmit inputs only; server-computed output is the only persisted output.
3. A private save has no public read path; publish, revoke, rotation, ownership, malformed-token, and deletion behavior have integration coverage.
4. Every statutory row marked DEFECT is either fixed with official-source-backed regression coverage or explicitly changed to a scoped unsupported result.
5. Every numeric input is classified as zero-valid, zero-invalid, or an explicit analytical special case before freeze.
6. README, PDF metadata, state codec, coverage claims, and registry count reflect implementation evidence.
