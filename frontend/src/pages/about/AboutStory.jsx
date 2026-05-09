import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LanguageContext";
import aboutImg from "../../assets/images/about/about.png";

// ─── SVG Icons (exact paths from spec) ───────────────────────────────────────
function GlobeIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32.0006 58.6693C46.7282 58.6693 58.6673 46.7302 58.6673 32.0026C58.6673 17.275 46.7282 5.33594 32.0006 5.33594C17.2731 5.33594 5.33398 17.275 5.33398 32.0026C5.33398 46.7302 17.2731 58.6693 32.0006 58.6693Z"
        stroke="#00007B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.3329 8H23.9996C18.7996 23.5733 18.7996 40.4267 23.9996 56H21.3329"
        stroke="#00007B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 8C45.2 23.5733 45.2 40.4267 40 56"
        stroke="#00007B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 42.6667V40C23.5733 45.2 40.4267 45.2 56 40V42.6667"
        stroke="#00007B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 24.0016C23.5733 18.8016 40.4267 18.8016 56 24.0016"
        stroke="#00007B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 40.0026C41.9411 40.0026 50 32.2422 50 22.6693C50 13.0963 41.9411 5.33594 32 5.33594C22.0589 5.33594 14 13.0963 14 22.6693C14 32.2422 22.0589 40.0026 32 40.0026Z"
        stroke="#00007B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.054 36.0503L20.0273 55.7303C20.0273 58.1303 21.7074 59.3036 23.7874 58.317L30.934 54.9303C31.5207 54.637 32.5073 54.637 33.094 54.9303L40.2673 58.317C42.3207 59.277 44.0273 58.1303 44.0273 55.7303V35.5703"
        stroke="#00007B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Browser frame (shared style) ────────────────────────────────────────────
function BrowserFrame({ children }) {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 bg-[#f3f4f6] border-b border-slate-200">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <div className="flex-1 mx-4">
          <div className="rounded-full h-5 px-3 flex items-center gap-1.5 border border-slate-200 max-w-[200px] mx-auto">
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="3.5"
                cy="3.5"
                r="2.8"
                stroke="#9ca3af"
                strokeWidth="0.9"
              />
              <path
                d="M5.8 5.8L7 7"
                stroke="#9ca3af"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[9px] text-slate-400 font-medium">
              app.youra.io
            </span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Commitment card ──────────────────────────────────────────────────────────
function CommitmentCard({ icon, title, text, delay, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(13,27,75,0.10)" }}
      className={`bg-white rounded-[24px] shadow-[0_4px_24px_rgba(13,27,75,0.07)] border border-slate-100 px-10 py-12 flex flex-col items-center text-center transition-shadow duration-300 ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{
          delay: delay + 0.15,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mb-6"
      >
        {icon}
      </motion.div>
      <h3
        className="font-extrabold text-[#0d1b4b] mb-5"
        style={{ fontSize: "clamp(1.25rem, 1.8vw, 1.5rem)" }}
      >
        {title}
      </h3>
      <p
        className="text-slate-500 font-semibold leading-[1.8]"
        style={{ fontSize: "clamp(0.88rem, 1vw, 0.95rem)" }}
      >
        {text}
      </p>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AboutStory() {
  const { t } = useTranslation("about");
  const { isRTL } = useLang();
  const topRef = useRef(null);
  const topInView = useInView(topRef, { once: true, margin: "-60px" });

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="bg-white py-20 px-6">
      <div className="container mx-auto w-full">
        {/* ── Lower: staggered cards ────────────────────────────────── */}
        <div className="relative  flex flex-col gap-16 lg:gap-24">
          {/* Journey card — left, full width on mobile, ~60% on desktop */}
          <div className="lg:w-[62%]">
            <CommitmentCard
              icon={<GlobeIcon />}
              title={t("story.journey_title")}
              text={t("story.journey_text")}
              delay={0.1}
            />
          </div>

          {/* Promise card — right, offset down */}
          <div className="lg:w-[62%] lg:ms-auto mt-8 lg:-mt-8">
            <CommitmentCard
              icon={<MedalIcon />}
              title={t("story.promise_title")}
              text={t("story.promise_text")}
              delay={0.2}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
