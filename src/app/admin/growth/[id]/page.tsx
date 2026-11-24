import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { GrowthStatusForm } from "@/components/admin/GrowthStatusForm";
import { query } from "@/lib/db";
import { formatKes } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

type GrowthRow = {
  id: string;
  reference_code: string;
  kind: string;
  status: string;
  isp_name: string;
  registration_number: string;
  ca_licence: string;
  county: string;
  active_subscribers: number;
  arpu: string;
  billing_system: string;
  payment_channels: string;
  contact_name: string;
  email: string;
  phone_number: string;
  notes: string | null;
  monthly_collections: string;
  indicative_limit: string;
  items: Array<{
    product: string;
    spec: string;
    plan: string;
  }>;
  financing: { typeName?: string; amount?: number; lender?: string } | null;
  access_finance: boolean;
  customer_care_notes: string | null;
  created_at: Date;
};

export default async function AdminGrowthDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await requireAdmin())) redirect("/admin/login");

  const { id } = await params;
  const result = await query<GrowthRow>(
    `SELECT * FROM growth_applications WHERE id = $1`,
    [id],
  );
  const app = result.rows[0];
  if (!app) notFound();

  const items = Array.isArray(app.items) ? app.items : [];

  return (
    <AdminShell
      title={app.reference_code}
      subtitle={`${app.isp_name} · ${app.kind.replace("_", " ")}`}
    >
      <Link
        href="/admin/growth"
        className="text-[13px] font-medium text-siscom hover:underline"
      >
        ← Back to growth applications
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-steel bg-paper p-5">
            <h2 className="text-[15px] font-semibold text-ink">ISP</h2>
            <dl className="mt-3 grid gap-3 text-[13px] sm:grid-cols-2">
              {[
                ["Business", app.isp_name],
                ["Registration", app.registration_number],
                ["CA licence", app.ca_licence],
                ["County", app.county],
                ["Subscribers", String(app.active_subscribers)],
                ["ARPU", formatKes(Number(app.arpu))],
                ["Billing", app.billing_system],
                ["Payments", app.payment_channels],
                ["Contact", app.contact_name],
                ["Email", app.email],
                ["Phone", app.phone_number],
                [
                  "Monthly collections",
                  formatKes(Number(app.monthly_collections)),
                ],
                [
                  "Indicative limit",
                  formatKes(Number(app.indicative_limit)),
                ],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-slate">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            {app.notes ? (
              <p className="mt-4 rounded-xl bg-cloud p-3 text-[13px] text-slate">
                {app.notes}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-steel bg-paper p-5">
            <h2 className="text-[15px] font-semibold text-ink">
              Infrastructure ({items.length})
            </h2>
            {items.length === 0 ? (
              <p className="mt-2 text-[13px] text-slate">No items</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {items.map((item, i) => (
                  <li
                    key={`${item.product}-${i}`}
                    className="flex justify-between gap-3 border-b border-steel/60 pb-3 text-[13px] last:border-0"
                  >
                    <span>
                      <span className="font-medium text-ink">{item.product}</span>
                      <br />
                      <span className="text-slate">{item.spec}</span>
                    </span>
                    <span className="shrink-0 font-medium text-charcoal">
                      {item.plan}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {app.access_finance ? (
              <p className="mt-3 text-[12px] font-medium text-siscom">
                Access infrastructure finance selected
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-steel bg-paper p-5">
            <h2 className="text-[15px] font-semibold text-ink">Financing</h2>
            {app.financing?.amount != null ? (
              <dl className="mt-3 grid gap-3 text-[13px] sm:grid-cols-2">
                <div>
                  <dt className="text-slate">Facility</dt>
                  <dd className="font-medium text-ink">
                    {app.financing.typeName || "Billing finance"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate">Amount</dt>
                  <dd className="font-medium text-ink">
                    {formatKes(app.financing.amount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate">Lender</dt>
                  <dd className="font-medium text-ink">
                    {app.financing.lender || "Mkash"}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-[13px] text-slate">
                No billing finance requested
              </p>
            )}
          </section>
        </div>

        <div>
          <GrowthStatusForm
            id={app.id}
            status={app.status}
            notes={app.customer_care_notes || ""}
          />
          <p className="mt-4 text-[12px] text-slate">
            Submitted {new Date(app.created_at).toLocaleString("en-KE")}
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
