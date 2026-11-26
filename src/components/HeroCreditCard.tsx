"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const STEPS = [
  {
    title: "Your subscribers",
    detail: "300 homes × KES 2,500",
    value: "KES 750k/mo",
    connector: "pay monthly bills",
    icon: "subs" as const,
  },
  {
    title: "Cashia wallet",
    detail: "Collected, recorded in WASP",
    value: "−KES 75k",
    connector: "repayment deducted at source · balance settles to you",
    icon: "wallet" as const,
  },
  {
    title: "Your network grows",
    detail: "Example: KES 720k facility",
    value: "KES 675k to you",
    connector: null,
    icon: "growth" as const,
  },
];

function StepIcon({ kind }: { kind: (typeof STEPS)[number]["icon"] }) {
  if (kind === "subs") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M3.5 18.5c.6-2.8 2.8-4.5 5.5-4.5s4.9 1.7 5.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14.2 18.5c.4-1.8 1.7-3.1 3.5-3.4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "wallet") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="6"
          width="18"
          height="13"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16.5" cy="14.5" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 16.5 10 10l3.5 3.5L20 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 7h5v5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlowRow({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function HeroCreditCard() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] px-1 py-2 sm:py-4">
      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[36px] bg-[radial-gradient(ellipse_at_70%_30%,rgba(235,18,96,0.08),transparent_60%)]" />

      <motion.div
        className="relative overflow-hidden rounded-[28px] border border-steel bg-paper shadow-[var(--shadow-graphite-card)]"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(4,8,37,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(4,8,37,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />

        <div className="relative px-4 py-5 sm:px-6 sm:py-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="tech-label text-slate">Siscom · cashflow loop</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-siscom-soft px-2.5 py-1 text-[11px] font-semibold text-siscom-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-siscom" />
              Live example
            </span>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute top-5 bottom-5 left-[25px] w-px bg-gradient-to-b from-siscom/40 via-steel to-siscom/30 sm:left-[29px]" />

            {STEPS.map((step, i) => (
              <div key={step.title}>
                <FlowRow delay={0.1 + i * 0.1}>
                  <div className="relative flex items-center gap-3 rounded-2xl border border-steel bg-cloud/80 px-3.5 py-3.5 sm:gap-4 sm:px-4 sm:py-4">
                    <div
                      className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border sm:h-12 sm:w-12 ${
                        step.icon === "growth"
                          ? "border-siscom/30 bg-siscom-soft text-siscom"
                          : "border-steel bg-paper text-charcoal"
                      }`}
                    >
                      <StepIcon kind={step.icon} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold tracking-tight text-ink">
                        {step.title}
                      </p>
                      <p className="mt-0.5 truncate text-[12px] text-slate">
                        {step.detail}
                      </p>
                    </div>
                    <p className="shrink-0 font-[family-name:var(--font-mono)] text-[14px] font-semibold tracking-tight text-siscom sm:text-[15px]">
                      {step.value}
                    </p>
                  </div>
                </FlowRow>

                {step.connector ? (
                  <FlowRow delay={0.15 + i * 0.1}>
                    <div className="relative flex items-center gap-2 py-2.5 pl-[17px] sm:pl-[21px]">
                      <span className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full border border-steel bg-paper text-[10px] text-slate">
                        ↓
                      </span>
                      <p className="font-[family-name:var(--font-mono)] text-[11px] leading-snug text-slate">
                        {step.connector}
                      </p>
                    </div>
                  </FlowRow>
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-5 text-center text-[12px] font-medium text-slate">
            Working capital · Mkash credit · Cashia repay
          </p>
        </div>
      </motion.div>
    </div>
  );
}
