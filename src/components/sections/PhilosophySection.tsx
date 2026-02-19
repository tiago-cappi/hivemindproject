import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import HexPattern from "@/components/HexPattern";
import { useLanguage } from "@/contexts/LanguageContext";
import GlassPanel from "@/components/GlassPanel";

const PhilosophySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  return (
    <section id="philosophy" ref={ref} className="relative py-10 pl-4 pr-4 md:py-16 md:pl-24 md:pr-8 overflow-hidden">
      <HexPattern className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />

      <GlassPanel className="relative z-10 mx-auto max-w-3xl text-center p-5 sm:p-7 lg:p-9">
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-4 font-display text-xs font-medium uppercase tracking-[0.3em] text-primary">
          {t("phil.tag")}
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }} className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {t("phil.title1")}
          <br />
          {t("phil.title2")}
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4, duration: 0.6 }} className="mt-8 text-base leading-relaxed text-graphite-light font-body">
          {t("phil.body")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-5 text-sm leading-relaxed text-graphite-light/70 font-body italic"
        >
          {t("phil.extension")}
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.7 }} className="mt-12 flex flex-wrap justify-center gap-3">
          {["Python", "OpenAI", "LangChain", "N8N", "Custom LLMs", "CrewAI", "AutoGen", "Pandas", "FastAPI"].map((tech) => (
            <span key={tech} className="border border-border px-4 py-2 font-display text-xs uppercase tracking-widest text-graphite-light transition-colors hover:border-primary hover:text-primary">
              {tech}
            </span>
          ))}
        </motion.div>
      </GlassPanel>
    </section>
  );
};

export default PhilosophySection;
