import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AssessmentsTable,
  type AssessmentListRow,
} from "@/components/admin/AssessmentsTable";
import { SearchBar } from "@/components/admin/SearchBar";
import { buildAssessmentWhere } from "@/lib/admin-queries";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminAssessmentsPage({
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

  const { where, params } = buildAssessmentWhere({ status, q });
  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM assessments a
     LEFT JOIN loan_applications la ON la.assessment_id = a.id
     ${where}`,
    params,
  );

  const listParams = [...params, limit, offset];
  const list = await query(
    `SELECT
       a.id,
       a.qualification_status,
       a.avg_monthly_inflow,
       a.avg_monthly_outflow,
       a.avg_monthly_net_cashflow,
       a.multiplier,
       a.max_qualified_amount,
       a.statement_period_days,
       a.is_converted,
       a.expires_at,
       a.created_at,
       a.risk_flags,
       la.reference_code,
       la.isp_name,
       la.phone_number
     FROM assessments a
     LEFT JOIN loan_applications la ON la.assessment_id = a.id
     ${where}
     ORDER BY a.created_at DESC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams,
  );

  return (
    <AdminShell
      title="Assessments"
      subtitle="Every M-Pesa statement check — including leads that never applied."
    >
      <Suspense fallback={null}>
        <SearchBar
          basePath="/admin/assessments"
          placeholder="Search assessment ID, ISP, phone, reference…"
        />
      </Suspense>
      <div className="mt-6">
        <Suspense fallback={<p className="text-slate">Loading…</p>}>
          <AssessmentsTable
            assessments={list.rows as AssessmentListRow[]}
            total={Number(countResult.rows[0]?.count ?? 0)}
            page={page}
            status={status || "ALL"}
          />
        </Suspense>
      </div>
    </AdminShell>
  );
}
