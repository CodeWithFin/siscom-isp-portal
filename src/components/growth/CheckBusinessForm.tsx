"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GROWTH_COUNTIES } from "@/lib/growth-catalog";
import { blankWcBiz, loadWcBiz, saveWcBiz, type WcBiz } from "@/lib/wc-biz";
import { Button } from "@/components/ui/Button";
import { WcProgress } from "./WcProgress";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-steel bg-paper px-3 py-2.5 text-[14px] text-ink outline-none transition focus:border-ink";

function Field({
  label,
  children,
  hint,
  bad,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  bad?: boolean;
}) {
  return (
    <label className={`block ${bad ? "rounded-xl ring-2 ring-[#EB1260]/40" : ""}`}>
      <span className="text-[13px] font-medium text-charcoal">{label}</span>
      {children}
      {hint ? (
        <span className="mt-1 block text-[12px] text-slate">{hint}</span>
      ) : null}
    </label>
  );
}

export function CheckBusinessForm() {
  const router = useRouter();
  const [biz, setBiz] = useState<WcBiz>(blankWcBiz);
  const [hydrated, setHydrated] = useState(false);
  const [bad, setBad] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setBiz(loadWcBiz());
    setHydrated(true);
  }, []);

  function patch(next: Partial<WcBiz>) {
    setBiz((prev) => ({ ...prev, ...next }));
  }

  function onContinue() {
    const need: (keyof WcBiz)[] = [
      "name",
      "ca",
      "contact",
      "phone",
      "email",
      "county",
    ];
    const nextBad: string[] = [];
    for (const k of need) {
      const v = String(biz[k] || "").trim();
      const fail =
        !v || (k === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      if (fail) nextBad.push(k);
    }
    setBad(nextBad);
    if (nextBad.length) {
      setError(
        nextBad[0] === "email" && biz.email
          ? "Enter a valid email address."
          : "Fill in the highlighted fields to continue.",
      );
      return;
    }
    saveWcBiz(biz);
    router.push("/check/statements");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <WcProgress step={0} />

      <div className="mt-8 rounded-3xl border border-steel bg-paper p-5 shadow-[var(--shadow-graphite-card)] sm:p-8">
        <p className="tech-label text-slate">
          Credit check · loans provided by Mkash, a CBK-licensed digital credit
          provider
        </p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight text-ink sm:text-[32px]">
          Check what you qualify for
        </h1>
        <p className="mt-2 text-[14px] text-slate">
          Takes about 3 minutes. You&apos;ll need 6 months of M-Pesa statements
          for your business Till, Paybill or line.
        </p>

        <div
          className={`mt-6 grid gap-4 sm:grid-cols-2 ${hydrated ? "" : "opacity-60"}`}
        >
          <Field label="ISP / business name" bad={bad.includes("name")}>
            <input
              className={fieldClass}
              value={biz.name}
              autoComplete="organization"
              onChange={(e) => patch({ name: e.target.value })}
            />
          </Field>
          <Field
            label="CA licence number"
            hint="Required before a loan is disbursed."
            bad={bad.includes("ca")}
          >
            <input
              className={fieldClass}
              value={biz.ca}
              onChange={(e) => patch({ ca: e.target.value })}
            />
          </Field>
          <Field label="Your name" bad={bad.includes("contact")}>
            <input
              className={fieldClass}
              value={biz.contact}
              autoComplete="name"
              onChange={(e) => patch({ contact: e.target.value })}
            />
          </Field>
          <Field label="M-Pesa phone number" bad={bad.includes("phone")}>
            <input
              className={fieldClass}
              type="tel"
              placeholder="+254 7xx xxx xxx"
              value={biz.phone}
              autoComplete="tel"
              onChange={(e) => patch({ phone: e.target.value })}
            />
          </Field>
          <Field label="Email" bad={bad.includes("email")}>
            <input
              className={fieldClass}
              type="email"
              value={biz.email}
              autoComplete="email"
              onChange={(e) => patch({ email: e.target.value })}
            />
          </Field>
          <Field label="County" bad={bad.includes("county")}>
            <select
              className={fieldClass}
              value={biz.county}
              onChange={(e) => patch({ county: e.target.value })}
            >
              <option value="">Select…</option>
              {GROWTH_COUNTIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {error ? (
          <p className="mt-4 text-[13px] font-medium text-[#EB1260]">{error}</p>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button href="/" variant="outline">
            Cancel
          </Button>
          <Button type="button" variant="primary" arrow onClick={onContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
