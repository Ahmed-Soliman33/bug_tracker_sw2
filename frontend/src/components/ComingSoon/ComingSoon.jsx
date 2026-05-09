import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LanguageContext";
import grcLogo from "../../assets/images/GRC_logo.png";
import anharLogo from "../../assets/images/anhar_logo.png";

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "grc",
    en: { promoText: "Nawras GRC" },
    ar: { promoText: "نورس GRC" },
    promoIsTitle: true,
    logo: grcLogo,
    logoAlt: "Nawras GRC",
    learnMoreHref: "#",
  },
  {
    id: "anhar",
    en: { promoText: "A NEW ERA OF\nSUPPLY CHAIN\nEXCELLENCE" },
    ar: { promoText: "عصر جديد من\nالتميز في\nسلسلة الإمداد" },
    promoIsTitle: false,
    logo: anharLogo,
    logoAlt: "Nawras Anhar",
    learnMoreHref: "#",
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Single product banner ────────────────────────────────────────────────────
function ProductBanner({ product }) {
  const { t } = useTranslation("common");
  const { isRTL } = useLang();
  const promoText = isRTL ? product.ar.promoText : product.en.promoText;

  return (
    <motion.div
      variants={cardVariants}
      className="flex flex-col gap-3 sm:gap-4"
    >
      {/* Banner card */}
      <motion.div
        className="w-full bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 overflow-hidden"
        style={{ boxShadow: "0 2px 20px -4px rgba(0,0,30,0.06)" }}
        whileHover={{
          boxShadow: "0 12px 48px -8px rgba(0,0,123,0.10)",
          borderColor: "rgba(0,0,123,0.12)",
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                        px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12 gap-6 sm:gap-8"
        >
          {/* Start — promo text */}
          <div className="flex-1 sm:pe-8">
            {product.promoIsTitle ? (
              <h3
                className="font-black text-[#00007B] leading-tight"
                style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
              >
                {promoText}
              </h3>
            ) : (
              <p
                className="font-black text-[#00007B] leading-tight uppercase whitespace-pre-line"
                style={{ fontSize: "clamp(1.3rem, 3vw, 2.4rem)" }}
              >
                {promoText}
              </p>
            )}
          </div>

          {/* Right — logo */}
          <div
            className="flex items-center justify-center self-end sm:justify-end shrink-0 w-full sm:w-auto"
            style={{ width: "clamp(160px, 28%, 260px)" }}
          >
            <img
              src={product.logo}
              alt={product.logoAlt}
              className="w-full h-auto  object-contain"
              style={{ maxHeight: 140 }}
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>

      {/* Learn More button */}
      <div>
        <motion.a
          href={product.learnMoreHref}
          className="inline-flex items-center rounded-full border text-sm font-semibold
                     px-5 py-2.5 text-[#0d1b4b]"
          style={{ borderColor: "#00b894" }}
          whileHover={{
            backgroundColor: "#00b894",
            color: "#fff",
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.96 }}
        >
          {t("learnMore")}
        </motion.a>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ComingSoon() {
  const { t } = useTranslation("common");

  return (
    <section
      className="w-full bg-white py-16 sm:py-20 lg:py-28"
      aria-labelledby="coming-soon-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.h2
          id="coming-soon-heading"
          className="font-black text-[#0d1b4b] mb-8 sm:mb-12"
          style={{ fontSize: "clamp(1.3rem, 2.2vw, 2rem)" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("comingSoonHeading")}
        </motion.h2>

        {/* Product banners */}
        <motion.div
          className="flex flex-col gap-8 sm:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
        >
          {PRODUCTS.map((product) => (
            <ProductBanner key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
