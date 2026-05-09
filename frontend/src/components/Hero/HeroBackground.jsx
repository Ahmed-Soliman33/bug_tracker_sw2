export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/40" />

      {/* Sweeping arc lines — SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Large outer sweep */}
        <path
          d="M-200 800 Q400 -100 1600 300"
          stroke="url(#sweep1)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M-100 750 Q450 -50 1650 350"
          stroke="url(#sweep1)"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M0 700 Q500 0 1700 400"
          stroke="url(#sweep2)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Mid arcs */}
        <path
          d="M100 900 Q600 200 1500 500"
          stroke="url(#sweep2)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M-300 600 Q300 100 1200 200"
          stroke="url(#sweep1)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.2"
        />
        {/* Teal accent sweep */}
        <path
          d="M800 -100 Q1100 400 700 900"
          stroke="url(#teal1)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M900 -50 Q1200 350 800 850"
          stroke="url(#teal1)"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.25"
        />
        {/* Diagonal fine lines */}
        <path
          d="M400 -50 Q900 300 1400 700"
          stroke="url(#sweep1)"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.2"
        />
        <path
          d="M200 900 Q700 400 1300 100"
          stroke="url(#sweep2)"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.15"
        />

        <defs>
          <linearGradient id="sweep1" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#c7d2fe" />
            <stop offset="50%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sweep2" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="teal1" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#00b894" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00cec9" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Soft glow blobs */}
      <div className="absolute top-[-10%] end-[5%] w-[520px] h-[520px] rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute bottom-[-5%] start-[10%] w-[400px] h-[400px] rounded-full bg-teal-100/30 blur-3xl" />
    </div>
  );
}
