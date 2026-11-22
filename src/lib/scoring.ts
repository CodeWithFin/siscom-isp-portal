import type {
  MonthlyBreakdown,
  MpesaTransaction,
  ScoringResult,
} from "./types";

const MIN_LOAN = 20_000;
const CONTINUITY_TOLERANCE = 1; // KES rounding

function monthKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function verifyBalanceContinuity(
  transactions: MpesaTransaction[],
): { failedRows: number; ok: boolean; ratio: number } {
  if (transactions.length < 2) {
    return { failedRows: 0, ok: true, ratio: 0 };
  }

  let failed = 0;
  const checks = transactions.length - 1;
  for (let i = 1; i < transactions.length; i += 1) {
    const prev = transactions[i - 1];
    const curr = transactions[i];
    const expected = prev.balance + curr.paidIn - curr.withdrawn;
    if (Math.abs(expected - curr.balance) > CONTINUITY_TOLERANCE) {
      failed += 1;
    }
  }

  const ratio = failed / checks;
  // Allow a small absolute + percentage slack for PDF parse noise
  const maxAllowed = Math.max(5, Math.ceil(checks * 0.03));
  return { failedRows: failed, ok: failed <= maxAllowed, ratio };
}

function aggregateMonthly(transactions: MpesaTransaction[]): MonthlyBreakdown[] {
  const map = new Map<string, MonthlyBreakdown>();

  for (const tx of transactions) {
    const key = monthKey(tx.timestamp);
    const existing = map.get(key) ?? {
      month: key,
      inflow: 0,
      outflow: 0,
      net: 0,
    };
    existing.inflow += tx.paidIn;
    existing.outflow += tx.withdrawn;
    existing.net = existing.inflow - existing.outflow;
    map.set(key, existing);
  }

  return Array.from(map.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((row) => ({
      month: row.month,
      inflow: round2(row.inflow),
      outflow: round2(row.outflow),
      net: round2(row.net),
    }));
}

function countFuliza(transactions: MpesaTransaction[]): number {
  return transactions.filter((tx) =>
    /fuliza|overdraft/i.test(tx.details),
  ).length;
}

function estimateUniqueCustomerInflows(
  transactions: MpesaTransaction[],
): number {
  const phones = new Set<string>();
  for (const tx of transactions) {
    if (tx.paidIn <= 0) continue;
    const match = tx.details.match(/254\d{9}|\b07\d{8}\b|\b01\d{8}\b/);
    if (match) phones.add(match[0]);
  }
  return phones.size;
}

export function scoreTransactions(
  transactions: MpesaTransaction[],
): ScoringResult {
  const riskFlags: string[] = [];
  const declineReasons: string[] = [];

  if (transactions.length === 0) {
    return {
      statementPeriodDays: 0,
      avgMonthlyInflow: 0,
      avgMonthlyOutflow: 0,
      avgMonthlyNetCashflow: 0,
      multiplier: 0,
      maxQualifiedAmount: 0,
      qualificationStatus: "NOT_QUALIFIED",
      monthlyBreakdown: [],
      riskFlags: ["NO_TRANSACTIONS_PARSED"],
      declineReasons: [
        "We could not extract transactions from the uploaded statement.",
      ],
    };
  }

  // Balance continuity is a risk signal only — never hard-zero a score.
  // PDF extraction often misreads the Balance column on Till/Paybill layouts
  // while Paid In / Withdrawn (cash-flow) remain usable.
  const continuity = verifyBalanceContinuity(transactions);
  const continuityUnreliable = !continuity.ok && continuity.ratio > 0.15;
  if (continuityUnreliable) {
    riskFlags.push(`BALANCE_CONTINUITY_FAILED:${continuity.failedRows}`);
  } else if (!continuity.ok) {
    riskFlags.push(`BALANCE_CONTINUITY_WARN:${continuity.failedRows}`);
  } else if (continuity.failedRows > 0) {
    riskFlags.push(`BALANCE_CONTINUITY_MINOR:${continuity.failedRows}`);
  }

  const first = transactions[0].timestamp;
  const last = transactions[transactions.length - 1].timestamp;
  const periodDays = Math.max(
    1,
    Math.round((last.getTime() - first.getTime()) / (24 * 60 * 60 * 1000)) + 1,
  );

  if (periodDays < 165) {
    declineReasons.push(
      `Statement covers fewer than 6 full months (${periodDays} days detected; 165+ required).`,
    );
  }

  const monthly = aggregateMonthly(transactions);
  const monthsWithActivity = monthly.length || 1;
  const avgInflow =
    monthly.reduce((sum, m) => sum + m.inflow, 0) / monthsWithActivity;
  const avgOutflow =
    monthly.reduce((sum, m) => sum + m.outflow, 0) / monthsWithActivity;
  const avgNet = avgInflow - avgOutflow;

  const positiveMonths = monthly.filter((m) => m.net > 0).length;
  const fulizaCount = countFuliza(transactions);
  const fulizaPerMonth = fulizaCount / Math.max(monthsWithActivity, 1);
  const uniqueCustomers = estimateUniqueCustomerInflows(transactions);

  if (fulizaPerMonth > 3) {
    riskFlags.push(`HIGH_FULIZA:${fulizaPerMonth.toFixed(1)}/mo`);
  } else if (fulizaPerMonth > 1) {
    riskFlags.push(`MODERATE_FULIZA:${fulizaPerMonth.toFixed(1)}/mo`);
  }

  if (uniqueCustomers > 0) {
    riskFlags.push(`EST_UNIQUE_CUSTOMER_INFLOWS:${uniqueCustomers}`);
  }

  if (avgNet < 0) {
    declineReasons.push("Negative average monthly net cash flow.");
  } else if (avgNet < 15_000) {
    declineReasons.push(
      "Average monthly net cash flow is below KES 15,000.",
    );
  }

  // Mixed personal/business heuristic → manual review
  const personalSignals = transactions.filter((tx) =>
    /buy goods|lipa na m-pesa|send money to|airtime|fuliza/i.test(tx.details),
  ).length;
  const businessSignals = transactions.filter((tx) =>
    /customer payment|payment from|till|paybill|funds received/i.test(
      tx.details,
    ),
  ).length;
  const mixed =
    personalSignals > transactions.length * 0.25 &&
    businessSignals > transactions.length * 0.15;

  let multiplier = 0;
  let status: ScoringResult["qualificationStatus"] = "NOT_QUALIFIED";

  if (periodDays >= 165 && avgNet >= 50_000 && positiveMonths >= 5 && fulizaPerMonth <= 3) {
    multiplier = 3.0;
    status = "QUALIFIED";
  } else if (
    periodDays >= 165 &&
    avgNet >= 25_000 &&
    positiveMonths >= 4
  ) {
    multiplier = 2.0;
    status = "QUALIFIED";
  } else if (periodDays >= 165 && avgNet >= 15_000 && avgNet > 0) {
    multiplier = 1.0;
    status = "QUALIFIED";
  } else if (
    periodDays >= 120 &&
    avgNet >= 15_000 &&
    (mixed || continuity.failedRows > 0)
  ) {
    multiplier = 1.0;
    status = "MANUAL_REVIEW";
    riskFlags.push("IRREGULAR_OR_MIXED_STATEMENT");
  } else if (mixed && avgNet >= 15_000) {
    multiplier = 1.0;
    status = "MANUAL_REVIEW";
    riskFlags.push("IRREGULAR_OR_MIXED_STATEMENT");
  }

  // Unreliable balance trail → customer care review instead of auto-approve
  if (status === "QUALIFIED" && continuityUnreliable) {
    status = "MANUAL_REVIEW";
    riskFlags.push("IRREGULAR_OR_MIXED_STATEMENT");
  } else if (
    status === "NOT_QUALIFIED" &&
    continuityUnreliable &&
    avgNet >= 15_000 &&
    periodDays >= 120
  ) {
    multiplier = Math.max(multiplier, 1.0);
    status = "MANUAL_REVIEW";
    riskFlags.push("IRREGULAR_OR_MIXED_STATEMENT");
  }

  if (status === "NOT_QUALIFIED" && declineReasons.length === 0) {
    declineReasons.push(
      "Cash-flow profile did not meet the minimum qualification thresholds.",
    );
  }

  if (status === "QUALIFIED" && mixed) {
    riskFlags.push("MIXED_PERSONAL_BUSINESS_SIGNALS");
  }

  const rawOffer = avgNet * multiplier;
  const maxQualifiedAmount =
    status === "QUALIFIED" || status === "MANUAL_REVIEW"
      ? Math.max(MIN_LOAN, Math.floor(rawOffer / 1000) * 1000)
      : 0;

  return {
    statementPeriodDays: periodDays,
    avgMonthlyInflow: round2(avgInflow),
    avgMonthlyOutflow: round2(avgOutflow),
    avgMonthlyNetCashflow: round2(avgNet),
    multiplier,
    maxQualifiedAmount,
    qualificationStatus: status,
    monthlyBreakdown: monthly,
    riskFlags,
    declineReasons:
      status === "QUALIFIED" || status === "MANUAL_REVIEW"
        ? []
        : declineReasons,
  };
}
