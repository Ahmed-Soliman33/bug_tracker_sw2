import { useRef, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  animate,
} from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LanguageContext";

// ─── Asset imports (Vite bundles these for production) ────────────────────────
import logo00 from "../../assets/images/partners_logos/063f3d662c28d905ccd2718c2d2c371ff349ebeb.png";
import logo01 from "../../assets/images/partners_logos/d2ae45db1a8eacf5b073d66109632247efc9b084.png";
import logo02 from "../../assets/images/partners_logos/7850f5ed8e7bcd49f9822281635fdf2df58c03e5.png";
import logo03 from "../../assets/images/partners_logos/d5bfd407ad7c92a1f32d3069450132499617e3d2 (1).png";
import logo04 from "../../assets/images/partners_logos/741935dcf0aa78ef17c175480aa34a3aad3451c2.png";
import logo05 from "../../assets/images/partners_logos/4c9b58e8539a270e529c36b0c981d4afddca54d1.png";
import logo06 from "../../assets/images/partners_logos/05fab648-49ef-440b-81a2-c747eef5086a.avif";
import logo07 from "../../assets/images/partners_logos/23a3dae362955818b614a82f373ace977e4af3ea.jpg";
import logo08 from "../../assets/images/partners_logos/f0825647389495ff6e3cf42c6845c3eada0956ce.jpg";

const BASE_LOGOS = [
  { src: logo00, alt: "Nawras" },
  { src: logo01, alt: "Saudi Authority" },
  { src: logo02, alt: "Mowah" },
  { src: logo03, alt: "Movix" },
  { src: logo04, alt: "Zadk" },
  { src: logo05, alt: "Academy 32" },
  { src: logo06, alt: "Partner" },
  { src: logo07, alt: "Partner" },
  { src: logo08, alt: "Partner" },
];

// ─── Layout constants ─────────────────────────────────────────────────────────
const CARD_W = 168;
const GAP = 28;
const STEP = CARD_W + GAP; // px per card slot
const N = BASE_LOGOS.length; // 11 logos
const BAND = N * STEP; // width of one full set
const AUTO_SPEED = 0.6; // px per frame at 60 fps ≈ 36 px/s
const SNAP_SPRING = { type: "spring", stiffness: 300, damping: 38, mass: 0.9 };
const ARROW_SPRING = { type: "spring", stiffness: 260, damping: 32, mass: 0.8 };

// Triple the logos so we have [copy-A | copy-B | copy-C].
// We start in copy-B (offset −BAND) and silently jump back whenever
// we drift into copy-A or copy-C.
const TRIPLED = [...BASE_LOGOS, ...BASE_LOGOS, ...BASE_LOGOS];

function TrustedCustomersInner() {
  const { t } = useTranslation("common");
  const { isRTL } = useLang();

  // In LTR: strip scrolls left  → x goes negative  → initial x = -BAND
  // In RTL: strip scrolls right → x goes positive  → initial x = +BAND
  // translateX is always physical, so we invert sign for RTL.
  const sign = isRTL ? 1 : -1;
  const x = useMotionValue(sign * BAND);

  const isPaused = useRef(false);
  const isDragging = useRef(false);

  // ── Infinite-loop normaliser ────────────────────────────────────────────────
  const normalise = useCallback(() => {
    const cur = x.get();
    if (isRTL) {
      // RTL: positive x scrolls right; wrap when drifting into outer copies
      if (cur > BAND * 2 - BAND / 2) x.set(cur - BAND);
      if (cur < BAND / 2)            x.set(cur + BAND);
    } else {
      if (cur < -(BAND * 2 - BAND / 2)) x.set(cur + BAND);
      if (cur > -(BAND / 2))            x.set(cur - BAND);
    }
  }, [x, isRTL]);

  // ── Auto-play via useAnimationFrame ────────────────────────────────────────
  useAnimationFrame(() => {
    if (isPaused.current || isDragging.current) return;
    // sign * AUTO_SPEED: LTR subtracts (moves left), RTL adds (moves right)
    x.set(x.get() + sign * AUTO_SPEED);
    normalise();
  });

  // ── Snap to nearest card boundary after drag ends ──────────────────────────
  const snapToNearest = useCallback(() => {
    const cur = x.get();
    const snapped = Math.round(cur / STEP) * STEP;
    animate(x, snapped, SNAP_SPRING);
  }, [x]);

  // ── Arrow navigation (moves by one card slot) ─────────────────────────────
  const shift = useCallback(
    (direction) => {
      isPaused.current = true;
      const cur = x.get();
      // direction: -1 = prev (go backwards), +1 = next (go forwards)
      // LTR: "next" decreases x; RTL: "next" increases x
      const target = cur - sign * direction * STEP;
      animate(x, target, {
        ...ARROW_SPRING,
        onComplete: () => {
          normalise();
          setTimeout(() => { isPaused.current = false; }, 2000);
        },
      });
    },
    [x, normalise, sign],
  );

  // ── Keyboard support ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") shift(-1);
      if (e.key === "ArrowRight") shift(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shift]);

  return (
    <section
      className="relative w-full bg-[#f3f4f6] py-14 overflow-hidden"
      onMouseEnter={() => {
        isPaused.current = true;
      }}
      onMouseLeave={() => {
        isPaused.current = false;
      }}
    >
      <ArcLines position="top" />
      <ArcLines position="bottom" />

      {/* ── Heading ─────────────────────────────────────────────────── */}
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="text-center text-3xl md:text-[2.15rem] font-extrabold text-[#0d1b4b] mb-10 tracking-tight select-none"
      >
        {t("trustedCustomersHeading", "Our Trusted Customers")}
      </motion.h2>

      {/* ── Carousel row ────────────────────────────────────────────── */}
      <div className="relative  max-w-7xl mx-auto flex items-center">
        {/* Left arrow */}
        <ArrowButton direction="left" onClick={() => shift(-1)} />

        {/* Drag viewport */}
        <div className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing">
          <motion.div
            drag="x"
            dragElastic={0.08}
            dragMomentum={true}
            // No dragConstraints — we wrap manually so it feels truly infinite
            style={{ x, gap: GAP }}
            className="flex items-center will-change-transform select-none"
            onDragStart={() => {
              isDragging.current = true;
              isPaused.current = true;
            }}
            onDragEnd={() => {
              isDragging.current = false;
              normalise();
              snapToNearest();
              setTimeout(() => {
                isPaused.current = false;
              }, 2000);
            }}
          >
            {TRIPLED.map((logo, i) => (
              <LogoCard key={i} logo={logo} />
            ))}
          </motion.div>
        </div>

        {/* Right arrow */}
        <ArrowButton direction="right" onClick={() => shift(1)} />
      </div>

      {/* Edge fade masks for the "bleed off screen" illusion */}
      <div
        className="pointer-events-none absolute inset-y-0 inset-s-0 w-16 bg-gradient-to-e from-[#f3f4f6] to-transparent z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 inset-e-0 w-16 bg-gradient-to-s from-[#f3f4f6] to-transparent z-10"
        aria-hidden="true"
      />
    </section>
  );
}

// Wrapper remounts the inner carousel on every lang change so useMotionValue
// resets to -BAND and the infinite-scroll strip re-anchors correctly.
export default function TrustedCustomers() {
  const { lang } = useLang();
  return <TrustedCustomersInner key={lang} />;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ArrowButton({ direction, onClick }) {
  const isLeft = direction === "left";
  return (
    <motion.button
      onClick={onClick}
      aria-label={isLeft ? "Previous" : "Next"}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="relative z-20 shrink-0 px-3 py-6 text-[#0d1b4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d1b4b]/40 rounded-lg"
    >
      {isLeft ? (
        <FiChevronLeft size={26} strokeWidth={2.4} />
      ) : (
        <FiChevronRight size={26} strokeWidth={2.4} />
      )}
    </motion.button>
  );
}

function LogoCard({ logo }) {
  return (
    <motion.div
      className="shrink-0 flex items-center justify-center bg-white rounded-xl border border-gray-100 h-22.5 overflow-hidden"
      style={{ width: CARD_W, boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)" }}
      whileHover={{ y: -3, boxShadow: "0 6px 20px 0 rgba(0,0,0,0.10)" }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      <img
        src={logo.src}
        alt={logo.alt}
        className="max-h-16.5 max-w-36 w-auto h-auto object-contain"
        draggable={false}
      />
    </motion.div>
  );
}

function ArcLines({ position }) {
  const isTop = position === "top";
  return (
    <div
      className={`absolute ${isTop ? "top-0" : "bottom-0"} inset-x-0 pointer-events-none`}
      style={{ height: 52 }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="52"
        viewBox="0 0 1440 52"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: isTop ? "none" : "scaleY(-1)" }}
      >
        <path
          d="M-100 38 Q400 -18 900 28 Q1200 56 1540 18"
          stroke="#c7d2fe"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.48"
        />
        <path
          d="M-100 48 Q350 2 800 36 Q1100 62 1540 28"
          stroke="#93c5fd"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.32"
        />
        <path
          d="M200 52 Q700 8 1100 40 Q1300 52 1540 36"
          stroke="#a5b4fc"
          strokeWidth="0.65"
          strokeLinecap="round"
          opacity="0.22"
        />
      </svg>
    </div>
  );
}
