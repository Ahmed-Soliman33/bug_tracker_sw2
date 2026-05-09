import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function HeroCollage({ images }) {
  const [img0, img1, img2, img3, img4] = images;

  return (
    <div className="w-full select-none flex flex-col gap-3">

      {/* ── Row 1 ──────────────────────────────────────────────────────── */}
      {/* Layout: [narrow tall pill] [wide landscape] [narrow tall pill]   */}
      <div className="flex gap-3 items-stretch h-[230px]">

        {/* A — narrow portrait pill */}
        <motion.div
          {...fadeUp(0.18)}
          className="w-[22%] rounded-[2.5rem] overflow-hidden shrink-0 shadow-md"
        >
          <img src={img0.src} alt={img0.alt} className="w-full h-full object-cover" loading="eager" />
        </motion.div>

        {/* B — wide landscape centre */}
        <motion.div
          {...fadeUp(0.28)}
          className="flex-1 rounded-[1.75rem] overflow-hidden shadow-md"
        >
          <img src={img1.src} alt={img1.alt} className="w-full h-full object-cover" />
        </motion.div>

        {/* C — narrow portrait pill */}
        <motion.div
          {...fadeUp(0.38)}
          className="w-[22%] rounded-[2.5rem] overflow-hidden shrink-0 shadow-md"
        >
          <img src={img2.src} alt={img2.alt} className="w-full h-full object-cover" />
        </motion.div>

      </div>

      {/* ── Row 2 ──────────────────────────────────────────────────────── */}
      {/* Layout: [small square-ish pill] [wide dominant landscape]        */}
      <div className="flex gap-3 items-stretch h-[210px]">

        {/* D — square pill */}
        <motion.div
          {...fadeUp(0.48)}
          className="w-[30%] rounded-[2.5rem] overflow-hidden shrink-0 shadow-md"
        >
          <img src={img3.src} alt={img3.alt} className="w-full h-full object-cover object-top" />
        </motion.div>

        {/* E — wide dominant card */}
        <motion.div
          {...fadeUp(0.58)}
          className="flex-1 rounded-[1.75rem] overflow-hidden shadow-md"
        >
          <img src={img4.src} alt={img4.alt} className="w-full h-full object-cover" />
        </motion.div>

      </div>
    </div>
  );
}
