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
        {/* Hero — copy on paper, tower + diagram on the right */}
        <section className="relative overflow-hidden border-b border-steel/70 bg-paper">
          <div className="mx-auto grid max-w-6xl lg:grid-cols-2 lg:items-stretch">
            <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:py-16 animate-rise">
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
              className="relative min-h-[420px] overflow-hidden bg-[#0b1c3a] sm:min-h-[520px] lg:min-h-full animate-rise"
              style={{ animationDelay: "100ms" }}
            >
              <Image
                src="/images/tower.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="animate-hero-drift object-cover object-[center_22%]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(4,8,37,0.45)_0%,rgba(4,8,37,0.12)_45%,rgba(4,8,37,0.28)_100%)]" />
              <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-[520px] scale-[0.92] sm:scale-100">
                  <HeroDiagram />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="hatched-band">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6">
            <p className="max-w-md text-[18px] font-medium text-white/75">
              Built for Kenyan ISPs who keep the network running.
            </p>
            <div className="flex flex-wrap gap-3">
              {["M-Pesa Personal", "Till", "Paybill"].map((label) => (
                <span
                  key={label}
                  className="rounded-[35px] border border-white/40 px-4 py-2 text-[13px] font-medium text-paper"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How it works + upload */}
        <section
          id="how-it-works"
          className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20"
        >
          <div>
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

        {/* Router — edge-to-edge media + copy */}
        <section className="border-t border-steel">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[5/4] lg:aspect-auto lg:min-h-[480px]">
              <Image
                src="/images/router.jpg"
                alt="Customer-premise router used by ISP operators"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center bg-cloud px-4 py-14 sm:px-10 lg:px-14 lg:py-16">
              <p className="tech-label text-slate">OPERATIONS</p>
              <h2 className="display-section mt-3 max-w-[14ch]">
                Restock CPE before outages start.
              </h2>
              <p className="mt-5 max-w-md text-[14px] leading-[1.5] font-medium text-slate">
                When float is thin, routers sit in customs and tickets pile up.
                Use your M-Pesa cash-flow score to unlock working capital and keep
                installations moving.
              </p>
            </div>
          </div>
        </section>

        {/* Connected home */}
        <section className="border-t border-steel">
          <div className="grid lg:grid-cols-2">
            <div className="order-2 flex flex-col justify-center px-4 py-14 sm:px-10 lg:order-1 lg:px-14 lg:py-16">
              <p className="tech-label text-slate">SUBSCRIBER IMPACT</p>
              <h2 className="display-section mt-3 max-w-[15ch]">
                Capital that keeps households online.
              </h2>
              <p className="mt-5 max-w-md text-[14px] leading-[1.5] font-medium text-slate">
                Reliable last-mile service depends on stock, fuel, and field teams.
                Siscom scores statement performance so you can fund the work that
                protects uptime—without a long bank process.
              </p>
              <div className="mt-8">
                <Button href="#check" variant="primary" arrow>
                  Check My Qualification
                </Button>
              </div>
            </div>
            <div className="relative order-1 aspect-[5/4] lg:order-2 lg:aspect-auto lg:min-h-[480px]">
              <Image
                src="/images/home-speaker.jpg"
                alt="Connected home powered by reliable internet"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Trust */}
        <section id="trust" className="border-t border-steel bg-cloud">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="display-section max-w-3xl">
              Security designed for ODPC-minded operators.
            </h2>
            <div className="mt-10 grid gap-10 sm:grid-cols-3">
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
              ].map((item) => (
                <div key={item.title}>
                  <span className="mb-3 inline-flex h-2.5 w-2.5 rounded-[3px] bg-siscom" />
                  <h3 className="text-[16px] font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.45] text-slate">
                    {item.body}
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
