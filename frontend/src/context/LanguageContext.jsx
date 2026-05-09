import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "../i18n/config";

const LanguageContext = createContext(null);

/**
 * Wraps i18n language state and exposes RTL helpers.
 * i18n is the single source of truth for the active language;
 * this context only derives RTL and provides a convenient toggle.
 */
export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language?.slice(0, 2) ?? DEFAULT_LANGUAGE);

  const isRTL = lang === "ar";

  // Keep <html dir> and <html lang> in sync with i18n changes (including browser detection)
  useEffect(() => {
    const sync = (lng) => {
      const code = lng?.slice(0, 2);
      if (!SUPPORTED_LANGUAGES.includes(code)) return;
      setLang(code);
      document.documentElement.setAttribute("dir", code === "ar" ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", code);
    };

    sync(i18n.language);
    i18n.on("languageChanged", sync);
    return () => i18n.off("languageChanged", sync);
  }, [i18n]);

  const toggle = () => {
    const next = lang === "en" ? "ar" : "en";
    i18n.changeLanguage(next); // persisted to localStorage by LanguageDetector
  };

  return (
    <LanguageContext.Provider value={{ lang, isRTL, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
