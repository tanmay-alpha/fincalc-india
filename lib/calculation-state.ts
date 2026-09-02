/**
 * Calculation State Serialization & Sharing Utility
 *
 * Provides safe, versioned URL-friendly encoding and decoding of calculation parameters
 * with validation, Unicode preservation (including ₹ symbol), and protection against malformed payloads.
 */

export interface SerializedCalculationState<T = Record<string, unknown>> {
  v: number; // Schema version
  id: string; // Calculator route / identifier e.g. "sip", "tax"
  ts: number; // Generation timestamp
  data: T; // Input parameters
}

const CURRENT_SCHEMA_VERSION = 1;
const MAX_DECODED_BYTES = 64 * 1024; // 64 KB safety ceiling

/**
 * Safely encodes calculation state to URL-safe Base64
 */
export function encodeCalculationState<T = Record<string, unknown>>(
  calculatorId: string,
  data: T,
  version = CURRENT_SCHEMA_VERSION
): string {
  if (!calculatorId || typeof calculatorId !== "string") {
    throw new Error("Invalid calculatorId: must be a non-empty string");
  }

  const payload: SerializedCalculationState<T> = {
    v: version,
    id: calculatorId.trim().toLowerCase(),
    ts: Date.now(),
    data,
  };

  const jsonString = JSON.stringify(payload);
  // Robust UTF-8 to Base64 encoding supporting full Unicode spectrum
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    const bytes = new TextEncoder().encode(jsonString);
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = window.btoa(binary);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } else {
    // Node.js fallback
    return Buffer.from(jsonString, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
}

/**
 * Safely decodes a URL-safe Base64 calculation state with integrity checks
 */
export function decodeCalculationState<T = Record<string, unknown>>(
  encoded: string
): SerializedCalculationState<T> | null {
  if (!encoded || typeof encoded !== "string") {
    return null;
  }

  // Guard against massive payloads
  if (encoded.length > MAX_DECODED_BYTES) {
    return null;
  }

  try {
    // Convert URL-safe base64 back to standard base64 with padding
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    let jsonString = "";
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      const binary = window.atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      jsonString = new TextDecoder().decode(bytes);
    } else {
      jsonString = Buffer.from(base64, "base64").toString("utf-8");
    }

    if (!jsonString || jsonString.length > MAX_DECODED_BYTES) {
      return null;
    }

    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    if (typeof parsed.v !== "number" || typeof parsed.id !== "string" || !parsed.data) {
      return null;
    }

    return parsed as SerializedCalculationState<T>;
  } catch {
    return null;
  }
}

/**
 * Builds a complete shareable URL with embedded state
 */
export function buildShareableUrl<T = Record<string, unknown>>(
  baseUrl: string,
  route: string,
  data: T
): string {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedRoute = route.replace(/^\/+/, "");
  const encoded = encodeCalculationState(normalizedRoute, data);
  return `${normalizedBase}/${normalizedRoute}?state=${encodeURIComponent(encoded)}`;
}
