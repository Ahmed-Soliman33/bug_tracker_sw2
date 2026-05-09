import { Link } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { footerData } from "../../mockData";
import { useLang } from "../../context/LanguageContext";
import ContactForm from "./ContactForm";
import footerLogo from "../../assets/images/GRC_logo.png";

const QUICK_LINKS = [
  { key: "link_home", href: "/" },
  { key: "link_about", href: "/about" },
  { key: "link_blogs", href: "/blogs" },
  { key: "link_contact", href: "/contact" },
];

export default function Footer() {
  const { t } = useTranslation("footer");
  const { isRTL } = useLang();
  const d = footerData;

  return (
    <footer className="bg-[#00001D] text-white" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="container mx-auto px-8 lg:px-14 py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.7fr_1.4fr] gap-16 lg:gap-20 items-start">
          {/* Col 1 — Brand */}
          <div className="flex flex-col  items-start gap-8">
            <img
              src={footerLogo}
              alt="Nawras"
              className="h-20 w-auto object-contain object-start brightness-0 invert"
            />
            <p
              className="font-bold text-white leading-snug"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", maxWidth: 300 }}
            >
              {t("slogan")}
            </p>
          </div>

          {/* Col 2 — Quick links */}
          <div>
            <h4
              className="font-extrabold tracking-[0.18em] uppercase text-white mb-8"
              style={{ fontSize: "0.85rem" }}
            >
              {t("quickLinks")}
            </h4>
            <ul className="flex flex-col gap-5">
              {QUICK_LINKS.map((link) => (
                <li key={link.key}>
                  <motion.div
                    whileHover="hovered"
                    initial="rest"
                    animate="rest"
                  >
                    <Link
                      to={link.href}
                      className="relative inline-block font-semibold text-white/80 transition-colors duration-200 hover:text-white"
                      style={{ fontSize: "0.95rem" }}
                    >
                      {t(link.key)}
                      {/* Underline slide-in */}
                      <motion.span
                        className="absolute bottom-0 start-0 h-px bg-white rounded-full"
                        variants={{
                          rest: { scaleX: 0, originX: 0 },
                          hovered: { scaleX: 1, originX: 0 },
                        }}
                        transition={{
                          duration: 0.22,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{ width: "100%", display: "block" }}
                      />
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Mini contact form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.08]" />

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 lg:px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm font-medium text-white/50">{t("copyright")}</p>

        <div className="flex items-center gap-3">
          {[
            {
              href: d.social.facebook,
              Icon: FaFacebookF,
              label: "Facebook",
              size: 14,
            },
            {
              href: d.social.linkedin,
              Icon: FaLinkedinIn,
              label: "LinkedIn",
              size: 14,
            },
            {
              href: d.social.youtube,
              Icon: FaYoutube,
              label: "YouTube",
              size: 15,
            },
          ].map(({ href, Icon, label, size }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center justify-center rounded-full text-white/70"
              style={{
                width: 38,
                height: 38,
                background: "rgba(255,255,255,0.09)",
              }}
              whileHover={{
                background: "rgba(255,255,255,0.18)",
                color: "#fff",
                scale: 1.1,
              }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.18 }}
            >
              <Icon size={size} />
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
}
