import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ApplicationDetail } from "@/components/admin/ApplicationDetail";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import type { AssessmentRow, LoanApplicationRow } from "@/lib/types";

export default async function AdminApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await requireAdmin())) redirect("/admin/login");

  const { id } = await params;
  const appResult = await query<LoanApplicationRow>(
    `SELECT * FROM loan_applications WHERE id = $1 LIMIT 1`,
    [id],
  );
  const application = appResult.rows[0];
  if (!application) notFound();

  const assessmentResult = await query<AssessmentRow>(
    `SELECT * FROM assessments WHERE id = $1 LIMIT 1`,
    [application.assessment_id],
  );
  const assessment = assessmentResult.rows[0];
  if (!assessment) notFound();

  return (
    <AdminShell title="Application detail">
      <ApplicationDetail application={application} assessment={assessment} />
    </AdminShell>
  );
}
