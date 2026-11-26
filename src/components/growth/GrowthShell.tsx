import type { ReactNode } from "react";

/** Cart provider lives in root `Providers`; this is a layout passthrough. */
export function GrowthShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
