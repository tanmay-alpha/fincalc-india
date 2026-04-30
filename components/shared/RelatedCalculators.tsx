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
    <section className="mt-8 pt-8 border-t border-slate-200">
      <h3 className="text-base font-semibold text-slate-900 mb-4">
        Related Calculators
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {related.map((calc) => (
          <Link
            key={calc.id}
            href={calc.href}
            className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group"
          >
            <span className="text-2xl">{calc.icon}</span>
            <div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {calc.label} Calculator
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {calc.desc}
              </p>
            </div>
            <ChevronRight
              size={14}
              className="ml-auto text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
