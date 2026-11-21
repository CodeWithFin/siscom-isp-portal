"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicAssessment } from "@/lib/types";
import { formatKes } from "@/lib/format";
import { Button } from "./ui/Button";

export function ResultClient({ assessment }: { assessment: PublicAssessment }) {
  const min = 20_000;
  const max = Math.max(min, assessment.maxQualifiedAmount);
  const [amount, setAmount] = useState(
    Math.min(max, Math.max(min, Math.round(max * 0.7))),
  );

  const status = assessment.qualificationStatus;

  const headline = useMemo(() => {
    if (status === "QUALIFIED") {
      return `Congratulations! You qualify for up to ${formatKes(assessment.maxQualifiedAmount)}`;
    }
    if (status === "MANUAL_REVIEW") {
      return "Your Statement Requires Quick Manual Verification";
    }
    return "You Do Not Qualify at This Time";
  }, [assessment.maxQualifiedAmount, status]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {status === "QUALIFIED" ? (
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-semibold text-emerald-800">
          Pre-Qualified
        </span>
      ) : status === "MANUAL_REVIEW" ? (
        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[12px] font-semibold text-amber-900">
          Manual Review
        </span>
      ) : (
        <span className="inline-flex rounded-full bg-cloud px-3 py-1 text-[12px] font-semibold text-charcoal">
          Not Qualified
        </span>
      )}

      <h1 className="display-section mt-4">{headline}</h1>

      {status === "QUALIFIED" ? (
        <p className="mt-4 max-w-2xl text-[14px] leading-[1.5] font-medium text-slate">
          Based on your 6-month M-Pesa performance, you qualify for{" "}
          <span className="text-charcoal">{assessment.multiplier}x</span> your
          average monthly net cash flow.
        </p>
      ) : null}

      {status === "MANUAL_REVIEW" ? (
        <p className="mt-4 max-w-2xl text-[14px] leading-[1.5] font-medium text-slate">
          We detected irregular statement formatting or mixed personal/business
          transactions. Submit your ISP details so our credit team can review
          manually.
        </p>
      ) : null}

      {status === "NOT_QUALIFIED" ||
      assessment.riskFlags.includes("TAMPERED_REJECTED") ? (
        <ul className="mt-6 space-y-2">
          {(assessment.declineReasons.length
            ? assessment.declineReasons
            : ["Cash-flow profile did not meet qualification thresholds."]
          ).map((reason) => (
            <li
              key={reason}
              className="flex gap-2 text-[14px] font-medium text-charcoal"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
              {reason}
            </li>
          ))}
        </ul>
      ) : null}

      {(status === "QUALIFIED" || status === "MANUAL_REVIEW") && (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Avg. Monthly Inflow",
                value: formatKes(assessment.avgMonthlyInflow),
              },
              {
                label: "Avg. Monthly Outflow",
                value: formatKes(assessment.avgMonthlyOutflow),
              },
              {
                label: "Avg. Monthly Net Cash Flow",
                value: formatKes(assessment.avgMonthlyNetCashflow),
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-steel bg-cloud p-4"
              >
                <p className="tech-label text-slate">{card.label}</p>
                <p className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-ink">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {status === "QUALIFIED" ? (
            <div className="mt-8 rounded-2xl border border-steel bg-paper p-5 shadow-[var(--shadow-technical-card)]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="tech-label text-slate">LOAN SELECTOR</p>
                  <p className="mt-2 text-[28px] font-semibold tracking-[-0.03em]">
                    {formatKes(amount)}
                  </p>
                </div>
                <p className="text-[13px] text-slate">
                  {formatKes(min)} – {formatKes(max)}
                </p>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={1000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-6"
              />
              <div className="mt-6">
                <Button
                  href={`/apply/${assessment.id}?amount=${amount}`}
                  variant="aqua"
                  arrow
                  className="w-full sm:w-auto"
                >
                  Apply for {formatKes(amount)}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <Button
                href={`/apply/${assessment.id}?amount=${Math.min(max, Math.max(min, assessment.maxQualifiedAmount || min))}`}
                variant="aqua"
                arrow
              >
                Request Manual Review
              </Button>
            </div>
          )}
        </>
      )}

      {status === "NOT_QUALIFIED" ||
      assessment.riskFlags.includes("TAMPERED_REJECTED") ? (
        <div className="mt-8">
          <Button href="/" variant="ghost">
            Upload a Different Statement
          </Button>
        </div>
      ) : null}

      <p className="mt-10 text-[12px] text-slate">
        Assessment ID{" "}
        <span className="font-mono text-charcoal">{assessment.id}</span>
        {" · "}
        <Link href="/" className="underline underline-offset-2">
          Home
        </Link>
      </p>
    </div>
  );
}
