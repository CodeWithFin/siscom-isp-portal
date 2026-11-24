"use client";

import type { ReactNode } from "react";
import { GrowthCartProvider } from "@/lib/growth-cart";
import { GrowthConsole } from "./GrowthConsole";

export function GrowthShell({ children }: { children: ReactNode }) {
  return (
    <GrowthCartProvider>
      {children}
      <GrowthConsole />
    </GrowthCartProvider>
  );
}
