import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Boxes, GitFork, TestTube, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import GlassPanel from "@/components/GlassPanel";

const PillarsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  const pillars = [
    { number: "01", icon: Boxes, title: t("pillar1.title"), category: t("pillar1.category"), description: t("pillar1.desc") },
    { number: "02", icon: GitFork, title: t("pillar2.title"), category: t("pillar2.category"), description: t("pillar2.desc") },
    { number: "03", icon: TestTube, title: t("pillar3.title"), category: t("pillar3.category"), description: t("pillar3.desc") },
    { number: "04", icon: ShieldCheck, title: t("pillar4.title"), category: t("pillar4.category"), description: t("pillar4.desc") },
  ];

  return (
    <section id="pillars" ref={ref} className="relative py-8 pl-4 pr-4 md:py-14 md:pl-24 md:pr-8">
      <GlassPanel className="mx-auto max-w-6xl p-5 sm:p-7 lg:p-9">
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-4 font-display text-xs font-medium uppercase tracking-[0.3em] text-primary">
          {t("pillars.tag")}
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }} className="mb-20 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {t("pillars.title")}
        </motion.h2>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.7, ease: "easeOut" }}
              className="group relative glass-card p-6 pt-8"
            >
              {/* Honeycomb border glow on entry */}
              <motion.div
                className="absolute inset-0 -m-px border border-primary/0 pointer-events-none"
                initial={{ borderColor: "hsl(43 90% 45% / 0)" }}
                animate={inView ? {
                  borderColor: ["hsl(43 90% 45% / 0)", "hsl(43 90% 45% / 0.3)", "hsl(43 90% 45% / 0)"],
                } : {}}
                transition={{ delay: 0.3 + i * 0.2, duration: 1.2 }}
              />

              <motion.span
                className="font-display text-sm font-light text-primary inline-block"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.2, duration: 0.4 }}
              >
                {pillar.number}
              </motion.span>

              <div className="mt-6 mb-5 flex h-12 w-12 items-center justify-center border border-primary/20 transition-colors group-hover:bg-primary/5">
                <pillar.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>

              <p className="mb-1 font-display text-xs font-medium uppercase tracking-[0.2em] text-graphite-light">{pillar.category}</p>

              <motion.h3
                className="mb-4 font-display text-xl font-semibold text-foreground overflow-hidden"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.2, duration: 0.5 }}
              >
                {pillar.title}
              </motion.h3>

              <p className="text-sm leading-relaxed text-graphite-light font-body">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </GlassPanel>
    </section>
  );
};

export default PillarsSection;
