
import SIPCalculator from "@/components/calculators/sip/SIPCalculator";
import SIPInfo from "@/components/seo/SIPInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";

export const metadata = {
  title: 'SIP Calculator',
  description: 'Calculate SIP returns with our free SIP calculator. See how ₹5,000/month grows to ₹11.6L in 10 years at 12% return. Year-by-year compound interest breakdown.',
  openGraph: {
    title: 'SIP Calculator — FinCalc India',
    description: 'Free SIP calculator for Indian mutual fund investors. Instant compound interest calculation.',
  }
}

export default function SIPPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "SIP Calculator" }
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">📈</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">SIP Calculator</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Calculate returns on your monthly Systematic Investment Plan. See year-by-year corpus growth with compound interest.
          </p>
        </div>
        <SIPCalculator />
        <SIPInfo />
        <RelatedCalculators current="sip" />
      </div>
    </main>
  );
}
