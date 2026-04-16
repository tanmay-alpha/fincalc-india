import { Metadata } from "next";
import SIPCalculator from "@/components/calculators/sip/SIPCalculator";

export const metadata: Metadata = {
  title: "SIP Calculator | FinCalc India",
  description: "Calculate returns on your monthly Systematic Investment Plan (SIP). Project your mutual fund growth and wealth accumulation.",
  openGraph: {
    title: "SIP Calculator | FinCalc India",
    description: "Calculate returns on your monthly Systematic Investment Plan (SIP).",
    type: "website",
  }
};

export default function Page() {
  return <SIPCalculator />;
}
