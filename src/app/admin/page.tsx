import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { Button } from "@/components/ui/Button";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  if (!(await requireAdmin())) redirect("/admin/login");

  const sp = await searchParams;
  const status = sp.status || "";
  const page = Math.max(1, Number(sp.page || 1));
  const limit = 20;
  const offset = (page - 1) * limit;

  const params: unknown[] = [];
  let where = "";
  if (["NEW", "CONTACTED", "APPROVED", "REJECTED"].includes(status)) {
    params.push(status);
    where = `WHERE la.status = $${params.length}`;
  }

  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM loan_applications la ${where}`,
    params,
  );

  params.push(limit, offset);
  const list = await query(
    `SELECT
       la.id,
       la.reference_code,
       la.isp_name,
       la.phone_number,
       la.requested_amount,
       la.status,
       la.created_at,
       a.avg_monthly_net_cashflow,
       a.max_qualified_amount
     FROM loan_applications la
     JOIN assessments a ON a.id = la.assessment_id
     ${where}
     ORDER BY la.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-steel">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="tech-label text-slate">SISCOM INTERNAL</p>
            <h1 className="feature-heading">Loan Applications</h1>
          </div>
          <Button href="/" variant="ghost">
            Public site
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Suspense fallback={<p className="text-slate">Loading…</p>}>
          <ApplicationsTable
            applications={list.rows as never}
            total={Number(countResult.rows[0]?.count ?? 0)}
            page={page}
            status={status || "ALL"}
          />
        </Suspense>
      </div>
    </main>
  );
}
