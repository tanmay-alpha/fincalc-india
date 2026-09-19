/**
 * FinCalc India — Zod Validation Schemas
 *
 * One schema per calculator with descriptive error messages
 * and sensible min/max limits for Indian financial context.
 *
 * Uses Zod v4 API (message-based errors, no required_error / errorMap).
 */

import { z } from "zod";
import { MAX_INPUT_LIMITS } from "@/lib/constants/tax-year-2026-27";
import { CALCULATOR_INPUT_LIMITS } from "@/lib/constants/calculator-input-limits";

// ─── SIP ──────────────────────────────────────────────────────

export const sipSchema = z.object({
  monthlyAmount: z
    .number({ message: "Monthly investment is required" })
    .min(CALCULATOR_INPUT_LIMITS.sip.monthlyAmount.supported.min, "Minimum monthly investment is ₹100")
    .max(CALCULATOR_INPUT_LIMITS.sip.monthlyAmount.supported.max, "Maximum monthly investment is ₹1 Crore"),
  annualRate: z
    .number({ message: "Expected return rate is required" })
    .min(CALCULATOR_INPUT_LIMITS.sip.annualRate.supported.min, "Minimum rate is 0.1%")
    .max(CALCULATOR_INPUT_LIMITS.sip.annualRate.supported.max, "Maximum rate is 50%"),
  years: z
    .number({ message: "Time period is required" })
    .int("Time period must be a whole number")
    .min(CALCULATOR_INPUT_LIMITS.sip.years.supported.min, "Minimum period is 1 year")
    .max(CALCULATOR_INPUT_LIMITS.sip.years.supported.max, "Maximum period is 50 years"),
});

export type SipFormValues = z.infer<typeof sipSchema>;

// ─── EMI ──────────────────────────────────────────────────────

export const emiSchema = z.object({
  principal: z
    .number({ message: "Loan amount is required" })
    .min(CALCULATOR_INPUT_LIMITS.emi.principal.supported.min, "Minimum loan amount is ₹1,000")
    .max(CALCULATOR_INPUT_LIMITS.emi.principal.supported.max, "Maximum loan amount is ₹100 Crore"),
  annualRate: z
    .number({ message: "Interest rate is required" })
    .min(CALCULATOR_INPUT_LIMITS.emi.annualRate.supported.min, "Minimum rate is 0.1%")
    .max(CALCULATOR_INPUT_LIMITS.emi.annualRate.supported.max, "Maximum rate is 50%"),
  tenureMonths: z
    .number({ message: "Loan tenure is required" })
    .int("Tenure must be a whole number of months")
    .min(CALCULATOR_INPUT_LIMITS.emi.tenureMonths.supported.min, "Minimum tenure is 1 month")
    .max(CALCULATOR_INPUT_LIMITS.emi.tenureMonths.supported.max, "Maximum tenure is 600 months (50 years)"),
});

export type EmiFormValues = z.infer<typeof emiSchema>;

// ─── FD ───────────────────────────────────────────────────────

export const fdSchema = z.object({
  principal: z
    .number({ message: "Deposit amount is required" })
    .min(CALCULATOR_INPUT_LIMITS.fd.principal.supported.min, "Minimum deposit is ₹1,000")
    .max(CALCULATOR_INPUT_LIMITS.fd.principal.supported.max, "Maximum deposit is ₹100 Crore"),
  annualRate: z
    .number({ message: "Interest rate is required" })
    .min(CALCULATOR_INPUT_LIMITS.fd.annualRate.supported.min, "Minimum rate is 0.1%")
    .max(CALCULATOR_INPUT_LIMITS.fd.annualRate.supported.max, "Maximum rate is 20%"),
  tenureYears: z
    .number({ message: "Tenure is required" })
    .min(CALCULATOR_INPUT_LIMITS.fd.tenureYears.supported.min, "Minimum tenure is 3 months")
    .max(CALCULATOR_INPUT_LIMITS.fd.tenureYears.supported.max, "Maximum tenure is 30 years"),
  compoundingFrequency: z
    .union(
      [z.literal(1), z.literal(2), z.literal(4), z.literal(12)],
      { message: "Must be 1 (yearly), 2 (half-yearly), 4 (quarterly), or 12 (monthly)" }
    ),
});

export type FdFormValues = z.infer<typeof fdSchema>;

// ─── PPF ──────────────────────────────────────────────────────

export const ppfSchema = z.object({
  yearlyInvestment: z
    .number({ message: "Yearly investment is required" })
    .min(CALCULATOR_INPUT_LIMITS.ppf.yearlyInvestment.supported.min, "Minimum yearly investment is ₹500")
    .max(CALCULATOR_INPUT_LIMITS.ppf.yearlyInvestment.supported.max, "Maximum yearly investment is ₹1,50,000 (Section 80C limit)"),
  years: z
    .number({ message: "Time period is required" })
    .int("Time period must be a whole number")
    .min(CALCULATOR_INPUT_LIMITS.ppf.years.supported.min, "PPF has a minimum lock-in of 15 years")
    .max(CALCULATOR_INPUT_LIMITS.ppf.years.supported.max, "Maximum period is 50 years"),
  rate: z
    .number({ message: "PPF rate is required" })
    .min(CALCULATOR_INPUT_LIMITS.ppf.rate.supported.min, "Minimum rate is 1%")
    .max(CALCULATOR_INPUT_LIMITS.ppf.rate.supported.max, "Maximum rate is 15%"),
});

export type PpfFormValues = z.infer<typeof ppfSchema>;

// ─── LUMPSUM ──────────────────────────────────────────────────

export const lumpsumSchema = z.object({
  principal: z
    .number({ message: "Investment amount is required" })
    .min(CALCULATOR_INPUT_LIMITS.lumpsum.principal.supported.min, "Minimum investment is ₹100")
    .max(CALCULATOR_INPUT_LIMITS.lumpsum.principal.supported.max, "Maximum investment is ₹100 Crore"),
  annualRate: z
    .number({ message: "Expected return rate is required" })
    .min(CALCULATOR_INPUT_LIMITS.lumpsum.annualRate.supported.min, "Minimum rate is 0.1%")
    .max(CALCULATOR_INPUT_LIMITS.lumpsum.annualRate.supported.max, "Maximum rate is 50%"),
  years: z
    .number({ message: "Time period is required" })
    .int("Time period must be a whole number")
    .min(CALCULATOR_INPUT_LIMITS.lumpsum.years.supported.min, "Minimum period is 1 year")
    .max(CALCULATOR_INPUT_LIMITS.lumpsum.years.supported.max, "Maximum period is 50 years"),
});

export type LumpsumFormValues = z.infer<typeof lumpsumSchema>;

// ─── TAX ──────────────────────────────────────────────────────

const taxIncomeSchema = z
  .number({ message: "Income must be a number" })
  .finite("Income must be finite")
  .min(0, "Income cannot be negative")
  .max(MAX_INPUT_LIMITS.annualIncome, "Maximum income is ₹100 Crore");

const taxDeductionSchema = (maximum: number, label: string) =>
  z
    .number({ message: `${label} must be a number` })
    .finite(`${label} must be finite`)
    .min(0, `${label} cannot be negative`)
    .max(maximum, `${label} exceeds the supported limit`)
    .default(0);

export const taxSchema = z.object({
  // Retained only for legacy saved inputs. New callers provide actual income streams.
  grossIncome: taxIncomeSchema.optional(),
  salaryIncome: taxIncomeSchema.optional(),
  interestAndOtherIncome: taxIncomeSchema.default(0),
  dividendIncome: taxIncomeSchema.default(0),
  businessIncome: taxIncomeSchema.default(0),
  equityLtcg: taxIncomeSchema.default(0),
  equityStcg: taxIncomeSchema.default(0),
  otherLtcg: taxIncomeSchema.default(0),
  residency: z.enum(["resident_individual", "nri"], {
    message: "Only resident individual and NRI individual taxation are supported",
  }).default("resident_individual"),
  ageCategory: z.enum(["below_60", "senior_60_to_79", "super_senior_80_plus"], {
    message: "Select a supported age category",
  }).default("below_60"),
  regime: z.enum(["old", "new"], {
    message: "Select Old or New tax regime",
  }),
  deduction80C: taxDeductionSchema(150000, "Section 80C deduction"),
  deduction80D: taxDeductionSchema(100000, "Section 80D deduction"),
  deduction80CCD1B: taxDeductionSchema(50000, "Section 80CCD(1B) deduction"),
  hraExemption: taxDeductionSchema(MAX_INPUT_LIMITS.annualIncome, "HRA exemption"),
  otherDeductions: taxDeductionSchema(50_00_000, "Other deductions"),
});

export type TaxFormValues = z.infer<typeof taxSchema>;

// ─── STEP-UP SIP ──────────────────────────────────────────────

export const stepUpSipSchema = z.object({
  monthlyAmount: z.number().min(100).max(10_000_000),
  targetCorpus: z.number().min(1000).max(1_000_000_000).optional(),
  annualRate: z.number().min(0.1).max(50),
  years: z.number().min(1).max(50),
  stepUpType: z.enum(["percentage", "fixed"]).default("percentage"),
  stepUpValue: z.number().min(0).max(10_000_000),
});
export type StepUpSipFormValues = z.infer<typeof stepUpSipSchema>;

// ─── FIRE ─────────────────────────────────────────────────────

export const fireSchema = z.object({
  currentAge: z.number().min(18).max(100),
  retirementAge: z.number().min(19).max(100),
  lifeExpectancy: z.number().min(20).max(120),
  currentMonthlyExpenses: z.number().min(0).max(10_000_000),
  preRetirementReturn: z.number().min(0).max(50).default(12),
  postRetirementReturn: z.number().min(0).max(50).default(8),
  inflationRate: z.number().min(0).max(30).default(6),
  swrPercent: z.number().min(0.1).max(20).default(4),
  currentSavings: z.number().min(0).max(1_000_000_000).default(0),
});
export type FireFormValues = z.infer<typeof fireSchema>;

// ─── NPS ──────────────────────────────────────────────────────

export const npsSchema = z.object({
  currentAge: z.number().min(18).max(70),
  retirementAge: z.number().min(19).max(75).default(60),
  monthlyContribution: z.number().min(500).max(10_000_000),
  equityAllocationPercent: z.number().min(0).max(100),
  corporateDebtAllocationPercent: z.number().min(0).max(100),
  govtBondsAllocationPercent: z.number().min(0).max(100),
  expectedEquityReturnPercent: z.number().min(0).max(50).default(12),
  expectedCorpDebtReturnPercent: z.number().min(0).max(50).default(9),
  expectedGovtBondReturnPercent: z.number().min(0).max(50).default(8),
  accumulatedCorpus: z.number().min(0).optional(),
  lumpSumWithdrawalPercent: z.number().min(0).max(80).default(60),
  annuityReinvestmentPercent: z.number().min(20).max(100).default(40),
  assumedAnnuityYieldPercent: z.number().min(0).max(30).default(6),
  taxBracketPercent: z.number().min(0).max(50).default(30),
  regime: z.enum(["new", "old"]).default("new"),
  employerMonthlyContribution: z.number().min(0).default(0),
  eligibleSalaryFor80CCD2: z.number().min(0).default(0),
  isGovtEmployee: z.boolean().default(false),
  isPrematureExit: z.boolean().default(false),
  exitOptionChoice: z.enum(["standard", "sur_6yr_split"]).default("standard"),
});
export type NpsFormValues = z.infer<typeof npsSchema>;

// ─── XIRR / CAGR / TWRR ───────────────────────────────────────

export const xirrCagrTwrrSchema = z.object({
  activeTab: z.enum(["xirr", "cagr", "twrr"]).default("xirr"),
  cashflows: z
    .array(z.object({ date: z.string(), amount: z.number() }))
    .optional(),
  cagrInitial: z.number().optional(),
  cagrFinal: z.number().optional(),
  cagrYears: z.number().optional(),
  twrrPeriods: z
    .array(
      z.object({
        startValue: z.number(),
        endValue: z.number(),
        netCashflow: z.number(),
      })
    )
    .optional(),
});
export type XirrCagrTwrrFormValues = z.infer<typeof xirrCagrTwrrSchema>;

// ─── LOAN PREPAYMENT ──────────────────────────────────────────

export const loanPrepaymentSchema = z.object({
  principal: z.number().min(1_000).max(1_000_000_000),
  annualRate: z.number().min(0.1).max(50),
  tenure: z.number().optional(),
  tenureMonths: z.number().optional(),
  prepaymentType: z
    .enum(["extra_emi_yearly", "monthly_topup", "annual_lumpsum"])
    .default("extra_emi_yearly"),
  prepaymentAmount: z.number().min(0).optional(),
  lumpsumYear: z.number().min(1).optional(),
  investmentRate: z.number().min(0).max(50).default(12),
});
export type LoanPrepaymentFormValues = z.infer<typeof loanPrepaymentSchema>;

// ─── NO-COST EMI ──────────────────────────────────────────────

export const noCostEmiSchema = z.object({
  productPrice: z.number().min(100).max(10_000_000),
  tenureMonths: z.number().min(1).max(60),
  bankInterestRate: z.number().min(0).max(50).default(15),
  processingFee: z.number().min(0).default(199),
  upfrontDiscountForfeited: z.number().min(0).default(0),
  gstRatePercent: z.number().min(0).max(40).default(18),
});
export type NoCostEmiFormValues = z.infer<typeof noCostEmiSchema>;

// ─── CAR LOAN TCO ─────────────────────────────────────────────

export const carLoanTcoSchema = z.object({
  carOnRoadPrice: z.number().min(10_000).max(1_000_000_000),
  downPayment: z.number().min(0).max(1_000_000_000),
  loanInterestRate: z.number().min(0).max(50).default(9),
  loanTenureYears: z.number().min(0).max(15).default(5),
  ownershipTenureYears: z.number().min(1).max(25).default(5),
  annualKmDriven: z.number().min(0).max(500_000).default(12000),
  fuelMileageKmpl: z.number().min(1).max(100).default(15),
  fuelPricePerLitre: z.number().min(1).max(500).default(100),
  fuelInflationPercent: z.number().min(0).max(50).default(5),
  annualInsuranceCost: z.number().min(0).default(25000),
  annualMaintenanceCost: z.number().min(0).default(10000),
  maintenanceInflationPercent: z.number().min(0).max(50).default(5),
});
export type CarLoanTcoFormValues = z.infer<typeof carLoanTcoSchema>;

// ─── BALANCE TRANSFER ─────────────────────────────────────────

export const balanceTransferSchema = z.object({
  currentOutstandingPrincipal: z.number().min(1_000).max(1_000_000_000),
  currentInterestRate: z.number().min(0.1).max(50),
  currentRemainingTenureMonths: z.number().min(1).max(600),
  newInterestRate: z.number().min(0.1).max(50),
  newTenureMonths: z.number().min(1).max(600).optional(),
  processingFeeType: z.enum(["flat", "percentage"]).default("percentage"),
  processingFeeValue: z.number().min(0).default(0.5),
  otherSwitchingCharges: z.number().min(0).default(0),
  discountRatePercent: z.number().min(0).max(50).optional(),
});
export type BalanceTransferFormValues = z.infer<typeof balanceTransferSchema>;

// ─── MARGINAL RELIEF ──────────────────────────────────────────

export const marginalReliefSchema = z.object({
  grossTotalIncome: z.number().min(0).max(MAX_INPUT_LIMITS.annualIncome),
  regime: z.enum(["new", "old"]).default("new"),
  ageCategory: z.enum(["general", "senior", "super_senior"]).default("general"),
});
export type MarginalReliefFormValues = z.infer<typeof marginalReliefSchema>;

// ─── CAPITAL GAINS TAX ────────────────────────────────────────

export const capitalGainsSchema = z.object({
  assetClass: z.enum([
    "listed_equity",
    "real_estate",
    "specified_mutual_fund",
    "non_specified_debt_mf",
    "physical_gold",
    "listed_gold_etf",
    "sovereign_gold_bond",
    "equity",
    "debt_mf",
    "gold_sgb",
  ]),
  taxpayerCategory: z
    .enum(["resident_individual", "resident_huf", "nri", "other"])
    .default("resident_individual"),
  purchasePrice: z.number().min(0),
  salePrice: z.number().min(0),
  transferExpenses: z.number().min(0).default(0),
  costOfImprovement: z.number().min(0).default(0),
  purchaseDate: z.string().optional(),
  saleDate: z.string().optional(),
  holdingMonths: z.number().min(0).optional(),
  improvementCiiYear: z.union([z.number(), z.string()]).default(2018),
  purchaseCiiYear: z.union([z.number(), z.string()]).default(2015),
  saleCiiYear: z.union([z.number(), z.string()]).default(2026),
  isPurchasedBeforeCutoff: z.boolean().optional(),
  investorSlabRatePercent: z.number().min(0).max(50).default(30),
  priorExemptionUsed: z.number().min(0).default(0),
});
export type CapitalGainsFormValues = z.infer<typeof capitalGainsSchema>;

// ─── HRA EXEMPTION ────────────────────────────────────────────

export const hraExemptionSchema = z.object({
  basicSalary: z.number().min(0),
  salaryPeriod: z.enum(["monthly", "yearly"]).default("monthly"),
  dearnessAllowance: z.number().min(0).default(0),
  daFormsPartOfRetirementBenefits: z.boolean().default(false),
  hraReceived: z.number().min(0),
  rentPaid: z.number().min(0),
  cityType: z.enum(["metro", "non_metro"]).default("metro"),
  regime: z.enum(["new", "old"]).default("old"),
  isPayingToParents: z.boolean().default(false),
  parentsSlabRatePercent: z.number().min(0).max(50).default(0),
  userSlabRatePercent: z.number().min(0).max(50).default(30),
});
export type HraExemptionFormValues = z.infer<typeof hraExemptionSchema>;

// ─── PRESUMPTIVE TAX ──────────────────────────────────────────

export const presumptiveTaxSchema = z.object({
  professionType: z.enum(["business_44ad", "profession_44ada"]),
  grossTurnover: z.number().min(0),
  digitalReceiptsPercentage: z.number().min(0).max(100).default(100),
  actualProfit: z.number().min(0).optional(),
  regime: z.enum(["new", "old"]).default("new"),
  deduction80C: z.number().min(0).default(0),
  deduction80D: z.number().min(0).default(0),
  otherDeductions: z.number().min(0).default(0),
  pastPresumptiveHistory: z
    .enum(["continuously_opted", "opted_out_in_past_5_years"])
    .default("continuously_opted"),
});
export type PresumptiveTaxFormValues = z.infer<typeof presumptiveTaxSchema>;

// ─── SECTION 54 EXEMPTION ─────────────────────────────────────

export const section54ExemptionSchema = z.object({
  capitalGainsAmount: z.number().min(0).optional(),
  sectionType: z.enum(["section_54", "section_54ec", "section_54f"]),
  originalAssetType: z
    .enum([
      "residential_house",
      "long_term_capital_asset_other_than_residential_house",
    ])
    .optional(),
  propertyInvestmentAmount: z.number().min(0).default(0),
  propertyMode: z.enum(["purchase", "construction"]).default("purchase"),
  propertyTimelineMonths: z.number().default(12),
  bondsInvestmentAmount: z.number().min(0).default(0),
  bondsTimelineMonths: z.number().default(3),
  taxRatePercent: z.number().min(0).max(50).default(12.5),
  netSaleConsideration: z.number().min(0).optional(),
  existingResidentialHousesCount: z.number().min(0).default(0),
});
export type Section54ExemptionFormValues = z.infer<
  typeof section54ExemptionSchema
>;

// ─── LRS TCS ──────────────────────────────────────────────────

export const lrsTcsSchema = z.object({
  category: z.enum([
    "education_loan_80e",
    "education_self_funded",
    "medical_treatment",
    "overseas_tour_package",
    "other_remittance_investment_real_estate",
  ]),
  remittanceAmountInr: z.number().min(0),
  panAvailable: z.boolean().default(true),
});
export type LrsTcsFormValues = z.infer<typeof lrsTcsSchema>;

// ─── US STOCK TAX ─────────────────────────────────────────────

export const usStockTaxSchema = z.object({
  investmentAmountInr: z.number().min(0),
  purchaseUsdInrRate: z.number().min(1),
  saleUsdInrRate: z.number().min(1),
  capitalGainUsd: z.number(),
  dividendIncomeUsd: z.number().min(0).default(0),
  holdingMonths: z.number().min(0),
  usDividendWithholdingTaxPercent: z.number().min(0).max(50).default(25),
  userTaxBracketPercent: z.number().min(0).max(50).default(30),
});
export type USStockTaxFormValues = z.infer<typeof usStockTaxSchema>;

// ─── NRI DEPOSITS (NRE / NRO / FCNR) ──────────────────────────

export const nreNroFcnrSchema = z.object({
  depositAmount: z.number().min(100),
  tenureMonths: z.number().min(1).max(120),
  nreInterestRatePercent: z.number().min(0).max(30),
  nroInterestRatePercent: z.number().min(0).max(30),
  fcnrInterestRatePercent: z.number().min(0).max(30),
  nroTdsRatePercent: z.number().min(0).max(50).default(31.2),
  compoundingFrequency: z.enum(["quarterly", "annual"]).default("quarterly"),
  startingUsdInrRate: z.number().min(1).default(84),
  expectedMaturityUsdInrRate: z.number().min(1).default(88),
  homeCountryTaxRatePercent: z.number().min(0).max(60).default(0),
});
export type NreNroFcnrFormValues = z.infer<typeof nreNroFcnrSchema>;

// ─── F&O BROKERAGE ────────────────────────────────────────────

export const fnoBrokerageSchema = z.object({
  instrument: z.enum([
    "futures",
    "options",
    "futures_equity",
    "options_equity",
    "futures_commodity",
    "options_commodity",
  ]),
  buyPrice: z.number().min(0),
  sellPrice: z.number().min(0),
  quantity: z.number().min(1),
  brokeragePerOrder: z.number().min(0).default(20),
  taxYear: z
    .enum([
      "period_a_till_sep_2024",
      "period_a_pre_oct_2024",
      "period_b_oct_2024_to_mar_2026",
      "period_c_from_apr_2026",
      "tax_year_2026_27",
      "pre_april_2026",
    ])
    .default("tax_year_2026_27"),
  sttRatePercent: z.number().min(0).max(10).optional(),
  exchangeChargeRatePercent: z.number().min(0).max(10).optional(),
});
export type FnoBrokerageFormValues = z.infer<typeof fnoBrokerageSchema>;

// ─── OPTION PAYOFF ────────────────────────────────────────────

export const optionPayoffSchema = z.object({
  lotSize: z.number().min(1).default(50),
  underlyingPrice: z.number().min(0).default(24000),
  legs: z
    .array(
      z.object({
        strike: z.number(),
        type: z.enum(["call", "put"]),
        action: z.enum(["buy", "sell"]),
        premium: z.number().min(0),
        lots: z.number().min(1).default(1),
        iv: z.number().min(0).optional(),
      })
    )
    .default([]),
  minSpot: z.number().min(0).optional(),
  maxSpot: z.number().min(0).optional(),
  step: z.number().min(0.01).optional(),
});
export type OptionPayoffFormValues = z.infer<typeof optionPayoffSchema>;

// ─── BLACK-SCHOLES ────────────────────────────────────────────

export const blackScholesSchema = z.object({
  spotPrice: z.number().min(0),
  strikePrice: z.number().min(0),
  timeToExpiryDays: z.number().min(0).optional(),
  timeToExpiryYears: z.number().min(0).optional(),
  volatilityPercent: z.number().min(0).max(500),
  riskFreeRatePercent: z.number().min(0).max(50).default(7),
  dividendYieldPercent: z.number().min(0).max(50).default(0),
});
export type BlackScholesFormValues = z.infer<typeof blackScholesSchema>;

// ─── POSITION SIZE ────────────────────────────────────────────

export const positionSizeSchema = z.object({
  capital: z.number().min(100),
  riskPercent: z.number().min(0.01).max(100),
  entryPrice: z.number().min(0.01),
  stopLossPrice: z.number().min(0.01),
  riskRewardRatio: z.number().min(0.1).default(2),
  tradeDirection: z.enum(["long", "short", "auto"]).default("auto"),
  leverageMultiplier: z.number().min(1).max(100).default(1),
});
export type PositionSizeFormValues = z.infer<typeof positionSizeSchema>;

// ─── MARGIN ESTIMATOR ─────────────────────────────────────────

export const marginCalculatorSchema = z.object({
  instrumentCategory: z.enum([
    "index_futures",
    "index_options_long",
    "index_options_short",
    "stock_futures",
    "stock_options_long",
    "stock_options_short",
    "equity_delivery",
    "equity_intraday",
  ]),
  lotSize: z.number().min(1),
  numberOfLots: z.number().min(1).default(1),
  price: z.number().min(0.01),
  customSpanPercent: z.number().min(0).max(100).optional(),
  customExposurePercent: z.number().min(0).max(100).optional(),
  isMtfHolding: z.boolean().default(false),
  mtfHoldingDays: z.number().min(0).default(0),
  mtfAnnualInterestRate: z.number().min(0).max(50).default(18),
});
export type MarginCalculatorFormValues = z.infer<
  typeof marginCalculatorSchema
>;

// ─── PORTFOLIO RISK ───────────────────────────────────────────

export const portfolioRiskSchema = z.object({
  returns: z.array(z.number()),
  periodFrequency: z.enum(["monthly", "daily", "annual"]).default("monthly"),
  riskFreeRate: z.number().default(7),
  portfolioBeta: z.number().default(1),
  benchmarkReturns: z.array(z.number()).optional(),
});
export type PortfolioRiskFormValues = z.infer<typeof portfolioRiskSchema>;

// ─── DCF VALUATION ────────────────────────────────────────────

export const dcfValuationSchema = z.object({
  fcfProjections: z.array(z.number()),
  terminalGrowthRate: z.number().min(0).max(20).default(4),
  discountRate: z.number().min(0.1).max(50).default(11),
  sharesOutstanding: z.number().min(1).optional(),
  netDebt: z.number().default(0),
  forecastYears: z.number().optional(),
  growthRateYears1to5: z.number().optional(),
  cashFlowYear1: z.number().optional(),
});
export type DcfValuationFormValues = z.infer<typeof dcfValuationSchema>;

// ─── WACC ─────────────────────────────────────────────────────

export const waccSchema = z.object({
  equityValue: z.number().min(0),
  debtValue: z.number().min(0),
  costOfEquityMode: z.enum(["direct", "capm"]).default("direct"),
  costOfEquity: z.number().min(0).max(100).optional(),
  riskFreeRate: z.number().min(0).max(50).optional(),
  beta: z.number().optional(),
  marketReturn: z.number().min(0).max(100).optional(),
  costOfDebt: z.number().min(0).max(100),
  taxRate: z.number().min(0).max(100),
});
export type WaccFormValues = z.infer<typeof waccSchema>;

// ─── DUPONT ANALYSIS ──────────────────────────────────────────

export const dupontAnalysisSchema = z.object({
  netIncome: z.number(),
  revenue: z.number().min(0.01),
  totalAssets: z.number().min(0.01),
  shareholdersEquity: z.number().min(0.01),
  ebt: z.number().optional(),
  ebit: z.number().optional(),
});
export type DuPontAnalysisFormValues = z.infer<typeof dupontAnalysisSchema>;

// ─── Utility: generic validator ──────────────────────────────

/**
 * Validate input against a schema and return typed data or errors.
 * Useful in API routes.
 */
export function validateInput<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors as Record<string, string[]>,
  };
}
