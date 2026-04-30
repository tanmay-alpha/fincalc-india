import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  current: "sip" | "emi" | "fd" | "ppf" | "lumpsum" | "tax";
}

const all = [
  {
    id: "sip",
    label: "SIP",
    icon: "📈",
    desc: "Monthly investment returns",
    href: "/sip",
  },
  {
    id: "emi",
    label: "EMI",
    icon: "🏦",
    desc: "Loan EMI calculator",
    href: "/emi",
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
  {
    id: "tax",
    label: "Tax",
    icon: "🧾",
    desc: "Old vs New regime",
    href: "/tax",
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
