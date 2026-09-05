/**
 * useIsMounted — Returns true once the component has mounted on the client.
 *
 * Centralizes the `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])`
 * pattern that previously appeared copy-pasted in every calculator component.
 *
 * Usage:
 *   const mounted = useIsMounted();
 *   if (!mounted) return <CalcPageSkeleton />;
 */
import { useEffect, useState } from "react";

export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
