import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LanguageContext";

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { key: "stat1", value: 40, suffix: "%", label: "fasterOnboarding" },
  { key: "stat2", value: 60, suffix: "%", label: "improvedProductivity" },
  { key: "stat3", value: 3, suffix: "x", label: "roiMultiplier" },
  { key: "stat4", value: 90, suffix: "%", label: "clientRetention" },
];

// ─── Counter hook ─────────────────────────────────────────────────────────────
function useCounter(target, inView, duration = 1.6) {
  const [display, setDisplay] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  return display;
}

// ─── Single stat cell ─────────────────────────────────────────────────────────
function StatCell({ value, suffix, label, delay, inView }) {
  const { t } = useTranslation("common");
  const count = useCounter(value, inView, 1.5);

  return (
    <motion.div
      className="group flex flex-col items-start justify-center text-left px-4 py-6 sm:px-6 sm:py-8 relative"
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Number */}
      <span
        className="block font-black leading-none text-white select-none"
        style={{
          fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
          letterSpacing: "-0.03em",
        }}
      >
        {count}
        <span style={{ fontSize: "0.76em" }}>{suffix}</span>
      </span>

      {/* Label */}
      <span
        className="block mt-2 text-white/75 font-bold capitalize tracking-widest text-start leading-snug"
        style={{ fontSize: "clamp(0.62rem, 1.1vw, 0.8rem)" }}
      >
        {t(label)}
      </span>

      {/* Hover shimmer underline */}
      <span
        className="absolute bottom-0 inset-x-4 sm:inset-x-6 h-px bg-white/0 group-hover:bg-white/40 transition-colors duration-300"
        aria-hidden="true"
      />
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ImpactBar() {
  const { t } = useTranslation("common");
  const { isRTL } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const fontFamily = isRTL
    ? "'Helvetica Neue Arabic', 'Helvetica Neue', sans-serif"
    : "'Helvetica Neue', sans-serif";

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      aria-label="Impact statistics"
    >
      {/* ── Mobile / tablet: stacked layout ───────────────────────────────── */}
      {/* ── Desktop: side-by-side layout ──────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row">

        {/* ── Left: Dark hook block ────────────────────────────────────────── */}
        <motion.div
          className="relative flex items-center justify-start bg-[#00001D] px-8 py-10 sm:px-10 sm:py-12 lg:py-20 lg:px-14 lg:shrink-0"
          style={{ width: "auto" }}
          initial={{ opacity: 0, x: -28 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Vertical rule — only visible on desktop (side-by-side) */}
          <span
            className="hidden lg:block absolute end-0 inset-y-0 w-px bg-white/8 z-10"
            aria-hidden="true"
          />
          {/* Horizontal rule — only visible on mobile/tablet (stacked) */}
          <span
            className="lg:hidden absolute bottom-0 inset-x-0 h-px bg-white/8 z-10"
            aria-hidden="true"
          />

          <p
            className="text-white font-bold leading-tight max-w-xs lg:max-w-[280px] xl:max-w-[360px]"
            style={{
              fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
              letterSpacing: isRTL ? "-0.01em" : "-0.025em",
              fontFamily,
            }}
          >
            {t("impactHook")}
          </p>
        </motion.div>

        {/* ── Right: Gradient stats block ──────────────────────────────────── */}
        <div className="relative flex-1 flex items-stretch bg-[#01CD8F]">
          {/* Subtle noise texture overlay for depth */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "120px 120px",
            }}
            aria-hidden="true"
          />

          {/* Stats grid — 2-col on mobile, 4-col on desktop */}
          <div className="relative z-10 flex-1 grid grid-cols-2 lg:grid-cols-4 gap-0 divide-white/15 py-6 sm:py-8 px-2 sm:px-4
                          [&>*:nth-child(n+2)]:border-s [&>*:nth-child(n+2)]:border-s-white/15
                          lg:[&>*:nth-child(2)]:border-s lg:[&>*:nth-child(2)]:border-s-white/15
                          [&>*:nth-child(3)]:border-t [&>*:nth-child(3)]:border-t-white/15
                          [&>*:nth-child(4)]:border-t [&>*:nth-child(4)]:border-t-white/15
                          lg:[&>*:nth-child(3)]:border-t-0
                          lg:[&>*:nth-child(4)]:border-t-0">
            {STATS.map((s, i) => (
              <StatCell
                key={s.key}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                delay={0.12 + i * 0.09}
                inView={inView}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
