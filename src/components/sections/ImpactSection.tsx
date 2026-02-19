import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import GlassPanel from "@/components/GlassPanel";

const ImpactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  const metrics = [
    { value: "+70%", label: t("impact.metric1") },
    { value: "5×", label: t("impact.metric2") },
    { value: "~0%", label: t("impact.metric3") },
  ];

  return (
    <section ref={ref} className="relative py-6 pl-4 pr-4 md:py-10 md:pl-24 md:pr-8 border-t border-border">
      <GlassPanel className="mx-auto max-w-6xl p-5 sm:p-7 lg:p-9">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-12 text-center font-display text-xs font-medium uppercase tracking-[0.3em] text-primary"
        >
          {t("impact.tag")}
        </motion.p>

        <div className="grid gap-px bg-border md:grid-cols-3">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className="flex flex-col items-center justify-center glass-card px-5 py-8 text-center md:px-8 md:py-12"
            >
              <motion.span
                className="font-display text-5xl font-bold text-primary md:text-6xl"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5, ease: "backOut" }}
              >
                {m.value}
              </motion.span>
              <p className="mt-4 max-w-[180px] font-display text-xs uppercase tracking-[0.2em] text-graphite-light">
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>
      </GlassPanel>
    </section>
  );
};

export default ImpactSection;
