import { ReactNode } from "react";

/**
 * AuthGate — backwards-compatibility alias for InteractiveCalculatorGate.
 * Passes children through as InteractiveCalculatorGate handles gating at CalculatorPageShell level.
 */
export default function AuthGate({ children }: { children: ReactNode; promptContext?: string }) {
  return <>{children}</>;
}
