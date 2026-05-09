import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LanguageContext";
import dashboardImg from "../../assets/images/our_solutions_dashboard.png";
import erpPersonImg from "../../assets/images/our_solutions_2.png";

// ─── Shared fade-up factory ───────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Dot grid decoration ─────────────────────────────────────────────────────
function DotGrid({ cols = 11, rows = 5, className = "" }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        width={cols * 22}
        height={rows * 22}
        viewBox={`0 0 ${cols * 22} ${rows * 22}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => (
            <circle
              key={`${r}-${c}`}
              cx={c * 22 + 11}
              cy={r * 22 + 11}
              r={2.2}
              fill="#000093"
              opacity={0.98}
            />
          )),
        )}
      </svg>
    </div>
  );
}

// ─── Swoosh divider ───────────────────────────────────────────────────────────
function SwooshDivider() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 90 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 60 Q360 0 720 45 Q1080 90 1440 30"
          stroke="url(#swoosh1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M0 70 Q400 10 760 52 Q1100 88 1440 42"
          stroke="url(#swoosh2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <defs>
          <linearGradient
            id="swoosh1"
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#01ab77" />
            <stop offset="55%" stopColor="#00cec9" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient
            id="swoosh2"
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#00cec9" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ─── Floating badge ───────────────────────────────────────────────────────────
function BestAwardBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: "0 12px 32px 0 rgba(0,0,0,0.14)" }}
      className="absolute z-20 top-6 end-0 flex items-center gap-2.5 bg-white rounded-2xl px-4 py-2.5 shadow-lg"
      style={{ boxShadow: "0 4px 20px 0 rgba(0,0,0,0.10)" }}
    >
      <span
        className="flex items-center justify-center w-8 h-8 rounded-full"
        style={{
          background: "linear-gradient(135deg, #0d1b4b 0%, #000093 100%)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z"
            fill="#fff"
            stroke="#fff"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="leading-tight">
        <p className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider">
          Best
        </p>
        <p className="text-[0.78rem] font-bold text-[#0d1b4b]">Tour Awards</p>
      </div>
    </motion.div>
  );
}

// ─── Income tooltip card ──────────────────────────────────────────────────────
function IncomeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: "0 10px 28px 0 rgba(0,0,0,0.13)" }}
      className="absolute z-20 bottom-6 start-0 bg-white rounded-2xl px-4 py-3 shadow-lg"
      style={{ boxShadow: "0 4px 18px 0 rgba(0,0,0,0.10)", minWidth: 148 }}
    >
      <p className="text-[0.65rem] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
        Total Income
      </p>
      <div className="flex items-end gap-2.5">
        <span className="text-[1.15rem] font-black text-[#0d1b4b] leading-none">
          $245.00
        </span>
        {/* Mini bar chart */}
        <svg
          width="28"
          height="18"
          viewBox="0 0 28 18"
          fill="none"
          className="mb-0.5"
        >
          <rect
            x="0"
            y="10"
            width="5"
            height="8"
            rx="1.5"
            fill="#000093"
            opacity="0.25"
          />
          <rect
            x="7.5"
            y="5"
            width="5"
            height="13"
            rx="1.5"
            fill="#000093"
            opacity="0.4"
          />
          <rect x="15" y="1" width="5" height="17" rx="1.5" fill="#000093" />
          <rect
            x="22.5"
            y="7"
            width="5"
            height="11"
            rx="1.5"
            fill="#000093"
            opacity="0.55"
          />
        </svg>
      </div>
    </motion.div>
  );
}

// ─── Browser frame wrapper for dashboard screenshot ──────────────────────────
function BrowserFrame({ children }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-white"
      style={{
        boxShadow:
          "0 8px 48px 0 rgba(13,27,75,0.13), 0 1.5px 4px 0 rgba(0,0,0,0.07)",
      }}
    >
      {/* Traffic lights bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f3f4f6] border-b border-gray-200">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div className="flex-1 mx-4 h-5 bg-white rounded-full border border-gray-200 flex items-center px-3">
          <span className="text-[0.6rem] text-gray-400 truncate">
            nawras.io/hr-dashboard
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Orbital ring decoration ─────────────────────────────────────────────────
function OrbitalRings() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse
        cx="240"
        cy="240"
        rx="220"
        ry="130"
        stroke="#000093"
        strokeWidth="1"
        opacity="0.12"
        strokeDasharray="6 5"
        transform="rotate(-18 240 240)"
      />
      <ellipse
        cx="240"
        cy="240"
        rx="196"
        ry="108"
        stroke="#000093"
        strokeWidth="0.8"
        opacity="0.08"
        strokeDasharray="4 6"
        transform="rotate(8 240 240)"
      />
      <ellipse
        cx="240"
        cy="240"
        rx="172"
        ry="88"
        stroke="#01ab77"
        strokeWidth="0.7"
        opacity="0.1"
        transform="rotate(-30 240 240)"
      />
    </svg>
  );
}

// ─── HCM Section ─────────────────────────────────────────────────────────────
function HCMSection() {
  const { t } = useTranslation("common");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isMobile = window.innerWidth < 640;

  return (
    <div
      ref={ref}
      className="relative max-w-7xl mx-auto px-6 lg:px-16 py-16 lg:py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* ── Text ── */}
        <div className="relative z-10 order-2 lg:order-1">
          <motion.h3
            {...fadeUp(0)}
            className="text-2xl lg:text-[2rem] font-bold text-[#0d1b4b] leading-tight mb-6"
            style={{ letterSpacing: "-0.025em" }}
          >
            {t("hcmHeading")}
          </motion.h3>
          <motion.p
            {...fadeUp(0.1)}
            className="text-[1.05rem] font-semibold text-gray-700 leading-relaxed"
          >
            {t("hcmDescription")}
          </motion.p>

          {/* Teal accent line */}
          <motion.span
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="block mt-8 h-1 w-16 rounded-full origin-start"
            style={{ background: "linear-gradient(90deg, #01ab77, #00cec9)" }}
          />
        </div>

        {/* ── Dashboard image ── */}
        <div className="relative order-1 lg:order-2">
          {/* Dot grid — top-right */}
          <DotGrid
            cols={isMobile ? 10 : 14}
            rows={isMobile ? 8 : 12}
            className="md:top-[-90px] top-[-20px] end-[-30px]  md:end-[-50px] z-0"
          />

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 0.75,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              y: -6,
              transition: { duration: 0.4, ease: "easeOut" },
            }}
            className="relative z-10"
          >
            <BrowserFrame>
              <img
                src={dashboardImg}
                alt="Nawras HR Dashboard"
                className="w-full h-auto block select-none"
                draggable={false}
              />
            </BrowserFrame>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── ERP Section ─────────────────────────────────────────────────────────────
function ERPSection() {
  const { t } = useTranslation("common");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="relative max-w-7xl mx-auto px-6 lg:px-16 py-16 lg:py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* ── Person image (left) ── */}
        <div className="relative flex justify-center lg:justify-start">
          {/* Orbital rings behind the circle */}
          <div className="relative" style={{ width: "auto", height: 390 }}>
            <OrbitalRings />

            {/* Circular clipped image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.75,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative  z-10 w-full h-full 
               overflow-hidden"
            >
              <img
                src={erpPersonImg}
                alt="Professional working on ERP system"
                className="  mx-auto h-auto w-full md:h-full object-cover select-none"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>

        {/* ── Text (right) ── */}
        <div className="relative z-10">
          <motion.h3
            {...fadeUp(0.05)}
            className="text-2xl lg:text-[2rem] font-bold text-[#0d1b4b] leading-tight mb-6"
            style={{ letterSpacing: "-0.025em" }}
          >
            {t("erpHeading")}
          </motion.h3>
          <motion.p
            {...fadeUp(0.15)}
            className="text-[1.05rem] font-semibold text-gray-700 leading-relaxed"
          >
            {t("erpDescription")}
          </motion.p>

          {/* Teal accent line */}
          <motion.span
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="block mt-8 h-1 w-16 rounded-full origin-start"
            style={{ background: "linear-gradient(90deg, #01ab77, #00cec9)" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function OurSolutions() {
  const { t } = useTranslation("common");
  const { isRTL } = useLang();
  const fontFamily = isRTL
    ? "'Helvetica Neue Arabic', 'Helvetica Neue', sans-serif"
    : "'Helvetica Neue', sans-serif";

  return (
    <section
      className="relative w-full bg-white overflow-hidden"
      aria-label="Our Solutions"
    >
      {/* ── Section heading ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-20 pb-0">
        <motion.h2
          {...fadeUp(0)}
          className="text-5xl lg:text-[3rem] font-black text-[#0d1b4b]"
          style={{
            letterSpacing: isRTL ? "-0.015em" : "-0.035em",
            fontFamily,
          }}
        >
          {t("ourSolutionsHeading")}
        </motion.h2>
      </div>

      {/* ── HCM part ── */}
      <HCMSection />

      {/* ── Swoosh separator ── */}
      <SwooshDivider />

      {/* ── ERP part ── */}
      <ERPSection />
    </section>
  );
}
