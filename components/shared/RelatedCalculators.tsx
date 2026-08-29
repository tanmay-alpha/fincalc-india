import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  current:
    | "sip"
    | "emi"
    | "fd"
    | "ppf"
    | "lumpsum"
    | "tax"
    | "step-up-sip"
    | "loan-prepayment"
    | "no-cost-emi"
    | "fire"
    | string;
}

const all = [
  {
    id: "capital-gains-tax",
    label: "Capital Gains Tax",
    icon: "🏛️",
    desc: "Post-Budget 2024 STCG & LTCG",
    href: "/capital-gains-tax",
  },
  {
    id: "fno-brokerage",
    label: "F&O Brokerage & STT",
    icon: "⚡",
    desc: "Turnover, taxes & break-even",
    href: "/fno-brokerage",
  },
  {
    id: "option-payoff",
    label: "Option Strategy Payoff",
    icon: "📈",
    desc: "Multi-leg expiry payoff chart",
    href: "/option-payoff",
  },
  {
    id: "step-up-sip",
    label: "Step-Up SIP",
    icon: "📈",
    desc: "Annual increment & goal planning",
    href: "/step-up-sip",
  },
  {
    id: "loan-prepayment",
    label: "Loan Pre-Payment",
    icon: "🏦",
    desc: "Prepay vs Mutual Fund invest",
    href: "/loan-prepayment",
  },
  {
    id: "no-cost-emi",
    label: "No-Cost EMI Truth",
    icon: "📱",
    desc: "Hidden interest & GST revealer",
    href: "/no-cost-emi",
  },
  {
    id: "fire",
    label: "FIRE Retirement",
    icon: "🏖️",
    desc: "Financial freedom & corpus",
    href: "/fire",
  },
  {
    id: "sip",
    label: "SIP",
    icon: "📊",
    desc: "Monthly investment returns",
    href: "/sip",
  },
  {
    id: "emi",
    label: "EMI",
    icon: "💳",
    desc: "Loan EMI calculator",
    href: "/emi",
  },
  {
    id: "tax",
    label: "Income Tax",
    icon: "🧾",
    desc: "Old vs New regime",
    href: "/tax",
  },
  {
    id: "fd",
    label: "FD",
    icon: "🔒",
    desc: "Fixed deposit returns",
    href: "/fd",
  },
  {
    id: "ppf",
    label: "PPF",
    icon: "🏛️",
    desc: "Tax-free PPF corpus",
    href: "/ppf",
  },
  {
    id: "lumpsum",
    label: "Lumpsum",
    icon: "💰",
    desc: "One-time investment growth",
    href: "/lumpsum",
  },
] as const;

export default function RelatedCalculators({ current }: Props) {
  const related = all
    .filter((calc) => calc.id !== current)
    .slice(0, 3);

  return (
    <section className="mt-8 border-t border-border pt-8">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        Related Calculators
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {related.map((calc) => (
          <Link
            key={calc.id}
            href={calc.href}
            className="surface-card-hover group flex items-center gap-3 rounded-xl p-4"
          >
            <span className="text-2xl">{calc.icon}</span>
            <div>
              <p className="text-sm font-semibold text-card-foreground transition-colors group-hover:text-primary">
                {calc.label} Calculator
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {calc.desc}
              </p>
            </div>
            <ChevronRight
              size={14}
              className="ml-auto text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
