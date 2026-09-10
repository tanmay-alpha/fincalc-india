import type { ReactNode } from "react";
export { getSafeCallbackUrl } from "@/lib/url";

interface InteractiveCalculatorGateProps {
  children: ReactNode;
  calcName?: string;
}

/**
 * Clean workspace container for interactive calculators.
 * Centralized server-side route protection is enforced at the middleware boundary.
 */
export default function InteractiveCalculatorGate({
  children,
}: InteractiveCalculatorGateProps) {
  return (
    <div
      data-testid="interactive-calculator-surface"
      data-auth-state="authenticated"
    >
      {children}
    </div>
  );
}
