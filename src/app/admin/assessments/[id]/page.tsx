import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AssessmentDetail } from "@/components/admin/AssessmentDetail";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import type { AssessmentRow, LoanApplicationRow } from "@/lib/types";

export default async function AdminAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await requireAdmin())) redirect("/admin/login");

  const { id } = await params;
  const assessmentResult = await query<AssessmentRow>(
    `SELECT * FROM assessments WHERE id = $1 LIMIT 1`,
    [id],
  );
  const assessment = assessmentResult.rows[0];
  if (!assessment) notFound();

  const appResult = await query<LoanApplicationRow>(
    `SELECT * FROM loan_applications WHERE assessment_id = $1 LIMIT 1`,
    [id],
  );

  return (
    <AdminShell title="Assessment detail">
      <AssessmentDetail
        assessment={assessment}
        application={appResult.rows[0] ?? null}
      />
    </AdminShell>
  );
}
