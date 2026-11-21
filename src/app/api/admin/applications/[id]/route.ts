import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import type { AssessmentRow, LoanApplicationRow } from "@/lib/types";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "APPROVED", "REJECTED"]).optional(),
  customerCareNotes: z.string().max(5000).optional(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const appResult = await query<LoanApplicationRow>(
      `SELECT * FROM loan_applications WHERE id = $1 LIMIT 1`,
      [id],
    );
    const application = appResult.rows[0];
    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const assessmentResult = await query<AssessmentRow>(
      `SELECT * FROM assessments WHERE id = $1 LIMIT 1`,
      [application.assessment_id],
    );

    return NextResponse.json({
      application,
      assessment: assessmentResult.rows[0] ?? null,
    });
  } catch (err) {
    console.error("[admin/applications/get]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { status, customerCareNotes } = parsed.data;
    const result = await query<LoanApplicationRow>(
      `UPDATE loan_applications
       SET
         status = COALESCE($2, status),
         customer_care_notes = COALESCE($3, customer_care_notes),
         updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, status ?? null, customerCareNotes ?? null],
    );

    if (!result.rows[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ application: result.rows[0] });
  } catch (err) {
    console.error("[admin/applications/patch]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
