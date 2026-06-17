/**
 * Indian-locale number formatters.
 * All helpers are null/NaN/Infinity safe — they return a safe fallback
 * instead of throwing or showing "NaN" / "₹Infinity" to the user.
 */

const SAFE_FALLBACK_INR = "₹0";
const SAFE_FALLBACK_PCT = "0%";

function isSafeNumber(value: number): boolean {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    !Number.isNaN(value)
  );
}

export function formatINR(value: number): string {
  if (!isSafeNumber(value)) return SAFE_FALLBACK_INR;

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
    formatted = `${groups.join(",")},${last3}`;
  }

  return `${isNeg ? "-₹" : "₹"}${formatted}`;
}

export function formatCompact(value: number): string {
  if (!isSafeNumber(value)) return SAFE_FALLBACK_INR;

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

export function formatPercent(value: number, decimals: number = 1): string {
  if (!isSafeNumber(value)) return SAFE_FALLBACK_PCT;
  return `${value.toFixed(decimals)}%`;
}

/**
 * Parse a free-form Indian-currency string into a number.
 * Accepts suffixes: k, L, Cr (case-insensitive). Also strips ₹, commas, spaces.
 * Returns 0 for unparseable input — never NaN.
 */
export function parseINRInput(value: string): number {
  if (!value || typeof value !== "string") return 0;

  const cleaned = value.replace(/[₹,\s]/g, "").trim();
  if (!cleaned) return 0;

  const crMatch = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*(?:cr|crore)$/i);
  if (crMatch) {
    const n = parseFloat(crMatch[1]);
    return Number.isFinite(n) ? n * 1_00_00_000 : 0;
  }

  const lMatch = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*(?:l|lac|lakh)$/i);
  if (lMatch) {
    const n = parseFloat(lMatch[1]);
    return Number.isFinite(n) ? n * 1_00_000 : 0;
  }

  const kMatch = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*k$/i);
  if (kMatch) {
    const n = parseFloat(kMatch[1]);
    return Number.isFinite(n) ? n * 1_000 : 0;
  }

  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

/**
 * Clamp a number to a safe range while defending against pathological inputs.
 * - Replaces NaN / Infinity with `min`.
 * - Caps at an absolute SAFE_MAX to prevent overflow downstream.
 */
export function clampSafe(value: number, min: number, max: number): number {
  if (!isSafeNumber(value)) return min;

  const SAFE_MAX = 9_000_000_00_00_000; // 9e13 — well within Number.MAX_SAFE_INTEGER
  const targetMax = Math.min(max, SAFE_MAX);
  const targetMin = Math.max(min, 0); // we don't allow negative financial values

  if (targetMin > targetMax) return targetMin;
  return Math.min(Math.max(value, targetMin), targetMax);
}
