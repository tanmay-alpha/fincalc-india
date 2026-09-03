import SIPCalculator from "@/components/calculators/sip/SIPCalculator";
import SIPInfo from "@/components/seo/SIPInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import CalculatorDisclaimer from "@/components/ui/CalculatorDisclaimer";
import AssumptionsDrawer from "@/components/ui/AssumptionsDrawer";
import { TrendingUp } from "lucide-react";

export const metadata = {
  title: "SIP Calculator",
  description:
    "Calculate SIP returns with our free SIP calculator. See how ₹5,000/month grows to ₹11.6L in 10 years at 12% return. Year-by-year compound interest breakdown.",
  openGraph: {
    title: "SIP Calculator — FinCalc India",
    description:
      "Free SIP calculator for Indian mutual fund investors. Instant compound interest calculation.",
  },
};

export default function SIPPage() {
  return (
    <main id="main-content" className="min-h-screen pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Investments", href: "/#calculators" },
            { label: "SIP Calculator" },
          ]}
        />

        {/* Header Area */}
        <div className="mt-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  SIP Calculator
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Compounding Growth
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Calculate compounding returns on your monthly Systematic Investment Plan (SIP) in mutual funds.
              </p>
            </div>

            {/* Assumptions Drawer */}
            <AssumptionsDrawer
              calcName="SIP Calculator"
              assumptions={[
                "Monthly investments occur at the beginning of each calendar month.",
                "Compounding is calculated on a monthly compounding frequency.",
                "Returns are projected at a constant annualized rate; actual equity market returns will experience volatility.",
                "Taxation (e.g. 12.5% LTCG above ₹1.25 Lakh) and exit loads are not deducted from gross corpus projection.",
              ]}
              sources={[
                { label: "AMFI India — Understanding SIPs", url: "https://www.amfiindia.com/" },
                { label: "SEBI Investor Education", url: "https://investor.sebi.gov.in/" },
              ]}
            />
          </div>
        </div>

        {/* Interactive Workspace */}
        <SIPCalculator />

        {/* Separated SEO & Educational Content */}
        <section className="mt-16 pt-12 border-t border-border/80 max-w-4xl mx-auto">
          <SIPInfo />
        </section>

        <CalculatorDisclaimer />
        <RelatedCalculators current="sip" />
      </div>
    </main>
  );
}
