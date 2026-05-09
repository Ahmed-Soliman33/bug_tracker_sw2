import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LanguageContext";

// ─── Swoosh background SVG ────────────────────────────────────────────────────
function SwooshBg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 700"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="swoosh-grad" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%"   stopColor="#00cec9" stopOpacity="0.55" />
          <stop offset="45%"  stopColor="#00b894" stopOpacity="0.35" />
          <stop offset="75%"  stopColor="#818cf8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.3"  />
        </linearGradient>
      </defs>
      {/* Main sweeping stroke — starts left at ~row-1 height, arcs through row-2 */}
      <path
        d="M-60 260 C180 200, 380 420, 720 340 S1100 200, 1500 380"
        stroke="url(#swoosh-grad)"
        strokeWidth="52"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      {/* Thinner echo */}
      <path
        d="M-60 260 C180 200, 380 420, 720 340 S1100 200, 1500 380"
        stroke="url(#swoosh-grad)"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
    </svg>
  );
}

// ─── Single value card ────────────────────────────────────────────────────────
function ValueCard({ title, text, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: 0.08 * index,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 52px rgba(13,27,75,0.11)",
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className="relative bg-white rounded-[22px] shadow-[0_4px_20px_rgba(13,27,75,0.07)] border border-slate-100/80 px-8 py-10 flex flex-col items-center text-center cursor-default overflow-hidden group"
    >
      {/* Subtle teal top-edge glow on hover */}
      <span className="absolute top-0 inset-x-0 h-[3px] rounded-t-[22px] bg-gradient-to-r from-[#00cec9] to-[#818cf8] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <h3
        className="font-extrabold text-[#0d1b4b] mb-5 leading-snug"
        style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}
      >
        {title}
      </h3>
      <p
        className="text-[#0d1b4b] leading-[1.85] font-medium"
        style={{ fontSize: "clamp(0.88rem, 1vw, 0.93rem)" }}
      >
        {text}
      </p>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AboutValues() {
  const { t } = useTranslation("about");
  const { isRTL } = useLang();
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-40px" });

  const items = t("values.items", { returnObjects: true });

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative bg-[#f8f9fc] py-24 px-6 overflow-hidden"
    >
      <SwooshBg />

      <div className="container mx-auto w-full relative z-10">
        {/* Heading */}
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-extrabold text-[#0d1b4b] mb-14"
          style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)" }}
        >
          {t("values.heading")}
        </motion.h2>

        {/* 3-column grid, 2 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(items) &&
            items.map((item, i) => (
              <ValueCard
                key={i}
                index={i}
                title={item.title}
                text={item.text}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
