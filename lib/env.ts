import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("Must be a valid database URL").min(1, "Database URL is strictly required"),
  NEXTAUTH_SECRET: z.string().min(1, "NextAuth Secret is required"),
  NEXTAUTH_URL: z.string().url("Must be a valid URL").min(1, "NextAuth URL is required"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

/**
 * Validate environment variables synchronously at startup.
 * Throws a detailed error if any critical variables are missing.
 */
export function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables. Terminating boot sequence.");
  }

  return parsed.data;
}

// Optionally invoke immediately to crash early if misused
// Uncomment to enforce hard-fail on import:
// validateEnv();
