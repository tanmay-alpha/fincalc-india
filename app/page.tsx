import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import WorkspaceHome from "@/components/home/WorkspaceHome";

export const metadata: Metadata = {
  title: "Financial Workspace | FinCalc India",
  description:
    "Your private financial workspace with 31 verified calculators for Indian tax law, investments, loan amortization, trading derivatives, and corporate valuation.",
};

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main id="main-content" className="min-h-screen">
      <WorkspaceHome user={session.user} />
    </main>
  );
}
