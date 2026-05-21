
import PPFCalculator from "@/components/calculators/ppf/PPFCalculator";
import PPFInfo from "@/components/seo/PPFInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";

export const metadata = {
  title: 'PPF Calculator',
  description: 'Calculate PPF (Public Provident Fund) corpus over 15 to 50 years. See year-by-year tax-free growth at 7.1% interest rate.',
  openGraph: {
    title: 'PPF Calculator — FinCalc India',
    description: 'Free PPF calculator with withdrawal eligibility and tax-free corpus projection.',
  }
}

export default function PPFPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "PPF Calculator" }
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">🏛️</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">PPF Calculator</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Plan tax-free PPF maturity across the lock-in period and optional extensions. See yearly breakdown of contributions and interest.
          </p>
        </div>
        <PPFCalculator />
        <PPFInfo />
        <RelatedCalculators current="ppf" />
      </div>
    </main>
  );
}
