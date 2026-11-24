"use client";

import { Button } from "./ui/Button";
import { SiscomLogo } from "./SiscomLogo";
import { useGrowthCartOptional } from "@/lib/growth-cart";

export function Header() {
  const growth = useGrowthCartOptional();
  const count = growth?.cart.length ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-steel bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <SiscomLogo priority />

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="/#how-it-works"
            className="text-nav text-[#353535] hover:text-siscom"
          >
            How it works
          </a>
          <a
            href="/#infrastructure"
            className="text-nav text-[#353535] hover:text-siscom"
          >
            Infrastructure
          </a>
          <a
            href="/#financing"
            className="text-nav text-[#353535] hover:text-siscom"
          >
            Financing
          </a>
          <a href="/#wasp" className="text-nav text-[#353535] hover:text-siscom">
            WASP billing
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {growth ? (
            <button
              type="button"
              onClick={() => growth.openCheckout()}
              className="relative inline-flex min-h-10 items-center rounded-[35px] border border-steel bg-paper px-4 text-[13px] font-medium text-ink hover:bg-cloud"
              aria-label={`Open cart${count ? `, ${count} items` : ""}`}
            >
              Cart
              {count > 0 ? (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-siscom px-1.5 text-[11px] font-semibold text-white">
                  {count}
                </span>
              ) : null}
            </button>
          ) : null}
          <Button
            href="/#check"
            variant="primary"
            className="!min-h-10 !px-5 !text-[13px]"
          >
            Check qualification
          </Button>
        </div>
      </div>
    </header>
  );
}
