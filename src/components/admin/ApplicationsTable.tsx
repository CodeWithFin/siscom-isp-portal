"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatKes } from "@/lib/format";

type Row = {
  id: string;
  reference_code: string;
  isp_name: string;
  phone_number: string;
  requested_amount: string;
  status: string;
  created_at: string;
  avg_monthly_net_cashflow: string;
  max_qualified_amount: string;
};

const STATUSES = ["ALL", "NEW", "CONTACTED", "APPROVED", "REJECTED"] as const;

export function ApplicationsTable({
  applications,
  total,
  page,
  status,
}: {
  applications: Row[];
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
    router.push(`/admin?${params.toString()}`);
  }

  return (
    <div>
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
                  : "bg-cloud text-slate hover:text-ink"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-steel">
        <table className="min-w-full text-left text-[13px]">
          <thead className="bg-cloud text-slate">
            <tr>
              {[
                "Reference",
                "ISP",
                "Phone",
                "Avg Net CF",
                "Limit",
                "Requested",
                "Status",
                "Submitted",
              ].map((h) => (
                <th key={h} className="px-3 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-slate">
                  No applications yet.
                </td>
              </tr>
            ) : (
              applications.map((row) => (
                <tr key={row.id} className="border-t border-steel hover:bg-cloud/60">
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/applications/${row.id}`}
                      className="font-mono font-semibold text-ink underline-offset-2 hover:underline"
                    >
                      {row.reference_code}
                    </Link>
                  </td>
                  <td className="px-3 py-3 font-medium">{row.isp_name}</td>
                  <td className="px-3 py-3">{row.phone_number}</td>
                  <td className="px-3 py-3">
                    {formatKes(Number(row.avg_monthly_net_cashflow))}
                  </td>
                  <td className="px-3 py-3">
                    {formatKes(Number(row.max_qualified_amount))}
                  </td>
                  <td className="px-3 py-3">
                    {formatKes(Number(row.requested_amount))}
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-cloud px-2 py-0.5 text-[11px] font-semibold">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate">
                    {new Date(row.created_at).toLocaleString("en-KE")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[13px] text-slate">
        Showing page {page} · {total} total
      </p>
    </div>
  );
}
