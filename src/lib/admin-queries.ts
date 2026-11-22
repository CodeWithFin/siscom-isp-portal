import { query } from "@/lib/db";

export async function getAdminStats() {
  const [assessments, applications, money] = await Promise.all([
    query<{
      total: string;
      qualified: string;
      manual: string;
      rejected: string;
      converted: string;
    }>(
      `SELECT
         COUNT(*)::text AS total,
         COUNT(*) FILTER (WHERE qualification_status = 'QUALIFIED')::text AS qualified,
         COUNT(*) FILTER (WHERE qualification_status = 'MANUAL_REVIEW')::text AS manual,
         COUNT(*) FILTER (WHERE qualification_status IN ('NOT_QUALIFIED','TAMPERED_REJECTED'))::text AS rejected,
         COUNT(*) FILTER (WHERE is_converted = TRUE)::text AS converted
       FROM assessments`,
    ),
    query<{
      total: string;
      new_count: string;
      contacted: string;
      approved: string;
      rejected: string;
    }>(
      `SELECT
         COUNT(*)::text AS total,
         COUNT(*) FILTER (WHERE status = 'NEW')::text AS new_count,
         COUNT(*) FILTER (WHERE status = 'CONTACTED')::text AS contacted,
         COUNT(*) FILTER (WHERE status = 'APPROVED')::text AS approved,
         COUNT(*) FILTER (WHERE status = 'REJECTED')::text AS rejected
       FROM loan_applications`,
    ),
    query<{ requested_sum: string; qualified_sum: string }>(
      `SELECT
         COALESCE(SUM(la.requested_amount), 0)::text AS requested_sum,
         COALESCE(SUM(a.max_qualified_amount), 0)::text AS qualified_sum
       FROM loan_applications la
       JOIN assessments a ON a.id = la.assessment_id`,
    ),
  ]);

  const a = assessments.rows[0];
  const app = applications.rows[0];
  const m = money.rows[0];

  return {
    assessmentsTotal: Number(a?.total ?? 0),
    assessmentsQualified: Number(a?.qualified ?? 0),
    assessmentsManual: Number(a?.manual ?? 0),
    assessmentsRejected: Number(a?.rejected ?? 0),
    applicationsTotal: Number(app?.total ?? 0),
    applicationsNew: Number(app?.new_count ?? 0),
    applicationsContacted: Number(app?.contacted ?? 0),
    applicationsApproved: Number(app?.approved ?? 0),
    applicationsRejected: Number(app?.rejected ?? 0),
    converted: Number(a?.converted ?? 0),
    requestedSum: Number(m?.requested_sum ?? 0),
    qualifiedSum: Number(m?.qualified_sum ?? 0),
  };
}

export function buildApplicationWhere(opts: {
  status?: string;
  q?: string;
}) {
  const params: unknown[] = [];
  const clauses: string[] = [];

  if (
    opts.status &&
    ["NEW", "CONTACTED", "APPROVED", "REJECTED"].includes(opts.status)
  ) {
    params.push(opts.status);
    clauses.push(`la.status = $${params.length}`);
  }

  if (opts.q?.trim()) {
    params.push(`%${opts.q.trim()}%`);
    const i = params.length;
    clauses.push(
      `(la.reference_code ILIKE $${i}
        OR la.isp_name ILIKE $${i}
        OR la.contact_name ILIKE $${i}
        OR la.phone_number ILIKE $${i}
        OR COALESCE(la.email, '') ILIKE $${i}
        OR la.kra_pin ILIKE $${i}
        OR COALESCE(la.paybill_or_till, '') ILIKE $${i}
        OR la.location ILIKE $${i})`,
    );
  }

  return {
    where: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

export function buildAssessmentWhere(opts: {
  status?: string;
  q?: string;
}) {
  const params: unknown[] = [];
  const clauses: string[] = [];

  if (
    opts.status &&
    [
      "QUALIFIED",
      "MANUAL_REVIEW",
      "NOT_QUALIFIED",
      "TAMPERED_REJECTED",
    ].includes(opts.status)
  ) {
    params.push(opts.status);
    clauses.push(`a.qualification_status = $${params.length}`);
  }

  if (opts.q?.trim()) {
    params.push(`%${opts.q.trim()}%`);
    const i = params.length;
    clauses.push(
      `(a.id::text ILIKE $${i}
        OR COALESCE(la.reference_code, '') ILIKE $${i}
        OR COALESCE(la.isp_name, '') ILIKE $${i}
        OR COALESCE(la.phone_number, '') ILIKE $${i})`,
    );
  }

  return {
    where: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}
