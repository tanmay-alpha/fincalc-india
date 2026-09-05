import type { Metadata } from "next";
import StepUpSIPCalculator from "@/components/calculators/step-up-sip/StepUpSIPCalculator";
import StepUpSIPInfo from "@/components/seo/StepUpSIPInfo";
import CalculatorPageShell from "@/components/layout/CalculatorPageShell";

export const metadata: Metadata = {
  title: "Step-Up SIP & Goal SIP Calculator — Annual Increment Compounding",
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
    <CalculatorPageShell
      id="step-up-sip"
      badge="Annual Top-Up"
      assumptions={[
        "Monthly SIP amount increases once every 12 months by the specified percentage or fixed rupee amount.",
        "Compounding is calculated at monthly compounding intervals.",
        "Goal planner mode solves for the initial starting monthly installment required to achieve the future target corpus.",
      ]}
      sources={[
        { label: "AMFI India — Mutual Fund SIP Compounding", url: "https://www.amfiindia.com/" },
      ]}
      educationalContent={<StepUpSIPInfo />}
    >
      <StepUpSIPCalculator />
    </CalculatorPageShell>
  );
}
