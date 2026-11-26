"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicAssessment } from "@/lib/types";
import { formatKes } from "@/lib/format";
import { Button } from "./ui/Button";
import { FlowMeter, HeroDial } from "./MeterGauge";
import { WcProgress } from "./growth/WcProgress";

function clampRatio(value: number, max: number) {
  if (!Number.isFinite(value) || max <= 0) return 0;
  return Math.max(0, Math.min(1, value / max));
}

export function ResultClient({ assessment }: { assessment: PublicAssessment }) {
  const min = 20_000;
  const max = Math.max(min, assessment.maxQualifiedAmount);
  const [amount, setAmount] = useState(
    Math.min(max, Math.max(min, Math.round(max * 0.7))),
  );

  const status = assessment.qualificationStatus;
  const peakFlow = Math.max(
    assessment.avgMonthlyInflow,
    assessment.avgMonthlyOutflow,
    Math.abs(assessment.avgMonthlyNetCashflow),
    1,
  );

  const headline = useMemo(() => {
    if (status === "QUALIFIED") {
      return `Congratulations! You qualify for up to ${formatKes(assessment.maxQualifiedAmount)}`;
    }
    if (status === "MANUAL_REVIEW") {
      return "Your Statement Requires Quick Manual Verification";
    }
    return "You Do Not Qualify at This Time";
  }, [assessment.maxQualifiedAmount, status]);

  const dialStatus =
    status === "QUALIFIED"
      ? "ok"
      : status === "MANUAL_REVIEW"
        ? "warn"
        : "muted";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <WcProgress step={2} />

      <div className="mt-8 rounded-3xl border border-steel bg-paper p-5 shadow-[var(--shadow-graphite-card)] sm:p-8">
        {status === "QUALIFIED" ? (
          <span className="inline-flex rounded-full bg-siscom-soft px-3 py-1 text-[12px] font-semibold text-siscom-dark">
            Pre-Qualified
          </span>
        ) : status === "MANUAL_REVIEW" ? (
          <span className="inline-flex rounded-full bg-[#fff4e5] px-3 py-1 text-[12px] font-semibold text-[#9a6700]">
            Manual Review
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-cloud px-3 py-1 text-[12px] font-semibold text-charcoal">
            Not Qualified
          </span>
        )}

        <h1 className="mt-4 text-[28px] font-semibold tracking-tight text-ink sm:text-[34px]">
          {headline}
        </h1>

        {status === "QUALIFIED" ? (
          <p className="mt-3 max-w-2xl text-[14px] leading-[1.5] font-medium text-slate">
            Based on your M-Pesa performance, you qualify for{" "}
            <span className="text-charcoal">{assessment.multiplier}x</span> your
            average monthly net cash flow.
          </p>
        ) : null}

        {status === "MANUAL_REVIEW" ? (
          <p className="mt-3 max-w-2xl text-[14px] leading-[1.5] font-medium text-slate">
            We detected irregular statement formatting or mixed
            personal/business transactions. Submit your ISP details so our
            credit team can review manually.
          </p>
        ) : null}

        {status === "NOT_QUALIFIED" ||
        assessment.riskFlags.includes("TAMPERED_REJECTED") ? (
          <ul className="mt-5 space-y-2">
            {(assessment.declineReasons.length
              ? assessment.declineReasons
              : ["Cash-flow profile did not meet qualification thresholds."]
            ).map((reason) => (
              <li
                key={reason}
                className="flex gap-2 text-[14px] font-medium text-charcoal"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EB1260]" />
                {reason}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-[28px] border border-steel bg-[linear-gradient(165deg,#FBFBFC_0%,#F3F5F8_100%)]">
          <div className="grid items-center gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-10">
            <HeroDial
              label="Indicative limit"
              valueLabel={formatKes(assessment.maxQualifiedAmount)}
              ratio={clampRatio(assessment.maxQualifiedAmount, 10_000_000)}
              status={dialStatus}
              caption={
                status === "QUALIFIED"
                  ? `${assessment.multiplier}× average monthly net cash flow`
                  : status === "MANUAL_REVIEW"
                    ? "Subject to credit-team verification"
                    : `${assessment.statementPeriodDays} days of statement read`
              }
            />

            <div className="space-y-6 rounded-2xl border border-white/80 bg-paper/80 p-5 shadow-[0_1px_0_rgba(4,8,37,0.04)] backdrop-blur-sm sm:p-6">
              <FlowMeter
                label="Monthly inflow"
                valueLabel={formatKes(assessment.avgMonthlyInflow)}
                ratio={clampRatio(assessment.avgMonthlyInflow, peakFlow)}
                accent="ink"
              />
              <FlowMeter
                label="Monthly outflow"
                valueLabel={formatKes(assessment.avgMonthlyOutflow)}
                ratio={clampRatio(assessment.avgMonthlyOutflow, peakFlow)}
                accent="muted"
              />
              <FlowMeter
                label="Monthly net"
                valueLabel={formatKes(assessment.avgMonthlyNetCashflow)}
                ratio={clampRatio(
                  Math.max(0, assessment.avgMonthlyNetCashflow),
                  Math.max(peakFlow, 50_000),
                )}
                accent="siscom"
                hint={
                  assessment.avgMonthlyNetCashflow >= 15_000
                    ? "Above the KES 15,000 qualification floor"
                    : "Below the KES 15,000 qualification floor"
                }
              />
              <div className="border-t border-steel pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-slate">
                    Statement coverage
                  </p>
                  <p className="text-[13px] font-semibold tabular-nums text-ink">
                    {assessment.statementPeriodDays}
                    <span className="font-medium text-slate"> / 165 days</span>
                  </p>
                </div>
                <div className="mt-2.5 h-[6px] overflow-hidden rounded-full bg-[#ECEFF3]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#7B1B3D_0%,#EB1260_100%)] transition-all duration-1000"
                    style={{
                      width: `${Math.min(100, (assessment.statementPeriodDays / 165) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {(status === "QUALIFIED" || status === "MANUAL_REVIEW") && (
          <>
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
                  className="mt-6 w-full"
                />
                <div className="mt-6">
                  <Button
                    href={`/apply/${assessment.id}?amount=${amount}`}
                    variant="primary"
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
                  variant="primary"
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
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/check/statements" variant="primary" arrow>
              Upload another statement
            </Button>
            <Button href="/check" variant="outline">
              Edit business details
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
    </div>
  );
}
