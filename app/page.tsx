import type { Metadata } from "next";
import { auth } from "@/auth";
import GuestLanding from "@/components/home/GuestLanding";
import WorkspaceHome from "@/components/home/WorkspaceHome";

export const metadata: Metadata = {
  title: "FinCalc India — Financial Calculation & Modeling Suite",
  description:
    "31 verified financial calculators for Indian tax law, investments, loan amortization, trading derivatives, and corporate valuation.",
};

export default async function HomePage() {
  const session = await auth();

  return (
    <main id="main-content" className="min-h-screen">
      {session?.user ? (
        <WorkspaceHome user={session.user} />
      ) : (
        <GuestLanding />
      )}
    </main>
  );
}
