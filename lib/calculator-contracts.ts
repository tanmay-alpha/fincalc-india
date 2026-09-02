import { z } from "zod";
import { CALCULATOR_REGISTRY } from "@/lib/calculators";
import {
  calcEMI,
  calcFD,
  calcLumpsum,
  calcPPF,
  calcSIP,
  calcTax,
} from "@/lib/math";
import {
  emiSchema,
  fdSchema,
  lumpsumSchema,
  ppfSchema,
  sipSchema,
  taxSchema,
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

const unsupported = (calculationFunctions: readonly string[]): ContractDefinition => ({
  calculationFunctions,
  saveSupported: false,
  shareSupported: false,
});

const calculatorContractDefinitions: Record<string, ContractDefinition> = {
  sip: {
    calculationFunctions: ["calcSIP"],
    inputSchema: sipSchema,
    calculate: (input) => calcSIP(input as Parameters<typeof calcSIP>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "step-up-sip": unsupported(["calcStepUpSIP", "calcGoalSIP"]),
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
  },
  fire: unsupported(["calcFIRE"]),
  nps: unsupported(["calcNPS"]),
  "xirr-cagr-twrr": unsupported(["calcXIRR", "calcCAGR", "calcTWRR"]),
  emi: {
    calculationFunctions: ["calcEMI"],
    inputSchema: emiSchema,
    calculate: (input) => calcEMI(input as Parameters<typeof calcEMI>[0]),
    saveSupported: true,
    shareSupported: true,
  },
  "loan-prepayment": unsupported(["calcPrepaymentVsInvest"]),
  "no-cost-emi": unsupported(["calcNoCostEMITruth"]),
  "car-loan-tco": unsupported(["calcCarTCO"]),
  "balance-transfer": unsupported(["calcBalanceTransfer"]),
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
      officialSources: ["https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/general-questions-0"],
    },
  },
  "marginal-relief": unsupported(["calcMarginalRelief"]),
  "capital-gains-tax": unsupported(["calcCapitalGains"]),
  "hra-exemption": unsupported(["calcHRAExemption"]),
  "presumptive-tax": unsupported(["calcPresumptiveTax"]),
  "section-54-exemption": unsupported(["calcSection54Exemption"]),
  "lrs-tcs": unsupported(["calcLRSTCS"]),
  "us-stock-tax": unsupported(["calcUSStockReturn"]),
  "nre-nro-fcnr": unsupported(["calcNRIDepositReturns"]),
  "fno-brokerage": unsupported(["calcFnOBreakeven"]),
  "option-payoff": unsupported(["calcOptionPayoff"]),
  "black-scholes": unsupported(["calcBlackScholes"]),
  "position-size": unsupported(["calcPositionSize"]),
  "margin-calculator": unsupported(["calcMarginRequired"]),
  "portfolio-risk": unsupported(["calcRiskRatios"]),
  "dcf-valuation": unsupported(["calcDCF"]),
  wacc: unsupported(["calcWACC"]),
  "dupont-analysis": unsupported(["calcDuPont"]),
};

export const CALCULATOR_CONTRACTS: readonly CalculatorContract[] = CALCULATOR_REGISTRY.map(
  ({ id, route }) => {
    const definition = calculatorContractDefinitions[id];
    if (!definition) {
      throw new Error(`Missing calculator contract definition for ${id}`);
    }
    return { id, route, ...definition };
  }
);

export function getCalculatorContract(id: string): CalculatorContract | undefined {
  return CALCULATOR_CONTRACTS.find((contract) => contract.id === id);
}

export function isSaveSupportedContract(
  contract: CalculatorContract
): contract is CalculatorContract & Required<Pick<CalculatorContract, "inputSchema" | "calculate">> {
  return contract.saveSupported && Boolean(contract.inputSchema) && typeof contract.calculate === "function";
}

export function isShareSupportedContract(contract: CalculatorContract): boolean {
  return Boolean(contract.shareSupported);
}
