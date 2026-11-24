"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GROWTH_COUNTIES,
  PAY_PLANS,
  defaultConfig,
  getProduct,
  indicativeBilling,
  itemSpec,
} from "@/lib/growth-catalog";
import { formatKes, formatNumber } from "@/lib/format";
import { useGrowthCart } from "@/lib/growth-cart";
import { Button } from "@/components/ui/Button";

const STEPS = ["Cart", "Your ISP", "Financing", "Review", "Terms"] as const;

const BILLING_OPTIONS = [
  "Spreadsheets or manual",
  "Splynx",
  "UISP / UNMS",
  "MikroTik User Manager",
  "Other system",
  "None",
];

const CHANNEL_OPTIONS = [
  "M-Pesa Paybill / Till",
  "Bank transfer",
  "Cash",
  "Mixed",
];

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-steel bg-paper px-3 py-2.5 text-[14px] text-ink outline-none transition focus:border-ink";

function Field({
  label,
  children,
  optional,
  bad,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
  bad?: boolean;
}) {
  return (
    <label className={`block ${bad ? "rounded-xl ring-2 ring-[#EB1260]/40" : ""}`}>
      <span className="text-[13px] font-medium text-charcoal">
        {label}
        {optional ? " (optional)" : ""}
      </span>
      {children}
    </label>
  );
}

export function GrowthConsole() {
  const router = useRouter();
  const {
    cart,
    addItem,
    removeItem,
    updatePlan,
    clearCart,
    mode,
    configProductId,
    checkoutStep,
    isp,
    fin,
    terms,
    closeConsole,
    setCheckoutStep,
    setIsp,
    setFin,
    setTerms,
    resetCheckout,
  } = useGrowthCart();

  const [cfg, setCfg] = useState<Record<string, string>>({});
  const [plan, setPlan] = useState("Lease 24 months");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [badFields, setBadFields] = useState<string[]>([]);
  const [doneRef, setDoneRef] = useState<string | null>(null);

  const product = configProductId ? getProduct(configProductId) : null;
  const ind = useMemo(
    () => indicativeBilling(Number(isp.subs) || 0, Number(isp.arpu) || 0),
    [isp.subs, isp.arpu],
  );

  useEffect(() => {
    if (mode === "config" && configProductId) {
      setCfg(defaultConfig(configProductId));
      setPlan("Lease 24 months");
      setError("");
    }
  }, [mode, configProductId]);

  useEffect(() => {
    if (!ind?.lim) return;
    if (fin.amount > ind.lim) setFin({ amount: ind.lim });
  }, [ind, fin.amount, setFin]);

  useEffect(() => {
    if (mode === "closed") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeConsole();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, closeConsole]);

  if (mode === "closed") return null;

  function validateIsp(): boolean {
    const need = [
      "name",
      "reg",
      "ca",
      "county",
      "subs",
      "arpu",
      "billing",
      "channels",
      "contact",
      "email",
      "phone",
    ] as const;
    const bad: string[] = [];
    for (const k of need) {
      const v = String(isp[k] || "").trim();
      const fail =
        !v ||
        (k === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ||
        ((k === "subs" || k === "arpu") && !(Number(v) > 0));
      if (fail) bad.push(k);
    }
    setBadFields(bad);
    if (bad.length) {
      setError(
        bad[0] === "email" && isp.email
          ? "Enter a valid email address."
          : "Fill in the highlighted fields to continue.",
      );
      return false;
    }
    setError("");
    return true;
  }

  async function submit() {
    if (busy) return;
    if (!Object.values(terms).every(Boolean)) {
      setError("Confirm each term to submit.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const financing =
        fin.want && ind && ind.lim
          ? {
              type: "billing" as const,
              typeName: "Billing finance",
              amount: Math.min(Math.max(fin.amount, 100_000), ind.lim),
              lender: "Mkash",
            }
          : null;

      const res = await fetch("/api/growth/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isp: {
            ...isp,
            name: isp.name.trim(),
            reg: isp.reg.trim(),
            ca: isp.ca.trim(),
            county: isp.county.trim(),
            billing: isp.billing.trim(),
            channels: isp.channels.trim(),
            contact: isp.contact.trim(),
            email: isp.email.trim(),
            phone: isp.phone.trim(),
            notes: isp.notes.trim(),
            subs: Number(isp.subs),
            arpu: Number(isp.arpu),
          },
          items: cart.map((c) => {
            const pr = getProduct(c.productId)!;
            return {
              productId: c.productId,
              product: pr.name,
              spec: itemSpec(c),
              config: c.config,
              plan: c.plan,
            };
          }),
          financing,
          accessFinance: fin.access,
          monthlyCollections: ind?.c ?? 0,
          indicativeLimit: ind?.lim ?? 0,
          consent: terms,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      clearCart();
      setDoneRef(data.referenceCode as string);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Your application did not go through. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function onBack() {
    setError("");
    if (mode === "config") {
      closeConsole();
      return;
    }
    if (checkoutStep === 0) return;
    setCheckoutStep(checkoutStep - 1);
  }

  function onNext() {
    if (mode === "config") {
      if (!product) return;
      const miss = product.fields.find(
        (fl) =>
          !fl.optional &&
          fl.k !== "route" &&
          fl.k !== "model" &&
          !String(cfg[fl.k] || "").trim(),
      );
      if (miss) {
        setError(`Add ${miss.l.toLowerCase()} to continue.`);
        return;
      }
      addItem({ productId: product.id, config: { ...cfg }, plan });
      closeConsole();
      return;
    }

    if (checkoutStep === 1 && !validateIsp()) return;

    if (checkoutStep === 2) {
      if (fin.want) {
        if (!(ind && ind.lim)) {
          setError(
            "Your monthly billing is below the minimum for billing finance. Lease equipment or check working capital instead.",
          );
          return;
        }
      } else if (cart.length === 0) {
        setError("Select a financing option, or add equipment to your cart.");
        return;
      }
    }

    if (checkoutStep === 4) {
      void submit();
      return;
    }

    setError("");
    setCheckoutStep(checkoutStep + 1);
  }

  const leased = cart.filter((c) => c.plan !== "Pay upfront").length;
  const nextDisabled =
    mode === "checkout" &&
    checkoutStep === 4 &&
    (!Object.values(terms).every(Boolean) || busy);

  const nextLabel =
    mode === "config"
      ? "Add to cart"
      : checkoutStep === 4
        ? busy
          ? "Submitting…"
          : "Submit application"
        : checkoutStep === 3
          ? "Confirm and continue"
          : "Continue";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="growth-pane-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeConsole();
      }}
    >
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-steel bg-paper shadow-[var(--shadow-graphite-card)] sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-steel px-5 py-4">
          <div>
            <p className="tech-label text-slate">
              {mode === "config" ? "CONFIGURE" : "CHECKOUT"}
            </p>
            {!doneRef && mode === "checkout" ? (
              <ol className="mt-2 hidden grid-cols-5 gap-1 sm:grid">
                {STEPS.map((s, i) => (
                  <li
                    key={s}
                    className={`text-[11px] font-medium ${
                      i < checkoutStep
                        ? "text-siscom"
                        : i === checkoutStep
                          ? "text-ink"
                          : "text-slate/50"
                    }`}
                  >
                    {i + 1}. {s}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
          <button
            type="button"
            onClick={closeConsole}
            className="rounded-full border border-steel px-3 py-1.5 text-[13px] font-medium text-slate hover:text-ink"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {doneRef ? (
            <div className="text-center">
              <p className="tech-label text-siscom">Application received</p>
              <h2
                id="growth-pane-title"
                className="display-section mt-3"
              >
                You&apos;re in. An associate will call you.
              </h2>
              <p className="mt-4 font-[family-name:var(--font-mono)] text-[18px] font-semibold tracking-wide text-ink">
                {doneRef}
              </p>
              <p className="mx-auto mt-4 max-w-lg text-[14px] leading-[1.5] text-slate">
                We&apos;ve recorded your application for {isp.name || "your ISP"}.
                A SISCOM associate will contact {isp.contact || "you"} to walk
                through WASP and Cashia onboarding and your Mkash credit check.
                No payment is taken now.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDoneRef(null);
                    resetCheckout();
                    setCheckoutStep(0);
                  }}
                >
                  Start another
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    closeConsole();
                    setDoneRef(null);
                    resetCheckout();
                    router.push(`/growth/confirmation/${doneRef}`);
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          ) : mode === "config" && product ? (
            <>
              <p className="tech-label text-slate">{product.who}</p>
              <h2 id="growth-pane-title" className="mt-2 text-[22px] font-semibold text-ink">
                {product.name}
              </h2>
              <p className="mt-2 text-[14px] text-slate">{product.desc}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {product.fields.map((fl) => (
                  <Field key={fl.k} label={fl.l} optional={fl.optional}>
                    {fl.t === "select" ? (
                      <select
                        className={fieldClass}
                        value={cfg[fl.k] ?? ""}
                        onChange={(e) =>
                          setCfg((c) => ({ ...c, [fl.k]: e.target.value }))
                        }
                      >
                        {(fl.o ?? []).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className={fieldClass}
                        type={fl.t}
                        value={cfg[fl.k] ?? ""}
                        min={fl.min}
                        max={fl.max}
                        placeholder={fl.ph}
                        onChange={(e) =>
                          setCfg((c) => ({ ...c, [fl.k]: e.target.value }))
                        }
                      />
                    )}
                  </Field>
                ))}
                <Field label="How do you want to pay?">
                  <select
                    className={fieldClass}
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                  >
                    {PAY_PLANS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-[12px] text-slate">
                    Leases are financed by SISCOM Capital. The equipment secures
                    the lease.
                  </span>
                </Field>
              </div>
              {error ? (
                <p className="mt-4 text-[13px] font-medium text-[#EB1260]">
                  {error}
                </p>
              ) : null}
            </>
          ) : checkoutStep === 0 ? (
            <>
              <h2 id="growth-pane-title" className="text-[22px] font-semibold text-ink">
                Your cart
              </h2>
              <p className="mt-2 text-[14px] text-slate">
                Review your infrastructure. You can add financing in the next
                steps.
              </p>
              <ul className="mt-6 space-y-3">
                {cart.length === 0 ? (
                  <li className="rounded-2xl border border-dashed border-steel bg-cloud px-4 py-6 text-[14px] text-slate">
                    Your cart is empty.{" "}
                    <button
                      type="button"
                      className="font-semibold text-siscom underline"
                      onClick={closeConsole}
                    >
                      Browse infrastructure
                    </button>
                    , or continue to apply for financing only.
                  </li>
                ) : (
                  cart.map((c) => {
                    const pr = getProduct(c.productId);
                    if (!pr) return null;
                    return (
                      <li
                        key={c.id}
                        className="flex flex-col gap-3 rounded-2xl border border-steel bg-cloud p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-[15px] font-semibold text-ink">
                            {pr.name}
                          </p>
                          <p className="mt-1 text-[13px] text-slate">
                            {itemSpec(c)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            className={fieldClass + " !mt-0 max-w-[180px]"}
                            value={c.plan}
                            aria-label={`Payment plan for ${pr.name}`}
                            onChange={(e) => updatePlan(c.id, e.target.value)}
                          >
                            {PAY_PLANS.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="text-[13px] font-medium text-siscom"
                            onClick={() => removeItem(c.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
              <p className="mt-4 text-[12px] text-slate">
                Infrastructure is quoted after review. Leases are financed by
                SISCOM Capital.
              </p>
            </>
          ) : checkoutStep === 1 ? (
            <>
              <h2 id="growth-pane-title" className="text-[22px] font-semibold text-ink">
                Tell us about your ISP
              </h2>
              <p className="mt-2 text-[14px] text-slate">
                Your subscriber numbers and collections set your indicative
                limit.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["name", "ISP / business name", "text", "e.g. Kitengela Fibre Ltd"],
                    ["reg", "Business registration number", "text", "e.g. PVT-AB12CD3"],
                    ["ca", "CA licence number", "text", "Communications Authority licence"],
                    ["county", "Main county of operation", "select", ""],
                    ["subs", "Active subscribers", "number", "e.g. 300"],
                    ["arpu", "Average monthly bill per subscriber (KES)", "number", ""],
                    ["billing", "Current billing system", "select-billing", ""],
                    ["channels", "How subscribers pay today", "select-channels", ""],
                    ["contact", "Contact person", "text", ""],
                    ["email", "Email", "email", ""],
                    ["phone", "Phone", "tel", "+254 7xx xxx xxx"],
                  ] as const
                ).map(([key, label, type, ph]) => (
                  <Field
                    key={key}
                    label={label}
                    bad={badFields.includes(key)}
                  >
                    {type === "select" ? (
                      <select
                        className={fieldClass}
                        value={isp.county}
                        onChange={(e) => setIsp({ county: e.target.value })}
                      >
                        <option value="">Select…</option>
                        {GROWTH_COUNTIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    ) : type === "select-billing" ? (
                      <select
                        className={fieldClass}
                        value={isp.billing}
                        onChange={(e) => setIsp({ billing: e.target.value })}
                      >
                        <option value="">Select…</option>
                        {BILLING_OPTIONS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : type === "select-channels" ? (
                      <select
                        className={fieldClass}
                        value={isp.channels}
                        onChange={(e) => setIsp({ channels: e.target.value })}
                      >
                        <option value="">Select…</option>
                        {CHANNEL_OPTIONS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className={fieldClass}
                        type={type}
                        value={isp[key]}
                        placeholder={ph || undefined}
                        min={type === "number" ? 1 : undefined}
                        onChange={(e) => setIsp({ [key]: e.target.value })}
                      />
                    )}
                    {key === "ca" ? (
                      <span className="mt-1 block text-[12px] text-slate">
                        Required before financing is approved.
                      </span>
                    ) : null}
                  </Field>
                ))}
                <label className="block sm:col-span-2">
                  <span className="text-[13px] font-medium text-charcoal">
                    Anything else? (optional)
                  </span>
                  <textarea
                    className={fieldClass + " min-h-[88px]"}
                    value={isp.notes}
                    placeholder="Expansion plans, sites, current upstream provider"
                    onChange={(e) => setIsp({ notes: e.target.value })}
                  />
                </label>
              </div>
              {error ? (
                <p className="mt-4 text-[13px] font-medium text-[#EB1260]">
                  {error}
                </p>
              ) : null}
            </>
          ) : checkoutStep === 2 ? (
            <>
              <h2 id="growth-pane-title" className="text-[22px] font-semibold text-ink">
                Financing
              </h2>
              <p className="mt-2 text-[14px] text-slate">
                Choose how to fund this order. Loans are provided with Mkash, a
                CBK-licensed digital credit provider.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={!cart.length}
                  aria-pressed={fin.access}
                  onClick={() => {
                    const next = !fin.access;
                    setFin({ access: next });
                    cart.forEach((c) => {
                      if (next && c.plan === "Pay upfront") {
                        updatePlan(c.id, "Lease 24 months");
                      }
                      if (!next) updatePlan(c.id, "Pay upfront");
                    });
                  }}
                  className={`rounded-2xl border p-4 text-left transition ${
                    fin.access
                      ? "border-siscom bg-[#F8E8F0]"
                      : "border-steel bg-cloud"
                  } disabled:opacity-40`}
                >
                  <span className="tech-label text-slate">01</span>
                  <p className="mt-2 text-[15px] font-semibold text-ink">
                    Access infrastructure finance
                  </p>
                  <p className="mt-1 text-[13px] text-slate">
                    {cart.length
                      ? `Lease your ${cart.length} cart item${cart.length > 1 ? "s" : ""} over 12–36 months (${leased} on lease now)`
                      : "Add equipment to your cart to lease it"}
                  </p>
                </button>
                <button
                  type="button"
                  aria-pressed={fin.want}
                  onClick={() => setFin({ want: !fin.want })}
                  className={`rounded-2xl border p-4 text-left transition ${
                    fin.want
                      ? "border-siscom bg-[#F8E8F0]"
                      : "border-steel bg-cloud"
                  }`}
                >
                  <span className="tech-label text-slate">02</span>
                  <p className="mt-2 text-[15px] font-semibold text-ink">
                    Billing finance
                  </p>
                  <p className="mt-1 text-[13px] text-slate">
                    Advance against your subscriber billing on WASP
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeConsole();
                    requestAnimationFrame(() => {
                      document
                        .getElementById("check")
                        ?.scrollIntoView({ behavior: "smooth" });
                    });
                  }}
                  className="rounded-2xl border border-steel bg-cloud p-4 text-left transition hover:border-siscom sm:col-span-2"
                >
                  <span className="tech-label text-slate">03</span>
                  <p className="mt-2 text-[15px] font-semibold text-ink">
                    Working capital: check with M-Pesa statements →
                  </p>
                  <p className="mt-1 text-[13px] text-slate">
                    Upload 6 months of statements and see the business loan you
                    qualify for
                  </p>
                </button>
              </div>

              {fin.want ? (
                ind && ind.lim ? (
                  <div className="mt-6 space-y-4">
                    <Field label="Billing finance amount">
                      <div className="mt-2 flex items-center gap-4">
                        <input
                          type="range"
                          min={100_000}
                          max={ind.lim}
                          step={50_000}
                          value={Math.min(
                            Math.max(fin.amount, 100_000),
                            ind.lim,
                          )}
                          onChange={(e) =>
                            setFin({ amount: Number(e.target.value) })
                          }
                          className="w-full"
                        />
                        <span className="shrink-0 text-[14px] font-semibold text-ink">
                          {formatKes(
                            Math.min(Math.max(fin.amount, 100_000), ind.lim),
                          )}
                        </span>
                      </div>
                    </Field>
                    <div className="grid gap-3 rounded-2xl border border-steel bg-cloud p-4 sm:grid-cols-3">
                      <div>
                        <p className="text-[18px] font-semibold text-ink">
                          {formatKes(ind.c)}
                        </p>
                        <p className="text-[12px] text-slate">
                          monthly billing ({formatNumber(Number(isp.subs))} ×{" "}
                          {formatKes(Number(isp.arpu))})
                        </p>
                      </div>
                      <div>
                        <p className="text-[18px] font-semibold text-ink">
                          {formatKes(ind.lim)}
                        </p>
                        <p className="text-[12px] text-slate">
                          indicative maximum
                        </p>
                      </div>
                      <div>
                        <p className="text-[18px] font-semibold text-ink">
                          {formatKes(
                            (Math.min(Math.max(fin.amount, 100_000), ind.lim) *
                              1.25) /
                              12,
                          )}
                        </p>
                        <p className="text-[12px] text-slate">
                          est. monthly deduction, 12 months
                        </p>
                      </div>
                    </div>
                    <p className="text-[12px] text-slate">
                      Indicative only. Deductions are capped at about 10% of
                      monthly collections and taken through Cashia as
                      subscribers pay. Requires billing on WASP. Mkash confirms
                      the final limit.
                    </p>
                  </div>
                ) : (
                  <p className="mt-6 rounded-2xl border border-dashed border-steel bg-cloud px-4 py-5 text-[14px] text-slate">
                    Your monthly billing is below the minimum for a KES 100,000
                    advance today. Lease equipment instead, or check working
                    capital with your M-Pesa statements.
                  </p>
                )
              ) : null}

              {!fin.want && !fin.access ? (
                <p className="mt-4 text-[12px] text-slate">
                  {cart.length
                    ? "You can submit your equipment request without financing."
                    : "Select a financing option, or add equipment to your cart."}
                </p>
              ) : null}
              {error ? (
                <p className="mt-4 text-[13px] font-medium text-[#EB1260]">
                  {error}
                </p>
              ) : null}
            </>
          ) : checkoutStep === 3 ? (
            <>
              <h2 id="growth-pane-title" className="text-[22px] font-semibold text-ink">
                Review your application
              </h2>
              <p className="mt-2 text-[14px] text-slate">
                Check everything before you accept the terms.
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-steel bg-cloud p-4">
                  <h3 className="text-[14px] font-semibold text-ink">Your ISP</h3>
                  <dl className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
                    <div>
                      <dt className="text-slate">Business</dt>
                      <dd className="font-medium text-ink">{isp.name}</dd>
                    </div>
                    <div>
                      <dt className="text-slate">CA licence</dt>
                      <dd className="font-medium text-ink">{isp.ca}</dd>
                    </div>
                    <div>
                      <dt className="text-slate">County</dt>
                      <dd className="font-medium text-ink">{isp.county}</dd>
                    </div>
                    <div>
                      <dt className="text-slate">Active subscribers</dt>
                      <dd className="font-medium text-ink">
                        {formatNumber(Number(isp.subs) || 0)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate">Monthly collections</dt>
                      <dd className="font-medium text-ink">
                        {formatKes(ind?.c ?? 0)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate">Contact</dt>
                      <dd className="font-medium text-ink">
                        {isp.contact} · {isp.phone}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-2xl border border-steel bg-cloud p-4">
                  <h3 className="text-[14px] font-semibold text-ink">
                    Infrastructure ({cart.length})
                  </h3>
                  {cart.length === 0 ? (
                    <p className="mt-2 text-[13px] text-slate">
                      No infrastructure items
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {cart.map((c) => {
                        const pr = getProduct(c.productId);
                        return (
                          <li
                            key={c.id}
                            className="flex justify-between gap-3 text-[13px]"
                          >
                            <span>
                              <span className="font-medium text-ink">
                                {pr?.name}
                              </span>
                              <br />
                              <span className="text-slate">{itemSpec(c)}</span>
                            </span>
                            <span className="shrink-0 font-medium text-charcoal">
                              {c.plan}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <div className="rounded-2xl border border-steel bg-cloud p-4">
                  <h3 className="text-[14px] font-semibold text-ink">
                    Financing
                  </h3>
                  {fin.want && ind && ind.lim ? (
                    <dl className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
                      <div>
                        <dt className="text-slate">Facility</dt>
                        <dd className="font-medium text-ink">Billing finance</dd>
                      </div>
                      <div>
                        <dt className="text-slate">Amount requested</dt>
                        <dd className="font-medium text-ink">
                          {formatKes(
                            Math.min(Math.max(fin.amount, 100_000), ind.lim),
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate">Est. monthly repayment</dt>
                        <dd className="font-medium text-ink">
                          {formatKes(
                            (Math.min(Math.max(fin.amount, 100_000), ind.lim) *
                              1.25) /
                              12,
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate">Lender</dt>
                        <dd className="font-medium text-ink">
                          Mkash (CBK-licensed DCP)
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="mt-2 text-[13px] text-slate">
                      No financing requested
                      {fin.access ? " (infrastructure lease selected)" : ""}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 id="growth-pane-title" className="text-[22px] font-semibold text-ink">
                Terms and consent
              </h2>
              <p className="mt-2 text-[14px] text-slate">
                Please confirm each point before you submit.
              </p>
              <div className="mt-6 space-y-3">
                {(
                  [
                    [
                      "wasp",
                      "Billing and collections on WASP and Cashia",
                      "Financed ISPs move subscriber billing to WASP and collections to a Cashia gateway and wallet before disbursement.",
                    ],
                    [
                      "deduct",
                      "Repayment at source",
                      "I authorise agreed repayments for any facility or lease to be deducted from collections in my Cashia wallet before the balance is settled to me.",
                    ],
                    [
                      "data",
                      "Sharing my data for credit",
                      "I consent to SISCOM, Mkash and Cashia using my business, billing and payment data to assess and manage credit, in line with the Kenya Data Protection Act, 2019. Facilities are provided by Mkash, a CBK-licensed digital credit provider, and are subject to approval.",
                    ],
                    [
                      "accurate",
                      "Accurate information",
                      "The information I have provided is accurate, and I hold or will provide a valid Communications Authority licence. Quotes and limits shown are indicative until confirmed in writing.",
                    ],
                  ] as const
                ).map(([key, title, text]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer gap-3 rounded-2xl border border-steel bg-cloud p-4"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[#EB1260]"
                      checked={terms[key]}
                      onChange={(e) => setTerms({ [key]: e.target.checked })}
                    />
                    <span>
                      <span className="block text-[14px] font-semibold text-ink">
                        {title}
                      </span>
                      <span className="mt-1 block text-[13px] leading-[1.45] text-slate">
                        {text}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {error ? (
                <p className="mt-4 text-[13px] font-medium text-[#EB1260]">
                  {error}
                </p>
              ) : null}
            </>
          )}
        </div>

        {!doneRef ? (
          <div className="flex items-center justify-between gap-3 border-t border-steel px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className={
                mode === "checkout" && checkoutStep === 0
                  ? "invisible"
                  : undefined
              }
            >
              {mode === "config" ? "Cancel" : "Back"}
            </Button>
            <Button
              type="button"
              variant="primary"
              arrow={checkoutStep < 4 && mode === "checkout"}
              disabled={nextDisabled}
              onClick={onNext}
            >
              {nextLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
