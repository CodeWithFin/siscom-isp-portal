import { AnnouncementStrip } from "@/components/AnnouncementStrip";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroDiagram } from "@/components/HeroDiagram";
import { UploadCard } from "@/components/UploadCard";
import { Button } from "@/components/ui/Button";

const STEPS = [
  {
    n: "01",
    t: "Choose",
    d: "Add infrastructure to your plan, or go straight to working-capital scoring.",
  },
  {
    n: "02",
    t: "Configure",
    d: "Tell us quantities, sites and capacity. Pay upfront or lease over 12–36 months.",
  },
  {
    n: "03",
    t: "Get scored",
    d: "Share billing and M-Pesa data with Mkash, our licensed credit partner, for a limit.",
  },
  {
    n: "04",
    t: "Grow",
    d: "A Siscom associate completes onboarding. You build, bill on WASP, and repay automatically.",
  },
];

const INFRA = [
  {
    title: "Colocation",
    body: "Rack space, power and cross-connects for your core and edge gear.",
  },
  {
    title: "Fibre & poles",
    body: "Backbone links, last-mile drops and pole access for coverage expansion.",
  },
  {
    title: "Nodes & IP",
    body: "Aggregation nodes plus ASN and IP pools so your network scales cleanly.",
  },
  {
    title: "Upstream capacity",
    body: "Dedicated internet capacity from 1–10 Gbps via Netco (Tier 3).",
  },
  {
    title: "Radios & CPE",
    body: "5G fixed wireless, point-to-point links, sector antennas and subscriber routers.",
  },
];

const FINANCE = [
  {
    n: "01",
    eyebrow: "Access infrastructure",
    title: "Finance your last mile",
    meta: "Lease 12–36 months",
    body: "Fibre drops, CPEs, 5G radios, nodes and poles. The equipment secures the lease, so no land title is needed.",
    points: [
      "Financed by SISCOM Capital",
      "Pick gear from the catalogue",
      "Repaid from collections at source",
    ],
    note: "Secured by the financed equipment",
    cta: { href: "#how-it-works", label: "See how it works" },
  },
  {
    n: "02",
    eyebrow: "Billing finance",
    title: "Advance on your subscriber billing",
    meta: "Up to ~1× monthly billing",
    body: "Unlock cash against the recurring bills you run on WASP, including WASP setup and migration.",
    points: [
      "Requires billing on WASP",
      "Limit grows with your billing history",
      "Deducted as subscribers pay through Cashia",
    ],
    note: "Secured by WASP billing and Cashia collections",
    cta: { href: "#wasp", label: "Learn about WASP" },
  },
  {
    n: "03",
    eyebrow: "Working capital",
    title: "Get scored in minutes",
    meta: "KES 100,000 – 10,000,000",
    body: "Upload 6 months of M-Pesa statements. We score your cash flow and show the business loan you qualify for.",
    points: [
      "Upstream bills, payroll, router stock",
      "No land title or logbook needed",
      "An investment associate follows up",
    ],
    note: "Scored on your M-Pesa cash flow",
    cta: { href: "#check", label: "Check what you qualify for" },
  },
];

const WASP = [
  {
    title: "Subscribers and plans",
    body: "PPPoE, hotspot, vouchers and speed tiers in one place.",
  },
  {
    title: "Cashia collections",
    body: "Gateway and wallet payments, auto-reconciled as they land.",
  },
  {
    title: "Reminders and suspensions",
    body: "Fewer missed payments and less churn across your base.",
  },
  {
    title: "Credit profile",
    body: "Your billing data builds a stronger financing limit over time.",
  },
];

export default function HomePage() {
  return (
    <>
      <AnnouncementStrip />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-steel/70 bg-paper">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:py-16">
            <div className="relative z-10 animate-rise">
              <p className="tech-label text-slate">
                FOR TIER 4 AND 5 ISPS · KENYA
              </p>
              <h1 className="display-hero mt-4 max-w-[16ch]">
                Grow your network. Repay as your subscribers pay.
              </h1>
              <p className="mt-6 max-w-xl text-[14px] leading-[1.5] font-medium text-slate">
                Colocation, fibre, poles, nodes, IP space and upstream capacity,
                financed in one place. Run billing on{" "}
                <span className="text-charcoal">WASP</span>, collect through{" "}
                <span className="text-charcoal">Cashia</span>, and unlock growth
                and working capital from{" "}
                <span className="text-charcoal">KES 100,000 to KES 10 million</span>.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
                {[
                  "KES 100k–10M facilities",
                  "1–10 Gbps upstream via Netco",
                  "Repayment deducted at source",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="flex h-3 w-3 items-center justify-center rounded-[3px] bg-ink" />
                    <span className="text-[14px] font-medium text-ink">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:max-w-xs">
                <Button href="#check" variant="primary" arrow className="w-full">
                  Check what you qualify for
                </Button>
                <Button href="#financing" variant="outline" className="w-full">
                  Explore financing
                </Button>
              </div>
            </div>

            <div
              className="relative z-0 -mx-2 animate-rise sm:mx-0 lg:-mr-8"
              style={{ animationDelay: "120ms" }}
            >
              <HeroDiagram />
            </div>
          </div>
        </section>

        {/* Proof strip */}
        <section className="hatched-band">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6">
            <p className="max-w-lg text-[18px] font-medium text-white/70">
              No land title needed. Your subscriber collections are your
              collateral.
            </p>
            <div className="flex flex-wrap gap-3">
              {["WASP billing", "Cashia collections", "Mkash credit"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-[35px] border border-white/40 bg-transparent px-4 py-2 text-[13px] font-medium text-paper"
                  >
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-b border-steel bg-paper">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <p className="tech-label text-slate">HOW IT WORKS</p>
            <h2 className="display-section mt-3 max-w-[18ch]">
              From plan to capacity in four steps.
            </h2>
            <p className="mt-5 max-w-2xl text-[14px] leading-[1.5] font-medium text-slate">
              Configure infrastructure, get scored with Mkash, then grow while
              repayments deduct automatically as subscribers pay.
            </p>

            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <li key={step.n}>
                  <span className="tech-label text-slate">{step.n}</span>
                  <p className="mt-3 text-[16px] font-semibold text-ink">
                    {step.t}
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.45] text-slate">
                    {step.d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Infrastructure */}
        <section id="infrastructure" className="border-b border-steel bg-cloud">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <p className="tech-label text-slate">DIGITAL INFRASTRUCTURE</p>
            <h2 className="display-section mt-3 max-w-[16ch]">
              Everything your network runs on.
            </h2>
            <p className="mt-5 max-w-2xl text-[14px] leading-[1.5] font-medium text-slate">
              Colocation, fibre, poles, nodes, IP space, upstream capacity and
              CPE—financed by SISCOM Capital. Quotes are confirmed after review.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INFRA.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-steel bg-paper p-5 shadow-[var(--shadow-technical-card)]"
                >
                  <span className="mb-3 inline-flex h-3 w-3 rounded-[3px] bg-siscom" />
                  <h3 className="text-[16px] font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.45] text-slate">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Financing pillars */}
        <section id="financing" className="border-b border-steel bg-paper">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <p className="tech-label text-slate">FINANCING</p>
            <h2 className="display-section mt-3 max-w-[16ch]">
              Three ways to fund your growth.
            </h2>
            <p className="mt-5 max-w-2xl text-[14px] leading-[1.5] font-medium text-slate">
              Loans provided with Mkash, a CBK-licensed digital credit provider.
              Limits are indicative and subject to approval.
            </p>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {FINANCE.map((item) => (
                <div
                  key={item.n}
                  className="flex flex-col rounded-2xl border border-steel bg-cloud p-5 shadow-[var(--shadow-technical-card)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="tech-label text-slate">
                      {item.n} · {item.eyebrow}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[18px] font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13px] font-medium text-siscom">
                    {item.meta}
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.45] text-slate">
                    {item.body}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2 text-[13px] font-medium text-charcoal"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[12px] font-medium text-slate">
                    {item.note}
                  </p>
                  <div className="mt-auto pt-5">
                    <Button
                      href={item.cta.href}
                      variant={item.n === "03" ? "primary" : "outline"}
                      arrow={item.n === "03"}
                      className="w-full"
                    >
                      {item.cta.label}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WASP */}
        <section id="wasp" className="border-b border-steel bg-navy-mid text-paper">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <p className="tech-label text-white/50">WASP · BUILT BY SISCOM</p>
            <h2 className="display-section mt-3 max-w-[16ch] text-paper">
              Billing built for small ISPs.
            </h2>
            <p className="mt-5 max-w-2xl text-[14px] leading-[1.5] font-medium text-white/70">
              Subscribers, plans, hotspot and PPPoE, invoices and reminders—
              integrated with Cashia so every payment is recorded the moment it
              lands. WASP is required for financing, because your billing data is
              what earns you a bigger limit.
            </p>
            <p className="mt-4 text-[14px] font-semibold text-siscom-pay">
              KES 10 per active subscriber per month
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {WASP.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5"
                >
                  <h3 className="text-[15px] font-semibold text-paper">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.45] text-white/65">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Working capital upload */}
        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="tech-label text-slate">WORKING CAPITAL</p>
            <h2 className="display-section mt-3">
              Get scored in minutes on your M-Pesa cash flow.
            </h2>
            <p className="mt-5 max-w-lg text-[14px] leading-[1.5] font-medium text-slate">
              Upload a 6-month M-Pesa, Till, or Paybill statement. We unlock it in
              memory, verify continuity, and show what you qualify for—up to 3×
              average monthly net cash flow, within the KES 100,000–10,000,000
              band.
            </p>

            <ol className="mt-8 space-y-5">
              {[
                {
                  n: "01",
                  t: "Upload",
                  d: "Drop your official Safaricom PDF and enter the statement password.",
                },
                {
                  n: "02",
                  t: "Score",
                  d: "We tier your multiplier and show an indicative working-capital limit.",
                },
                {
                  n: "03",
                  t: "Apply",
                  d: "Submit ISP details. Siscom and Mkash complete verification and follow-up.",
                },
              ].map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="tech-label mt-1 text-slate">{step.n}</span>
                  <div>
                    <p className="text-[16px] font-semibold text-ink">{step.t}</p>
                    <p className="mt-1 text-[14px] leading-[1.45] text-slate">
                      {step.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <UploadCard />
        </section>

        {/* Trust */}
        <section id="trust" className="border-t border-steel bg-cloud">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="display-section max-w-3xl">
              Security designed for ODPC-minded operators.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "256-bit Encryption",
                  body: "Statement uploads travel over HTTPS and are processed only in RAM.",
                },
                {
                  title: "24-Hour Auto-Purge",
                  body: "Unsubmitted qualification checks expire and are deleted automatically.",
                },
                {
                  title: "ODPC Compliant",
                  body: "Explicit consent and data minimization for Kenya Data Protection Act (2019).",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-steel bg-paper p-5 shadow-[var(--shadow-technical-card)]"
                >
                  <span className="mb-3 inline-flex h-3 w-3 rounded-full bg-siscom" />
                  <h3 className="text-[16px] font-semibold text-ink">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.45] text-slate">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
