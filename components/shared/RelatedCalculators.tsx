import Link from "next/link";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { CALCULATOR_REGISTRY, type CalculatorCategory } from "@/lib/calculators";
import { getCategoryIcon } from "@/components/ui/CategoryIcon";

interface Props {
  current: string;
}

const CATEGORY_NAMES: Record<CalculatorCategory, string> = {
  investments: "Investing & Wealth",
  loans: "Loans & Credit",
  taxation: "Tax & Compliance",
  trading: "Trading & Markets",
  corporate: "Corporate Finance",
};

export default function RelatedCalculators({ current }: Props) {
  const currentCalc = CALCULATOR_REGISTRY.find(
    (c) => c.id === current || c.route === `/${current}`
  );

  // Pick up to 3 smart related calculators:
  // 1. Same category first
  // 2. Or popular calculators
  const currentCategory = currentCalc?.category || "investments";
  
  const sameCategory = CALCULATOR_REGISTRY.filter(
    (c) => c.category === currentCategory && c.id !== current && c.route !== `/${current}`
  );

  const fallbackPopular = CALCULATOR_REGISTRY.filter(
    (c) => c.isPopular && c.id !== current && c.route !== `/${current}` && !sameCategory.includes(c)
  );

  const related = [...sameCategory, ...fallbackPopular].slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border/80 pt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Related Financial Calculators
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            More tools in {CATEGORY_NAMES[currentCategory] || "FinCalc India"}
          </p>
        </div>
        <Link
          href="/"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>All 31 Calculators</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {related.map((calc) => {
          const Icon = getCategoryIcon(calc.id);
          return (
            <Link
              key={calc.id}
              href={calc.route}
              className="group flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-border/50">
                    {calc.shortName}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {calc.name}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {calc.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs font-medium text-primary">
                <span>Calculate now</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
