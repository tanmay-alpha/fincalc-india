
import FDCalculator from "@/components/calculators/fd/FDCalculator";
import FDInfo from "@/components/seo/FDInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";

export const metadata = {
  title: 'FD Calculator',
  description: 'Calculate Fixed Deposit maturity amount with monthly, quarterly, and annual compounding. See how ₹1 lakh grows in any FD.',
  openGraph: {
    title: 'FD Calculator — FinCalc India',
    description: 'Free FD maturity calculator with compounding frequency options.',
  }
}

export default function FDPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "FD Calculator" }
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">🔒</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">FD Calculator</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Project fixed deposit maturity with different compounding frequencies. See effective yield and interest breakdown.
          </p>
        </div>
        <FDCalculator />
        <FDInfo />
        <RelatedCalculators current="fd" />
      </div>
    </main>
  );
}
