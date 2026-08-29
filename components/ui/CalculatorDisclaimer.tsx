import { Info } from "lucide-react";

export default function CalculatorDisclaimer() {
  return (
    <div className="mt-8 rounded-xl border border-border/80 bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed flex items-start gap-3">
      <Info className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground/80" aria-hidden="true" />
      <p>
        <strong className="font-semibold text-foreground">Disclaimer:</strong> The calculations, results, and visual projections provided on this page are for illustrative and educational purposes only, based on user-provided inputs and prevailing financial formulas. They do not constitute financial, investment, legal, or tax advice. Actual market returns, interest rates, tax liabilities, and bank charges may vary over time. Consult a certified financial planner (CFP) or Chartered Accountant (CA) for personalized advice.
      </p>
    </div>
  );
}
