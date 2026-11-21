import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant =
  | "primary"
  | "aqua"
  | "outline"
  | "ghost"
  | "nav"
  | "graphite"
  | "outlineLight"
  | "translucent"
  | "secondary"
  | "volt";

/** Siscom.africa button system: 35px pills, pink radial primary, outline secondary */
const variants: Record<Variant, string> = {
  primary:
    "min-h-12 rounded-[35px] px-[22px] py-2 text-[14px] font-medium text-white [background-image:radial-gradient(97.54%_50.91%_at_50%_2.46%,#7B1B3D_0%,#EB1260_100%)] hover:brightness-105",
  aqua:
    "min-h-12 rounded-[35px] px-[22px] py-2 text-[14px] font-medium text-white [background-image:radial-gradient(97.54%_50.91%_at_50%_2.46%,#7B1B3D_0%,#EB1260_100%)] hover:brightness-105",
  outline:
    "min-h-12 rounded-[35px] border border-[#EB1260] bg-transparent px-[22px] py-2 text-[14px] font-medium text-[#040825] hover:bg-[#F8E8F0]",
  ghost:
    "min-h-12 rounded-[35px] border border-[#EB1260] bg-transparent px-[22px] py-2 text-[14px] font-medium text-[#040825] hover:bg-[#F8E8F0]",
  nav:
    "min-h-9 rounded-[35px] bg-white px-4 text-[11px] font-medium text-[#353535] hover:bg-[#F8E8F0]",
  graphite:
    "min-h-9 rounded-[35px] bg-[#040548] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#080C2D]",
  outlineLight:
    "min-h-12 rounded-[35px] border-[0.5px] border-[rgba(226,232,240,0.98)] bg-transparent px-[22px] py-2 text-[14px] font-medium text-white hover:bg-white/10",
  translucent:
    "min-h-12 rounded-[35px] border-[0.5px] border-[rgba(226,232,240,0.98)] bg-transparent px-[22px] py-2 text-[14px] font-medium text-white hover:bg-white/10",
  secondary:
    "min-h-12 rounded-[35px] bg-[#F8E8F0] px-[22px] py-2 text-[14px] font-medium text-[#C7105B] hover:bg-[#f3d6e4]",
  volt:
    "min-h-12 rounded-[35px] bg-[#CA3060] px-[22px] py-2 text-[14px] font-medium text-white hover:brightness-105",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
};

export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  arrow = false,
  ...rest
}: Props) {
  const classes = `inline-flex items-center justify-center gap-2 font-[family-name:var(--font-poppins)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`;

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
