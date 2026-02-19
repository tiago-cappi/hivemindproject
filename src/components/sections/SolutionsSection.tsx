import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Bot, BarChart2, FileText, TrendingUp, LayoutDashboard, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import GlassPanel from "@/components/GlassPanel";

const SolutionsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  const solutions = [
    {
      icon: Bot,
      layer: t("sol.layer1"),
      title: t("sol.card1.title"),
      desc: t("sol.card1.desc"),
      tags: ["CRM", "LangChain", "GPT-4"],
    },
    {
      icon: TrendingUp,
      layer: t("sol.layer1"),
      title: t("sol.card2.title"),
      desc: t("sol.card2.desc"),
      tags: ["Python", "scikit-learn", "Pandas"],
    },
    {
      icon: FileText,
      layer: t("sol.layer1"),
      title: t("sol.card3.title"),
      desc: t("sol.card3.desc"),
      tags: ["OCR", "Python", "ERP API"],
    },
    {
      icon: MessageSquare,
      layer: t("sol.layer2"),
      title: t("sol.card4.title"),
      desc: t("sol.card4.desc"),
      tags: ["CrewAI", "AutoGen", "OpenAI"],
    },
    {
      icon: LayoutDashboard,
      layer: t("sol.layer2"),
      title: t("sol.card5.title"),
      desc: t("sol.card5.desc"),
      tags: ["Python", "Plotly", "SQL"],
    },
    {
      icon: BarChart2,
      layer: t("sol.layer2"),
      title: t("sol.card6.title"),
      desc: t("sol.card6.desc"),
      tags: ["NLP", "BERT", "Python"],
    },
  ];

  return (
    <section id="solutions" ref={ref} className="relative py-8 pl-4 pr-4 md:py-14 md:pl-24 md:pr-8">
      <GlassPanel className="mx-auto max-w-6xl p-5 sm:p-7 lg:p-9">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-4 font-display text-xs font-medium uppercase tracking-[0.3em] text-primary"
        >
          {t("sol.tag")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl"
        >
          {t("sol.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-16 max-w-2xl text-base leading-relaxed text-graphite-light font-body"
        >
          {t("sol.subtitle")}
        </motion.p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((sol, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: "easeOut" }}
              className="group relative glass-card p-8 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Glow edge on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: "inset 0 0 30px hsl(43 90% 45% / 0.04)" }} />

              {/* Layer badge */}
              <span className="mb-6 inline-block border border-primary/20 px-3 py-1 font-display text-[10px] uppercase tracking-[0.25em] text-primary">
                {sol.layer}
              </span>

              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-primary/20 transition-colors group-hover:bg-primary/5">
                <sol.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>

              <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                {sol.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-graphite-light font-body">
                {sol.desc}
              </p>

              <div className="flex flex-wrap gap-2">
                {sol.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-border px-2 py-0.5 font-display text-[10px] uppercase tracking-widest text-graphite-light transition-colors group-hover:border-primary/20 group-hover:text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassPanel>
    </section>
  );
};

export default SolutionsSection;
