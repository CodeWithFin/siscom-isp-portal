import { query } from "./db";
import type {
  AssessmentRow,
  LoanApplicationRow,
  PublicAssessment,
  ScoringResult,
} from "./types";

export function toPublicAssessment(row: AssessmentRow): PublicAssessment {
  return {
    id: row.id,
    statementPeriodDays: row.statement_period_days,
    avgMonthlyInflow: Number(row.avg_monthly_inflow),
    avgMonthlyOutflow: Number(row.avg_monthly_outflow),
    avgMonthlyNetCashflow: Number(row.avg_monthly_net_cashflow),
    multiplier: Number(row.multiplier),
    maxQualifiedAmount: Number(row.max_qualified_amount),
    qualificationStatus: row.qualification_status,
    monthlyBreakdown: row.monthly_breakdown,
    riskFlags: row.risk_flags,
    declineReasons: row.decline_reasons,
    isConverted: row.is_converted,
    expiresAt: new Date(row.expires_at).toISOString(),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function insertAssessment(input: {
  sessionTokenHash: string;
  statementSha256: string;
  scoring: ScoringResult;
}): Promise<AssessmentRow> {
  const { scoring } = input;
  const result = await query<AssessmentRow>(
    `INSERT INTO assessments (
      session_token_hash,
      statement_sha256,
      statement_period_days,
      avg_monthly_inflow,
      avg_monthly_outflow,
      avg_monthly_net_cashflow,
      multiplier,
      max_qualified_amount,
      qualification_status,
      monthly_breakdown,
      risk_flags,
      decline_reasons
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12::jsonb)
    RETURNING *`,
    [
      input.sessionTokenHash,
      input.statementSha256,
      scoring.statementPeriodDays,
      scoring.avgMonthlyInflow,
      scoring.avgMonthlyOutflow,
      scoring.avgMonthlyNetCashflow,
      scoring.multiplier,
      scoring.maxQualifiedAmount,
      scoring.qualificationStatus === "TAMPERED_REJECTED"
        ? "NOT_QUALIFIED"
        : scoring.qualificationStatus,
      JSON.stringify(scoring.monthlyBreakdown),
      JSON.stringify(
        scoring.qualificationStatus === "TAMPERED_REJECTED"
          ? [...scoring.riskFlags, "TAMPERED_REJECTED"]
          : scoring.riskFlags,
      ),
      JSON.stringify(
        scoring.qualificationStatus === "TAMPERED_REJECTED"
          ? scoring.declineReasons
          : scoring.declineReasons,
      ),
    ],
  );

  return result.rows[0];
}

export async function getAssessmentById(
  id: string,
): Promise<AssessmentRow | null> {
  const result = await query<AssessmentRow>(
    `SELECT * FROM assessments WHERE id = $1 LIMIT 1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function getApplicationByReference(
  referenceCode: string,
): Promise<LoanApplicationRow | null> {
  const result = await query<LoanApplicationRow>(
    `SELECT * FROM loan_applications WHERE reference_code = $1 LIMIT 1`,
    [referenceCode],
  );
  return result.rows[0] ?? null;
}
