"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatKes } from "@/lib/format";

export type ApplicationListRow = {
  id: string;
  reference_code: string;
  isp_name: string;
  contact_name: string;
  phone_number: string;
  email: string | null;
  location: string;
  kra_pin: string;
  paybill_or_till: string | null;
  subscriber_band: string;
  requested_amount: string;
  status: string;
  created_at: string;
  avg_monthly_net_cashflow: string;
  max_qualified_amount: string;
  multiplier: string;
  qualification_status: string;
};

const STATUSES = ["ALL", "NEW", "CONTACTED", "APPROVED", "REJECTED"] as const;

export function ApplicationsTable({
  applications,
  total,
  page,
  status,
  basePath = "/admin/applications",
}: {
  applications: ApplicationListRow[];
  total: number;
  page: number;
  status: string;
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setStatus(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "ALL") params.delete("status");
    else params.set("status", next);
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  }

  function setPage(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (next <= 1) params.delete("page");
    else params.set("page", String(next));
    router.push(`${basePath}?${params.toString()}`);
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
                {s}
              </button>
            );
          })}
        </div>
        <a
          href={`/api/admin/export?type=applications${status && status !== "ALL" ? `&status=${status}` : ""}${searchParams.get("q") ? `&q=${encodeURIComponent(searchParams.get("q")!)}` : ""}`}
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
                "Reference",
                "ISP / Contact",
                "Phone",
                "County",
                "Net CF",
                "Limit",
                "Requested",
                "Qual.",
                "Status",
                "Submitted",
              ].map((h) => (
                <th key={h} className="px-3 py-3 font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-slate">
                  No applications yet.
                </td>
              </tr>
            ) : (
              applications.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-steel hover:bg-cloud/60"
                >
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/applications/${row.id}`}
                      className="font-mono font-semibold text-ink underline-offset-2 hover:underline"
                    >
                      {row.reference_code}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-ink">{row.isp_name}</div>
                    <div className="text-slate">{row.contact_name}</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {row.phone_number}
                  </td>
                  <td className="px-3 py-3">{row.location}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatKes(Number(row.avg_monthly_net_cashflow))}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatKes(Number(row.max_qualified_amount))}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatKes(Number(row.requested_amount))}
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-cloud px-2 py-0.5 text-[11px] font-semibold">
                      {row.qualification_status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-cloud px-2 py-0.5 text-[11px] font-semibold">
                      {row.status}
                    </span>
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
