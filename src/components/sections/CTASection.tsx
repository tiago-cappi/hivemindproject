import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import GlassPanel from "@/components/GlassPanel";

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  return (
    <section id="cta" ref={ref} className="relative py-10 pl-4 pr-4 md:py-16 md:pl-24 md:pr-8">
      <GlassPanel className="mx-auto max-w-3xl text-center p-5 sm:p-7 lg:p-9">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          {t("cta.title1")}
          <br />
          {t("cta.title2")}
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }} className="mt-6 text-base text-graphite-light font-body">
          {t("cta.sub")}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4, duration: 0.5 }} className="mt-12">
          <a href="#" className="inline-block bg-primary px-14 py-5 font-display text-lg font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:shadow-xl hover:shadow-primary/30 animate-pulse-glow">
            {t("cta.button")}
          </a>
        </motion.div>
        <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ delay: 0.8, duration: 1 }} className="mx-auto mt-24 h-px w-32 bg-primary/30" />
      </GlassPanel>
    </section>
  );
};

export default CTASection;
