"use client";

import { useState } from "react";
import { formatKes } from "@/lib/format";
import { Button } from "./ui/Button";

export function ConfirmationClient({
  referenceCode,
  ispName,
  phoneNumber,
  requestedAmount,
}: {
  referenceCode: string;
  ispName: string;
  phoneNumber: string;
  requestedAmount: number;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(referenceCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-aqua-relay text-ink">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="display-section mt-6 text-center">
        Application Received — Our Customer Care Team Will Reach Out Shortly
      </h1>

      <div className="mt-10 rounded-2xl border border-steel bg-cloud p-5 shadow-[var(--shadow-cloud-card)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="tech-label text-slate">APPLICATION REFERENCE</p>
            <p className="mt-1 font-mono text-[22px] font-semibold tracking-[-0.02em] text-ink">
              {referenceCode}
            </p>
          </div>
          <Button type="button" variant="graphite" onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="tech-label text-slate">ISP Name</dt>
            <dd className="mt-1 text-[14px] font-semibold text-ink">{ispName}</dd>
          </div>
          <div>
            <dt className="tech-label text-slate">Requested Amount</dt>
            <dd className="mt-1 text-[14px] font-semibold text-ink">
              {formatKes(requestedAmount)}
            </dd>
          </div>
          <div>
            <dt className="tech-label text-slate">Contact Number</dt>
            <dd className="mt-1 text-[14px] font-semibold text-ink">
              {phoneNumber}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-2xl border border-steel bg-paper p-5">
        <p className="text-[14px] font-semibold text-ink">Next steps</p>
        <ol className="mt-3 space-y-3 text-[14px] leading-[1.45] text-slate">
          <li>
            1. One of our Siscom Customer Care representatives is reviewing your
            M-Pesa cash-flow profile.
          </li>
          <li>
            2. We will call or WhatsApp you on{" "}
            <span className="font-semibold text-charcoal">{phoneNumber}</span>{" "}
            within 2 business hours to verify your ISP registration and finalize
            disbursement.
          </li>
        </ol>
      </div>

      <div className="mt-8 flex justify-center">
        <Button href="/" variant="ghost">
          Return to Homepage
        </Button>
      </div>
    </div>
  );
}
