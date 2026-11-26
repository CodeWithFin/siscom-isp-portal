"use client";

import { useMemo } from "react";
import { cx, sortCx } from "@/utils/cx";
import { MastercardIcon, MastercardIconWhite, PaypassIcon } from "./icons";

const styles = sortCx({
  transparent: {
    root: "bg-black/10 bg-gradient-to-br from-white/30 to-transparent backdrop-blur-[6px] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "transparent-gradient": {
    root: "bg-black/10 bg-gradient-to-br from-white/30 to-transparent backdrop-blur-[6px] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "brand-dark": {
    root: "bg-gradient-to-tr from-[#7B1B3D] to-[#EB1260] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "brand-light": {
    root: "bg-[#F8E8F0] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-black/10 before:ring-inset",
    company: "text-neutral-700",
    footerText: "text-neutral-700",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white",
  },
  "gray-dark": {
    root: "bg-gradient-to-tr from-neutral-900 to-neutral-700 before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "gray-light": {
    root: "bg-neutral-100 before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-black/10 before:ring-inset",
    company: "text-neutral-700",
    footerText: "text-neutral-700",
    paypassIcon: "text-neutral-400",
    cardTypeRoot: "bg-white",
  },
  "transparent-strip": {
    root: "bg-gradient-to-br from-white/30 to-transparent backdrop-blur-[6px] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "gray-strip": {
    root: "bg-neutral-100 before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-neutral-700",
    footerText: "text-white",
    paypassIcon: "text-neutral-400",
    cardTypeRoot: "bg-white/10",
  },
  "gradient-strip": {
    root: "bg-gradient-to-b from-[#A5C0EE] to-[#FBC5EC] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "salmon-strip": {
    root: "bg-[#F4D9D0] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-neutral-700",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "gray-strip-vertical": {
    root: "bg-gradient-to-br from-white/30 to-transparent before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-neutral-400",
    cardTypeRoot: "bg-white/10",
  },
  "gradient-strip-vertical": {
    root: "bg-gradient-to-b from-[#FBC2EB] to-[#A18CD1] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
  "salmon-strip-vertical": {
    root: "bg-[#F4D9D0] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:ring-1 before:ring-white/30 before:ring-inset",
    company: "text-white",
    footerText: "text-white",
    paypassIcon: "text-white",
    cardTypeRoot: "bg-white/10",
  },
});

const _NORMAL_TYPES = [
  "transparent",
  "transparent-gradient",
  "brand-dark",
  "brand-light",
  "gray-dark",
  "gray-light",
] as const;
const STRIP_TYPES = [
  "transparent-strip",
  "gray-strip",
  "gradient-strip",
  "salmon-strip",
] as const;
const VERTICAL_STRIP_TYPES = [
  "gray-strip-vertical",
  "gradient-strip-vertical",
  "salmon-strip-vertical",
] as const;

const CARD_WITH_COLOR_LOGO = [
  "brand-dark",
  "brand-light",
  "gray-dark",
  "gray-light",
] as const;

type CreditCardType =
  | (typeof _NORMAL_TYPES)[number]
  | (typeof STRIP_TYPES)[number]
  | (typeof VERTICAL_STRIP_TYPES)[number];

export interface CreditCardProps {
  company?: string;
  cardNumber?: string;
  cardHolder?: string;
  cardExpiration?: string;
  type?: CreditCardType;
  className?: string;
  width?: number;
}

const calculateScale = (
  desiredWidth: number,
  originalWidth: number,
  originalHeight: number,
) => {
  const scale = desiredWidth / originalWidth;
  return {
    scale: scale.toFixed(4),
    scaledWidth: (originalWidth * scale).toFixed(2),
    scaledHeight: (originalHeight * scale).toFixed(2),
  };
};

export function CreditCard({
  company = "Untitled.",
  cardNumber = "1234 1234 1234 1234",
  cardHolder = "OLIVIA RHYE",
  cardExpiration = "06/28",
  type = "brand-dark",
  className,
  width,
}: CreditCardProps) {
  const originalWidth = 316;
  const originalHeight = 190;

  const { scale, scaledWidth, scaledHeight } = useMemo(() => {
    if (!width) {
      return {
        scale: "1",
        scaledWidth: String(originalWidth),
        scaledHeight: String(originalHeight),
      };
    }
    return calculateScale(width, originalWidth, originalHeight);
  }, [width]);

  return (
    <div
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
      }}
      className={cx("relative flex", className)}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          width: `${originalWidth}px`,
          height: `${originalHeight}px`,
        }}
        className={cx(
          "absolute top-0 left-0 flex origin-top-left flex-col justify-between overflow-hidden rounded-2xl p-4 shadow-[0_24px_60px_-12px_rgba(4,8,37,0.45)]",
          styles[type].root,
        )}
      >
        {STRIP_TYPES.includes(type as (typeof STRIP_TYPES)[number]) ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-1/2 bg-neutral-800" />
        ) : null}
        {VERTICAL_STRIP_TYPES.includes(
          type as (typeof VERTICAL_STRIP_TYPES)[number],
        ) ? (
          <div className="pointer-events-none absolute inset-y-0 right-[5.5rem] left-0 z-0 bg-neutral-800" />
        ) : null}
        {type === "transparent-gradient" ? (
          <div className="absolute -top-4 -left-4 grid grid-cols-2 blur-3xl">
            <div className="size-20 rounded-tl-full bg-pink-500 opacity-30 mix-blend-normal" />
            <div className="size-20 rounded-tr-full bg-orange-500 opacity-50 mix-blend-normal" />
            <div className="size-20 rounded-bl-full bg-blue-500 opacity-30 mix-blend-normal" />
            <div className="size-20 rounded-br-full bg-green-500 opacity-30 mix-blend-normal" />
          </div>
        ) : null}

        <div className="relative flex items-start justify-between px-1 pt-1">
          <div
            className={cx(
              "text-base leading-[normal] font-semibold",
              styles[type].company,
            )}
          >
            {company}
          </div>
          <PaypassIcon className={styles[type].paypassIcon} />
        </div>

        <div className="relative flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-end gap-1">
              <p
                style={{ wordBreak: "break-word" }}
                className={cx(
                  "text-xs leading-snug font-semibold tracking-[0.6px] uppercase",
                  styles[type].footerText,
                )}
              >
                {cardHolder}
              </p>
              <p
                className={cx(
                  "ml-auto text-right text-xs leading-[normal] font-semibold tracking-[0.6px] tabular-nums",
                  styles[type].footerText,
                )}
              >
                {cardExpiration}
              </p>
            </div>
            <div
              className={cx(
                "text-base leading-[normal] font-semibold tracking-[1px] tabular-nums",
                styles[type].footerText,
              )}
            >
              {cardNumber}
              <span className="pointer-events-none invisible inline-block w-0 max-w-0 opacity-0">
                1
              </span>
            </div>
          </div>

          <div
            className={cx(
              "flex h-8 w-[2.875rem] shrink-0 items-center justify-center rounded",
              styles[type].cardTypeRoot,
            )}
          >
            {CARD_WITH_COLOR_LOGO.includes(
              type as (typeof CARD_WITH_COLOR_LOGO)[number],
            ) ? (
              <MastercardIcon />
            ) : (
              <MastercardIconWhite />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditCard;
