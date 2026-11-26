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
            <a
              href="/checkout"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-steel bg-paper text-ink hover:bg-cloud"
              aria-label={`Open cart${count ? `, ${count} items` : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M17.437 19.934a1 1 0 1 1-2 0a1 1 0 0 1 2 0M6.22 15.668l-.945-10.9a.75.75 0 0 0-.749-.693H3.56a.5.5 0 0 1 0-1h.966a1.75 1.75 0 0 1 1.746 1.617l.139 1.818h13.03c.885 0 1.577.76 1.494 1.638l-.668 7.52a2.5 2.5 0 0 1-2.489 2.267H8.709a2.5 2.5 0 0 1-2.489-2.267m.274-8.158l.722 8.066a1.5 1.5 0 0 0 1.493 1.359h9.069a1.5 1.5 0 0 0 1.493-1.359l.668-7.518a.5.5 0 0 0-.498-.548zm4.454 12.424a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
                />
              </svg>
              {count > 0 ? (
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-siscom px-1.5 text-[11px] font-semibold text-white">
                  {count}
                </span>
              ) : null}
            </a>
          ) : null}
          <Button
            href="/check"
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
