const WSTEPS = [
  "Your business",
  "M-Pesa statements",
  "Your result",
  "Apply",
] as const;

export function WcProgress({ step }: { step: number }) {
  const current = Math.max(0, Math.min(WSTEPS.length - 1, step));

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={WSTEPS.length}
      aria-valuenow={current + 1}
      aria-label={`Step ${current + 1} of ${WSTEPS.length}: ${WSTEPS[current]}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="tech-label text-slate">
          SISCOM <span className="text-siscom">WORKING CAPITAL</span>
        </p>
        <p className="text-[12px] font-medium text-slate">
          Step {current + 1} of {WSTEPS.length}
        </p>
      </div>
      <div className="mt-4 flex gap-1.5">
        {WSTEPS.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={s} className="min-w-0 flex-1">
              <div className="relative h-1.5 overflow-hidden rounded-full bg-steel/80">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${
                    done || active
                      ? "bg-[radial-gradient(97.54%_50.91%_at_50%_2.46%,#7B1B3D_0%,#EB1260_100%)]"
                      : "bg-transparent"
                  } ${active ? "shadow-[0_0_12px_rgba(235,18,96,0.45)]" : ""}`}
                  style={{ width: done || active ? "100%" : "0%" }}
                />
              </div>
              <p
                className={`mt-2 truncate text-[11px] font-medium transition-colors duration-300 ${
                  done
                    ? "text-siscom"
                    : active
                      ? "text-ink"
                      : "text-slate/45"
                }`}
              >
                <span className="tabular-nums">{i + 1}.</span>{" "}
                <span className="hidden sm:inline">{s}</span>
                <span className="sm:hidden">{active ? s : `${i + 1}`}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { WSTEPS };
