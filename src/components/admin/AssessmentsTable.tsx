"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatKes } from "@/lib/format";

export type AssessmentListRow = {
  id: string;
  qualification_status: string;
  avg_monthly_inflow: string;
  avg_monthly_outflow: string;
  avg_monthly_net_cashflow: string;
  multiplier: string;
  max_qualified_amount: string;
  statement_period_days: number;
  is_converted: boolean;
  expires_at: string;
  created_at: string;
  risk_flags: string[] | string;
  reference_code: string | null;
  isp_name: string | null;
  phone_number: string | null;
};

const STATUSES = [
  "ALL",
  "QUALIFIED",
  "MANUAL_REVIEW",
  "NOT_QUALIFIED",
  "TAMPERED_REJECTED",
] as const;

export function AssessmentsTable({
  assessments,
  total,
  page,
  status,
}: {
  assessments: AssessmentListRow[];
  total: number;
  page: number;
  status: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setStatus(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "ALL") params.delete("status");
    else params.set("status", next);
    params.delete("page");
    router.push(`/admin/assessments?${params.toString()}`);
  }

  function setPage(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (next <= 1) params.delete("page");
    else params.set("page", String(next));
    router.push(`/admin/assessments?${params.toString()}`);
  }

  const pages = Math.max(1, Math.ceil(total / 20));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => {
            const active = (status || "ALL") === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${
                  active
                    ? "bg-siscom text-white"
                    : "bg-paper text-slate hover:text-ink"
                }`}
              >
                {s.replaceAll("_", " ")}
              </button>
            );
          })}
        </div>
        <a
          href={`/api/admin/export?type=assessments${status && status !== "ALL" ? `&status=${status}` : ""}`}
          className="rounded-full border border-steel bg-paper px-3 py-1.5 text-[13px] font-medium text-ink hover:border-ink"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-steel bg-paper">
        <table className="min-w-full text-left text-[13px]">
          <thead className="bg-cloud text-slate">
            <tr>
              {[
                "Assessment",
                "Status",
                "Net CF",
                "Multiplier",
                "Limit",
                "Days",
                "Converted",
                "Created",
              ].map((h) => (
                <th key={h} className="px-3 py-3 font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assessments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-slate">
                  No assessments yet.
                </td>
              </tr>
            ) : (
              assessments.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-steel hover:bg-cloud/60"
                >
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/assessments/${row.id}`}
                      className="font-mono text-[12px] font-semibold text-ink underline-offset-2 hover:underline"
                    >
                      {row.id.slice(0, 8)}…
                    </Link>
                    {row.isp_name ? (
                      <div className="mt-1 text-slate">
                        {row.isp_name}
                        {row.reference_code ? ` · ${row.reference_code}` : ""}
                      </div>
                    ) : (
                      <div className="mt-1 text-slate">Score-only lead</div>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-cloud px-2 py-0.5 text-[11px] font-semibold">
                      {row.qualification_status}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatKes(Number(row.avg_monthly_net_cashflow))}
                  </td>
                  <td className="px-3 py-3">{row.multiplier}×</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatKes(Number(row.max_qualified_amount))}
                  </td>
                  <td className="px-3 py-3">{row.statement_period_days}</td>
                  <td className="px-3 py-3">
                    {row.is_converted ? (
                      <span className="font-medium text-siscom">Yes</span>
                    ) : (
                      <span className="text-slate">No</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-slate whitespace-nowrap">
                    {new Date(row.created_at).toLocaleString("en-KE")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[13px] text-slate">
        <p>
          Page {page} of {pages} · {total} total
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full border border-steel bg-paper px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
            className="rounded-full border border-steel bg-paper px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
