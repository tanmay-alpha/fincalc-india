import { z } from "zod";
import { CALCULATOR_REGISTRY } from "@/lib/calculators";
import {
  calcBalanceTransfer,
  calcBlackScholes,
  calcCAGR,
  calcCapitalGains,
  calcCarTCO,
  calcDCF,
  calcDuPont,
  calcEMI,
  calcFD,
  calcFIRE,
  calcFnOBreakeven,
  calcHRAExemption,
  calcLRSTCS,
  calcLumpsum,
  calcMarginalRelief,
  calcMarginRequired,
  calcNPS,
  calcNRIDepositReturns,
  calcNoCostEMITruth,
  calcOptionPayoff,
  calcPositionSize,
  calcPPF,
  calcPrepaymentVsInvest,
  calcPresumptiveTax,
  calcRiskRatios,
  calcSection54Exemption,
  calcSIP,
  calcStepUpSIP,
  calcTax,
  calcTWRR,
  calcUSStockReturn,
  calcWACC,
  calcXIRR,
} from "@/lib/math";
import {
  balanceTransferSchema,
  blackScholesSchema,
  capitalGainsSchema,
  carLoanTcoSchema,
  dcfValuationSchema,
  dupontAnalysisSchema,
  emiSchema,
  fdSchema,
  fireSchema,
  fnoBrokerageSchema,
  hraExemptionSchema,
  loanPrepaymentSchema,
  lrsTcsSchema,
  lumpsumSchema,
  marginCalculatorSchema,
  marginalReliefSchema,
  noCostEmiSchema,
  npsSchema,
  nreNroFcnrSchema,
  optionPayoffSchema,
  portfolioRiskSchema,
  positionSizeSchema,
  ppfSchema,
  presumptiveTaxSchema,
  section54ExemptionSchema,
  sipSchema,
  stepUpSipSchema,
  taxSchema,
  usStockTaxSchema,
  waccSchema,
  xirrCagrTwrrSchema,
} from "@/lib/validations";

export interface RegulatoryMetadata {
  taxYear?: string;
  currentAct?: string;
  currentSections?: readonly string[];
  legacySections?: readonly string[];
  effectiveFrom?: string;
  officialSources?: readonly string[];
}

export interface CalculatorContract<I = unknown, O = unknown> {
  id: string;
  route: string;
  inputSchema?: z.ZodType<I>;
  calculate?: (input: I) => O;
  calculationFunctions: readonly string[];
  saveSupported: boolean;
  shareSupported: boolean;
  regulatoryMetadata?: RegulatoryMetadata;
}

type ContractDefinition = Omit<CalculatorContract, "id" | "route">;

const calculatorContractDefinitions: Record<string, ContractDefinition> = {
  sip: {
    calculationFunctions: ["calcSIP"],
    inputSchema: sipSchema,
    calculate: (input) => calcSIP(input as Parameters<typeof calcSIP>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "step-up-sip": {
    calculationFunctions: ["calcStepUpSIP", "calcGoalSIP"],
    inputSchema: stepUpSipSchema,
    calculate: (input) => calcStepUpSIP(input as Parameters<typeof calcStepUpSIP>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  lumpsum: {
    calculationFunctions: ["calcLumpsum"],
    inputSchema: lumpsumSchema,
    calculate: (input) => calcLumpsum(input as Parameters<typeof calcLumpsum>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  fd: {
    calculationFunctions: ["calcFD"],
    inputSchema: fdSchema,
    calculate: (input) => calcFD(input as Parameters<typeof calcFD>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  ppf: {
    calculationFunctions: ["calcPPF"],
    inputSchema: ppfSchema,
    calculate: (input) => calcPPF(input as Parameters<typeof calcPPF>[0]),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      currentAct: "Public Provident Fund Scheme, 2019",
      currentSections: ["Section 80C"],
      effectiveFrom: "2019-12-12",
      officialSources: ["https://www.indiapost.gov.in"],
    },
  },
  fire: {
    calculationFunctions: ["calcFIRE"],
    inputSchema: fireSchema,
    calculate: (input) => calcFIRE(input as Parameters<typeof calcFIRE>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  nps: {
    calculationFunctions: ["calcNPS"],
    inputSchema: npsSchema,
    calculate: (input) => calcNPS(input as Parameters<typeof calcNPS>[0]),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      currentAct: "PFRDA Exit Regulations, 2026",
      currentSections: ["80CCD(1B)", "80CCD(2)"],
      effectiveFrom: "2026-04-01",
      officialSources: ["https://www.pfrda.org.in"],
    },
  },
  "xirr-cagr-twrr": {
    calculationFunctions: ["calcXIRR", "calcCAGR", "calcTWRR"],
    inputSchema: xirrCagrTwrrSchema,
    calculate: (input: any) => {
      const xirrRes =
        input.cashflows && input.cashflows.length >= 2
          ? calcXIRR(input.cashflows)
          : null;
      const cagrRes =
        input.cagrInitial !== undefined &&
        input.cagrFinal !== undefined &&
        input.cagrYears
          ? calcCAGR({
              initialValue: input.cagrInitial,
              finalValue: input.cagrFinal,
              durationYears: input.cagrYears,
            })
          : null;
      const twrrRes =
        input.twrrPeriods && input.twrrPeriods.length > 0
          ? calcTWRR(input.twrrPeriods)
          : null;
      return {
        activeTab: input.activeTab ?? "xirr",
        xirr: xirrRes,
        cagr: cagrRes,
        twrr: twrrRes,
      };
    },
    saveSupported: true,
    shareSupported: true,
  },
  emi: {
    calculationFunctions: ["calcEMI"],
    inputSchema: emiSchema,
    calculate: (input) => calcEMI(input as Parameters<typeof calcEMI>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "loan-prepayment": {
    calculationFunctions: ["calcPrepaymentVsInvest"],
    inputSchema: loanPrepaymentSchema,
    calculate: (input: any) => {
      const tenureMonths =
        input.tenureMonths ?? (input.tenure ? input.tenure * 12 : 240);
      return calcPrepaymentVsInvest({
        principal: input.principal,
        annualRate: input.annualRate,
        tenureMonths,
        prepaymentType: input.prepaymentType ?? "extra_emi_yearly",
        prepaymentAmount: input.prepaymentAmount,
        lumpsumYear: input.lumpsumYear,
        investmentRate: input.investmentRate ?? 12,
      });
    },
    saveSupported: true,
    shareSupported: true,
  },
  "no-cost-emi": {
    calculationFunctions: ["calcNoCostEMITruth"],
    inputSchema: noCostEmiSchema,
    calculate: (input) =>
      calcNoCostEMITruth(input as Parameters<typeof calcNoCostEMITruth>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "car-loan-tco": {
    calculationFunctions: ["calcCarTCO"],
    inputSchema: carLoanTcoSchema,
    calculate: (input) =>
      calcCarTCO(input as Parameters<typeof calcCarTCO>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "balance-transfer": {
    calculationFunctions: ["calcBalanceTransfer"],
    inputSchema: balanceTransferSchema,
    calculate: (input) =>
      calcBalanceTransfer(input as Parameters<typeof calcBalanceTransfer>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  tax: {
    calculationFunctions: ["calcTax"],
    inputSchema: taxSchema,
    calculate: (input) => calcTax(input as Parameters<typeof calcTax>[0]),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      taxYear: "Tax Year 2026-27",
      currentAct: "Income-tax Act, 2025",
      currentSections: ["156"],
      legacySections: ["87A"],
      effectiveFrom: "2026-04-01",
      officialSources: [
        "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/general-questions-0",
      ],
    },
  },
  "marginal-relief": {
    calculationFunctions: ["calcMarginalRelief"],
    inputSchema: marginalReliefSchema,
    calculate: (input) =>
      calcMarginalRelief(input as Parameters<typeof calcMarginalRelief>[0]),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      taxYear: "Tax Year 2026-27",
      currentAct: "Income-tax Act, 2025",
      currentSections: ["Section 156 / Surcharge Slabs"],
      effectiveFrom: "2026-04-01",
      officialSources: ["https://www.incometax.gov.in"],
    },
  },
  "capital-gains-tax": {
    calculationFunctions: ["calcCapitalGains"],
    inputSchema: capitalGainsSchema,
    calculate: (input) =>
      calcCapitalGains(input as Parameters<typeof calcCapitalGains>[0]),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      taxYear: "Tax Year 2026-27",
      currentAct: "Finance Act, 2024 / Finance Act, 2026",
      currentSections: ["112A", "111A", "50AA", "76"],
      effectiveFrom: "2024-07-23",
      officialSources: ["https://www.incometax.gov.in"],
    },
  },
  "hra-exemption": {
    calculationFunctions: ["calcHRAExemption"],
    inputSchema: hraExemptionSchema,
    calculate: (input) =>
      calcHRAExemption(input as Parameters<typeof calcHRAExemption>[0]),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      currentAct: "Income-tax Act, 1961 / 2025",
      currentSections: ["10(13A)", "Rule 2A"],
      effectiveFrom: "2026-04-01",
      officialSources: ["https://www.incometax.gov.in"],
    },
  },
  "presumptive-tax": {
    calculationFunctions: ["calcPresumptiveTax"],
    inputSchema: presumptiveTaxSchema,
    calculate: (input) =>
      calcPresumptiveTax(input as Parameters<typeof calcPresumptiveTax>[0]),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      currentAct: "Income-tax Act, 1961 / 2025",
      currentSections: ["44AD", "44ADA", "44AB"],
      effectiveFrom: "2026-04-01",
      officialSources: ["https://www.incometax.gov.in"],
    },
  },
  "section-54-exemption": {
    calculationFunctions: ["calcSection54Exemption"],
    inputSchema: section54ExemptionSchema,
    calculate: (input) =>
      calcSection54Exemption(
        input as Parameters<typeof calcSection54Exemption>[0]
      ),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      currentAct: "Income-tax Act, 1961 / 2025",
      currentSections: ["54", "54EC", "54F", "82", "85", "86"],
      effectiveFrom: "2026-04-01",
      officialSources: ["https://www.incometax.gov.in"],
    },
  },
  "lrs-tcs": {
    calculationFunctions: ["calcLRSTCS"],
    inputSchema: lrsTcsSchema,
    calculate: (input) => calcLRSTCS(input as Parameters<typeof calcLRSTCS>[0]),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      taxYear: "Tax Year 2026-27",
      currentAct: "Income-tax Act, 2025 Section 394 / Finance Act, 2026",
      currentSections: ["394"],
      legacySections: ["206C(1G)"],
      effectiveFrom: "2026-04-01",
      officialSources: ["https://www.incometax.gov.in"],
    },
  },
  "us-stock-tax": {
    calculationFunctions: ["calcUSStockReturn"],
    inputSchema: usStockTaxSchema,
    calculate: (input) =>
      calcUSStockReturn(input as Parameters<typeof calcUSStockReturn>[0]),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      taxYear: "Tax Year 2026-27",
      currentAct: "Income-tax Rules (Rule 115) / Section 90 DTAA",
      currentSections: ["Rule 115", "Section 90"],
      effectiveFrom: "2026-04-01",
      officialSources: ["https://www.incometax.gov.in"],
    },
  },
  "nre-nro-fcnr": {
    calculationFunctions: ["calcNRIDepositReturns"],
    inputSchema: nreNroFcnrSchema,
    calculate: (input) =>
      calcNRIDepositReturns(input as Parameters<typeof calcNRIDepositReturns>[0]),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      taxYear: "Tax Year 2026-27",
      currentAct: "Income-tax Act / FEMA",
      currentSections: ["10(4)(ii)", "195"],
      effectiveFrom: "2026-04-01",
      officialSources: ["https://www.rbi.org.in"],
    },
  },
  "fno-brokerage": {
    calculationFunctions: ["calcFnOBreakeven"],
    inputSchema: fnoBrokerageSchema,
    calculate: (input) =>
      calcFnOBreakeven(input as Parameters<typeof calcFnOBreakeven>[0]),
    saveSupported: true,
    shareSupported: true,
    regulatoryMetadata: {
      taxYear: "Tax Year 2026-27",
      currentAct: "Finance Act, 2024 / Finance Act, 2026",
      currentSections: ["Securities Transaction Tax Act"],
      effectiveFrom: "2024-10-01",
      officialSources: ["https://www.nseindia.com"],
    },
  },
  "option-payoff": {
    calculationFunctions: ["calcOptionPayoff"],
    inputSchema: optionPayoffSchema,
    calculate: (input) =>
      calcOptionPayoff(input as Parameters<typeof calcOptionPayoff>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "black-scholes": {
    calculationFunctions: ["calcBlackScholes"],
    inputSchema: blackScholesSchema,
    calculate: (input) =>
      calcBlackScholes(input as Parameters<typeof calcBlackScholes>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "position-size": {
    calculationFunctions: ["calcPositionSize"],
    inputSchema: positionSizeSchema,
    calculate: (input) =>
      calcPositionSize(input as Parameters<typeof calcPositionSize>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "margin-calculator": {
    calculationFunctions: ["calcMarginRequired"],
    inputSchema: marginCalculatorSchema,
    calculate: (input) =>
      calcMarginRequired(input as Parameters<typeof calcMarginRequired>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "portfolio-risk": {
    calculationFunctions: ["calcRiskRatios"],
    inputSchema: portfolioRiskSchema,
    calculate: (input) =>
      calcRiskRatios(input as Parameters<typeof calcRiskRatios>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "dcf-valuation": {
    calculationFunctions: ["calcDCF"],
    inputSchema: dcfValuationSchema,
    calculate: (input) => calcDCF(input as Parameters<typeof calcDCF>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  wacc: {
    calculationFunctions: ["calcWACC"],
    inputSchema: waccSchema,
    calculate: (input) => calcWACC(input as Parameters<typeof calcWACC>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "dupont-analysis": {
    calculationFunctions: ["calcDuPont"],
    inputSchema: dupontAnalysisSchema,
    calculate: (input) =>
      calcDuPont(input as Parameters<typeof calcDuPont>[0]),
    saveSupported: true,
    shareSupported: true,
  },
};

export const CALCULATOR_CONTRACTS: readonly CalculatorContract[] =
  CALCULATOR_REGISTRY.map(({ id, route }) => {
    const definition = calculatorContractDefinitions[id];
    if (!definition) {
      throw new Error(`Missing calculator contract definition for ${id}`);
    }
    return { id, route, ...definition };
  });

function normalizeContractLookupId(id: string): string {
  const clean = id
    .toLowerCase()
    .trim()
    .replace(/^\//, "")
    .replace(/\s+/g, "-");

  const aliases: Record<string, string> = {
    dupont: "dupont-analysis",
    hra: "hra-exemption",
    "hra-exemption": "hra-exemption",
    "position-size": "position-size",
    xirr: "xirr-cagr-twrr",
    "returns-suite": "xirr-cagr-twrr",
    "car-tco": "car-loan-tco",
    "capital-gains": "capital-gains-tax",
    "section-54": "section-54-exemption",
    "nri-deposits": "nre-nro-fcnr",
    "us-stock": "us-stock-tax",
    margin: "margin-calculator",
    fno: "fno-brokerage",
  };

  return aliases[clean] || clean;
}

export function getCalculatorContract(
  id: string
): CalculatorContract | undefined {
  const normalized = normalizeContractLookupId(id);
  return CALCULATOR_CONTRACTS.find(
    (contract) =>
      contract.id === normalized ||
      contract.route.replace(/^\//, "") === normalized ||
      normalizeContractLookupId(contract.id) === normalized
  );
}

export function isSaveSupportedContract(
  contract: CalculatorContract
): contract is CalculatorContract &
  Required<Pick<CalculatorContract, "inputSchema" | "calculate">> {
  return (
    contract.saveSupported &&
    Boolean(contract.inputSchema) &&
    typeof contract.calculate === "function"
  );
}

export function isShareSupportedContract(
  contract: CalculatorContract
): boolean {
  return Boolean(contract.shareSupported);
}
