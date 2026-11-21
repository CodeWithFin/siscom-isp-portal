"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatKes, KENYA_COUNTIES } from "@/lib/format";
import type { PublicAssessment } from "@/lib/types";
import { Button } from "./ui/Button";

export function ApplyForm({
  assessment,
  initialAmount,
}: {
  assessment: PublicAssessment;
  initialAmount: number;
}) {
  const router = useRouter();
  const max = assessment.maxQualifiedAmount;
  const [requestedAmount, setRequestedAmount] = useState(
    Math.min(max, Math.max(20_000, initialAmount)),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      assessmentId: assessment.id,
      ispName: String(form.get("ispName") || ""),
      contactName: String(form.get("contactName") || ""),
      phoneNumber: String(form.get("phoneNumber") || ""),
      email: String(form.get("email") || ""),
      location: String(form.get("location") || ""),
      kraPin: String(form.get("kraPin") || ""),
      paybillOrTill: String(form.get("paybillOrTill") || ""),
      subscriberBand: String(form.get("subscriberBand") || ""),
      requestedAmount,
    };

    try {
      const res = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      router.push(`/confirmation/${data.referenceCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
      setLoading(false);
    }
  }

  const fieldClass =
    "mt-2 w-full rounded-xl border border-steel bg-paper px-3 py-3 text-[14px] text-ink outline-none transition focus:border-ink";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl bg-graphite px-4 py-3 text-[14px] font-medium text-paper shadow-[var(--shadow-graphite-card)]">
        Applying for:{" "}
        <span className="text-aqua-relay">{formatKes(requestedAmount)}</span>
        <span className="text-white/50">
          {" "}
          (Pre-qualified limit: {formatKes(max)})
        </span>
      </div>

      <h1 className="display-section mt-8">ISP Loan Application</h1>
      <p className="mt-3 text-[14px] font-medium text-slate">
        Share your business details so Siscom customer care can finalize
        disbursement.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-[13px] font-medium text-charcoal">
            ISP / Business Name *
          </span>
          <input
            name="ispName"
            required
            placeholder="SwiftFiber Networks Ltd"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-medium text-charcoal">
            Contact Person Full Name *
          </span>
          <input name="contactName" required className={fieldClass} />
        </label>

        <label className="block">
          <span className="text-[13px] font-medium text-charcoal">
            Phone Number (Safaricom/WhatsApp) *
          </span>
          <input
            name="phoneNumber"
            required
            type="tel"
            placeholder="+2547XXXXXXXX"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-medium text-charcoal">
            Business Email Address
          </span>
          <input name="email" type="email" className={fieldClass} />
        </label>

        <label className="block">
          <span className="text-[13px] font-medium text-charcoal">
            County / Primary Area of Operation *
          </span>
          <select name="location" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select county
            </option>
            {KENYA_COUNTIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[13px] font-medium text-charcoal">
            KRA PIN / Business Registration Number *
          </span>
          <input name="kraPin" required className={fieldClass} />
        </label>

        <label className="block">
          <span className="text-[13px] font-medium text-charcoal">
            M-Pesa Paybill or Till Number
          </span>
          <input name="paybillOrTill" className={fieldClass} />
        </label>

        <label className="block">
          <span className="text-[13px] font-medium text-charcoal">
            Approximate Active Subscribers *
          </span>
          <select
            name="subscriberBand"
            required
            defaultValue=""
            className={fieldClass}
          >
            <option value="" disabled>
              Select band
            </option>
            <option value="< 50">&lt; 50</option>
            <option value="50 – 200">50 – 200</option>
            <option value="201 – 500">201 – 500</option>
            <option value="500+">500+</option>
          </select>
        </label>

        <label className="block">
          <span className="text-[13px] font-medium text-charcoal">
            Requested Loan Amount (KES) *
          </span>
          <input
            type="number"
            min={20000}
            max={max}
            step={1000}
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(Number(e.target.value))}
            className={fieldClass}
          />
        </label>

        {error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="aqua"
          arrow
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Submitting…" : "Submit Loan Request"}
        </Button>
      </form>
    </div>
  );
}
