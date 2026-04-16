/**
 * FinCalc India — Formatting Utilities
 *
 * All monetary formatting uses Indian numbering (lakhs / crores).
 * This module is the canonical source; existing formatters.ts is
 * kept for backward-compat but new code should import from here.
 */

// ─── Indian Rupee (full precision) ──────────────────────────────
/**
 * Format a number as ₹X,XX,XXX using Indian grouping.
 * Returns "₹0" for NaN / Infinity / null.
 */
export function formatINR(value: number): string {
  if (value == null || !isFinite(value) || isNaN(value)) return "₹0";

  const rounded = Math.round(value);
  const isNeg = rounded < 0;
  const abs = Math.abs(rounded).toString();

  let formatted: string;
  if (abs.length <= 3) {
    formatted = abs;
  } else {
    const last3 = abs.slice(-3);
    const rest = abs.slice(0, -3);
    const groups: string[] = [];
    let i = rest.length;
    while (i > 0) {
      groups.unshift(rest.slice(Math.max(0, i - 2), i));
      i -= 2;
    }
    formatted = groups.join(",") + "," + last3;
  }

  return (isNeg ? "-₹" : "₹") + formatted;
}

// ─── Compact Indian (₹1.25L / ₹2.50Cr) ────────────────────────
/**
 * Compact format for display:
 *   < 1 Lakh  → full formatINR
 *   ≥ 1 Lakh  → "₹X.XXL"
 *   ≥ 1 Crore → "₹X.XXCr"
 */
export function formatCompact(value: number): string {
  if (value == null || !isFinite(value) || isNaN(value)) return "₹0";

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1_00_00_000) {
    return `${sign}₹${(abs / 1_00_00_000).toFixed(2)}Cr`;
  }
  if (abs >= 1_00_000) {
    return `${sign}₹${(abs / 1_00_000).toFixed(2)}L`;
  }
  return formatINR(value);
}

// ─── Percentage ─────────────────────────────────────────────────
/**
 * Format a number as "12.5%".
 * Handles NaN / Infinity safely.
 */
export function formatPercent(value: number, decimals: number = 1): string {
  if (value == null || !isFinite(value) || isNaN(value)) return "0%";
  return `${value.toFixed(decimals)}%`;
}

// ─── Parse INR Input ────────────────────────────────────────────
/**
 * Parse user-typed INR strings back to a number.
 *
 * Handles:
 *   "₹1,00,000"   → 100000
 *   "5L"  / "5l"   → 500000
 *   "2Cr" / "2cr"  → 20000000
 *   "50K" / "50k"  → 50000
 *   "1.5L"         → 150000
 *   plain "25000"  → 25000
 *
 * Returns 0 for unparseable input.
 */
export function parseINRInput(value: string): number {
  if (!value || typeof value !== "string") return 0;

  // Strip ₹, commas, spaces
  let cleaned = value.replace(/[₹,\s]/g, "").trim();
  if (cleaned === "") return 0;

  // Check for suffix multipliers (case-insensitive)
  const crMatch = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*(?:cr|Cr|CR)$/i);
  if (crMatch) {
    return parseFloat(crMatch[1]) * 1_00_00_000;
  }

  const lMatch = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*(?:l|L)$/i);
  if (lMatch) {
    return parseFloat(lMatch[1]) * 1_00_000;
  }

  const kMatch = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*(?:k|K)$/i);
  if (kMatch) {
    return parseFloat(kMatch[1]) * 1_000;
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// ─── Clamp ──────────────────────────────────────────────────────
/**
 * Clamp a number to [min, max].
 * Returns min if value is NaN.
 */
export function clampSafe(value: number, min: number, max: number): number {
  if (isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}
