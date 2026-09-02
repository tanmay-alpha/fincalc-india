export type CalculatorCategory =
  | "investments"
  | "loans"
  | "taxation"
  | "trading"
  | "corporate";

export interface CalculatorMeta {
  id: string;
  name: string;
  shortName: string;
  route: string;
  category: CalculatorCategory;
  description: string;
  badge?: string;
  isPopular?: boolean;
}

export const CALCULATOR_REGISTRY: CalculatorMeta[] = [
  // ─── Investments & Wealth ─────────────────────────────────────────
  {
    id: "sip",
    name: "SIP Calculator",
    shortName: "SIP",
    route: "/sip",
    category: "investments",
    description: "Calculate compounding returns on monthly mutual fund investments with inflation adjustment.",
    isPopular: true,
  },
  {
    id: "step-up-sip",
    name: "Step-Up SIP Calculator",
    shortName: "Step-Up SIP",
    route: "/step-up-sip",
    category: "investments",
    description: "Model annual percentage or fixed increment top-ups to beat lifestyle inflation.",
    isPopular: true,
  },
  {
    id: "lumpsum",
    name: "Lumpsum Investment Calculator",
    shortName: "Lumpsum",
    route: "/lumpsum",
    category: "investments",
    description: "Analyze compounding growth, CAGR, and wealth ratio for one-time investments.",
  },
  {
    id: "fd",
    name: "Fixed Deposit (FD) Calculator",
    shortName: "Fixed Deposit",
    route: "/fd",
    category: "investments",
    description: "Compute maturity values with monthly, quarterly, and annual compounding payouts.",
  },
  {
    id: "ppf",
    name: "Public Provident Fund (PPF) Calculator",
    shortName: "PPF",
    route: "/ppf",
    category: "investments",
    description: "Model 15-year EEE compounding with statutory deposit limits and partial withdrawals.",
  },
  {
    id: "fire",
    name: "FIRE Calculator (Financial Independence)",
    shortName: "FIRE",
    route: "/fire",
    category: "investments",
    description: "Calculate your Lean, Standard, and Fat FIRE corpus with Safe Withdrawal Rates (SWR).",
    isPopular: true,
  },
  {
    id: "nps",
    name: "NPS Calculator (National Pension System)",
    shortName: "NPS",
    route: "/nps",
    category: "investments",
    description: "Model Tier-1 asset allocation, PFRDA 2026 exit rules, and 80CCD(1B)/80CCD(2) tax deductions.",
    badge: "PFRDA 2026",
    isPopular: true,
  },
  {
    id: "xirr-cagr-twrr",
    name: "Returns Suite (XIRR / CAGR / TWRR)",
    shortName: "Returns Suite",
    route: "/xirr-cagr-twrr",
    category: "investments",
    description: "Compute money-weighted XIRR, point-to-point CAGR, and time-weighted TWRR returns.",
  },

  // ─── Loans & Refinancing ──────────────────────────────────────────
  {
    id: "emi",
    name: "Loan EMI Calculator",
    shortName: "EMI",
    route: "/emi",
    category: "loans",
    description: "Calculate monthly reducing-balance EMI and view complete amortization schedules.",
    isPopular: true,
  },
  {
    id: "loan-prepayment",
    name: "Loan Prepayment vs. Invest Calculator",
    shortName: "Prepayment vs Invest",
    route: "/loan-prepayment",
    category: "loans",
    description: "Compare interest saved via prepayment against wealth generated through equity SIPs.",
  },
  {
    id: "no-cost-emi",
    name: "No-Cost EMI Reality Checker",
    shortName: "No-Cost EMI",
    route: "/no-cost-emi",
    category: "loans",
    description: "Uncover hidden merchant discounts, processing fees, and 18% GST on zero-cost EMIs.",
  },
  {
    id: "car-loan-tco",
    name: "Car Loan Total Cost of Ownership (TCO)",
    shortName: "Car TCO",
    route: "/car-loan-tco",
    category: "loans",
    description: "Calculate true vehicle costs including depreciation, fuel inflation, insurance, and maintenance.",
  },
  {
    id: "balance-transfer",
    name: "Home Loan Balance Transfer & Refinance",
    shortName: "Balance Transfer",
    route: "/balance-transfer",
    category: "loans",
    description: "Evaluate switching fees, MODT stamp duty, and breakeven timeline against net interest savings.",
  },

  // ─── Taxation & Statutory Planning ────────────────────────────────
  {
    id: "tax",
    name: "Income Tax Calculator (AY 2026-27)",
    shortName: "Income Tax",
    route: "/tax",
    category: "taxation",
    description: "Compare New vs Old Regime with Section 156 rebate (₹12L), ₹75k standard deduction & capital gains.",
    badge: "Finance Act 2026",
    isPopular: true,
  },
  {
    id: "marginal-relief",
    name: "Marginal Relief & Surcharge Calculator",
    shortName: "Marginal Relief",
    route: "/marginal-relief",
    category: "taxation",
    description: "Calculate statutory marginal relief at ₹50L, ₹1Cr, ₹2Cr, and ₹5Cr surcharge boundaries.",
  },
  {
    id: "capital-gains-tax",
    name: "Capital Gains Tax Calculator",
    shortName: "Capital Gains",
    route: "/capital-gains-tax",
    category: "taxation",
    description: "Unified post-July 2024 rates: Equity LTCG @ 12.5% (>₹1.25L), STCG @ 20%, and real estate grandfathering.",
    badge: "Post-July 2024",
    isPopular: true,
  },
  {
    id: "hra-exemption",
    name: "HRA Exemption Calculator (Section 10(13A))",
    shortName: "HRA Exemption",
    route: "/hra-exemption",
    category: "taxation",
    description: "Calculate statutory 3-condition HRA tax exemption for metro and non-metro cities.",
  },
  {
    id: "presumptive-tax",
    name: "Presumptive Taxation (Section 44AD / 44ADA)",
    shortName: "Presumptive Tax",
    route: "/presumptive-tax",
    category: "taxation",
    description: "Compute 6%/8% business profit or 50% professional profit with Section 44AB audit triggers.",
  },
  {
    id: "section-54-exemption",
    name: "Section 54 / 54EC / 54F Exemption Planner",
    shortName: "Section 54 / 54EC / 54F",
    route: "/section-54-exemption",
    category: "taxation",
    description: "Plan capital gains roll-over into residential property, 54EC bonds (₹50L cap), or 54F proportionate exemption.",
  },
  {
    id: "lrs-tcs",
    name: "LRS TCS & Remittance (Section 394)",
    shortName: "LRS TCS",
    route: "/lrs-tcs",
    category: "taxation",
    description: "Calculate TCS on foreign remittances under Finance Act 2026 (flat 2% tour, 0% edu loan, 2%/20% >₹10L).",
    badge: "FA 2026",
  },
  {
    id: "us-stock-tax",
    name: "US Stock Tax & Net Return (DTAA FTC)",
    shortName: "US Stock Tax",
    route: "/us-stock-tax",
    category: "taxation",
    description: "Model Rule 115 INR conversion, 24m holding period, and Section 90 FTC on 25% US dividend withholding.",
  },
  {
    id: "nre-nro-fcnr",
    name: "NRI Deposit Comparator (NRE / NRO / FCNR)",
    shortName: "NRI Deposits",
    route: "/nre-nro-fcnr",
    category: "taxation",
    description: "Compare tax-free NRE interest, 31.2% NRO TDS, and USD FCNR exchange rate yields.",
  },

  // ─── Trading, Derivatives & Quantitative Risk ─────────────────────
  {
    id: "fno-brokerage",
    name: "F&O Brokerage & STT Calculator",
    shortName: "F&O Charges",
    route: "/fno-brokerage",
    category: "trading",
    description: "Calculate exchange charges, SEBI fees, GST, and updated STT with exact breakeven ticks.",
  },
  {
    id: "option-payoff",
    name: "Option Strategy Payoff Visualizer",
    shortName: "Option Payoffs",
    route: "/option-payoff",
    category: "trading",
    description: "Visualize multi-leg PnL curves and Greeks for Spreads, Straddles, Strangles, and Iron Condors.",
  },
  {
    id: "black-scholes",
    name: "Black-Scholes Option Pricing & Greeks",
    shortName: "Black-Scholes",
    route: "/black-scholes",
    category: "trading",
    description: "Compute theoretical European option prices with Delta, Gamma, Theta, Vega, and Rho Greeks.",
  },
  {
    id: "position-size",
    name: "Position Size & Risk Calculator",
    shortName: "Position Sizing",
    route: "/position-size",
    category: "trading",
    description: "Calculate optimal share quantity based on capital risk budget, stop loss distance, and R:R ratio.",
  },
  {
    id: "margin-calculator",
    name: "F&O Margin Estimator",
    shortName: "Margin Estimator",
    route: "/margin-calculator",
    category: "trading",
    description: "Estimate initial SPAN and exposure margin requirements across Index and Stock derivatives with illustrative assumptions.",
  },
  {
    id: "portfolio-risk",
    name: "Portfolio Risk & Performance Ratios",
    shortName: "Portfolio Risk",
    route: "/portfolio-risk",
    category: "trading",
    description: "Compute Sharpe, Sortino (with zero-downside handling), Beta, Treynor, and Max Drawdown.",
  },

  // ─── Corporate Finance & Valuation ────────────────────────────────
  {
    id: "dcf-valuation",
    name: "DCF Valuation Calculator (Discounted Cash Flow)",
    shortName: "DCF Valuation",
    route: "/dcf-valuation",
    category: "corporate",
    description: "Multi-stage FCFF discounting, Gordon Growth terminal value, net debt bridge, and 2D WACC matrix.",
  },
  {
    id: "wacc",
    name: "WACC Calculator (Cost of Capital)",
    shortName: "WACC",
    route: "/wacc",
    category: "corporate",
    description: "Compute Weighted Average Cost of Capital using CAPM Cost of Equity and post-tax debt shields.",
  },
  {
    id: "dupont-analysis",
    name: "DuPont 5-Step ROE Decomposition",
    shortName: "DuPont ROE",
    route: "/dupont-analysis",
    category: "corporate",
    description: "Decompose ROE into Tax Burden, Interest Burden, Operating Margin, Asset Turnover, and Leverage.",
  },
];

export const ALL_CALCULATOR_ROUTES = CALCULATOR_REGISTRY.map((c) => c.route);
