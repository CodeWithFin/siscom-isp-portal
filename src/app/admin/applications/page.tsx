import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  ApplicationsTable,
  type ApplicationListRow,
} from "@/components/admin/ApplicationsTable";
import { SearchBar } from "@/components/admin/SearchBar";
import { buildApplicationWhere } from "@/lib/admin-queries";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminApplicationsPage({
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

  const { where, params } = buildApplicationWhere({ status, q });
  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM loan_applications la ${where}`,
    params,
  );

  const listParams = [...params, limit, offset];
  const list = await query(
    `SELECT
       la.id,
       la.reference_code,
       la.isp_name,
       la.contact_name,
       la.phone_number,
       la.email,
       la.location,
       la.kra_pin,
       la.paybill_or_till,
       la.subscriber_band,
       la.requested_amount,
       la.status,
       la.created_at,
       a.avg_monthly_net_cashflow,
       a.max_qualified_amount,
       a.multiplier,
       a.qualification_status
     FROM loan_applications la
     JOIN assessments a ON a.id = la.assessment_id
     ${where}
     ORDER BY la.created_at DESC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams,
  );

  return (
    <AdminShell
      title="Loan Applications"
      subtitle="Full KYC, request amount, and scoring for every submitted ISP."
    >
      <Suspense fallback={null}>
        <SearchBar basePath="/admin/applications" />
      </Suspense>
      <div className="mt-6">
        <Suspense fallback={<p className="text-slate">Loading…</p>}>
          <ApplicationsTable
            applications={list.rows as ApplicationListRow[]}
            total={Number(countResult.rows[0]?.count ?? 0)}
            page={page}
            status={status || "ALL"}
          />
        </Suspense>
      </div>
    </AdminShell>
  );
}
