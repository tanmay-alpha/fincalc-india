import type { Metadata } from "next";
import StepUpSIPCalculator from "@/components/calculators/step-up-sip/StepUpSIPCalculator";
import StepUpSIPInfo from "@/components/seo/StepUpSIPInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";

export const metadata: Metadata = {
  title: "Step-Up SIP & Goal SIP Calculator",
  description:
    "Calculate mutual fund returns with annual step-up / top-up SIP increments. Reverse-calculate required starting SIP for target financial goals.",
  openGraph: {
    title: "Step-Up SIP & Goal SIP Calculator — FinCalc India",
    description:
      "Free Step-Up & Target Goal SIP calculator for Indian mutual fund investors.",
  },
};

export default function StepUpSIPPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Step-Up SIP Calculator" },
            ]}
          />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl" aria-hidden="true">📈</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Step-Up SIP & Goal Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Model annual increments in your monthly SIP or reverse-solve the required starting SIP to reach your target wealth goal.
          </p>
        </div>

        <StepUpSIPCalculator />
        <StepUpSIPInfo />
        <RelatedCalculators current="step-up-sip" />
      </div>
    </main>
  );
}
