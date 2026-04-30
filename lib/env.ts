import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url("Must be a valid database URL")
    .min(1, "Database URL is strictly required"),
  NEXTAUTH_SECRET: z.string().min(1, "NextAuth Secret is required"),
  NEXTAUTH_URL: z
    .string()
    .url("Must be a valid URL")
    .min(1, "NextAuth URL is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
});

export function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables.");
  }

  return parsed.data;
}
