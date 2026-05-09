import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useLang } from "../context/LanguageContext";

export default function MainLayout({ children }) {
  const { isRTL } = useLang();

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
