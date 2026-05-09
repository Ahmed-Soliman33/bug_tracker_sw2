import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

export const SUPPORTED_LANGUAGES = /** @type {const} */ (["en", "ar"]);
export const DEFAULT_LANGUAGE = "en";
export const FALLBACK_LANGUAGE = "en";

/** Namespaces loaded by default on every page. Additional ones can be lazy-loaded per-route. */
export const DEFAULT_NS = "common";
export const NAMESPACES = /** @type {const} */ (["common", "nav", "hero", "footer", "whyNawras", "about"]);

i18n
  .use(
    resourcesToBackend(
      (language, namespace) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Core
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: FALLBACK_LANGUAGE,
    defaultNS: DEFAULT_NS,
    ns: NAMESPACES,

    // Detection order: URL search param → localStorage → browser preference
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "nw_lang",
      caches: ["localStorage"],
    },

    // Interpolation
    interpolation: {
      escapeValue: false, // React already XSS-safe
    },

    // React-specific — disable Suspense so components render immediately with
    // fallback key strings while namespaces resolve, avoiding a blank-screen flash.
    react: {
      useSuspense: false,
    },

    // Debug only in development
    debug: import.meta.env.DEV,
  });

export default i18n;
