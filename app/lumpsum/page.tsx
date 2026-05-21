import LumpsumCalculator from "@/components/calculators/lumpsum/LumpsumCalculator";
import LumpsumInfo from "@/components/seo/LumpsumInfo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedCalculators from "@/components/shared/RelatedCalculators";

export const metadata = {
  title: 'Lumpsum Calculator',
  description: 'Calculate returns on one-time lumpsum investment. Compare lumpsum vs SIP returns and see CAGR on your investment.',
  openGraph: {
    title: 'Lumpsum Calculator — FinCalc India',
    description: 'Free lumpsum investment calculator with CAGR and SIP comparison.',
  }
}

export default function LumpsumPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Lumpsum Calculator" }
          ]} />
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">💰</span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Lumpsum Calculator</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            See how a one-time investment grows with CAGR, wealth multiplier, and year-by-year projections.
          </p>
        </div>
        <LumpsumCalculator />
        <LumpsumInfo />
        <RelatedCalculators current="lumpsum" />
      </div>
    </main>
  );
}
