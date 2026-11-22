import Image from "next/image";
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
        {/* Hero — tower atmosphere + scoring diagram */}
        <section className="relative overflow-hidden border-b border-steel/70 bg-[#fafafa]">
          <div className="pointer-events-none absolute inset-0">
            <Image
              src="/images/tower.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_20%] opacity-[0.18] sm:opacity-[0.22]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#fafafa_0%,rgba(250,250,250,0.92)_42%,rgba(250,250,250,0.55)_70%,rgba(250,250,250,0.35)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(235,18,96,0.08),transparent_55%)]" />
          </div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:py-16">
            <div className="relative z-10 animate-rise">
              <p className="tech-label text-slate">SISCOM · ISP LENDING</p>
              <h1 className="display-hero mt-4 max-w-[13ch]">
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
                <Button href="#check" variant="primary" arrow className="w-full">
                  Check My Qualification
                </Button>
                <Button href="#how-it-works" variant="outline" className="w-full">
                  How It Works
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
                  className="rounded-[35px] border border-white/40 bg-transparent px-4 py-2 text-[13px] font-medium text-paper"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Network gear visual + how it works */}
        <section className="border-b border-steel">
          <div className="mx-auto grid max-w-6xl items-stretch gap-0 lg:grid-cols-2">
            <div className="relative min-h-[280px] overflow-hidden bg-cloud sm:min-h-[360px]">
              <Image
                src="/images/router.jpg"
                alt="ISP customer premise router and network gear"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(4,8,37,0.45)_100%)]" />
              <p className="absolute bottom-5 left-5 right-5 tech-label text-white/80">
                Keep CPE stocked. Keep subscribers online.
              </p>
            </div>

            <div id="how-it-works" className="px-4 py-14 sm:px-8 lg:py-16">
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
          </div>
        </section>

        {/* Upload */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-xl">
            <UploadCard />
          </div>
        </section>

        {/* Homes connected — speaker lifestyle */}
        <section className="relative overflow-hidden border-y border-steel">
          <div className="mx-auto grid max-w-6xl items-center lg:grid-cols-2">
            <div className="order-2 px-4 py-14 sm:px-8 lg:order-1 lg:py-16">
              <p className="tech-label text-slate">WHY IT MATTERS</p>
              <h2 className="display-section mt-3 max-w-[16ch]">
                Working capital that keeps households connected.
              </h2>
              <p className="mt-5 max-w-md text-[14px] leading-[1.5] font-medium text-slate">
                When float is tight, routers sit in customs and outages stretch.
                Siscom scores your M-Pesa cash flow so you can restock CPE and
                protect subscriber uptime—without a long bank process.
              </p>
            </div>
            <div className="relative order-1 min-h-[300px] sm:min-h-[380px] lg:order-2">
              <Image
                src="/images/home-speaker.jpg"
                alt="Connected home powered by reliable ISP service"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
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
                  <span className="mb-3 inline-flex h-3 w-3 rounded-full bg-siscom" />
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
