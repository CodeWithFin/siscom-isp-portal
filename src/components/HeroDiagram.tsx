"use client";

import { motion } from "framer-motion";

export function HeroDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      <motion.div
        className="animate-float-sheet absolute inset-x-6 top-8 bottom-16 rounded-2xl border border-steel bg-cloud shadow-[var(--shadow-technical-card)]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      />

      <motion.div
        className="animate-float-sheet-alt absolute inset-x-3 top-14 bottom-10 overflow-hidden rounded-2xl border border-steel bg-paper shadow-[var(--shadow-cloud-card)]"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        <div className="construction-grid absolute inset-0 opacity-60" />
        <div className="relative p-5">
          <p className="tech-label text-slate">CASHFLOW.LAYER</p>
          <div className="mt-4 space-y-2">
            {[78, 54, 66, 42, 88].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-siscom" />
                <div
                  className="h-2 rounded-full bg-siscom-soft"
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
          </div>
          <div className="signal-line mt-6 w-2/3" />
        </div>
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-[42%] rounded-2xl bg-navy-mid p-5 text-paper shadow-[var(--shadow-graphite-card)]"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between">
          <p className="tech-label text-white/55">PRE-QUAL OFFER</p>
          <span className="rounded-full bg-siscom px-2.5 py-0.5 text-[11px] font-semibold text-white">
            LIVE
          </span>
        </div>
        <p className="mt-3 font-[family-name:var(--font-display)] text-[40px] leading-none tracking-[-0.04em]">
          3.0×
        </p>
        <p className="mt-2 text-[14px] font-medium text-white/55">
          Avg monthly net cash flow multiplier
        </p>

        <svg className="mt-5 h-12 w-full" viewBox="0 0 280 48" fill="none">
          <path
            className="animate-pulse-route"
            d="M4 36 C40 36, 50 8, 90 8 S140 40, 180 40 230 12, 276 12"
            stroke="url(#signal)"
            strokeWidth="2"
            fill="none"
          />
          <defs>
            <linearGradient id="signal" x1="0" y1="0" x2="280" y2="0">
              <stop stopColor="#11127C" />
              <stop offset="1" stopColor="#EB1260" />
            </linearGradient>
          </defs>
          <circle cx="90" cy="8" r="3.5" fill="#EB1260" />
          <circle cx="180" cy="40" r="3.5" fill="#CA3060" />
        </svg>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { label: "IN", value: "248k" },
            { label: "OUT", value: "171k" },
            { label: "NET", value: "77k" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-white/5 px-2 py-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            >
              <p className="tech-label text-[11px] text-white/40">{item.label}</p>
              <p className="mt-1 text-[14px] font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-4 right-2 rounded-full border border-steel bg-paper px-3 py-2 shadow-[var(--shadow-technical-card)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <p className="tech-label text-siscom">ODPC · 256-bit</p>
      </motion.div>
    </div>
  );
}
