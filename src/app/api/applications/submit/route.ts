import { NextResponse } from "next/server";
import { z } from "zod";
import { getAssessmentById } from "@/lib/assessments";
import { generateReferenceCode, normalizeKenyanPhone } from "@/lib/format";
import { notifyCustomerCare } from "@/lib/notifications";
import { getAssessmentCookie, hashToken, safeEqual } from "@/lib/session";
import type { LoanApplicationRow } from "@/lib/types";

export const runtime = "nodejs";

const bodySchema = z.object({
  assessmentId: z.string().uuid(),
  ispName: z.string().min(2).max(255),
  contactName: z.string().min(2).max(255),
  phoneNumber: z.string().min(9).max(30),
  email: z.string().email().optional().or(z.literal("")),
  location: z.string().min(2).max(120),
  kraPin: z.string().min(5).max(50),
  paybillOrTill: z.string().max(50).optional().or(z.literal("")),
  subscriberBand: z.enum(["< 50", "50 – 200", "201 – 500", "500+"]),
  requestedAmount: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const token = await getAssessmentCookie();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const phone = normalizeKenyanPhone(data.phoneNumber);
    if (!phone) {
      return NextResponse.json(
        { error: "Phone must be a valid Kenyan number (+254...)." },
        { status: 400 },
      );
    }

    const assessment = await getAssessmentById(data.assessmentId);
    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    if (!safeEqual(assessment.session_token_hash, hashToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (assessment.is_converted) {
      return NextResponse.json(
        { error: "This assessment already has a submitted application." },
        { status: 409 },
      );
    }

    if (
      assessment.qualification_status !== "QUALIFIED" &&
      assessment.qualification_status !== "MANUAL_REVIEW"
    ) {
      return NextResponse.json(
        { error: "Assessment is not eligible for application." },
        { status: 400 },
      );
    }

    const maxAmount = Number(assessment.max_qualified_amount);
    if (data.requestedAmount > maxAmount) {
      return NextResponse.json(
        { error: `Requested amount cannot exceed KES ${maxAmount}` },
        { status: 400 },
      );
    }

    if (data.requestedAmount < 20_000) {
      return NextResponse.json(
        { error: "Minimum loan amount is KES 20,000" },
        { status: 400 },
      );
    }

    const client = await (await import("@/lib/db")).getPool().connect();
    let application: LoanApplicationRow;

    try {
      await client.query("BEGIN");

      let referenceCode = generateReferenceCode();
      for (let i = 0; i < 5; i += 1) {
        const existing = await client.query(
          `SELECT 1 FROM loan_applications WHERE reference_code = $1`,
          [referenceCode],
        );
        if (existing.rowCount === 0) break;
        referenceCode = generateReferenceCode();
      }

      const insert = await client.query<LoanApplicationRow>(
        `INSERT INTO loan_applications (
          reference_code, assessment_id, isp_name, contact_name, phone_number,
          email, location, kra_pin, paybill_or_till, subscriber_band, requested_amount
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *`,
        [
          referenceCode,
          assessment.id,
          data.ispName.trim(),
          data.contactName.trim(),
          phone,
          data.email?.trim() || null,
          data.location.trim(),
          data.kraPin.trim().toUpperCase(),
          data.paybillOrTill?.trim() || null,
          data.subscriberBand,
          data.requestedAmount,
        ],
      );

      await client.query(
        `UPDATE assessments SET is_converted = TRUE WHERE id = $1`,
        [assessment.id],
      );

      await client.query("COMMIT");
      application = insert.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    await notifyCustomerCare({
      referenceCode: application.reference_code,
      ispName: application.isp_name,
      contactName: application.contact_name,
      phoneNumber: application.phone_number,
      requestedAmount: Number(application.requested_amount),
      maxQualifiedAmount: maxAmount,
    });

    return NextResponse.json({
      referenceCode: application.reference_code,
      applicationId: application.id,
    });
  } catch (err) {
    console.error("[applications/submit]", err);
    return NextResponse.json(
      { error: "Could not submit application. Please try again." },
      { status: 500 },
    );
  }
}
