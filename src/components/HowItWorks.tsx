function StepIcon({ kind }: { kind: "choose" | "configure" | "score" | "grow" }) {
  if (kind === "choose") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 17.5h7M17.5 14v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "configure") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M5.8 18.2l1.6-1.6M16.6 7.4l1.6-1.6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "score") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 16.5c2.2-1.5 3.8-4.8 5.2-4.8 1.8 0 2.2 5.2 4.2 5.2 1.6 0 3-3.4 6.6-7.4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16 9h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 17 10.5 10.5 14 14l6-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 7h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HowItWorks({
  steps,
}: {
  steps: {
    n: string;
    t: string;
    d: string;
    icon: "choose" | "configure" | "score" | "grow";
  }[];
}) {
  return (
    <section id="how-it-works" className="relative overflow-hidden border-b border-steel bg-cloud">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(4,8,37,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(4,8,37,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse at 20% 0%, black 20%, transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(235,18,96,0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <p className="tech-label text-siscom">How it works</p>
          <h2 className="display-section mt-3 max-w-[18ch]">
            From plan to capacity in four steps.
          </h2>
          <p className="mt-5 text-[14px] leading-[1.5] font-medium text-slate">
            Configure infrastructure, get scored with Mkash, then grow while
            repayments deduct automatically as subscribers pay.
          </p>
        </div>

        <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* desktop connector */}
          <div className="pointer-events-none absolute top-[28px] right-[8%] left-[8%] hidden h-px bg-gradient-to-r from-siscom/20 via-steel to-siscom/20 lg:block" />

          {steps.map((step, i) => (
            <li key={step.n} className="relative">
              <div className="flex items-center gap-3 lg:flex-col lg:items-start">
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-steel bg-paper text-siscom shadow-[var(--shadow-technical-card)]">
                  <StepIcon kind={step.icon} />
                  {i < steps.length - 1 ? (
                    <span className="absolute top-1/2 -right-4 hidden h-px w-4 bg-steel sm:block lg:hidden" />
                  ) : null}
                </div>
                <div className="min-w-0 lg:mt-5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tabular-nums text-siscom">
                      {step.n}
                    </span>
                    <span className="hidden h-px flex-1 bg-steel/80 sm:block lg:hidden" />
                  </div>
                  <p className="mt-1.5 text-[18px] font-semibold tracking-tight text-ink">
                    {step.t}
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.5] text-slate">
                    {step.d}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
