import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import framePng from "../../assets/images/vedio-section-border.png";
import thumbnailImg from "../../assets/images/our_solutions_dashboard.png";

// ─── Config ───────────────────────────────────────────────────────────────────
const VIDEO_EMBED_URL =
  "https://www.youtube.com/embed/PUF5s9BWaDQ?si=vd4T-5BTLyxuXDu7";

// Frame native size: 1238 × 618 px
// Border stroke (measured): ~14 px on all sides at native resolution
// Inset as % of frame: horizontal 14/1238 ≈ 1.13%, vertical 14/618 ≈ 2.26%
// Corner radius at native: ~40 px → as % of width: 40/1238 ≈ 3.23%
const INSET_X = "1.5%";
const INSET_Y = "2.6%";
const CORNER_RADIUS = "3.4%";

// ─── Play Button ──────────────────────────────────────────────────────────────
function PlayButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Play video"
      className="absolute inset-0 cursor-pointer flex items-center justify-center z-20 focus:outline-none"
      initial={false}
    >
      {/* Outer pulse ring */}
      <motion.span
        className="absolute rounded-full bg-white/20"
        style={{ width: 88, height: 88 }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* Inner button circle */}
      <motion.span
        className="relative flex items-center justify-center rounded-full bg-white"
        style={{
          width: 64,
          height: 64,
          boxShadow: "0 8px 32px rgba(0,0,30,0.28)",
        }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg
          width="22"
          height="24"
          viewBox="0 0 22 24"
          fill="none"
          aria-hidden="true"
          className="ms-1"
        >
          <path d="M2 2L20 12L2 22V2Z" fill="#00001D" />
        </svg>
      </motion.span>
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VideoShowcase() {
  const { t } = useTranslation("common");
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef(null);

  return (
    <section
      className="relative w-full bg-white py-20 lg:py-28 px-6 overflow-hidden"
      aria-labelledby="video-heading"
    >
      {/* Heading */}
      <motion.h2
        id="video-heading"
        className="text-center font-black text-[#0d1b4b] mb-12 lg:mb-14 leading-tight"
        style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {t("videoHeading")}
      </motion.h2>

      {/* Outer frame wrapper — sized by the PNG's native aspect ratio */}
      <motion.div
        className="relative mx-auto w-full"
        style={{ maxWidth: 960, aspectRatio: "1238 / 618" }}
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* PNG border — covers the full outer wrapper exactly */}
        <img
          src={framePng}
          alt=""
          aria-hidden="true"
          style={{ maxWidth: 960, aspectRatio: "1238 / 618" }}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none select-none"
          style={{ objectFit: "fill" }}
          draggable={false}
        />

        {/* Video inset — pushed inside the border by the measured insets */}
        <div
          className="absolute overflow-hidden"
          style={{
            inset: `${INSET_Y} ${INSET_X}`,
            borderRadius: CORNER_RADIUS,
            maxWidth: 960,
          }}
        >
          <AnimatePresence mode="wait">
            {!playing ? (
              /* ── Thumbnail ─────────────────────────────────────────── */
              <motion.div
                key="thumbnail"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{ borderRadius: CORNER_RADIUS, maxWidth: 960 }}
              >
                <img
                  src={thumbnailImg}
                  alt="Nawras dashboard preview"
                  className="w-full h-full object-cover"
                  draggable={false}
                  style={{ borderRadius: CORNER_RADIUS, maxWidth: 960 }}
                />
                <div className="absolute inset-0 bg-[#00001D]/15" />
                <PlayButton onClick={() => setPlaying(true)} />
              </motion.div>
            ) : (
              /* ── Video ─────────────────────────────────────────────── */
              <motion.div
                key="video"
                className="absolute inset-0 ovderflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ borderRadius: CORNER_RADIUS, maxWidth: 960 }}
              >
                <iframe
                  ref={iframeRef}
                  src={VIDEO_EMBED_URL}
                  title="Nawras product demo video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 block"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
