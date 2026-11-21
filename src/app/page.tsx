import { AnnouncementStrip } from "@/components/AnnouncementStrip";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroDiagram } from "@/components/HeroDiagram";
import { UploadCard } from "@/components/UploadCard";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      <AnnouncementStrip />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="animate-rise">
            <p className="tech-label text-slate">SISCOM · ISP LENDING</p>
            <h1 className="display-hero mt-4 max-w-[14ch]">
              Unlock Working Capital for Your ISP in Minutes.
            </h1>
            <p className="mt-6 max-w-xl text-[14px] leading-[1.5] font-medium text-slate">
              Upload your 6-month M-Pesa statement to instantly check your loan
              qualification—up to{" "}
              <span className="text-charcoal">3x your monthly net cash flow</span>
              . No account required.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
              {[
                "Zero registration",
                "Automated cash-flow scoring",
                "Up to 3× offer",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="flex h-3 w-3 items-center justify-center rounded-[3px] bg-ink" />
                  <span className="text-[14px] font-medium text-ink">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:max-w-xs">
              <Button href="#check" variant="aqua" arrow className="w-full">
                Check My Qualification
              </Button>
              <Button href="#how-it-works" variant="ghost" className="w-full">
                How It Works
              </Button>
            </div>
          </div>

          <div className="animate-rise" style={{ animationDelay: "120ms" }}>
            <HeroDiagram />
          </div>
        </section>

        {/* Dark social / trust strip */}
        <section className="hatched-band">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6">
            <p className="max-w-md text-[18px] font-medium text-white/70">
              Built for Kenyan ISPs who need working capital without the paperwork
              maze.
            </p>
            <div className="flex flex-wrap gap-3">
              {["M-Pesa Personal", "Till", "Paybill"].map((label) => (
                <span
                  key={label}
                  className="rounded-xl bg-white/10 px-4 py-2 text-[13px] font-medium text-paper shadow-[inset_0_0_0_2px_rgba(255,255,255,0.13)]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Upload + how it works */}
        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div id="how-it-works">
            <h2 className="display-section">From statement to offer in three steps.</h2>
            <p className="mt-5 max-w-lg text-[14px] leading-[1.5] font-medium text-slate">
              We parse your official Safaricom statement in memory, verify balance
              continuity, and compute a pre-qualified limit based on average monthly
              net cash flow.
            </p>

            <ol className="mt-8 space-y-5">
              {[
                {
                  n: "01",
                  t: "Upload",
                  d: "Drop a 6-month M-Pesa, Till, or Paybill PDF and enter the statement password.",
                },
                {
                  n: "02",
                  t: "Score",
                  d: "We unlock, validate continuity, and tier your multiplier up to 3.0×.",
                },
                {
                  n: "03",
                  t: "Apply",
                  d: "Qualified ISPs submit business details — Siscom customer care finalizes disbursement.",
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

        {/* Trust footer badges */}
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
                  <span className="mb-3 inline-flex h-3 w-3 rounded-[3px] bg-aqua-relay" />
                  <h3 className="text-[16px] font-semibold text-ink">{card.title}</h3>
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
