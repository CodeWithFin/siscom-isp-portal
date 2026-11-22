import { NextResponse } from "next/server";
import {
  buildApplicationWhere,
  buildAssessmentWhere,
} from "@/lib/admin-queries";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const runtime = "nodejs";

function csvEscape(value: unknown): string {
  const raw = value == null ? "" : String(value);
  if (/[",\n\r]/.test(raw)) return `"${raw.replaceAll('"', '""')}"`;
  return raw;
}

function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ];
  return `${lines.join("\n")}\n`;
}

export async function GET(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "applications";
    const status = searchParams.get("status") || undefined;
    const q = searchParams.get("q") || undefined;

    if (type === "assessments") {
      const { where, params } = buildAssessmentWhere({ status, q });
      const result = await query(
        `SELECT
           a.id AS assessment_id,
           a.qualification_status,
           a.avg_monthly_inflow,
           a.avg_monthly_outflow,
           a.avg_monthly_net_cashflow,
           a.multiplier,
           a.max_qualified_amount,
           a.statement_period_days,
           a.is_converted,
           a.risk_flags,
           a.decline_reasons,
           a.created_at,
           a.expires_at,
           la.reference_code,
           la.isp_name,
           la.phone_number
         FROM assessments a
         LEFT JOIN loan_applications la ON la.assessment_id = a.id
         ${where}
         ORDER BY a.created_at DESC
         LIMIT 5000`,
        params,
      );

      const headers = [
        "assessment_id",
        "qualification_status",
        "avg_monthly_inflow",
        "avg_monthly_outflow",
        "avg_monthly_net_cashflow",
        "multiplier",
        "max_qualified_amount",
        "statement_period_days",
        "is_converted",
        "risk_flags",
        "decline_reasons",
        "created_at",
        "expires_at",
        "reference_code",
        "isp_name",
        "phone_number",
      ];

      const rows = result.rows.map((row) =>
        headers.map((h) => {
          const value = (row as Record<string, unknown>)[h];
          if (Array.isArray(value)) return value.join("|");
          return value;
        }),
      );

      return new NextResponse(toCsv(headers, rows), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="siscom-assessments.csv"',
        },
      });
    }

    const { where, params } = buildApplicationWhere({ status, q });
    const result = await query(
      `SELECT
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
         la.customer_care_notes,
         la.created_at,
         a.qualification_status,
         a.avg_monthly_inflow,
         a.avg_monthly_outflow,
         a.avg_monthly_net_cashflow,
         a.multiplier,
         a.max_qualified_amount,
         a.statement_period_days,
         a.risk_flags
       FROM loan_applications la
       JOIN assessments a ON a.id = la.assessment_id
       ${where}
       ORDER BY la.created_at DESC
       LIMIT 5000`,
      params,
    );

    const headers = [
      "reference_code",
      "isp_name",
      "contact_name",
      "phone_number",
      "email",
      "location",
      "kra_pin",
      "paybill_or_till",
      "subscriber_band",
      "requested_amount",
      "status",
      "customer_care_notes",
      "created_at",
      "qualification_status",
      "avg_monthly_inflow",
      "avg_monthly_outflow",
      "avg_monthly_net_cashflow",
      "multiplier",
      "max_qualified_amount",
      "statement_period_days",
      "risk_flags",
    ];

    const rows = result.rows.map((row) =>
      headers.map((h) => {
        const value = (row as Record<string, unknown>)[h];
        if (Array.isArray(value)) return value.join("|");
        return value;
      }),
    );

    return new NextResponse(toCsv(headers, rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="siscom-applications.csv"',
      },
    });
  } catch (err) {
    console.error("[admin/export]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
