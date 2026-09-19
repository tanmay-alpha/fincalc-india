import { PrismaClient } from "@prisma/client";

export default async function globalSetup() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    "postgresql://postgres:tanmay@127.0.0.1:5432/fincalc_test";

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    const user = await prisma.user.upsert({
      where: { email: "test-user@fincalc-india.test" },
      update: { name: "Test User" },
      create: {
        id: "test-user-e2e-id",
        email: "test-user@fincalc-india.test",
        name: "Test User",
      },
    });

    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days valid
    await prisma.session.upsert({
      where: { sessionToken: "test-e2e-session-token" },
      update: {
        userId: user.id,
        expires,
      },
      create: {
        sessionToken: "test-e2e-session-token",
        userId: user.id,
        expires,
      },
    });
  } catch (error) {
    console.warn("Playwright globalSetup: could not seed test session in database:", error);
  } finally {
    await prisma.$disconnect();
  }
}
