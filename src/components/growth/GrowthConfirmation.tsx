"use client";

import { useState } from "react";
import { formatKes } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export function GrowthConfirmation({
  referenceCode,
  ispName,
  contactName,
  phoneNumber,
  itemCount,
  financingAmount,
  accessFinance,
}: {
  referenceCode: string;
  ispName: string;
  contactName: string;
  phoneNumber: string;
  itemCount: number;
  financingAmount: number | null;
  accessFinance: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(referenceCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-siscom text-white">
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
        You&apos;re in. An associate will call you.
      </h1>
      <p className="mt-3 text-center text-[14px] text-slate">
        Application received for {ispName}. We&apos;ll contact {contactName} on{" "}
        {phoneNumber}.
      </p>

      <div className="mt-10 rounded-2xl border border-steel bg-cloud p-5 shadow-[var(--shadow-cloud-card)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="tech-label text-slate">APPLICATION REFERENCE</p>
            <p className="mt-1 font-mono text-[22px] font-semibold tracking-[-0.02em] text-ink">
              {referenceCode}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={copy}
            className="!min-h-10"
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="tech-label text-slate">Infrastructure</dt>
            <dd className="mt-1 text-[14px] font-semibold text-ink">
              {itemCount} item{itemCount === 1 ? "" : "s"}
              {accessFinance ? " · lease" : ""}
            </dd>
          </div>
          <div>
            <dt className="tech-label text-slate">Billing finance</dt>
            <dd className="mt-1 text-[14px] font-semibold text-ink">
              {financingAmount != null ? formatKes(financingAmount) : "—"}
            </dd>
          </div>
          <div>
            <dt className="tech-label text-slate">Contact</dt>
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
            1. A SISCOM associate reviews your infrastructure list and any
            financing request.
          </li>
          <li>
            2. We call or WhatsApp you within 2 business hours to confirm WASP
            and Cashia onboarding and quote your lease or facility.
          </li>
          <li>
            3. No payment is taken now. Quotes and limits stay indicative until
            confirmed in writing.
          </li>
        </ol>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button href="/" variant="outline">
          Return home
        </Button>
        <Button href="/#check" variant="primary">
          Check working capital
        </Button>
      </div>
    </div>
  );
}
