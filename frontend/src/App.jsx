import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";

// Code-split heavy pages
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));
const About = lazy(() => import("./pages/about/About"));

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <MainLayout>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <span className="text-gray-400 text-lg">Loading…</span>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* Future routes: /products, /contact, /demo */}
            </Routes>
          </Suspense>
        </MainLayout>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
