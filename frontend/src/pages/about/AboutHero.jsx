import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LanguageContext";
import aboutImg from "../../assets/images/about/about.png";

function BrowserFrame({ children }) {
  return (
    <div className="rounded-2xl overflow-hidden ">
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

export default function AboutHero() {
  const { t } = useTranslation("about");
  const { isRTL } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex items-center  pt-28 pb-20 px-6"
    >
      <div className="container mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-12 items-center">
        {/* Left — Text */}
        <div className="flex flex-col gap-5">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-extrabold text-[#0d1b4b]"
            style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)" }}
          >
            {t("hero.badge_title")}
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-bold text-[#0d1b4b]"
            style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)" }}
          >
            {t("hero.badge_subtitle")}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-bold text-[#1a1a1a] leading-[1.85]"
            style={{
              fontSize: "clamp(0.95rem, 1.1vw, 1rem)",
            }}
          >
            {t("hero.description")}
          </motion.p>
        </div>

        {/* Right — Browser screenshot */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <BrowserFrame>
            <img
              src={aboutImg}
              alt="Nawras HCM dashboard"
              className="w-full block"
            />
          </BrowserFrame>
        </motion.div>
      </div>
    </section>
  );
}
