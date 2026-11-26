"use client";

import { useEffect, useId, useState } from "react";

function useMountedProgress(ratio: number) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const clamped = Math.max(0, Math.min(1, Number.isFinite(ratio) ? ratio : 0));
    const id = window.requestAnimationFrame(() => setP(clamped));
    return () => window.cancelAnimationFrame(id);
  }, [ratio]);
  return p;
}

function polar(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  };
}

/** Sweep from π → 0 (left to right over the top). */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const s = polar(cx, cy, r, a0);
  const e = polar(cx, cy, r, a1);
  const large = a0 - a1 > Math.PI ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

type HeroDialProps = {
  label: string;
  valueLabel: string;
  ratio: number;
  caption?: string;
  status?: "ok" | "warn" | "muted";
};

export function HeroDial({
  label,
  valueLabel,
  ratio,
  caption,
  status = "muted",
}: HeroDialProps) {
  const uid = useId();
  const gradId = `dial-grad-${uid.replace(/:/g, "")}`;
  const p = useMountedProgress(ratio);
  const w = 280;
  const stroke = 14;
  const r = (w - stroke) / 2 - 8;
  const cx = w / 2;
  const cy = w / 2;
  const start = Math.PI;
  const end = 0;
  const length = Math.PI * r;
  const needleAngle = start - (start - end) * p;
  const tip = polar(cx, cy, r - 18, needleAngle);
  const hub = polar(cx, cy, 0, 0);

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    const a = start - (start - end) * t;
    const outer = polar(cx, cy, r + 6, a);
    const inner = polar(cx, cy, r - (i % 5 === 0 ? 10 : 5), a);
    return { outer, inner, major: i % 5 === 0 };
  });

  const accent =
    status === "ok" ? "#0F7A4C" : status === "warn" ? "#B7791F" : "#EB1260";

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={w}
        height={w * 0.58}
        viewBox={`0 0 ${w} ${w * 0.58}`}
        className="overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7B1B3D" />
            <stop offset="55%" stopColor="#EB1260" />
            <stop offset="100%" stopColor="#FF6B9D" />
          </linearGradient>
        </defs>

        {/* soft plate */}
        <path
          d={arcPath(cx, cy, r + 18, start, end)}
          fill="none"
          stroke="rgba(4,8,37,0.04)"
          strokeWidth={36}
          strokeLinecap="round"
        />

        {/* tick marks */}
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.inner.x}
            y1={tick.inner.y}
            x2={tick.outer.x}
            y2={tick.outer.y}
            stroke={tick.major ? "rgba(4,8,37,0.28)" : "rgba(4,8,37,0.12)"}
            strokeWidth={tick.major ? 1.5 : 1}
            strokeLinecap="round"
          />
        ))}

        {/* track */}
        <path
          d={arcPath(cx, cy, r, start, end)}
          fill="none"
          stroke="rgba(4,8,37,0.08)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* value arc */}
        <path
          d={arcPath(cx, cy, r, start, end)}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - p)}
          style={{
            transition: "stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* needle */}
        <line
          x1={hub.x}
          y1={hub.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#040825"
          strokeWidth={2}
          strokeLinecap="round"
          style={{
            transition: "all 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        <circle cx={cx} cy={cy} r={5} fill="#040825" />
        <circle cx={cx} cy={cy} r={2.2} fill="#fff" />
        <circle
          cx={tip.x}
          cy={tip.y}
          r={3.5}
          fill={accent}
          style={{
            transition: "all 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>

      <div className="-mt-6 flex flex-col items-center text-center">
        <p className="tech-label text-slate">{label}</p>
        <p className="mt-1 text-[34px] font-semibold tracking-[-0.04em] text-ink tabular-nums sm:text-[40px]">
          {valueLabel}
        </p>
        {caption ? (
          <p className="mt-1 text-[13px] font-medium text-slate">{caption}</p>
        ) : null}
      </div>
      <span className="sr-only">
        {label}: {valueLabel}
      </span>
    </div>
  );
}

type FlowMeterProps = {
  label: string;
  valueLabel: string;
  ratio: number;
  hint?: string;
  accent?: "siscom" | "ink" | "muted";
};

export function FlowMeter({
  label,
  valueLabel,
  ratio,
  hint,
  accent = "siscom",
}: FlowMeterProps) {
  const p = useMountedProgress(ratio);
  const fill =
    accent === "ink"
      ? "#040825"
      : accent === "muted"
        ? "#94A3B8"
        : "linear-gradient(90deg, #7B1B3D 0%, #EB1260 100%)";

  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-slate">
          {label}
        </p>
        <p className="text-[18px] font-semibold tracking-tight text-ink tabular-nums">
          {valueLabel}
        </p>
      </div>
      <div className="mt-2.5 h-[6px] overflow-hidden rounded-full bg-[#ECEFF3]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${p * 100}%`,
            background: fill,
            transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
      {hint ? (
        <p className="mt-1.5 text-[12px] text-slate/80">{hint}</p>
      ) : null}
    </div>
  );
}

/** @deprecated prefer HeroDial / FlowMeter */
export function MeterGauge(props: {
  label: string;
  valueLabel: string;
  ratio: number;
  tone?: string;
  size?: string;
  hint?: string;
}) {
  return (
    <FlowMeter
      label={props.label}
      valueLabel={props.valueLabel}
      ratio={props.ratio}
      hint={props.hint}
    />
  );
}
