"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";

const CARD_LAST4 = ["1302", "7842", "0601", "4521", "9188"];

function DashboardScene() {
  return (
    <div
      className="relative h-[300px] w-[340px] sm:h-[340px] sm:w-[380px]"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(58deg) rotateZ(-32deg)",
        }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-[8%] rounded-[28px] border-[2.5px] border-[#a1a1aa] bg-[#f4f4f5] shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
          {/* sidebar */}
          <div className="absolute bottom-[6%] left-[4%] top-[6%] w-[22%] rounded-2xl border-2 border-[#a1a1aa] bg-[#fafafa]">
            <div className="flex h-full flex-col justify-start gap-3 p-3 pt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-[#71717a]" />
                  <span className="h-[2px] flex-1 rounded bg-[#a1a1aa]" />
                </div>
              ))}
            </div>
          </div>

          {/* top bar */}
          <div className="absolute left-[30%] right-[4%] top-[6%] flex h-[12%] items-center gap-2 rounded-xl border-2 border-[#a1a1aa] bg-[#fafafa] px-3">
            <span className="h-2 w-2 rounded-full bg-[#d4d4d8]" />
            <span className="h-2 w-2 rounded-full bg-[#d4d4d8]" />
            <span className="h-2 w-2 rounded-full bg-[#d4d4d8]" />
            <span className="ml-2 h-3 w-8 rounded-full border border-[#a1a1aa]" />
            <span className="h-3 w-8 rounded-full border border-[#a1a1aa]" />
            <span className="ml-auto h-4 w-4 rounded-full border-2 border-[#a1a1aa]" />
          </div>

          {/* hatch panel */}
          <div
            className="absolute bottom-[28%] left-[30%] h-[42%] w-[36%] rounded-2xl border-2 border-[#a1a1aa]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg,#c4c4c8 0 1px,transparent 1px 7px)",
              backgroundColor: "#fafafa",
            }}
          />

          {/* side cards */}
          <div className="absolute right-[4%] top-[24%] h-[14%] w-[26%] rounded-xl border-2 border-[#a1a1aa] bg-[#fafafa]" />
          <div className="absolute right-[4%] top-[42%] h-[14%] w-[26%] rounded-xl border-2 border-[#a1a1aa] bg-[#fafafa]" />
          <div className="absolute bottom-[6%] left-[30%] h-[16%] w-[28%] rounded-xl border-2 border-[#a1a1aa] bg-[#fafafa]" />
          <div className="absolute bottom-[6%] left-[62%] h-[16%] w-[18%] rounded-xl border-2 border-[#a1a1aa] bg-[#fafafa]" />
          <div className="absolute bottom-[8%] right-[4%] h-[12%] w-[12%] rounded-full bg-[#18181b]" />
        </div>
      </motion.div>
    </div>
  );
}

function CardScene() {
  return (
    <div
      className="relative h-[300px] w-[340px] sm:h-[340px] sm:w-[380px]"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(58deg) rotateZ(-32deg)",
        }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="relative h-[58%] w-[72%] rounded-[28px] shadow-[0_35px_70px_rgba(0,0,0,0.18)]"
          style={{
            background:
              "linear-gradient(145deg, #d4d4d8 0%, #a1a1aa 45%, #8b8b93 100%)",
            transform: "translateZ(20px)",
          }}
        >
          {/* Chip plate */}
          <div className="absolute left-1/2 top-1/2 flex h-[48%] w-[38%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[18px] bg-[#18181b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-[#3f3f46]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#3f3f46]" />
            <span className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-[#3f3f46]" />
            <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-[#3f3f46]" />
            {/* Siscom geometric mark */}
            <div className="relative h-[46%] w-[46%]">
              <span className="absolute left-0 top-0 h-[42%] w-[42%] rounded-[4px] bg-[#EB1260] shadow-[0_0_16px_rgba(235,18,96,0.55)]" />
              <span className="absolute bottom-0 left-0 h-[52%] w-[42%] rounded-bl-[4px] bg-[#CA3060]" />
              <span className="absolute right-0 top-[8%] h-[84%] w-[52%] rounded-r-[4px] bg-[#EB1260] shadow-[0_0_16px_rgba(235,18,96,0.45)]" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FlyingLabel({
  title,
  value,
  accent = false,
  style,
  animate,
}: {
  title: string;
  value: string;
  accent?: boolean;
  style?: CSSProperties;
  animate: object;
}) {
  return (
    <motion.div
      className="absolute z-30 rounded-xl border border-[#d4d4d8] bg-white px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
      style={style}
      animate={animate}
      transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#71717a]">
        {title}
      </p>
      <p
        className={`mt-0.5 font-mono text-[13px] font-semibold ${
          accent ? "text-[#EB1260]" : "text-[#18181b]"
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}

export function HeroDiagram() {
  const [scene, setScene] = useState<"dashboard" | "card">("dashboard");
  const [last4, setLast4] = useState(CARD_LAST4[0]);

  useEffect(() => {
    const sceneTimer = window.setInterval(() => {
      setScene((s) => (s === "dashboard" ? "card" : "dashboard"));
    }, 4200);
    const cardTimer = window.setInterval(() => {
      setLast4((prev) => {
        const idx = CARD_LAST4.indexOf(prev);
        return CARD_LAST4[(idx + 1) % CARD_LAST4.length];
      });
    }, 1600);
    return () => {
      window.clearInterval(sceneTimer);
      window.clearInterval(cardTimer);
    };
  }, []);

  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[560px] overflow-hidden sm:h-[480px] lg:h-[520px]">
      {/* Soft wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(235,18,96,0.06),transparent_55%)]" />

      {/* Wireframe path lines (Basis Theory routing lines) */}
      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 560 520"
        fill="none"
        aria-hidden
      >
        <path
          d="M30 120 C110 120, 170 200, 250 250 S340 300, 400 305"
          stroke="#d4d4d8"
          strokeWidth="1.4"
        />
        <path
          d="M60 70 C150 70, 200 170, 280 230 S380 300, 430 310"
          stroke="#e4e4e7"
          strokeWidth="1.2"
        />
        <path
          d="M20 180 C100 180, 160 230, 240 270 S340 310, 390 315"
          stroke="#d4d4d8"
          strokeWidth="1.2"
        />
        <circle r="3" fill="#EB1260">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M30 120 C110 120, 170 200, 250 250 S340 300, 400 305"
          />
        </circle>
        <circle r="2.5" fill="#18181b">
          <animateMotion
            dur="3.6s"
            begin="0.9s"
            repeatCount="indefinite"
            path="M60 70 C150 70, 200 170, 280 230 S380 300, 430 310"
          />
        </circle>
      </svg>

      {/* Scenes */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {scene === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <DashboardScene />
            </motion.div>
          ) : (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <CardScene />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Flying labels — same language as Basis Theory Routing / CARD chips */}
      <FlyingLabel
        title="Routing"
        value="SCORE"
        accent
        style={{
          left: "8%",
          top: "18%",
          transform: "rotateX(18deg) rotateY(-28deg) rotateZ(-10deg)",
        }}
        animate={{
          x: [0, 18, 0],
          y: [0, -14, 0],
          opacity: [0.75, 1, 0.75],
        }}
      />

      <FlyingLabel
        title="CARD"
        value={`****${last4}`}
        style={{
          right: "6%",
          top: "28%",
          transform: "rotateX(16deg) rotateY(26deg) rotateZ(8deg)",
        }}
        animate={{
          x: [0, -16, 0],
          y: [0, 12, 0],
          opacity: [0.8, 1, 0.8],
        }}
      />

      <FlyingLabel
        title="Offer"
        value="3.0×"
        accent
        style={{
          left: "18%",
          bottom: "14%",
          transform: "rotateX(12deg) rotateY(-18deg) rotateZ(-4deg)",
        }}
        animate={{
          y: [0, -10, 0],
          opacity: [0.7, 1, 0.7],
        }}
      />
    </div>
  );
}
