/**
 * FINCALC INDIA — Canonical Product Registry & Search Architecture
 * 
 * Single source of truth for all 31 Indian financial calculators,
 * categories, metadata, search aliases, icon mappings, and related graphs.
 * 
 * Strict constraint: Pure metadata and search utility only.
 * Mathematical computation remains in lib/math.ts and domain engines.
 */

export type CalculatorCategory =
  | "investments"
  | "loans"
  | "taxation"
  | "trading"
  | "corporate";

export interface CategoryInfo {
  id: CalculatorCategory;
  label: string;
  description: string;
  iconName: "TrendingUp" | "Building2" | "FileText" | "LineChart" | "Scale";
}

export interface CalculatorMeta {
  id: string;
  name: string;
  shortName: string;
  route: string;
  category: CalculatorCategory;
  description: string;
  badge?: string;
  isPopular?: boolean;
  searchAliases: string[];
  relatedIds: string[];
}

// ─── Canonical Categories ───────────────────────────────────────────────────
export const CATEGORIES: CategoryInfo[] = [
  {
    id: "investments",
    label: "Invest & Grow",
    description: "Mutual funds, compounding, retirement, and returns analysis",
    iconName: "TrendingUp",
  },
  {
    id: "taxation",
    label: "Tax & Compliance",
    description: "Finance Act 2026 tax regimes, capital gains, HRA, and exemptions",
    iconName: "FileText",
  },
  {
    id: "loans",
    label: "Loans & Credit",
    description: "Amortization schedules, prepayments, refinancing, and true TCO",
    iconName: "Building2",
  },
  {
    id: "trading",
    label: "Trading & Risk",
    description: "F&O transaction charges, multi-leg payoffs, Greeks, and position sizing",
    iconName: "LineChart",
  },
  {
    id: "corporate",
    label: "Corporate & NRI",
    description: "DCF valuation models, WACC hurdle rates, and cross-border deposits",
    iconName: "Scale",
  },
];

export const CATEGORY_MAP: Record<CalculatorCategory, CategoryInfo> = {
  investments: CATEGORIES[0],
  taxation: CATEGORIES[1],
  loans: CATEGORIES[2],
  trading: CATEGORIES[3],
  corporate: CATEGORIES[4],
};

// ─── Canonical 31-Calculator Registry ───────────────────────────────────────
export const CALCULATOR_REGISTRY: CalculatorMeta[] = [
  // ─── 1. Investments & Wealth (8) ──────────────────────────────────────────
  {
    id: "sip",
    name: "SIP Calculator",
    shortName: "SIP",
    route: "/sip",
    category: "investments",
    description: "Calculate compounding returns on monthly mutual fund investments with inflation adjustment.",
    isPopular: true,
    searchAliases: ["sip", "systematic investment plan", "mutual fund", "mf", "compounding", "wealth", "equity", "crorepati"],
    relatedIds: ["step-up-sip", "lumpsum", "fire", "xirr-cagr-twrr"],
  },
  {
    id: "step-up-sip",
    name: "Step-Up SIP Calculator",
    shortName: "Step-Up SIP",
    route: "/step-up-sip",
    category: "investments",
    description: "Model annual percentage or fixed increment top-ups to beat lifestyle inflation.",
    isPopular: true,
    searchAliases: ["step-up sip", "top up sip", "incremental sip", "annual increment", "inflation", "mutual fund"],
    relatedIds: ["sip", "lumpsum", "fire", "xirr-cagr-twrr"],
  },
  {
    id: "lumpsum",
    name: "Lumpsum Investment Calculator",
    shortName: "Lumpsum",
    route: "/lumpsum",
    category: "investments",
    description: "Analyze compounding growth, CAGR, and wealth ratio for one-time investments.",
    searchAliases: ["lumpsum", "one time investment", "mutual fund", "cagr", "wealth ratio", "fixed investment"],
    relatedIds: ["sip", "fd", "step-up-sip", "xirr-cagr-twrr"],
  },
  {
    id: "fd",
    name: "Fixed Deposit (FD) Calculator",
    shortName: "Fixed Deposit",
    route: "/fd",
    category: "investments",
    description: "Compute maturity values with monthly, quarterly, and annual compounding payouts.",
    searchAliases: ["fd", "fixed deposit", "bank deposit", "term deposit", "safe return", "quarterly compounding"],
    relatedIds: ["ppf", "lumpsum", "sip", "nre-nro-fcnr"],
  },
  {
    id: "ppf",
    name: "Public Provident Fund (PPF) Calculator",
    shortName: "PPF",
    route: "/ppf",
    category: "investments",
    description: "Model 15-year EEE compounding with statutory deposit limits and partial withdrawals.",
    searchAliases: ["ppf", "public provident fund", "80c", "tax free return", "eee", "post office", "15 year"],
    relatedIds: ["fd", "nps", "sip", "tax"],
  },
  {
    id: "fire",
    name: "FIRE Calculator (Financial Independence)",
    shortName: "FIRE",
    route: "/fire",
    category: "investments",
    description: "Calculate your Lean, Standard, and Fat FIRE corpus with Safe Withdrawal Rates (SWR).",
    isPopular: true,
    searchAliases: ["fire", "financial independence", "retire early", "retirement", "swr", "safe withdrawal rate", "corpus"],
    relatedIds: ["sip", "nps", "step-up-sip", "lumpsum"],
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
    searchAliases: ["nps", "national pension system", "pfrda", "80ccd", "80ccd1b", "80ccd2", "corporate nps", "tier 1", "annuity"],
    relatedIds: ["fire", "tax", "ppf", "sip"],
  },
  {
    id: "xirr-cagr-twrr",
    name: "Returns Suite (XIRR / CAGR / TWRR)",
    shortName: "Returns Suite",
    route: "/xirr-cagr-twrr",
    category: "investments",
    description: "Compute money-weighted XIRR, point-to-point CAGR, and time-weighted TWRR returns.",
    isPopular: true,
    searchAliases: ["xirr", "cagr", "twrr", "returns suite", "money weighted return", "portfolio return", "mutual fund return"],
    relatedIds: ["sip", "lumpsum", "portfolio-risk", "step-up-sip"],
  },

  // ─── 2. Loans & Refinancing (5) ───────────────────────────────────────────
  {
    id: "emi",
    name: "Loan EMI Calculator",
    shortName: "EMI",
    route: "/emi",
    category: "loans",
    description: "Calculate monthly reducing-balance EMI and view complete amortization schedules.",
    isPopular: true,
    searchAliases: ["emi", "home loan emi", "car loan", "personal loan", "loan calculator", "reducing balance", "amortization"],
    relatedIds: ["loan-prepayment", "balance-transfer", "car-loan-tco", "no-cost-emi"],
  },
  {
    id: "loan-prepayment",
    name: "Loan Prepayment vs. Invest Calculator",
    shortName: "Prepayment vs Invest",
    route: "/loan-prepayment",
    category: "loans",
    description: "Compare interest saved via prepayment against wealth generated through equity SIPs.",
    searchAliases: ["loan prepayment", "prepay home loan", "prepayment vs invest", "part payment", "foreclosure", "interest saved"],
    relatedIds: ["emi", "balance-transfer", "sip", "car-loan-tco"],
  },
  {
    id: "no-cost-emi",
    name: "No-Cost EMI Reality Checker",
    shortName: "No-Cost EMI",
    route: "/no-cost-emi",
    category: "loans",
    description: "Uncover hidden merchant discounts, processing fees, and 18% GST on zero-cost EMIs.",
    searchAliases: ["no cost emi", "zero cost emi", "amazon emi", "flipkart emi", "hidden interest", "processing fee", "18% gst"],
    relatedIds: ["emi", "loan-prepayment", "car-loan-tco"],
  },
  {
    id: "car-loan-tco",
    name: "Car Loan Total Cost of Ownership (TCO)",
    shortName: "Car TCO",
    route: "/car-loan-tco",
    category: "loans",
    description: "Calculate true vehicle costs including depreciation, fuel inflation, insurance, and maintenance.",
    searchAliases: ["car loan", "car tco", "vehicle cost", "depreciation", "running cost", "fuel inflation", "car emi"],
    relatedIds: ["emi", "loan-prepayment", "balance-transfer"],
  },
  {
    id: "balance-transfer",
    name: "Home Loan Balance Transfer & Refinance",
    shortName: "Balance Transfer",
    route: "/balance-transfer",
    category: "loans",
    description: "Evaluate switching fees, MODT stamp duty, and breakeven timeline against net interest savings.",
    searchAliases: ["balance transfer", "refinance home loan", "switch bank", "modt", "stamp duty", "interest reduction", "processing fee"],
    relatedIds: ["emi", "loan-prepayment", "car-loan-tco"],
  },

  // ─── 3. Taxation & Statutory Planning (9) ────────────────────────────────
  {
    id: "tax",
    name: "Income Tax Calculator (AY 2026-27)",
    shortName: "Income Tax",
    route: "/tax",
    category: "taxation",
    description: "Compare New vs Old Regime with Section 157 rebate (₹12L), ₹75k standard deduction & capital gains.",
    badge: "Finance Act 2026",
    isPopular: true,
    searchAliases: ["income tax", "tax calculator", "new regime", "old regime", "budget 2026", "section 157", "rebate 12l", "slab", "salary tax"],
    relatedIds: ["marginal-relief", "capital-gains-tax", "hra-exemption", "presumptive-tax"],
  },
  {
    id: "marginal-relief",
    name: "Marginal Relief & Surcharge Calculator",
    shortName: "Marginal Relief",
    route: "/marginal-relief",
    category: "taxation",
    description: "Calculate statutory marginal relief at ₹50L, ₹1Cr, ₹2Cr, and ₹5Cr surcharge boundaries.",
    searchAliases: ["marginal relief", "surcharge", "50 lakh", "1 crore", "high net worth", "hni tax", "section 89"],
    relatedIds: ["tax", "capital-gains-tax", "presumptive-tax"],
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
    searchAliases: ["capital gains", "ltcg", "stcg", "12.5%", "20%", "equity shares", "mutual funds", "real estate", "grandfathering", "july 2024"],
    relatedIds: ["section-54-exemption", "tax", "us-stock-tax", "marginal-relief"],
  },
  {
    id: "hra-exemption",
    name: "HRA Exemption Calculator (Section 10(13A))",
    shortName: "HRA Exemption",
    route: "/hra-exemption",
    category: "taxation",
    description: "Calculate statutory 3-condition HRA tax exemption for metro and non-metro cities.",
    searchAliases: ["hra", "house rent allowance", "section 10(13a)", "metro non metro", "rent receipt", "tax exemption", "salary slip"],
    relatedIds: ["tax", "section-54-exemption", "presumptive-tax"],
  },
  {
    id: "presumptive-tax",
    name: "Presumptive Taxation (Section 44AD / 44ADA)",
    shortName: "Presumptive Tax",
    route: "/presumptive-tax",
    category: "taxation",
    description: "Compute 6%/8% business profit or 50% professional profit with Section 44AB audit triggers.",
    searchAliases: ["presumptive tax", "44ad", "44ada", "freelancer tax", "consultant tax", "small business tax", "tax audit 44ab", "professional tax"],
    relatedIds: ["tax", "marginal-relief", "dupont-analysis"],
  },
  {
    id: "section-54-exemption",
    name: "Section 54 / 54EC / 54F Exemption Planner",
    shortName: "Section 54 / 54EC / 54F",
    route: "/section-54-exemption",
    category: "taxation",
    description: "Plan capital gains roll-over into residential property, 54EC bonds (₹50L cap), or 54F proportionate exemption.",
    searchAliases: ["section 54", "section 54ec", "section 54f", "capital gain exemption", "property sale tax", "54ec bonds", "residential house"],
    relatedIds: ["capital-gains-tax", "tax", "marginal-relief"],
  },
  {
    id: "lrs-tcs",
    name: "LRS TCS & Remittance (Section 394)",
    shortName: "LRS TCS",
    route: "/lrs-tcs",
    category: "taxation",
    description: "Calculate TCS on foreign remittances under Finance Act 2026 (flat 2% tour, 0% edu loan, 2%/20% >₹10L).",
    badge: "FA 2026",
    searchAliases: ["lrs", "tcs", "remittance", "foreign remittance", "section 394", "liberalised remittance scheme", "tour package", "overseas education"],
    relatedIds: ["us-stock-tax", "nre-nro-fcnr", "tax"],
  },
  {
    id: "us-stock-tax",
    name: "US Stock Tax & Net Return (DTAA FTC)",
    shortName: "US Stock Tax",
    route: "/us-stock-tax",
    category: "taxation",
    description: "Model Rule 115 INR conversion, 24m holding period, and Section 90 FTC on 25% US dividend withholding.",
    searchAliases: ["us stock tax", "vested", "indmoney", "dtaa", "foreign tax credit", "ftc", "rule 115", "esop", "rsu"],
    relatedIds: ["capital-gains-tax", "lrs-tcs", "nre-nro-fcnr", "tax"],
  },
  {
    id: "nre-nro-fcnr",
    name: "NRI Deposit Comparator (NRE / NRO / FCNR)",
    shortName: "NRI Deposits",
    route: "/nre-nro-fcnr",
    category: "taxation",
    description: "Compare tax-free NRE interest, 31.2% NRO TDS, and USD FCNR exchange rate yields.",
    searchAliases: ["nre", "nro", "fcnr", "nri deposits", "nri banking", "tds on nro", "repatriation", "tax free nre"],
    relatedIds: ["tax", "fd", "lrs-tcs", "us-stock-tax"],
  },

  // ─── 4. Trading, Derivatives & Quantitative Risk (6) ─────────────
  {
    id: "fno-brokerage",
    name: "F&O Brokerage & STT Calculator",
    shortName: "F&O Charges",
    route: "/fno-brokerage",
    category: "trading",
    description: "Calculate exchange charges, SEBI fees, GST, and updated STT with exact breakeven ticks.",
    isPopular: true,
    searchAliases: ["fno", "f&o brokerage", "futures and options", "zerodha brokerage", "groww charges", "stt", "sebi charges", "breakeven tick"],
    relatedIds: ["option-payoff", "black-scholes", "position-size", "margin-calculator"],
  },
  {
    id: "option-payoff",
    name: "Option Strategy Payoff Visualizer",
    shortName: "Option Payoffs",
    route: "/option-payoff",
    category: "trading",
    description: "Visualize multi-leg PnL curves and Greeks for Spreads, Straddles, Strangles, and Iron Condors.",
    searchAliases: ["option payoff", "strategy visualizer", "bull call spread", "iron condor", "straddle", "strangle", "pnl curve", "greeks"],
    relatedIds: ["black-scholes", "fno-brokerage", "margin-calculator", "position-size"],
  },
  {
    id: "black-scholes",
    name: "Black-Scholes Option Pricing & Greeks",
    shortName: "Black-Scholes",
    route: "/black-scholes",
    category: "trading",
    description: "Compute theoretical European option prices with Delta, Gamma, Theta, Vega, and Rho Greeks.",
    searchAliases: ["black scholes", "option pricing", "implied volatility", "iv", "delta", "gamma", "theta", "vega", "rho", "greeks"],
    relatedIds: ["option-payoff", "fno-brokerage", "margin-calculator"],
  },
  {
    id: "position-size",
    name: "Position Size & Risk Calculator",
    shortName: "Position Sizing",
    route: "/position-size",
    category: "trading",
    description: "Calculate optimal share quantity based on capital risk budget, stop loss distance, and R:R ratio.",
    searchAliases: ["position sizing", "risk per trade", "stop loss distance", "risk reward", "capital management", "lot size"],
    relatedIds: ["fno-brokerage", "portfolio-risk", "margin-calculator"],
  },
  {
    id: "margin-calculator",
    name: "F&O Margin Estimator",
    shortName: "Margin Estimator",
    route: "/margin-calculator",
    category: "trading",
    description: "Estimate initial SPAN and exposure margin requirements across Index and Stock derivatives with illustrative assumptions.",
    searchAliases: ["margin calculator", "span margin", "exposure margin", "fno margin", "derivative margin", "hedged margin"],
    relatedIds: ["fno-brokerage", "option-payoff", "position-size"],
  },
  {
    id: "portfolio-risk",
    name: "Portfolio Risk & Performance Ratios",
    shortName: "Portfolio Risk",
    route: "/portfolio-risk",
    category: "trading",
    description: "Compute Sharpe, Sortino (with zero-downside handling), Beta, Treynor, and Max Drawdown.",
    searchAliases: ["portfolio risk", "sharpe ratio", "sortino ratio", "beta", "treynor", "max drawdown", "volatility", "risk adjusted return"],
    relatedIds: ["xirr-cagr-twrr", "position-size", "sip"],
  },

  // ─── 5. Corporate Finance & Valuation (3) ─────────────────────────
  {
    id: "dcf-valuation",
    name: "DCF Valuation Calculator (Discounted Cash Flow)",
    shortName: "DCF Valuation",
    route: "/dcf-valuation",
    category: "corporate",
    description: "Multi-stage FCFF discounting, Gordon Growth terminal value, net debt bridge, and 2D WACC matrix.",
    searchAliases: ["dcf", "discounted cash flow", "intrinsic value", "valuation", "fcff", "terminal value", "equity value", "wacc"],
    relatedIds: ["wacc", "dupont-analysis", "xirr-cagr-twrr"],
  },
  {
    id: "wacc",
    name: "WACC Calculator (Cost of Capital)",
    shortName: "WACC",
    route: "/wacc",
    category: "corporate",
    description: "Compute Weighted Average Cost of Capital using CAPM Cost of Equity and post-tax debt shields.",
    searchAliases: ["wacc", "cost of capital", "capm", "cost of equity", "post tax debt", "beta", "hurdle rate"],
    relatedIds: ["dcf-valuation", "dupont-analysis", "portfolio-risk"],
  },
  {
    id: "dupont-analysis",
    name: "DuPont 5-Step ROE Decomposition",
    shortName: "DuPont ROE",
    route: "/dupont-analysis",
    category: "corporate",
    description: "Decompose ROE into Tax Burden, Interest Burden, Operating Margin, Asset Turnover, and Leverage.",
    searchAliases: ["dupont", "roe decomposition", "5 step dupont", "operating margin", "asset turnover", "financial leverage", "tax burden"],
    relatedIds: ["dcf-valuation", "wacc", "presumptive-tax"],
  },
];

export const ALL_CALCULATOR_ROUTES: string[] = CALCULATOR_REGISTRY.map((c) => c.route);

// ─── Query & Lookup Helpers ─────────────────────────────────────────────────

/**
 * Retrieve calculator metadata by ID or route pathname
 */
export function getCalculatorById(idOrRoute: string): CalculatorMeta | undefined {
  const normalized = idOrRoute.replace(/^\//, "").toLowerCase();
  return CALCULATOR_REGISTRY.find(
    (c) => c.id.toLowerCase() === normalized || c.route.toLowerCase() === `/${normalized}`
  );
}

/**
 * Retrieve all calculators belonging to a category
 */
export function getCalculatorsByCategory(category: CalculatorCategory): CalculatorMeta[] {
  return CALCULATOR_REGISTRY.filter((c) => c.category === category);
}

/**
 * Retrieve popular calculators up to a limit (default 8)
 */
export function getPopularCalculators(limit = 8): CalculatorMeta[] {
  return CALCULATOR_REGISTRY.filter((c) => c.isPopular).slice(0, limit);
}

/**
 * Retrieve curated related calculators for a given calculator.
 * Falls back to same-category calculators then popular ones.
 */
export function getRelatedCalculators(idOrRoute: string, limit = 3): CalculatorMeta[] {
  const current = getCalculatorById(idOrRoute);
  if (!current) return CALCULATOR_REGISTRY.slice(0, limit);

  const results: CalculatorMeta[] = [];

  // 1. Direct curated relations
  for (const relId of current.relatedIds) {
    const found = CALCULATOR_REGISTRY.find((c) => c.id === relId);
    if (found && !results.some((r) => r.id === found.id)) {
      results.push(found);
      if (results.length >= limit) return results;
    }
  }

  // 2. Same category fallback
  const sameCategory = CALCULATOR_REGISTRY.filter(
    (c) => c.category === current.category && c.id !== current.id && !results.some((r) => r.id === c.id)
  );
  for (const c of sameCategory) {
    results.push(c);
    if (results.length >= limit) return results;
  }

  // 3. Global popular fallback
  const popular = CALCULATOR_REGISTRY.filter(
    (c) => c.isPopular && c.id !== current.id && !results.some((r) => r.id === c.id)
  );
  for (const c of popular) {
    results.push(c);
    if (results.length >= limit) return results;
  }

  return results.slice(0, limit);
}

/**
 * Tokenized & alias-aware search engine for calculators
 */
export function searchCalculators(
  query: string,
  categoryFilter: CalculatorCategory | "all" = "all"
): CalculatorMeta[] {
  const trimmed = query.trim().toLowerCase();
  
  let candidates = CALCULATOR_REGISTRY;
  if (categoryFilter !== "all") {
    candidates = candidates.filter((c) => c.category === categoryFilter);
  }

  if (!trimmed) {
    return candidates;
  }

  const terms = trimmed.split(/\s+/).filter(Boolean);

  return candidates.filter((calc) => {
    const searchableCorpus = [
      calc.name.toLowerCase(),
      calc.shortName.toLowerCase(),
      calc.id.toLowerCase(),
      calc.description.toLowerCase(),
      CATEGORY_MAP[calc.category].label.toLowerCase(),
      ...calc.searchAliases.map((a) => a.toLowerCase()),
    ].join(" ");

    // Every term must match somewhere in the corpus
    return terms.every((term) => searchableCorpus.includes(term));
  });
}
