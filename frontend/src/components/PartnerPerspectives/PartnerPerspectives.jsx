import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLang } from "../../context/LanguageContext";

// ─── Data (bilingual) ─────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 1,
    en: {
      name: "Abdulrahman Al-Qahtani,",
      title: "HR Director",
      quote: "Switching to this HCM platform was a game-changer. We reduced our monthly payroll processing time from five days to just four hours. The automation of GOSI and tax compliance has saved our team from endless manual errors.",
    },
    ar: {
      name: "عبدالرحمن القحطاني،",
      title: "مدير الموارد البشرية",
      quote: "الانتقال إلى منصة إدارة رأس المال البشري هذه كان نقطة تحوّل حقيقية. قلّصنا وقت معالجة الرواتب الشهرية من خمسة أيام إلى أربع ساعات فقط. وقد وفّرت أتمتة الـ GOSI والامتثال الضريبي على فريقنا أخطاءً يدوية لا تعدّ.",
    },
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
  },
  {
    id: 2,
    en: {
      name: "Noura Al-Rashid,",
      title: "CEO",
      quote: "Scaling a business requires data. This system provided us with the workforce insights needed to expand our headcount by 30% last year without losing grip on our organizational structure.",
    },
    ar: {
      name: "نورا الراشد،",
      title: "الرئيس التنفيذي",
      quote: "التوسع في الأعمال يتطلب بيانات دقيقة. زوّدنا هذا النظام بالرؤى الضرورية لتنمية كوادرنا بنسبة 30% خلال العام الماضي دون أن نفقد السيطرة على هيكلنا التنظيمي.",
    },
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face",
  },
  {
    id: 3,
    en: {
      name: "Eng. Faisal Bin Sultan,",
      title: "CTO",
      quote: "Scaling a business requires data. This system provided us with the workforce insights needed to expand our headcount by 30% last year without losing grip on our organizational structure.",
    },
    ar: {
      name: "م. فيصل بن سلطان،",
      title: "المدير التقني",
      quote: "التوسع في الأعمال يتطلب بيانات. زوّدنا هذا النظام بمعلومات القوى العاملة اللازمة لتوسيع كوادرنا بنسبة 30% دون أن نفقد السيطرة على هيكلنا التنظيمي.",
    },
    rating: 4.7,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&crop=face",
  },
  {
    id: 4,
    en: {
      name: "Sara Al-Mutairi,",
      title: "Operations Director",
      quote: "The ERP integration transformed how we manage supply chain logistics. Real-time visibility across all departments has eliminated the bottlenecks that used to cost us weeks every quarter.",
    },
    ar: {
      name: "سارة المطيري،",
      title: "مديرة العمليات",
      quote: "أحدث تكامل ERP ثورة في طريقة إدارتنا للوجستيات سلسلة الإمداد. الرؤية الفورية عبر جميع الأقسام أزالت الاختناقات التي كانت تُكلّفنا أسابيع كاملة كل ربع سنة.",
    },
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=face",
  },
  {
    id: 5,
    en: {
      name: "Mohammed Al-Harbi,",
      title: "Finance Manager",
      quote: "The financial reporting module alone was worth the entire investment. Month-end closing that used to take two weeks now takes two days. Our auditors are consistently impressed by the data accuracy.",
    },
    ar: {
      name: "محمد الحربي،",
      title: "مدير المالية",
      quote: "وحدة التقارير المالية وحدها كانت تستحق الاستثمار بأكمله. إقفال نهاية الشهر الذي كان يستغرق أسبوعين بات يُنجز في يومين. مدققونا ينبهرون دائماً بدقة البيانات.",
    },
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face",
  },
];

const AUTOPLAY_MS = 4000;
// Card dimensions
const ACTIVE_W = 340;
const SIDE_W = 300;
const STAGE_H = 520;
// Gap between card edges
const CARD_GAP = 24;

function mod(n, m) {
  return ((n % m) + m) % m;
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-2 mt-auto pt-5">
      <span
        className="font-black text-white"
        style={{ fontSize: "clamp(1.4rem, 2vw, 1.8rem)" }}
      >
        {rating.toFixed(1)}
      </span>
      <span
        className="text-white/60 font-semibold"
        style={{ fontSize: "0.75rem" }}
      >
        /5.0 rating
      </span>
      <div className="flex items-center gap-0.5 ms-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 1.5L9.545 5.865L14.196 6.197L10.754 9.135L11.916 13.635L8 11.164L4.084 13.635L5.246 9.135L1.804 6.197L6.455 5.865L8 1.5Z"
              stroke="white"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}

// ─── Avatar cluster ───────────────────────────────────────────────────────────
function AvatarCluster({ current, prev, next, isActive, isRTL }) {
  const bigSize = isActive ? 96 : 72;
  const smallSize = isActive ? 60 : 48;
  // Ring color matches card bg — creates the "gap" illusion between overlapping avatars
  const ring = "#fff";

  return (
    <div
      className="relative flex items-end justify-center mb-6"
      style={{ height: bigSize + 10 }}
    >
      {/* Left — prev person */}
      <div
        className="absolute rounded-full overflow-hidden border-[3px]"
        style={{
          width: smallSize,
          height: smallSize,
          borderColor: ring,
          left: "50%",
          marginLeft: -(bigSize * 0.58 + smallSize / 2),
          bottom: 0,
          zIndex: 1,
        }}
      >
        <img
          src={prev.avatar}
          alt={isRTL ? prev.ar.name : prev.en.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Center — current person */}
      <div
        className="absolute rounded-full overflow-hidden border-[3px]"
        style={{
          width: bigSize,
          height: bigSize,
          borderColor: ring,
          left: "50%",
          marginLeft: -bigSize / 2,
          bottom: 0,
          zIndex: 3,
        }}
      >
        <img
          src={current.avatar}
          alt={isRTL ? current.ar.name : current.en.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right — next person */}
      <div
        className="absolute rounded-full overflow-hidden border-[3px]"
        style={{
          width: smallSize,
          height: smallSize,
          borderColor: ring,
          left: "50%",
          marginLeft: bigSize * 0.58 - smallSize / 2,
          bottom: 0,
          zIndex: 2,
        }}
      >
        <img
          src={next.avatar}
          alt={isRTL ? next.ar.name : next.en.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

// ─── Single card ──────────────────────────────────────────────────────────────
function TestimonialCard({ item, position }) {
  const isActive = position === 0;
  const isAdjacent = Math.abs(position) === 1;
  const { isRTL } = useLang();
  const locale = isRTL ? item.ar : item.en;

  const n = TESTIMONIALS.length;
  const idx = TESTIMONIALS.findIndex((t) => t.id === item.id);
  const prev = TESTIMONIALS[mod(idx - 1, n)];
  const next = TESTIMONIALS[mod(idx + 1, n)];

  const cardW = isActive ? ACTIVE_W : SIDE_W;
  const cardH = isActive ? 460 : 420;
  const scale = isActive ? 1 : 0.9;
  const opacity = isActive ? 1 : isAdjacent ? 0.75 : 0;
  const zIndex = isActive ? 10 : isAdjacent ? 5 : 0;

  // Pure JS offset: position 0 → exact centre of stage
  // Each side card sits edge-to-edge from the active card + gap
  const sideOffset = ACTIVE_W / 2 + CARD_GAP + SIDE_W / 2;
  const x = position === 0 ? 0 : position * sideOffset;
  // Vertical centre inside stage
  const y = (STAGE_H - cardH) / 2;

  return (
    <motion.div
      animate={{ x, scale, opacity, zIndex }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="absolute rounded-3xl flex flex-col px-7 py-8 select-none"
      style={{
        width: cardW,
        height: cardH,
        top: y,
        // Anchor from horizontal centre of stage (left: 50% - cardW/2)
        left: `calc(50% - ${cardW / 2}px)`,
        background: "#2B2BA5",
        boxShadow: isActive
          ? "0 24px 64px -12px rgba(40,40,200,0.40), 0 8px 24px -4px rgba(0,0,0,0.18)"
          : "none",
        pointerEvents: isActive || isAdjacent ? "auto" : "none",
        overflow: "hidden",
      }}
    >
      <AvatarCluster
        current={item}
        prev={prev}
        next={next}
        isActive={isActive}
        isRTL={isRTL}
      />

      <div className="text-center mb-4">
        <p
          className="font-black text-white leading-tight"
          style={{ fontSize: isActive ? "1.15rem" : "0.95rem" }}
        >
          {locale.name}
        </p>
        <p
          className="font-semibold text-white/70"
          style={{ fontSize: isActive ? "0.9rem" : "0.8rem" }}
        >
          {locale.title}
        </p>
      </div>

      <p
        className="text-white/90 font-semibold text-center leading-relaxed flex-1"
        style={{ fontSize: isActive ? "0.95rem" : "0.82rem" }}
      >
        {locale.quote}
      </p>

      <StarRating rating={item.rating} />
    </motion.div>
  );
}

// ─── Nav arrow ────────────────────────────────────────────────────────────────
function NavArrow({ direction, onClick }) {
  const { isRTL } = useLang();
  // "prev" is always the start-side arrow; "next" is always end-side.
  // Use logical insetInline so the arrows stay on the correct edges in RTL.
  const isStart = direction === "prev";
  // In RTL the chevron visual direction must flip: start-side shows "→" and end-side "←"
  const showRightChevron = isRTL ? isStart : !isStart;

  return (
    <motion.button
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className="absolute cursor-pointer top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 z-20"
      style={{
        width: 48,
        height: 48,
        [isStart ? "insetInlineStart" : "insetInlineEnd"]: 0,
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
      }}
      whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.96)" }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.18 }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        {showRightChevron ? (
          <path d="M7 4L12 9L7 14" stroke="#555" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M11 14L6 9L11 4" stroke="#555" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </motion.button>
  );
}

// ─── Main (inner — remounted by wrapper on lang change) ───────────────────────
function PartnerPerspectivesInner() {
  const { t } = useTranslation("common");
  const [activeIndex, setActiveIndex] = useState(0);
  const pausedRef = useRef(false);
  const timerRef = useRef(null);
  const n = TESTIMONIALS.length;

  const advance = useCallback(
    (delta = 1) => setActiveIndex((prev) => mod(prev + delta, n)),
    [n],
  );

  const startAutoplay = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) advance(1);
    }, AUTOPLAY_MS);
  }, [advance]);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(timerRef.current);
  }, [startAutoplay]);

  function handleArrow(delta) {
    pausedRef.current = true;
    advance(delta);
    setTimeout(() => {
      pausedRef.current = false;
      startAutoplay();
    }, 1500);
  }

  const slots = [-2, -1, 0, 1, 2].map((pos) => ({
    pos,
    item: TESTIMONIALS[mod(activeIndex + pos, n)],
  }));

  return (
    <section
      className="w-full bg-[#f5f6f9] py-20 lg:py-28 overflow-hidden"
      aria-labelledby="perspectives-heading"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="container mx-auto px-6">
        {/* Heading */}
        <motion.h2
          id="perspectives-heading"
          className="font-black text-[#0d1b4b] text-center mb-16"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("partnerPerspectivesHeading")}
        </motion.h2>

        {/* Stage — cards are absolutely positioned inside this */}
        <div
          className="relative mx-auto"
          style={{ height: STAGE_H, maxWidth: 1040 }}
        >
          <NavArrow direction="prev" onClick={() => handleArrow(-1)} />
          <NavArrow direction="next" onClick={() => handleArrow(1)} />

          {slots.map(({ pos, item }) => (
            <TestimonialCard
              key={`${item.id}-${pos}`}
              item={item}
              position={pos}
            />
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                pausedRef.current = true;
                setActiveIndex(i);
                setTimeout(() => {
                  pausedRef.current = false;
                  startAutoplay();
                }, 1500);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                background: i === activeIndex ? "#2828c8" : "#2828c830",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Wrapper remounts the carousel on every lang change so all absolute positions,
// activeIndex, and autoplay timers reset cleanly for the new direction.
export default function PartnerPerspectives() {
  const { lang } = useLang();
  return <PartnerPerspectivesInner key={lang} />;
}
