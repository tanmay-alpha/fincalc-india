const CODEC_VERSION = "1";

export interface ScenarioSnapshot<T> {
  id: string;
  name: string;
  inputs: T;
}

function encodeBase64(value: string): string {
  if (typeof window !== "undefined") {
    return window.btoa(encodeURIComponent(value));
  }
  return Buffer.from(value, "utf8").toString("base64");
}

function decodeBase64(value: string): string | null {
  try {
    if (typeof window !== "undefined") {
      return decodeURIComponent(window.atob(value));
    }
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return null;
  }
}

function hasOnlyFiniteNumbers(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(hasOnlyFiniteNumbers);
  if (value && typeof value === "object") return Object.values(value).every(hasOnlyFiniteNumbers);
  return typeof value === "string" || typeof value === "boolean" || value === null;
}

export function encodeCalculationInputs<T extends Record<string, unknown>>(inputs: T): string {
  return `?v=${CODEC_VERSION}&i=${encodeURIComponent(encodeBase64(JSON.stringify(inputs)))}`;
}

export function decodeCalculationInputs<T>(
  search: string,
  isValid: (value: unknown) => value is T,
): T | null {
  const params = new URLSearchParams(search);
  if (params.get("v") !== CODEC_VERSION || !params.get("i") || [...params.keys()].some((key) => key !== "v" && key !== "i")) {
    return null;
  }

  const decoded = decodeBase64(params.get("i")!);
  if (!decoded) return null;

  try {
    const value: unknown = JSON.parse(decoded);
    return hasOnlyFiniteNumbers(value) && isValid(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveScenario<T>(
  items: ScenarioSnapshot<T>[],
  next: ScenarioSnapshot<T>,
): ScenarioSnapshot<T>[] {
  return [...items.filter((item) => item.id !== next.id), next].slice(-3);
}
