"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const CARD_LAST4 = ["1302", "7842", "0601", "4521", "9188"];

function FlyingLabel({
  title,
  value,
  accent = false,
  className,
  tilt,
}: {
  title: string;
  value: string;
  accent?: boolean;
  className: string;
  tilt: string;
}) {
  return (
    <div className={`absolute z-30 ${className}`} style={{ transform: tilt }}>
      <motion.div
        className="rounded-2xl border border-[#e4e4e7] bg-white px-3.5 py-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
        animate={{ y: [0, -10, 0], opacity: [0.88, 1, 0.88] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <p
          className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#71717a]"
          style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
        >
          {title}
        </p>
        <p
          className={`mt-0.5 text-[13px] font-semibold tracking-tight ${
            accent ? "text-[#EB1260]" : "text-[#18181b]"
          }`}
          style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
        >
          {value}
        </p>
      </motion.div>
    </div>
  );
}

export function HeroDiagram() {
  const [scene, setScene] = useState<"dashboard" | "card">("dashboard");
  const [last4, setLast4] = useState(CARD_LAST4[0]);

  useEffect(() => {
    const sceneTimer = window.setInterval(() => {
      setScene((s) => (s === "dashboard" ? "card" : "dashboard"));
    }, 3800);
    const cardTimer = window.setInterval(() => {
      setLast4((prev) => {
        const idx = CARD_LAST4.indexOf(prev);
        return CARD_LAST4[(idx + 1) % CARD_LAST4.length];
      });
    }, 1400);
    return () => {
      window.clearInterval(sceneTimer);
      window.clearInterval(cardTimer);
    };
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(235,18,96,0.07),transparent_65%)]" />

      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          {scene === "dashboard" ? (
            <motion.div
              key="dashboard"
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{
                opacity: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <Image
                src="/brand/hero-dashboard.png"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 90vw, 560px"
                className="select-none object-contain"
                draggable={false}
              />
            </motion.div>
          ) : (
            <motion.div
              key="card"
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{
                opacity: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 5.8, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <Image
                src="/brand/hero-card.png"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 90vw, 560px"
                className="select-none object-contain"
                draggable={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FlyingLabel
        title="Routing"
        value="SCORE"
        accent
        className="left-[4%] top-[20%]"
        tilt="perspective(900px) rotateX(28deg) rotateY(-36deg) rotateZ(-18deg)"
      />

      <FlyingLabel
        title="CARD"
        value={`****${last4}`}
        className="right-[2%] top-[16%]"
        tilt="perspective(900px) rotateX(26deg) rotateY(38deg) rotateZ(16deg)"
      />

      <FlyingLabel
        title="Offer"
        value="3.0× live"
        accent
        className="bottom-[14%] left-[12%]"
        tilt="perspective(900px) rotateX(22deg) rotateY(-24deg) rotateZ(-8deg)"
      />
    </div>
  );
}
