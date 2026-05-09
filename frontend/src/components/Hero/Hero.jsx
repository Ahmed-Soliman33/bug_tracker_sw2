import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiPlay } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { heroData } from "../../mockData";
import HeroBackground from "./HeroBackground";
import HeroCollage from "./HeroCollage";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const { t } = useTranslation("hero");
  const { t: tc } = useTranslation("common");

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text content */}
          <div className="flex flex-col items-start">
            {/* Heading */}
            <motion.h1
              {...fadeUp(0.2)}
              className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#000093] leading-[1.15] tracking-tight mb-6"
            >
              {t("headingBefore")}{" "}
              <span className="text-[#01ab77]">{t("headingAccent")}</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              {...fadeUp(0.32)}
              className="text-base md:text-lg text-slate-500 leading-relaxed max-w-lg mb-10"
            >
              {t("subtext")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.44)}
              className="flex flex-col xs:flex-row flex-wrap gap-3 w-full sm:w-auto"
            >
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#000093] text-white text-sm font-bold hover:bg-[#1a2d6b] active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full xs:w-auto"
              >
                {tc("requestDemo")}
              </Link>
              <Link
                to="/watch"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full border-2 border-[#01CD8F] text-[#000] text-sm font-bold hover:bg-[#01CD8F] hover:text-white active:scale-95 transition-all duration-200 group w-full xs:w-auto"
              >
                <span className="w-7 h-7 rounded-full bg-[#01CD8F] group-hover:bg-white flex items-center justify-center shrink-0 transition-colors duration-200">
                  <FiPlay
                    size={12}
                    className="text-white group-hover:text-[#000093] ms-0.5 transition-colors duration-200"
                  />
                </span>
                {tc("watchDemo")}
              </Link>
            </motion.div>
          </div>

          {/* Image collage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden lg:flex items-center"
          >
            <HeroCollage images={heroData.collageImages} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
