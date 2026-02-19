import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import GlassPanel from "@/components/GlassPanel";

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [started, text]);

  if (!started) return null;

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[3px] h-[0.85em] bg-primary ml-0.5 align-middle"
        />
      )}
    </span>
  );
};

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative flex min-h-screen items-center pl-4 pr-4 md:pl-24 md:pr-8 overflow-hidden">
      <GlassPanel className="relative z-10 max-w-3xl p-6 sm:p-9 lg:p-11">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary text-shadow-soft"
        >
          {t("hero.tag")}
        </motion.p>

        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl text-shadow-soft">
          <TypewriterText text={t("hero.title1")} delay={0.5} />
          <br />
          <TypewriterText text={t("hero.title2")} delay={1.8} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.6 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-graphite-light font-body text-shadow-soft"
        >
          {t("hero.sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.6, duration: 0.5 }}
          className="mt-12"
        >
          <a
            href="#cta"
            className="group relative inline-block bg-primary px-10 py-4 font-display text-base font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 animate-pulse-glow"
          >
            {t("hero.cta")}
          </a>
        </motion.div>
      </GlassPanel>

      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block"
        width="200"
        height="500"
        viewBox="0 0 200 500"
        fill="none"
      >
        <path
          d="M100 0 L100 150 L180 200 L180 300 L100 350 L100 500"
          stroke="hsl(43 90% 45%)"
          strokeWidth="1"
          opacity="0.15"
          strokeDasharray="6 10"
        />
        {/* Traveling data bits */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            r="2.5"
            fill="hsl(43 100% 55%)"
            style={{ filter: "drop-shadow(0 0 4px hsl(43 100% 55% / 0.6))" }}
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.3,
              ease: "linear",
            }}
            // Fallback: use cx/cy animation along path points
            initial={{ cx: 100, cy: 0 }}
          >
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              begin={`${i * 1.3}s`}
              path="M100,0 L100,150 L180,200 L180,300 L100,350 L100,500"
            />
          </motion.circle>
        ))}
        <circle cx="100" cy="150" r="4" fill="hsl(43 90% 45%)" opacity="0.3" />
        <circle cx="180" cy="200" r="3" fill="hsl(43 90% 45%)" opacity="0.2" />
        <circle cx="180" cy="300" r="3" fill="hsl(43 90% 45%)" opacity="0.2" />
        <circle cx="100" cy="350" r="4" fill="hsl(43 90% 45%)" opacity="0.3" />
      </motion.svg>
    </section>
  );
};

export default HeroSection;
