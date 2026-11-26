"use client";

import { useGrowthCart } from "@/lib/growth-cart";
import { Button } from "@/components/ui/Button";

export function FinanceCta({
  kind,
  label,
  primary,
}: {
  kind: "infra" | "billing" | "wc";
  label: string;
  primary?: boolean;
}) {
  const { openCheckout } = useGrowthCart();

  if (kind === "wc") {
    return (
      <Button
        href="/check"
        variant={primary ? "primary" : "outline"}
        arrow={primary}
        className="w-full"
      >
        {label}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={primary ? "primary" : "outline"}
      arrow={primary}
      className="w-full"
      onClick={() => {
        if (kind === "billing") {
          openCheckout({ billing: true });
          return;
        }
        document
          .getElementById("infrastructure")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {label}
    </Button>
  );
}

export function HeroGrowthCtas() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Button href="#infrastructure" variant="primary">
        Shop infrastructure
      </Button>
      <Button href="/check" variant="outline">
        Check what you qualify for
      </Button>
    </div>
  );
}
