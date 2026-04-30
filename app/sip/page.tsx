import { Metadata } from "next";
import SIPCalculator from "@/components/calculators/sip/SIPCalculator";

export const metadata: Metadata = {
  title: 'SIP Calculator',
  description: 'Free SIP calculator for Indian investors. Calculate returns on monthly Systematic Investment Plan with compound interest and year-by-year breakdown.',
};

export default function Page() {
  return <SIPCalculator />;
}
