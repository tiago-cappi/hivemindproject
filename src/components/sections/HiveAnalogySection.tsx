import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import GlassPanel from "@/components/GlassPanel";

const PC = "hsl(43 90% 45%)";
const PCB = "hsl(43 100% 55%)";

// ─── Queen Animation ──────────────────────────────────────────
const QueenAnimation = () => {
  const angles = [0, 60, 120, 180, 240, 300];
  const dotR = 55;

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      {/* Rotating dashed orbit */}
      <motion.circle
        cx="80" cy="80" r="65"
        stroke={PC} strokeWidth="0.5" strokeDasharray="3 7"
        opacity="0.2"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "80px 80px" }}
      />

      {/* Radiating command lines */}
      {angles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.line
            key={i}
            x1="80" y1="80"
            x2={80 + Math.cos(rad) * dotR}
            y2={80 + Math.sin(rad) * dotR}
            stroke={PC} strokeWidth="0.75" strokeDasharray="3 4"
            animate={{ opacity: [0.1, 0.55, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.33, ease: "easeInOut" }}
          />
        );
      })}

      {/* Center hexagon */}
      <motion.polygon
        points={Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          return `${80 + 26 * Math.cos(a)},${80 + 26 * Math.sin(a)}`;
        }).join(" ")}
        stroke={PC} strokeWidth="2"
        fill="hsl(43 90% 45% / 0.1)"
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "80px 80px" }}
      />

      {/* Crown symbol */}
      <motion.path
        d="M70 84 L70 73 L76 79 L80 67 L84 79 L90 73 L90 84 Z"
        fill={PC}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Satellite agent dots */}
      {angles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 80 + Math.cos(rad) * dotR;
        const y = 80 + Math.sin(rad) * dotR;
        return (
          <motion.circle
            key={i}
            cx={x} cy={y} r="5"
            stroke={PC} strokeWidth="1.5"
            fill="hsl(43 90% 45% / 0.15)"
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.33, ease: "easeInOut" }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        );
      })}

      {/* Traveling pulse dots from center to agents */}
      {[0, 2, 4].map((agentIdx, i) => {
        const rad = (agentIdx * 60 * Math.PI) / 180;
        const tx = 80 + Math.cos(rad) * dotR;
        const ty = 80 + Math.sin(rad) * dotR;
        return (
          <motion.circle
            key={i} r="2.5"
            fill={PCB}
            style={{ filter: "drop-shadow(0 0 3px hsl(43 100% 55% / 0.8))" }}
            animate={{ cx: [80, tx], cy: [80, ty], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.9, ease: "easeOut" }}
          />
        );
      })}
    </svg>
  );
};

// ─── Workers Animation ────────────────────────────────────────
const WorkersAnimation = () => {
  const labels = ["PY", "DB", "API", "ML", "NLP", "UI"];
  const orbitR = 52;

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      {/* Counter-rotating orbit ring */}
      <motion.circle
        cx="80" cy="80" r={orbitR}
        stroke={PC} strokeWidth="0.5" strokeDasharray="2 5"
        opacity="0.2"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "80px 80px" }}
      />

      {/* Central orchestrator node */}
      <circle cx="80" cy="80" r="14" stroke={PC} strokeWidth="1.5" fill="hsl(43 90% 45% / 0.1)" />
      <motion.circle
        cx="80" cy="80" r="6"
        fill={PC}
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Worker hexagon nodes */}
      {labels.map((label, i) => {
        const rad = (i * 60 * Math.PI) / 180;
        const cx = 80 + Math.cos(rad) * orbitR;
        const cy = 80 + Math.sin(rad) * orbitR;
        const hexPts = Array.from({ length: 6 }, (_, j) => {
          const a = (Math.PI / 3) * j - Math.PI / 6;
          return `${cx + 13 * Math.cos(a)},${cy + 13 * Math.sin(a)}`;
        }).join(" ");

        return (
          <motion.g key={i}>
            <motion.line
              x1="80" y1="80" x2={cx} y2={cy}
              stroke={PC} strokeWidth="0.75" strokeDasharray="3 3"
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
            />
            <motion.polygon
              points={hexPts}
              stroke={PC} strokeWidth="1.5"
              animate={{
                fill: ["hsl(43 90% 45% / 0.04)", "hsl(43 90% 45% / 0.25)", "hsl(43 90% 45% / 0.04)"],
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <text
              x={cx} y={cy + 4}
              textAnchor="middle" fontSize="7"
              fontFamily="Space Grotesk, sans-serif"
              fill={PC} fontWeight="600"
            >
              {label}
            </text>
          </motion.g>
        );
      })}

      {/* Traveling pulse dots center → workers */}
      {[0, 2, 4].map((agentIdx, i) => {
        const rad = (agentIdx * 60 * Math.PI) / 180;
        const tx = 80 + Math.cos(rad) * orbitR;
        const ty = 80 + Math.sin(rad) * orbitR;
        return (
          <motion.circle
            key={i} r="2.5"
            fill={PCB}
            style={{ filter: "drop-shadow(0 0 3px hsl(43 100% 55% / 0.8))" }}
            animate={{ cx: [80, tx, 80], cy: [80, ty, 80], opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.83, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
};

// ─── Hive Animation ────────────────────────────────────────────
const HiveAnimation = () => {
  const size = 20;
  const h = Math.sqrt(3) * size;
  const cells = [
    { cx: 80,              cy: 80 },
    { cx: 80 + size * 1.5, cy: 80 - h / 2 },
    { cx: 80 + size * 1.5, cy: 80 + h / 2 },
    { cx: 80,              cy: 80 + h },
    { cx: 80 - size * 1.5, cy: 80 + h / 2 },
    { cx: 80 - size * 1.5, cy: 80 - h / 2 },
    { cx: 80,              cy: 80 - h },
  ];
  const repeatDelay = cells.length * 0.25 + 1.5;

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      {cells.map((cell, i) => {
        const points = Array.from({ length: 6 }, (_, j) => {
          const a = (Math.PI / 3) * j;
          return `${cell.cx + size * Math.cos(a)},${cell.cy + size * Math.sin(a)}`;
        }).join(" ");

        return (
          <motion.polygon
            key={i}
            points={points}
            stroke={PC} strokeWidth="1.5"
            initial={{ fill: "hsl(43 90% 45% / 0.02)", strokeOpacity: 0.3 }}
            animate={{
              fill: [
                "hsl(43 90% 45% / 0.02)",
                "hsl(43 90% 45% / 0.40)",
                "hsl(43 90% 45% / 0.08)",
              ],
              strokeOpacity: [0.3, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.25,
              repeat: Infinity,
              repeatDelay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </svg>
  );
};

// ─── Main Section ──────────────────────────────────────────────
const HiveAnalogySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  const cards = [
    {
      label: t("analogy.queen.label"),
      title: t("analogy.queen.title"),
      desc:  t("analogy.queen.desc"),
      animation: <QueenAnimation />,
    },
    {
      label: t("analogy.workers.label"),
      title: t("analogy.workers.title"),
      desc:  t("analogy.workers.desc"),
      animation: <WorkersAnimation />,
    },
    {
      label: t("analogy.hive.label"),
      title: t("analogy.hive.title"),
      desc:  t("analogy.hive.desc"),
      animation: <HiveAnimation />,
    },
  ];

  return (
    <section ref={ref} id="analogy" className="relative py-6 pl-4 pr-4 md:py-10 md:pl-24 md:pr-8">
      <GlassPanel className="mx-auto max-w-6xl p-5 sm:p-7 lg:p-9">

        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4 font-display text-xs font-medium uppercase tracking-[0.3em] text-primary"
        >
          {t("analogy.tag")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl"
        >
          {t("analogy.title")}
        </motion.h2>

        {/* Horizontal divider drawn left → right */}
        <motion.div
          className="mb-12 h-px bg-primary/25"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.35, duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />

        {/* Three animated cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.7, ease: "easeOut" }}
              className="glass-card flex flex-col items-center p-6 text-center"
            >
              {/* SVG Animation */}
              <div className="mb-6 flex h-[160px] w-full items-center justify-center">
                {card.animation}
              </div>

              {/* Label badge */}
              <span className="mb-3 inline-block border border-primary/20 px-3 py-1 font-display text-[10px] uppercase tracking-[0.25em] text-primary">
                {card.label}
              </span>

              {/* Title */}
              <h3 className="mb-4 font-display text-xl font-semibold text-foreground">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-graphite-light font-body">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </GlassPanel>
    </section>
  );
};

export default HiveAnalogySection;
