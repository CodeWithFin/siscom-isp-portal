import { formatKes } from "@/lib/format";

type Stats = {
  assessmentsTotal: number;
  assessmentsQualified: number;
  assessmentsManual: number;
  assessmentsRejected: number;
  applicationsTotal: number;
  applicationsNew: number;
  applicationsContacted: number;
  applicationsApproved: number;
  applicationsRejected: number;
  converted: number;
  requestedSum: number;
  qualifiedSum: number;
};

export function DashboardStats({ stats }: { stats: Stats }) {
  const conversion =
    stats.assessmentsTotal === 0
      ? 0
      : Math.round((stats.converted / stats.assessmentsTotal) * 100);

  const cards = [
    {
      label: "Statement checks",
      value: String(stats.assessmentsTotal),
      hint: `${stats.assessmentsQualified} qualified · ${stats.assessmentsManual} review`,
    },
    {
      label: "Loan applications",
      value: String(stats.applicationsTotal),
      hint: `${stats.applicationsNew} new · ${stats.applicationsContacted} contacted`,
    },
    {
      label: "Conversion rate",
      value: `${conversion}%`,
      hint: `${stats.converted} applied after scoring`,
    },
    {
      label: "Pipeline requested",
      value: formatKes(stats.requestedSum),
      hint: `${formatKes(stats.qualifiedSum)} total qualified limit`,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-steel bg-paper p-5 shadow-[var(--shadow-subtle)]"
        >
          <p className="tech-label text-slate">{card.label}</p>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-ink">
            {card.value}
          </p>
          <p className="mt-1 text-[13px] text-slate">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
