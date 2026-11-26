"use client";

import type { ReactNode } from "react";
import { GrowthCartProvider } from "@/lib/growth-cart";

export function Providers({ children }: { children: ReactNode }) {
  return <GrowthCartProvider>{children}</GrowthCartProvider>;
}
