import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LanguageContext";
import headerLogo from "../../assets/images/header-logo.png";

const NAV_ITEMS = [
  { key: "about", href: "/about" },
  {
    key: "products",
    href: "/products",
    hasDropdown: true,
    children: [
      { key: "products_hr", href: "/products/hr" },
      { key: "products_payroll", href: "/products/payroll" },
      { key: "products_performance", href: "/products/performance" },
    ],
  },
  { key: "aiFeatures", href: "/ai-features" },
  { key: "contact", href: "/contact" },
];

export default function Header() {
  const { t } = useTranslation("nav");
  const { tc } = { tc: useTranslation("common").t };
  const { lang, isRTL, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`
          w-full container py-2 md:py-4 rounded-full bg-white/95 backdrop-blur-md
          flex items-center justify-between px-4
          transition-shadow duration-300
          ${scrolled ? "shadow-[0_8px_40px_rgba(13,27,75,0.18)]" : "shadow-[0_4px_24px_rgba(0,0,0,0.15)]"}
        `}
      >
        <Link to="/" className="shrink-0">
          <img src={headerLogo} alt="Nawras" className="h-auto w-24 md:w-32" />
        </Link>

        {/* Desktop nav */}
        <div
          ref={dropdownRef}
          className="hidden md:flex items-center gap-1 relative"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {NAV_ITEMS.map((item) => (
            <div key={item.key} className="relative">
              {item.hasDropdown ? (
                <>
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === item.key ? null : item.key,
                      )
                    }
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-[#000093] hover:bg-slate-50 transition-all duration-200"
                  >
                    {t(item.key)}
                    <FiChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openDropdown === item.key ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.key && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute top-full mt-2 start-0 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                      >
                        {item.children?.map((child) => (
                          <Link
                            key={child.key}
                            to={child.href}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#000093] transition-colors"
                          >
                            {t(child.key)}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to={item.href}
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-[#000093] hover:bg-slate-50 transition-all duration-200"
                >
                  {t(item.key)}
                </Link>
              )}
            </div>
          ))}

          {/* Language switcher */}
          <button
            onClick={toggle}
            title={
              lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"
            }
            className="ms-2 p-2 rounded-full text-slate-600 hover:text-[#000093] hover:bg-slate-50 transition-all duration-200 flex items-center gap-1.5"
          >
            <FiGlobe size={17} />
            <span className="text-xs font-semibold uppercase tracking-wide">
              {tc("switchLang")}
            </span>
          </button>
        </div>

        {/* CTA */}
        <Link
          to="/demo"
          className="hidden md:inline-flex items-center px-8 py-2.5 rounded-full bg-[#000093] text-white text-sm font-semibold hover:bg-[#1a2d6b] transition-all duration-200 shadow-md hover:shadow-lg shrink-0"
        >
          {tc("requestDemo")}
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-slate-800 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-slate-800 my-1 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-slate-800 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="absolute top-[calc(100%+8px)] inset-x-4 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="p-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#000093]"
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="pt-2 pb-1 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={toggle}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600"
                >
                  <FiGlobe size={16} />
                  {lang === "en"
                    ? "Switch to Arabic"
                    : "التبديل إلى الإنجليزية"}
                </button>
                <Link
                  to="/demo"
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-2 rounded-full bg-[#000093] text-white text-sm font-semibold"
                >
                  {tc("requestDemo")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
