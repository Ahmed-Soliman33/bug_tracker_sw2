import { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MOCK_POSTS } from "../../services/posts";
import { useLang } from "../../context/LanguageContext";

import "swiper/css";
import "swiper/css/pagination";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Arrow button ─────────────────────────────────────────────────────────────
function NavArrow({ direction, swiperRef }) {
  function handleClick() {
    if (!swiperRef.current) return;
    direction === "prev"
      ? swiperRef.current.slidePrev()
      : swiperRef.current.slideNext();
  }

  return (
    <motion.button
      onClick={handleClick}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className="flex items-center justify-center rounded-full border border-[#00007B]/20 bg-white"
      style={{ width: 44, height: 44 }}
      whileHover={{
        backgroundColor: "#00007B",
        borderColor: "#00007B",
        scale: 1.05,
      }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.18 }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        className="text-[#00007B]"
        style={{ color: "inherit" }}
      >
        {direction === "prev" ? (
          <path
            d="M11 14L6 9L11 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M7 4L12 9L7 14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </motion.button>
  );
}

// ─── News card ────────────────────────────────────────────────────────────────
function NewsCard({ post }) {
  const { t } = useTranslation("common");

  return (
    <motion.article
      className="flex flex-col bg-white rounded-2xl overflow-hidden h-full"
      style={{ boxShadow: "0 2px 16px -2px rgba(0,0,30,0.07)" }}
      whileHover={{
        y: -6,
        boxShadow:
          "0 20px 48px -8px rgba(0,0,123,0.12), 0 4px 16px -4px rgba(0,0,123,0.07)",
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {/* Thumbnail */}
      <Link
        to={`/blog/${post.slug}`}
        className="block overflow-hidden shrink-0"
        style={{ aspectRatio: "16/10" }}
        draggable={false}
      >
        <motion.img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover pointer-events-none"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          loading="lazy"
          draggable={false}
        />
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 pt-5">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[#00007B] font-semibold"
            style={{ fontSize: "0.75rem" }}
          >
            {formatDate(post.date)}
          </span>
          <span className="text-[#00007B]/30" aria-hidden="true">
            ·
          </span>
          <span
            className="text-[#00007B] font-semibold"
            style={{ fontSize: "0.75rem" }}
          >
            {post.category}
          </span>
        </div>

        {/* Title */}
        <Link to={`/blog/${post.slug}`} draggable={false}>
          <h3
            className="font-extrabold text-[#0d1b4b] leading-snug mb-3 hover:text-[#00007B] transition-colors duration-200"
            style={{ fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)" }}
          >
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p
          className="text-gray-500 leading-relaxed mb-5 flex-1"
          style={{
            fontSize: "0.875rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.excerpt}
        </p>

        {/* CTA */}
        <Link
          to={`/blog/${post.slug}`}
          draggable={false}
          className="inline-flex items-center gap-2 self-end rounded-full bg-[#00007B] text-white font-semibold px-5 py-2 text-sm hover:bg-[#0000a0] hover:gap-3 transition-all duration-200"
        >
          {t("readMore")}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8H13M13 8L9 4M13 8L9 12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LatestNews() {
  const { t } = useTranslation("common");
  const { lang, isRTL } = useLang();
  const swiperRef = useRef(null);

  return (
    <section
      className="relative w-full bg-white py-20 lg:py-28 overflow-hidden"
      aria-labelledby="news-heading"
    >
      <div className="mx-auto overflow-hidden container px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 gap-4">
          <motion.h2
            id="news-heading"
            className="font-black text-[#0d1b4b] leading-tight"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {t("latestNewsHeading")}
          </motion.h2>

          <div className="flex items-center gap-2 shrink-0">
            <NavArrow direction="prev" swiperRef={swiperRef} />
            <NavArrow direction="next" swiperRef={swiperRef} />
          </div>
        </div>

        {/* Swiper carousel — key forces full remount on dir change so Swiper
            re-reads the document direction and re-initialises slide positions */}
        <Swiper
          key={lang}
          dir={isRTL ? "rtl" : "ltr"}
          modules={[Autoplay, Navigation, Pagination, A11y]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1}
          slidesPerGroup={1}
          spaceBetween={24}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true, el: ".news-pagination" }}
          breakpoints={{
            640: { slidesPerView: 2, slidesPerGroup: 2 },
            1024: { slidesPerView: 3, slidesPerGroup: 3 },
          }}
          style={{ overflow: "visible" }}
        >
          {MOCK_POSTS.map((post) => (
            <SwiperSlide key={post.id} style={{ height: "auto" }}>
              <NewsCard post={post} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dot indicators */}
        <div className="news-pagination flex justify-center gap-2 mt-10" />
      </div>

      {/* Swiper pagination dot overrides */}
      <style>{`
        .news-pagination .swiper-pagination-bullet {
          width: 8px; height: 8px;
          background: #00007B30;
          opacity: 1;
          border-radius: 9999px;
          transition: width 0.3s, background 0.3s;
        }
        .news-pagination .swiper-pagination-bullet-active {
          width: 24px;
          background: #00007B;
        }
      `}</style>
    </section>
  );
}
