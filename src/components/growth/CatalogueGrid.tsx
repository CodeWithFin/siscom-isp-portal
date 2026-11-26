"use client";

import { GROWTH_PRODUCTS } from "@/lib/growth-catalog";
import { useGrowthCart } from "@/lib/growth-cart";
import { Button } from "@/components/ui/Button";
import { CatalogueIcon } from "./CatalogueIcons";

export function CatalogueGrid() {
  const { openConfig } = useGrowthCart();

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GROWTH_PRODUCTS.map((item) => (
        <div
          key={item.id}
          className="flex flex-col rounded-2xl border border-steel bg-paper p-5 shadow-[var(--shadow-technical-card)]"
        >
          <CatalogueIcon productId={item.id} />
          <p className="tech-label mt-4 text-slate">{item.who}</p>
          <h3 className="mt-2 text-[16px] font-semibold text-ink">{item.name}</h3>
          <p className="mt-2 flex-1 text-[14px] leading-[1.45] text-slate">
            {item.desc}
          </p>
          <ul className="mt-3 space-y-1">
            {item.bullets.map((b) => (
              <li
                key={b}
                className="flex gap-2 text-[12px] font-medium text-charcoal"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <Button
              type="button"
              variant="outline"
              className="w-full !min-h-10 !text-[13px]"
              onClick={() => openConfig(item.id)}
            >
              Configure
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
