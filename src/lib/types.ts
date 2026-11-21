export type QualificationStatus =
  | "QUALIFIED"
  | "MANUAL_REVIEW"
  | "NOT_QUALIFIED"
  | "TAMPERED_REJECTED";

export type ApplicationStatus = "NEW" | "CONTACTED" | "APPROVED" | "REJECTED";

export type SubscriberBand = "< 50" | "50 – 200" | "201 – 500" | "500+";

export interface MonthlyBreakdown {
  month: string;
  inflow: number;
  outflow: number;
  net: number;
}

export interface MpesaTransaction {
  receipt: string;
  timestamp: Date;
  details: string;
  status: string;
  paidIn: number;
  withdrawn: number;
  balance: number;
}

export interface ScoringResult {
  statementPeriodDays: number;
  avgMonthlyInflow: number;
  avgMonthlyOutflow: number;
  avgMonthlyNetCashflow: number;
  multiplier: number;
  maxQualifiedAmount: number;
  qualificationStatus: QualificationStatus;
  monthlyBreakdown: MonthlyBreakdown[];
  riskFlags: string[];
  declineReasons: string[];
}

export interface AssessmentRow {
  id: string;
  session_token_hash: string;
  statement_sha256: string;
  statement_period_days: number;
  avg_monthly_inflow: string;
  avg_monthly_outflow: string;
  avg_monthly_net_cashflow: string;
  multiplier: string;
  max_qualified_amount: string;
  qualification_status: QualificationStatus;
  monthly_breakdown: MonthlyBreakdown[];
  risk_flags: string[];
  decline_reasons: string[];
  is_converted: boolean;
  expires_at: Date;
  created_at: Date;
}

export interface LoanApplicationRow {
  id: string;
  reference_code: string;
  assessment_id: string;
  isp_name: string;
  contact_name: string;
  phone_number: string;
  email: string | null;
  location: string;
  kra_pin: string;
  paybill_or_till: string | null;
  subscriber_band: string;
  requested_amount: string;
  status: ApplicationStatus;
  customer_care_notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PublicAssessment {
  id: string;
  statementPeriodDays: number;
  avgMonthlyInflow: number;
  avgMonthlyOutflow: number;
  avgMonthlyNetCashflow: number;
  multiplier: number;
  maxQualifiedAmount: number;
  qualificationStatus: QualificationStatus;
  monthlyBreakdown: MonthlyBreakdown[];
  riskFlags: string[];
  declineReasons: string[];
  isConverted: boolean;
  expiresAt: string;
  createdAt: string;
}
