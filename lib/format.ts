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
    formatted = `${groups.join(",")},${last3}`;
  }

  return `${isNeg ? "-₹" : "₹"}${formatted}`;
}

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

export function formatPercent(value: number, decimals: number = 1): string {
  if (value == null || !isFinite(value) || isNaN(value)) return "0%";
  return `${value.toFixed(decimals)}%`;
}

export function parseINRInput(value: string): number {
  if (!value || typeof value !== "string") return 0;

  const cleaned = value.replace(/[₹,\s]/g, "").trim();
  if (!cleaned) return 0;

  const crMatch = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*(?:cr)$/i);
  if (crMatch) return parseFloat(crMatch[1]) * 1_00_00_000;

  const lMatch = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*(?:l)$/i);
  if (lMatch) return parseFloat(lMatch[1]) * 1_00_000;

  const kMatch = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*(?:k)$/i);
  if (kMatch) return parseFloat(kMatch[1]) * 1_000;

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function clampSafe(value: number, min: number, max: number): number {
  if (isNaN(value) || !isFinite(value)) return min;

  const SAFE_MAX = 9_000_000_00_00_000;
  const targetMax = Math.min(max, SAFE_MAX);

  return Math.min(Math.max(value, min), targetMax);
}
