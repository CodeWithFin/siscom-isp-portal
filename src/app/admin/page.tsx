import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { formatKes } from "@/lib/format";
import { getAdminStats } from "@/lib/admin-queries";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminOverviewPage() {
  if (!(await requireAdmin())) redirect("/admin/login");

  const stats = await getAdminStats();

  const recentApps = await query<{
    id: string;
    reference_code: string;
    isp_name: string;
    phone_number: string;
    requested_amount: string;
    status: string;
    created_at: string;
    max_qualified_amount: string;
  }>(
    `SELECT
       la.id,
       la.reference_code,
       la.isp_name,
       la.phone_number,
       la.requested_amount,
       la.status,
       la.created_at,
       a.max_qualified_amount
     FROM loan_applications la
     JOIN assessments a ON a.id = la.assessment_id
     ORDER BY la.created_at DESC
     LIMIT 8`,
  );

  const recentAssessments = await query<{
    id: string;
    qualification_status: string;
    max_qualified_amount: string;
    avg_monthly_net_cashflow: string;
    is_converted: boolean;
    created_at: string;
  }>(
    `SELECT
       id,
       qualification_status,
       max_qualified_amount,
       avg_monthly_net_cashflow,
       is_converted,
       created_at
     FROM assessments
     ORDER BY created_at DESC
     LIMIT 8`,
  );

  return (
    <AdminShell
      title="Admin Dashboard"
      subtitle="Capture every statement check and loan application in one place."
    >
      <DashboardStats stats={stats} />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-steel bg-paper overflow-hidden">
          <div className="flex items-center justify-between border-b border-steel px-4 py-3">
            <p className="tech-label text-slate">RECENT APPLICATIONS</p>
            <Link
              href="/admin/applications"
              className="text-[13px] font-semibold text-siscom hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-steel">
            {recentApps.rows.length === 0 ? (
              <li className="px-4 py-8 text-center text-[13px] text-slate">
                No applications yet.
              </li>
            ) : (
              recentApps.rows.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/admin/applications/${row.id}`}
                    className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-cloud/70"
                  >
                    <div>
                      <p className="font-medium text-ink">{row.isp_name}</p>
                      <p className="mt-0.5 font-mono text-[12px] text-slate">
                        {row.reference_code} · {row.phone_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-ink">
                        {formatKes(Number(row.requested_amount))}
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold text-slate">
                        {row.status}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-steel bg-paper overflow-hidden">
          <div className="flex items-center justify-between border-b border-steel px-4 py-3">
            <p className="tech-label text-slate">RECENT ASSESSMENTS</p>
            <Link
              href="/admin/assessments"
              className="text-[13px] font-semibold text-siscom hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-steel">
            {recentAssessments.rows.length === 0 ? (
              <li className="px-4 py-8 text-center text-[13px] text-slate">
                No assessments yet.
              </li>
            ) : (
              recentAssessments.rows.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/admin/assessments/${row.id}`}
                    className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-cloud/70"
                  >
                    <div>
                      <p className="font-mono text-[13px] font-medium text-ink">
                        {row.id.slice(0, 8)}…
                      </p>
                      <p className="mt-0.5 text-[12px] text-slate">
                        Net {formatKes(Number(row.avg_monthly_net_cashflow))}
                        {row.is_converted ? " · converted" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-ink">
                        {formatKes(Number(row.max_qualified_amount))}
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold text-slate">
                        {row.qualification_status}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
