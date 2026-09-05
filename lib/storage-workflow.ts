import { z } from "zod";
import { getCalculatorContract } from "@/lib/calculator-contracts";

/**
 * FINCALC INDIA — Client-Side Workflow & Local-First State Persistence
 * 
 * 1. "Open Again" workflow: Restores saved inputs directly into the calculator
 *    via sessionStorage and validated query parameters.
 * 2. Local-first recents: Tracks recent tools locally in localStorage with
 *    zero server telemetry, adhering to privacy-first architecture.
 */

export interface RecentCalculation {
  id: string;
  name: string;
  route: string;
  category: string;
  timestamp: number;
  summary?: string;
}

const RESTORE_KEY = "fincalc_restore_inputs";
const RECENTS_KEY = "fincalc_recent_calculations";
const MAX_RECENTS = 4;

/**
 * Save calculator inputs to sessionStorage and generate query string
 * for restoring parameters when clicking "Open Again".
 */
export function prepareOpenAgain(type: string, inputs: Record<string, unknown>): string {
  const normType = type.toLowerCase();
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(RESTORE_KEY, JSON.stringify({ type: normType, inputs }));
    } catch {
      // Ignored if storage quota exceeded or disabled
    }
  }

  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(inputs)) {
    if (v !== undefined && v !== null && typeof v !== "object") {
      params.set(k, String(v));
    }
  }
  return params.toString();
}

/**
 * Validate and restore calculator inputs against canonical CalculatorContract schemas.
 * 
 * Secure architecture:
 * saved/session/url data
 * ↓
 * resolve calculator contract
 * ↓
 * canonical input schema
 * ↓
 * safeParse
 * ↓
 * validated calculator inputs
 * ↓
 * restore
 */
export function validateAndRestoreInputs<T extends object>(
  calcType: string,
  rawCandidate: unknown,
  defaults: T
): T {
  // 1. Must be a non-null plain object (reject null, primitives, arrays)
  if (
    !rawCandidate ||
    typeof rawCandidate !== "object" ||
    Array.isArray(rawCandidate)
  ) {
    return defaults;
  }

  const normType = calcType.toLowerCase();
  const contract = getCalculatorContract(normType);
  const candidateObj = rawCandidate as Record<string, unknown>;
  const defObj = defaults as Record<string, unknown>;

  // 2. If canonical contract has an inputSchema (Zod schema)
  if (contract?.inputSchema) {
    if (contract.inputSchema instanceof z.ZodObject) {
      const shape = contract.inputSchema.shape as Record<string, z.ZodTypeAny>;

      // Whitelist check: reject unknown properties
      for (const key of Object.keys(candidateObj)) {
        if (!(key in shape)) {
          return defaults;
        }
      }

      // Type coercion for string inputs (e.g. from URL query params)
      const coerced: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(candidateObj)) {
        const defaultVal = defObj[key];
        if (typeof val === "string" && typeof defaultVal === "number") {
          const n = Number(val);
          if (!Number.isFinite(n) || Number.isNaN(n)) return defaults;
          coerced[key] = n;
        } else if (typeof val === "string" && typeof defaultVal === "boolean") {
          if (val === "true" || val === "1") coerced[key] = true;
          else if (val === "false" || val === "0") coerced[key] = false;
          else return defaults;
        } else {
          coerced[key] = val;
        }
      }

      // safeParse against strict schema (rejects out-of-range, NaN, Infinity, bad enums)
      const parsed = contract.inputSchema.strict().safeParse(coerced);
      if (!parsed.success) {
        return defaults;
      }
      return parsed.data as T;
    }

    const parsed = contract.inputSchema.safeParse(candidateObj);
    if (!parsed.success) {
      return defaults;
    }
    return parsed.data as T;
  }

  // 3. Fallback for calculators without a Zod contract schema:
  // Whitelist check against defaults
  for (const key of Object.keys(candidateObj)) {
    if (!(key in defObj)) {
      return defaults;
    }
  }

  const validated: Record<string, unknown> = {};
  for (const [key, defVal] of Object.entries(defObj)) {
    const val = candidateObj[key];
    if (val === undefined) {
      validated[key] = defVal;
      continue;
    }
    if (typeof defVal === "number") {
      const n = typeof val === "number" ? val : Number(val);
      if (!Number.isFinite(n) || Number.isNaN(n)) return defaults;
      validated[key] = n;
    } else if (typeof defVal === "boolean") {
      if (typeof val === "boolean") validated[key] = val;
      else if (val === "true" || val === "1") validated[key] = true;
      else if (val === "false" || val === "0") validated[key] = false;
      else return defaults;
    } else if (typeof defVal === "string") {
      if (typeof val !== "string") return defaults;
      validated[key] = val;
    } else {
      validated[key] = val;
    }
  }

  return validated as T;
}

/**
 * Load restored inputs for a calculator on mount.
 * Checks sessionStorage first, then validated query parameters.
 * Untrusted data is validated against canonical calculator schemas before merging.
 */
export function getRestoredInputs<T extends object>(
  calcType: string,
  defaults: T
): T {
  if (typeof window === "undefined") return defaults;

  const normType = calcType.toLowerCase();

  // 1. Check sessionStorage
  try {
    const raw = sessionStorage.getItem(RESTORE_KEY);
    if (raw) {
      sessionStorage.removeItem(RESTORE_KEY);
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        parsed.type?.toLowerCase() === normType &&
        parsed.inputs
      ) {
        return validateAndRestoreInputs(calcType, parsed.inputs, defaults);
      }
      // If type mismatched or malformed structure, reject and fall back to defaults
      return defaults;
    }
  } catch {
    // Malformed JSON in sessionStorage -> safely return defaults
    try {
      sessionStorage.removeItem(RESTORE_KEY);
    } catch {
      // Ignored
    }
    return defaults;
  }

  // 2. Check query params if available
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const candidate: Record<string, unknown> = {};
    searchParams.forEach((val, key) => {
      candidate[key] = val;
    });

    if (Object.keys(candidate).length > 0) {
      return validateAndRestoreInputs(calcType, candidate, defaults);
    }
  } catch {
    // Ignore URL parsing errors
  }

  return defaults;
}

/**
 * Record a calculation to local recents (privacy-first, zero telemetry)
 */
export function recordRecentCalculation(entry: {
  id: string;
  name: string;
  route: string;
  category: string;
  summary?: string;
}): void {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    let list: RecentCalculation[] = raw ? JSON.parse(raw) : [];

    // Filter out previous entry for same tool
    list = list.filter((item) => item.id !== entry.id);

    // Prepend new entry
    list.unshift({
      ...entry,
      timestamp: Date.now(),
    });

    // Cap list size
    if (list.length > MAX_RECENTS) {
      list = list.slice(0, MAX_RECENTS);
    }

    localStorage.setItem(RECENTS_KEY, JSON.stringify(list));
  } catch {
    // Ignored in private browsing or quota limits
  }
}

/**
 * Retrieve list of local recent calculations
 */
export function getRecentCalculations(): RecentCalculation[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const list: RecentCalculation[] = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/**
 * Clear local recent calculations
 */
export function clearRecentCalculations(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENTS_KEY);
  } catch {
    // Ignored
  }
}
