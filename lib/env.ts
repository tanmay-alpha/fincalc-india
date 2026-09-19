import { z } from "zod";

/**
 * Centralized environment validation.
 *
 * Called from API routes that need DB access or auth (not from pure-static
 * pages, so we don't penalize static render time). Throws on invalid env.
 *
 * In production, the build will also fail early if these are missing,
 * because `npm run build` runs `prisma generate` which loads DATABASE_URL.
 */
const envSchema = z
  .object({
    DATABASE_URL: z
      .string()
      .url("Must be a valid database URL")
      .min(1, "Database URL is strictly required"),
    NEXTAUTH_SECRET: z
      .string()
      .min(32, "NEXTAUTH_SECRET must be at least 32 characters (64+ recommended in production)")
      .optional(),
    AUTH_SECRET: z
      .string()
      .min(32, "AUTH_SECRET must be at least 32 characters (64+ recommended in production)")
      .optional(),
    NEXTAUTH_URL: z
      .string()
      .url("Must be a valid URL")
      .min(1, "NextAuth URL is required"),
    GOOGLE_CLIENT_ID: z
      .string()
      .default(process.env.NODE_ENV === "production" ? "" : "test-google-client-id"),
    GOOGLE_CLIENT_SECRET: z
      .string()
      .default(process.env.NODE_ENV === "production" ? "" : "test-google-client-secret"),
  })
  .refine(
    (data) => Boolean(data.NEXTAUTH_SECRET || data.AUTH_SECRET),
    {
      message: "Either NEXTAUTH_SECRET or AUTH_SECRET must be provided with at least 32 characters",
      path: ["NEXTAUTH_SECRET"],
    }
  )
  .refine(
    (data) => {
      if (process.env.NODE_ENV === "production") {
        return Boolean(data.GOOGLE_CLIENT_ID && data.GOOGLE_CLIENT_SECRET);
      }
      return true;
    },
    {
      message: "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required in production",
      path: ["GOOGLE_CLIENT_ID"],
    }
  );

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function validateEnv() {
  if (cachedEnv) return cachedEnv;

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // Surface only the safe, redacted shape of errors in production logs.
    const fields = parsed.error.flatten().fieldErrors;
    console.error("Invalid environment variables:", JSON.stringify(fields));
    throw new Error("Invalid environment variables — see server logs.");
  }

  // Additional production-only hardening: enforce strong secret.
  if (process.env.NODE_ENV === "production") {
    const secret = parsed.data.NEXTAUTH_SECRET ?? parsed.data.AUTH_SECRET ?? "";
    if (secret.length < 64) {
      console.warn(
        "[env] WARNING: NEXTAUTH_SECRET / AUTH_SECRET is shorter than 64 chars. " +
          "Generate a strong secret with: `openssl rand -base64 48`"
      );
    }
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  }
  return "https://fincalc-india.vercel.app";
}
