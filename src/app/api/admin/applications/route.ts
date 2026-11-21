import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 20)));
    const offset = (page - 1) * limit;

    const params: unknown[] = [];
    let where = "";
    if (status && ["NEW", "CONTACTED", "APPROVED", "REJECTED"].includes(status)) {
      params.push(status);
      where = `WHERE la.status = $${params.length}`;
    }

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*)::text AS count
       FROM loan_applications la
       ${where}`,
      params,
    );

    params.push(limit, offset);
    const list = await query(
      `SELECT
         la.id,
         la.reference_code,
         la.isp_name,
         la.contact_name,
         la.phone_number,
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
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    return NextResponse.json({
      applications: list.rows,
      page,
      limit,
      total: Number(countResult.rows[0]?.count ?? 0),
    });
  } catch (err) {
    console.error("[admin/applications]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
