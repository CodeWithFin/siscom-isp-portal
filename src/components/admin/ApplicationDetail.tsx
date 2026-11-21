"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatKes } from "@/lib/format";
import type { AssessmentRow, LoanApplicationRow } from "@/lib/types";
import { Button } from "../ui/Button";

export function ApplicationDetail({
  application,
  assessment,
}: {
  application: LoanApplicationRow;
  assessment: AssessmentRow;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.customer_care_notes || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, customerCareNotes: notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMessage("Saved");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const breakdown = assessment.monthly_breakdown || [];
  const flags = assessment.risk_flags || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="tech-label text-slate">{application.reference_code}</p>
          <h1 className="feature-heading mt-1">{application.isp_name}</h1>
        </div>
        <Button href="/admin" variant="ghost">
          Back to list
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-steel bg-paper p-5">
          <p className="tech-label text-slate">KYC DETAILS</p>
          <dl className="mt-4 space-y-3 text-[14px]">
            {[
              ["Contact", application.contact_name],
              ["Phone", application.phone_number],
              ["Email", application.email || "—"],
              ["County", application.location],
              ["KRA PIN", application.kra_pin],
              ["Paybill/Till", application.paybill_or_till || "—"],
              ["Subscribers", application.subscriber_band],
              ["Requested", formatKes(Number(application.requested_amount))],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-slate">{k}</dt>
                <dd className="font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl bg-graphite p-5 text-paper shadow-[var(--shadow-graphite-card)]">
          <p className="tech-label text-white/50">CASH FLOW SUMMARY</p>
          <dl className="mt-4 space-y-3 text-[14px]">
            {[
              ["Avg inflow", formatKes(Number(assessment.avg_monthly_inflow))],
              ["Avg outflow", formatKes(Number(assessment.avg_monthly_outflow))],
              [
                "Avg net",
                formatKes(Number(assessment.avg_monthly_net_cashflow)),
              ],
              ["Multiplier", `${assessment.multiplier}x`],
              [
                "Qualified limit",
                formatKes(Number(assessment.max_qualified_amount)),
              ],
              ["Status", assessment.qualification_status],
              ["Period days", String(assessment.statement_period_days)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-white/50">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="rounded-2xl border border-steel overflow-hidden">
        <div className="bg-cloud px-4 py-3">
          <p className="tech-label text-slate">MONTH-BY-MONTH BREAKDOWN</p>
        </div>
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-steel text-slate">
              <th className="px-4 py-2 font-medium">Month</th>
              <th className="px-4 py-2 font-medium">Inflow</th>
              <th className="px-4 py-2 font-medium">Outflow</th>
              <th className="px-4 py-2 font-medium">Net</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((row) => (
              <tr key={row.month} className="border-b border-steel last:border-0">
                <td className="px-4 py-2 font-mono">{row.month}</td>
                <td className="px-4 py-2">{formatKes(row.inflow)}</td>
                <td className="px-4 py-2">{formatKes(row.outflow)}</td>
                <td className="px-4 py-2 font-semibold">{formatKes(row.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="tech-label text-slate">RISK FLAGS</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {flags.length === 0 ? (
            <span className="text-[13px] text-slate">None</span>
          ) : (
            flags.map((flag) => (
              <span
                key={flag}
                className="rounded-full bg-cloud px-3 py-1 font-mono text-[12px] text-charcoal"
              >
                {flag}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-steel bg-paper p-5">
        <p className="tech-label text-slate">FOLLOW-UP</p>
        <label className="mt-4 block">
          <span className="text-[13px] font-medium text-charcoal">Status</span>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as LoanApplicationRow["status"])
            }
            className="mt-2 w-full rounded-xl border border-steel px-3 py-3 text-[14px] outline-none focus:border-ink"
          >
            {["NEW", "CONTACTED", "APPROVED", "REJECTED"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 block">
          <span className="text-[13px] font-medium text-charcoal">
            Customer Care Notes
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="mt-2 w-full rounded-xl border border-steel px-3 py-3 text-[14px] outline-none focus:border-ink"
          />
        </label>
        <div className="mt-4 flex items-center gap-3">
          <Button type="button" variant="graphite" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save updates"}
          </Button>
          {message ? (
            <span className="text-[13px] font-medium text-slate">{message}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
