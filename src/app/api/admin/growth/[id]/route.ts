import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const runtime = "nodejs";

const bodySchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "APPROVED", "REJECTED"]),
  customerCareNotes: z.string().max(5000).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const result = await query(
      `UPDATE growth_applications
       SET status = $1,
           customer_care_notes = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING id`,
      [
        parsed.data.status,
        parsed.data.customerCareNotes?.trim() || null,
        id,
      ],
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/growth PATCH]", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
