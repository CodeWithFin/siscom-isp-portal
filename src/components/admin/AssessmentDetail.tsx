import Link from "next/link";
import { formatKes } from "@/lib/format";
import type { AssessmentRow, LoanApplicationRow } from "@/lib/types";
import { Button } from "../ui/Button";

export function AssessmentDetail({
  assessment,
  application,
}: {
  assessment: AssessmentRow;
  application: LoanApplicationRow | null;
}) {
  const breakdown = assessment.monthly_breakdown || [];
  const flags = assessment.risk_flags || [];
  const declines = assessment.decline_reasons || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="tech-label text-slate">ASSESSMENT</p>
          <h1 className="feature-heading mt-1 font-mono text-[22px]">
            {assessment.id}
          </h1>
          <p className="mt-2 text-[14px] text-slate">
            Created {new Date(assessment.created_at).toLocaleString("en-KE")} ·
            Expires {new Date(assessment.expires_at).toLocaleString("en-KE")}
          </p>
        </div>
        <Button href="/admin/assessments" variant="outline">
          Back to assessments
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-navy-mid p-5 text-paper shadow-[var(--shadow-graphite-card)]">
          <p className="tech-label text-white/50">SCORE SUMMARY</p>
          <dl className="mt-4 space-y-3 text-[14px]">
            {[
              ["Status", assessment.qualification_status],
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
              ["Period days", String(assessment.statement_period_days)],
              ["Converted", assessment.is_converted ? "Yes" : "No"],
              ["Statement SHA-256", assessment.statement_sha256.slice(0, 16) + "…"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-white/50">{k}</dt>
                <dd className="font-medium text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-steel bg-paper p-5">
          <p className="tech-label text-slate">LINKED APPLICATION</p>
          {application ? (
            <dl className="mt-4 space-y-3 text-[14px]">
              {[
                ["Reference", application.reference_code],
                ["ISP", application.isp_name],
                ["Contact", application.contact_name],
                ["Phone", application.phone_number],
                ["Email", application.email || "—"],
                ["County", application.location],
                ["KRA PIN", application.kra_pin],
                ["Paybill/Till", application.paybill_or_till || "—"],
                ["Subscribers", application.subscriber_band],
                ["Requested", formatKes(Number(application.requested_amount))],
                ["Status", application.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-slate">{k}</dt>
                  <dd className="font-medium text-ink text-right">{v}</dd>
                </div>
              ))}
              <div className="pt-2">
                <Link
                  href={`/admin/applications/${application.id}`}
                  className="text-[13px] font-semibold text-siscom underline-offset-2 hover:underline"
                >
                  Open full application →
                </Link>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-[14px] text-slate">
              No loan application submitted yet. This is a score-only lead.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-steel overflow-hidden bg-paper">
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

      <div className="grid gap-4 md:grid-cols-2">
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
        <div>
          <p className="tech-label text-slate">DECLINE REASONS</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {declines.length === 0 ? (
              <span className="text-[13px] text-slate">None</span>
            ) : (
              declines.map((reason) => (
                <span
                  key={reason}
                  className="rounded-full bg-siscom-soft px-3 py-1 text-[12px] text-siscom-deeper"
                >
                  {reason}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
