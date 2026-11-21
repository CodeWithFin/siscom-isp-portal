import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "aqua" | "graphite" | "ghost" | "translucent" | "volt" | "secondary";

const variants: Record<Variant, string> = {
  aqua:
    "bg-aqua-relay text-ink rounded-2xl px-[22px] py-3 hover:brightness-95 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]",
  graphite:
    "bg-graphite text-paper rounded-xl px-4 py-2 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.13)] hover:brightness-110",
  ghost:
    "bg-transparent text-ink border border-steel rounded-2xl px-[22px] py-3 hover:bg-cloud",
  secondary:
    "bg-cloud text-ink rounded-2xl px-[22px] py-3 hover:bg-steel/40",
  translucent:
    "bg-white/10 text-paper rounded-2xl px-[22px] py-3 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.13)] hover:bg-white/15",
  volt:
    "bg-volt-lime text-ink rounded-xl px-4 py-2 hover:brightness-95",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
};

export function Button({
  variant = "aqua",
  href,
  children,
  className = "",
  arrow = false,
  ...rest
}: Props) {
  const classes = `inline-flex items-center justify-center gap-2 text-[14px] font-medium tracking-[-0.14px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {arrow ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M2 7h9M7.5 3.5 11 7l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
