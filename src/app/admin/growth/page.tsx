import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SearchBar } from "@/components/admin/SearchBar";
import { query } from "@/lib/db";
import { formatKes } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

type Row = {
  id: string;
  reference_code: string;
  kind: string;
  status: string;
  isp_name: string;
  contact_name: string;
  phone_number: string;
  county: string;
  active_subscribers: number;
  items: unknown[];
  financing: { amount?: number } | null;
  access_finance: boolean;
  created_at: Date;
};

export default async function AdminGrowthPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>;
}) {
  if (!(await requireAdmin())) redirect("/admin/login");

  const sp = await searchParams;
  const status = sp.status || "";
  const q = sp.q || "";
  const page = Math.max(1, Number(sp.page || 1));
  const limit = 20;
  const offset = (page - 1) * limit;

  const params: unknown[] = [];
  const clauses: string[] = [];

  if (
    status &&
    ["NEW", "CONTACTED", "APPROVED", "REJECTED"].includes(status)
  ) {
    params.push(status);
    clauses.push(`status = $${params.length}`);
  }

  if (q.trim()) {
    params.push(`%${q.trim()}%`);
    const i = params.length;
    clauses.push(
      `(reference_code ILIKE $${i} OR isp_name ILIKE $${i} OR contact_name ILIKE $${i} OR phone_number ILIKE $${i} OR email ILIKE $${i} OR county ILIKE $${i})`,
    );
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM growth_applications ${where}`,
    params,
  );

  const listParams = [...params, limit, offset];
  const list = await query<Row>(
    `SELECT id, reference_code, kind, status, isp_name, contact_name, phone_number,
            county, active_subscribers, items, financing, access_finance, created_at
     FROM growth_applications
     ${where}
     ORDER BY created_at DESC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams,
  );

  const total = Number(countResult.rows[0]?.count ?? 0);
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <AdminShell
      title="Growth Applications"
      subtitle="Infrastructure and billing-finance requests from the Growth console."
    >
      <Suspense fallback={null}>
        <SearchBar basePath="/admin/growth" />
      </Suspense>

      <div className="mt-4 flex flex-wrap gap-2">
        {["ALL", "NEW", "CONTACTED", "APPROVED", "REJECTED"].map((s) => {
          const active = (status || "ALL") === s;
          const href =
            s === "ALL"
              ? `/admin/growth${q ? `?q=${encodeURIComponent(q)}` : ""}`
              : `/admin/growth?status=${s}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
          return (
            <Link
              key={s}
              href={href}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${
                active ? "bg-siscom text-white" : "bg-cloud text-slate"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-steel bg-paper">
        <table className="min-w-full text-left text-[13px]">
          <thead className="border-b border-steel bg-cloud text-slate">
            <tr>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">ISP</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Finance</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {list.rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate"
                >
                  No growth applications yet.
                </td>
              </tr>
            ) : (
              list.rows.map((row) => {
                const itemCount = Array.isArray(row.items)
                  ? row.items.length
                  : 0;
                const amt =
                  row.financing && typeof row.financing.amount === "number"
                    ? row.financing.amount
                    : null;
                return (
                  <tr
                    key={row.id}
                    className="border-b border-steel/70 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/growth/${row.id}`}
                        className="font-mono font-semibold text-siscom hover:underline"
                      >
                        {row.reference_code}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-slate">
                        {row.kind.replace("_", " ")}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{row.isp_name}</p>
                      <p className="text-slate">
                        {row.contact_name} · {row.phone_number}
                      </p>
                      <p className="text-slate">
                        {row.county} · {row.active_subscribers} subs
                      </p>
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {itemCount}
                      {row.access_finance ? " · lease" : ""}
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {amt != null ? formatKes(amt) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-cloud px-2 py-1 text-[11px] font-medium text-charcoal">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {new Date(row.created_at).toLocaleString("en-KE")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 ? (
        <div className="mt-4 flex items-center justify-between text-[13px] text-slate">
          <span>
            Page {page} of {pages} · {total} total
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={`/admin/growth?page=${page - 1}${status ? `&status=${status}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className="rounded-full border border-steel px-3 py-1.5"
              >
                Previous
              </Link>
            ) : null}
            {page < pages ? (
              <Link
                href={`/admin/growth?page=${page + 1}${status ? `&status=${status}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className="rounded-full border border-steel px-3 py-1.5"
              >
                Next
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
