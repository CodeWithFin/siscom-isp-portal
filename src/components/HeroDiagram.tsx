"use client";

import { motion } from "framer-motion";

const float = (delay = 0, y = 10) => ({
  y: [0, -y, 0],
  transition: {
    duration: 5.5 + delay,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

export function HeroDiagram() {
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[620px] sm:h-[520px] lg:h-[560px]">
      {/* Soft ambient wash */}
      <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(ellipse_at_65%_45%,rgba(235,18,96,0.10),transparent_52%),radial-gradient(ellipse_at_35%_70%,rgba(17,18,124,0.07),transparent_48%)]" />

      {/* Faint scrolling data foundation */}
      <div
        aria-hidden
        className="absolute inset-x-4 bottom-4 top-14 overflow-hidden rounded-[28px] opacity-[0.28]"
      >
        <motion.div
          className="absolute inset-0 font-mono text-[9px] leading-[1.7] text-[#71717a]"
          animate={{ y: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 80 }).map((_, i) => (
            <p key={i} className="whitespace-nowrap px-3">
              {`0x${(0xa1f0 + (i % 40) * 17).toString(16)}  IN ${1200 + (((i % 40) * 37) % 900)}  OUT ${800 + (((i % 40) * 53) % 700)}  NET ${4500 + (((i % 40) * 91) % 12000)}  ·  M-PESA · TILL · SCORE`}
            </p>
          ))}
        </motion.div>
      </div>

      {/* Connector wires into the stack */}
      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 620 560"
        fill="none"
        aria-hidden
      >
        <path
          d="M36 100 C130 100, 180 190, 250 235 S340 275, 390 278"
          stroke="#c4c4c8"
          strokeWidth="1.35"
        />
        <path
          d="M72 56 C160 56, 210 155, 280 210 S370 268, 410 282"
          stroke="#d4d4d8"
          strokeWidth="1.1"
        />
        <path
          d="M18 155 C120 155, 165 215, 235 250 S330 282, 380 288"
          stroke="#c4c4c8"
          strokeWidth="1.1"
        />
        <circle r="3.5" fill="#EB1260">
          <animateMotion
            dur="2.8s"
            repeatCount="indefinite"
            path="M36 100 C130 100, 180 190, 250 235 S340 275, 390 278"
          />
        </circle>
        <circle r="2.75" fill="#11127C">
          <animateMotion
            dur="3.4s"
            begin="0.8s"
            repeatCount="indefinite"
            path="M72 56 C160 56, 210 155, 280 210 S370 268, 410 282"
          />
        </circle>
        <circle r="2.75" fill="#CA3060">
          <animateMotion
            dur="3.1s"
            begin="1.4s"
            repeatCount="indefinite"
            path="M18 155 C120 155, 165 215, 235 250 S330 282, 380 288"
          />
        </circle>
      </svg>

      {/* Isometric stack — Basis Theory layered planes */}
      <div
        className="absolute left-[52%] top-[12%] z-20 h-[380px] w-[380px] -translate-x-1/2 sm:h-[420px] sm:w-[420px]"
        style={{ perspective: "1100px" }}
      >
        <div
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(60deg) rotateZ(-42deg)",
          }}
        >
          {/* Back plane */}
          <div
            className="absolute left-[4%] top-[10%] h-[62%] w-[78%]"
            style={{ transform: "translateZ(-48px)" }}
          >
            <motion.div
              className="h-full w-full rounded-[26px] border border-[#d4d4d8] bg-white/70 shadow-[0_16px_50px_rgba(4,8,37,0.08)] backdrop-blur-[1px]"
              animate={float(0.15, 7)}
            />
          </div>

          {/* Mid plane */}
          <div
            className="absolute left-[10%] top-[18%] h-[62%] w-[78%]"
            style={{ transform: "translateZ(0px)" }}
          >
            <motion.div
              className="relative h-full w-full rounded-[26px] border border-[#d4d4d8] bg-white/85 shadow-[0_18px_44px_rgba(4,8,37,0.1)]"
              animate={float(0.55, 10)}
            >
              <div className="absolute inset-5 rounded-[16px] border border-dashed border-[#e4e4e7]" />
            </motion.div>
          </div>

          {/* Front plane */}
          <div
            className="absolute left-[16%] top-[26%] h-[62%] w-[78%]"
            style={{ transform: "translateZ(42px)" }}
          >
            <motion.div
              className="relative h-full w-full rounded-[26px] border border-[#d4d4d8] bg-white shadow-[0_22px_50px_rgba(4,8,37,0.12)]"
              animate={float(0.95, 13)}
            >
              <div className="absolute inset-x-6 top-6 flex gap-1.5">
                <span className="h-1.5 w-10 rounded-full bg-[#ebebef]" />
                <span className="h-1.5 w-6 rounded-full bg-[#ebebef]" />
              </div>
              <div className="absolute inset-x-6 top-12 space-y-2">
                {[72, 50, 64, 40].map((w) => (
                  <div
                    key={w}
                    className="h-1.5 rounded-full bg-[#f4f4f5]"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              <div className="absolute bottom-7 left-6 right-10 h-[2px] overflow-hidden rounded-full bg-[#f4f4f5]">
                <motion.div
                  className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#11127C] to-[#EB1260]"
                  animate={{ x: ["-100%", "280%"] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>

          {/* Central dark floating tile */}
          <div
            className="absolute left-[32%] top-[14%] h-[42%] w-[42%]"
            style={{ transform: "translateZ(110px)" }}
          >
            <motion.div
              className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#18181b] shadow-[0_30px_60px_-12px_rgba(4,8,37,0.55)]"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -18, 0],
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.3 },
                scale: { duration: 0.8, delay: 0.3 },
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.9,
                },
              }}
            >
              <div className="relative flex h-[56%] w-[56%] items-center justify-center rounded-[14px] bg-[#27272a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
                <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-white/20" />
                <motion.div
                  className="h-[44%] w-[44%] rounded-[7px]"
                  style={{
                    background:
                      "linear-gradient(135deg, #EB1260 0%, #CA3060 55%, #7B1B3D 100%)",
                    boxShadow: "0 0 22px rgba(235,18,96,0.55)",
                  }}
                  animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating labels */}
      <motion.div
        className="absolute left-[2%] top-[26%] z-30 rounded-xl border border-[#d4d4d8] bg-white/95 px-3.5 py-2.5 shadow-[0_10px_28px_rgba(4,8,37,0.1)] backdrop-blur-sm"
        style={{ transform: "rotateX(10deg) rotateY(-16deg) rotateZ(-7deg)" }}
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71717a]">
          Statement
        </p>
        <p className="mt-0.5 font-mono text-[13px] font-semibold text-[#18181b]">
          ****7842
        </p>
      </motion.div>

      <motion.div
        className="absolute right-[2%] top-[42%] z-30 rounded-xl border border-[#d4d4d8] bg-white/95 px-3.5 py-2.5 shadow-[0_10px_28px_rgba(4,8,37,0.1)] backdrop-blur-sm"
        style={{ transform: "rotateX(8deg) rotateY(14deg) rotateZ(5deg)" }}
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.35,
        }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71717a]">
          Scoring
        </p>
        <p className="mt-0.5 text-[13px] font-semibold text-[#EB1260]">3.0× live</p>
      </motion.div>
    </div>
  );
}
