/**
 * Security & URL Utilities for FinCalc India
 * Centralized open redirect defense and safe relative internal URL sanitization.
 */

export function getSafeCallbackUrl(
  pathname?: string | null,
  searchParams?: string | URLSearchParams | null,
  fallback = "/"
): string {
  if (typeof pathname !== "string" || !pathname.trim()) {
    return fallback;
  }

  const cleanPath = pathname.trim();

  // Reject protocol-relative URLs, backslash tricks, or explicit URI schemes
  if (
    !cleanPath.startsWith("/") ||
    cleanPath.startsWith("//") ||
    cleanPath.includes("\\") ||
    /^[a-z0-9+.-]+:/i.test(cleanPath)
  ) {
    return fallback;
  }

  let queryString = "";
  if (typeof searchParams === "string") {
    const trimmed = searchParams.trim().replace(/^\?/, "");
    if (trimmed) {
      if (
        trimmed.includes("\\") ||
        trimmed.includes("//") ||
        /^[a-z0-9+.-]+:/i.test(trimmed)
      ) {
        return fallback;
      }
      queryString = `?${trimmed}`;
    }
  } else if (searchParams && typeof searchParams.toString === "function") {
    const str = searchParams.toString();
    if (str) {
      if (
        str.includes("\\") ||
        str.includes("//") ||
        /^[a-z0-9+.-]+:/i.test(str)
      ) {
        return fallback;
      }
      queryString = `?${str}`;
    }
  }

  const combined = `${cleanPath}${queryString}`;
  if (
    !combined.startsWith("/") ||
    combined.startsWith("//") ||
    combined.includes("\\") ||
    /^[a-z0-9+.-]+:/i.test(combined)
  ) {
    return fallback;
  }

  return combined;
}
