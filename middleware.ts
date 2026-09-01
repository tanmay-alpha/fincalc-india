import { NextResponse } from "next/server";

/**
 * Middleware entrypoint.
 * Security headers are natively handled via async headers() in next.config.mjs.
 */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
