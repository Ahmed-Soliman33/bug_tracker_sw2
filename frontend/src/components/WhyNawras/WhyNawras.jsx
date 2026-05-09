import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import whyNawrasImg from "../../assets/images/why-nawras.png";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function WhyNawras() {
  const { t } = useTranslation("whyNawras");

  return (
    <section className="relative w-full bg-white overflow-hidden py-10 px-6 lg:px-16">
      {/* ── Mesh arc lines — top-left decorative element ─────────────────── */}
      <MeshLines />

      <div className="relative z-10 container mx-auto">
        {/* ── Text block ────────────────────────────────────────────────── */}
        <div className="max-w-6xl mb-14">
          <motion.h2
            {...fadeUp(0)}
            className="text-3xl md:text-[3rem] font-extrabold text-[#0d1b4b] leading-tight mb-3"
          >
            {t("heading")}
          </motion.h2>

          <motion.p
            {...fadeUp(0.08)}
            className="text-xl md:text-[2.15rem] font-normal text-[#0d1b4b] leading-snug mb-6"
          >
            {t("subheading")}
          </motion.p>

          <motion.p
            {...fadeUp(0.16)}
            className="text-sm md:text-[1.15rem] font-bold text-gray-800 leading-relaxed max-w-6xl"
          >
            {t("body")}
          </motion.p>
        </div>

        {/* ── Dashboard image ───────────────────────────────────────────── */}
        <motion.img
          src={whyNawrasImg}
          alt="Nawras dashboard overview"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-auto block select-none"
          draggable={false}
        />
      </div>
    </section>
  );
}

/* ── Decorative mesh arc lines ─────────────────────────────────────────────── */
function MeshLines() {
  return (
    <div
      className="absolute top-0 start-0 pointer-events-none"
      style={{ width: "55%", height: "62%" }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 720 480"
        preserveAspectRatio="xMinYMin meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-60 360 Q180 80 600 180"
          stroke="#c7d2fe"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M-60 320 Q200 40 640 160"
          stroke="#c7d2fe"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M-40 400 Q160 120 580 220"
          stroke="#a5b4fc"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.28"
        />
        <path
          d="M-80 280 Q220 0 660 140"
          stroke="#93c5fd"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M20 440 Q260 160 640 260"
          stroke="#c7d2fe"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.2"
        />
        <path
          d="M100 460 Q340 200 700 300"
          stroke="#a5b4fc"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.18"
        />
        {/* Teal accent */}
        <path
          d="M-80 200 Q100 -20 420 80"
          stroke="#00b894"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.18"
        />
        <path
          d="M-60 240 Q120 20 440 100"
          stroke="#00cec9"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.12"
        />
      </svg>
    </div>
  );
}
