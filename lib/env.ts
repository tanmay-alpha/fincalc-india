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
const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url("Must be a valid database URL")
    .min(1, "Database URL is strictly required"),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters (64+ recommended in production)"),
  NEXTAUTH_URL: z
    .string()
    .url("Must be a valid URL")
    .min(1, "NextAuth URL is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
});

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
    if (parsed.data.NEXTAUTH_SECRET.length < 64) {
      console.warn(
        "[env] WARNING: NEXTAUTH_SECRET is shorter than 64 chars. " +
          "Generate a strong secret with: `openssl rand -base64 48`"
      );
    }
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
