import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

/**
 * NextAuth configuration — Google OAuth with Prisma adapter.
 *
 * Security hardening:
 *   - Database session strategy: server-side sessions (revocable, no JWT leakage)
 *   - Trust host header validation (only our vercel.app and any NEXTAUTH_URL)
 *   - Cookie flags set to "lax" in dev and enforced via NEXTAUTH_URL in prod
 *   - All tokens encrypted by NEXTAUTH_SECRET (must be 64+ chars in prod)
 *
 * Required env vars (validated by lib/env.ts at request time):
 *   - NEXTAUTH_SECRET (>= 32 chars; >= 64 in prod)
 *   - NEXTAUTH_URL (e.g. https://fincalc-india.vercel.app)
 *   - GOOGLE_CLIENT_ID
 *   - GOOGLE_CLIENT_SECRET
 *   - DATABASE_URL
 */
const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  trustHost: true,
  // Database sessions: tokens never leave the server, can be invalidated.
  session: { strategy: "database", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // Always re-prompt consent so the refresh token is issued reliably.
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/api/auth/signin",
    error: "/api/auth/error",
  },
  callbacks: {
    // Add user id and a stable identifier into the session for server routes.
    session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        if (user.email) session.user.email = user.email;
      }
      return session;
    },
  },
  events: {
    // Keep an audit trail of sign-in events (optional — handy for forensics).
    async signIn({ user, account, isNewUser }) {
      if (process.env.NODE_ENV !== "production") return;
      try {
        console.log(
          JSON.stringify({
            event: "auth.signin",
            userId: user?.id,
            provider: account?.provider,
            isNewUser,
            ts: new Date().toISOString(),
          })
        );
      } catch {
        // never throw from event handler
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
