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
 * Load restored inputs for a calculator on mount.
 * Checks sessionStorage first, then validated query parameters.
 */
export function getRestoredInputs<T extends object>(
  calcType: string,
  defaults: T
): T {
  if (typeof window === "undefined") return defaults;

  const normType = calcType.toLowerCase();
  const def = defaults as Record<string, unknown>;
  const candidate: Record<string, unknown> = {};

  // 1. Check sessionStorage
  try {
    const raw = sessionStorage.getItem(RESTORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.type?.toLowerCase() === normType && parsed.inputs) {
        Object.assign(candidate, parsed.inputs);
        sessionStorage.removeItem(RESTORE_KEY);
      }
    }
  } catch {
    // Fallthrough to query params
  }

  // 2. Check query params if any key matches defaults
  try {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((val, key) => {
      if (key in def) {
        const defVal = def[key];
        if (typeof defVal === "number") {
          const n = Number(val);
          if (!Number.isNaN(n)) candidate[key] = n;
        } else if (typeof defVal === "boolean") {
          candidate[key] = val === "true" || val === "1";
        } else if (typeof defVal === "string") {
          candidate[key] = val;
        }
      }
    });
  } catch {
    // Ignore URL parsing errors
  }

  return Object.keys(candidate).length > 0 ? ({ ...defaults, ...candidate } as T) : defaults;
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
