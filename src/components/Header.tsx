import Link from "next/link";
import { Button } from "./ui/Button";

export function Header({ helpline }: { helpline?: string }) {
  const phone = helpline || process.env.HELPLINE || "+254 700 000 000";

  return (
    <header className="sticky top-0 z-40 border-b border-steel bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-ink text-[11px] font-semibold text-paper">
            S
          </span>
          <span className="text-[14px] font-semibold tracking-[-0.02em]">
            Siscom Technologies
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="/#how-it-works" className="text-nav text-slate hover:text-ink">
            How It Works
          </a>
          <a href="/#trust" className="text-nav text-slate hover:text-ink">
            Security
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="tech-label text-slate hover:text-ink"
          >
            {phone}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="tech-label text-slate md:hidden"
          >
            Call
          </a>
          <Button href="/#check" variant="graphite" className="!py-2 !px-4">
            Check qualification
          </Button>
        </div>
      </div>
    </header>
  );
}
