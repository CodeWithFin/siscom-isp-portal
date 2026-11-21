import Link from "next/link";
import { Button } from "./ui/Button";

export function Header({ helpline }: { helpline?: string }) {
  const phone = helpline || process.env.HELPLINE || "+254 700 000 000";

  return (
    <header className="sticky top-0 z-40 border-b border-steel bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-siscom text-[12px] font-bold text-white">
            S
          </span>
          <span className="font-[family-name:var(--font-poppins)] text-[15px] font-semibold tracking-[-0.02em]">
            SISCOM
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="/#how-it-works"
            className="text-nav text-[#353535] hover:text-siscom"
          >
            How It Works
          </a>
          <a href="/#trust" className="text-nav text-[#353535] hover:text-siscom">
            Security
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="text-nav text-slate hover:text-siscom"
          >
            {phone}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="text-nav text-slate md:hidden"
          >
            Call
          </a>
          <Button href="/#check" variant="primary" className="!min-h-10 !px-5 !text-[13px]">
            Check qualification
          </Button>
        </div>
      </div>
    </header>
  );
}
