import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getPostBySlug, MOCK_POSTS } from "../../services/posts";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Related card (mini) ──────────────────────────────────────────────────────
function RelatedCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex gap-4 items-start"
    >
      <div className="w-20 h-16 shrink-0 rounded-lg overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div>
        <p className="text-xs text-[#00007B] font-semibold mb-1">{formatDate(post.date)}</p>
        <p className="text-sm font-bold text-[#0d1b4b] leading-snug group-hover:text-[#00007B] transition-colors line-clamp-2">
          {post.title}
        </p>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BlogPost() {
  const { slug } = useParams();
  const { t } = useTranslation("common");
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    // Swap getPostBySlug() with real API call when backend is ready
    getPostBySlug(slug).then(setPost);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (post === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-gray-400 text-lg">Loading…</span>
      </div>
    );
  }

  if (post === null) return <Navigate to="/" replace />;

  const related = MOCK_POSTS.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);
  const others = related.length < 2
    ? [...related, ...MOCK_POSTS.filter((p) => p.id !== post.id && !related.includes(p)).slice(0, 2 - related.length)]
    : related;

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero image */}
      <div className="relative w-full overflow-hidden" style={{ maxHeight: 460 }}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full object-cover"
          style={{ maxHeight: 460 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00001D]/60 to-transparent" />
      </div>

      {/* Article layout */}
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-14">

        {/* ── Main article ── */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#00007B] transition-colors">{t("home")}</Link>
            <span aria-hidden="true">/</span>
            <Link to="/blog" className="hover:text-[#00007B] transition-colors">{t("blog")}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0d1b4b] font-medium truncate max-w-[220px]">{post.title}</span>
          </nav>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#00007B]/8 text-[#00007B] text-xs font-bold px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-gray-400 text-sm">{formatDate(post.date)}</span>
          </div>

          {/* Title */}
          <h1
            className="font-black text-[#0d1b4b] leading-tight mb-8"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
          >
            {post.title}
          </h1>

          {/* Divider */}
          <div className="w-12 h-1 bg-[#00007B] rounded-full mb-8" />

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-gray-700
              prose-headings:text-[#0d1b4b] prose-headings:font-extrabold
              prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-[#00007B] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back button */}
          <div className="mt-14 pt-8 border-t border-gray-100">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#00007B] font-semibold hover:gap-3 transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M11 14L6 9L11 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t("backToHome")}
            </Link>
          </div>
        </motion.article>

        {/* ── Sidebar ── */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* Related posts */}
          <div className="bg-[#f5f6f9] rounded-2xl p-6">
            <h2 className="font-extrabold text-[#0d1b4b] text-base mb-5">{t("relatedPosts")}</h2>
            <div className="space-y-5">
              {others.map((p) => (
                <RelatedCard key={p.id} post={p} />
              ))}
            </div>
          </div>

          {/* Category badge */}
          <div className="bg-[#00007B] rounded-2xl p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-white/60">Category</p>
            <p className="text-xl font-black">{post.category}</p>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}
