import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import GlassPanel from "@/components/GlassPanel";

const OrchestratorSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();
  const [activeAgent, setActiveAgent] = useState(-1);
  const [taskLine, setTaskLine] = useState(-1);

  // Cycle task dispatch animation
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const interval = setInterval(() => {
      setTaskLine(i % 6);
      setTimeout(() => {
        setActiveAgent(i % 6);
        setTimeout(() => setActiveAgent(-1), 800);
      }, 400);
      setTimeout(() => setTaskLine(-1), 500);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, [inView]);

  const agentAngles = [0, 60, 120, 180, 240, 300];

  return (
    <section id="orchestrator" ref={ref} className="relative py-8 pl-4 pr-4 md:py-14 md:pl-24 md:pr-8 overflow-hidden">
      <GlassPanel className="mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-14 p-5 sm:p-7 lg:p-9">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative flex-shrink-0"
        >
          <svg width="320" height="320" viewBox="0 0 320 320" fill="none" className="w-64 h-64 lg:w-80 lg:h-80">
            {/* Outer orbit ring */}
            <motion.circle
              cx="160" cy="160" r="140"
              stroke="hsl(43 90% 45%)"
              strokeWidth="0.5"
              opacity="0.15"
              strokeDasharray="2 6"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "160px 160px" }}
            />

            {/* Queen center */}
            <circle cx="160" cy="160" r="30" stroke="hsl(43 90% 45%)" strokeWidth="2" fill="hsl(43 90% 45% / 0.08)" />
            <motion.circle
              cx="160" cy="160" r="8"
              fill="hsl(43 90% 45%)"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Agents with orbit */}
            {agentAngles.map((baseAngle, i) => {
              const isActive = activeAgent === i;
              const isDispatching = taskLine === i;
              return (
                <motion.g
                  key={i}
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 8 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "160px 160px" }}
                >
                  {(() => {
                    const rad = (baseAngle * Math.PI) / 180;
                    const x = 160 + Math.cos(rad) * 110;
                    const y = 160 + Math.sin(rad) * 110;
                    return (
                      <>
                        {/* Task dispatch line */}
                        <motion.line
                          x1="160" y1="160" x2={x} y2={y}
                          stroke="hsl(43 90% 45%)"
                          strokeWidth={isDispatching ? 2 : 1}
                          strokeDasharray="4 4"
                          initial={{ opacity: 0.15, pathLength: 1 }}
                          animate={{
                            opacity: isDispatching ? [0.15, 0.8, 0.15] : 0.15,
                            strokeWidth: isDispatching ? [1, 2.5, 1] : 1,
                          }}
                          transition={{ duration: 0.5 }}
                        />

                        {/* Agent node */}
                        <motion.circle
                          cx={x} cy={y} r="16"
                          stroke={isActive ? "hsl(43 90% 45%)" : "hsl(0 0% 70%)"}
                          strokeWidth={isActive ? 2 : 1}
                          fill={isActive ? "hsl(43 90% 45% / 0.15)" : "hsl(0 0% 0% / 0.02)"}
                          animate={isActive ? {
                            scale: [1, 1.3, 1],
                            filter: ["drop-shadow(0 0 0px transparent)", "drop-shadow(0 0 8px hsl(43 90% 45% / 0.5))", "drop-shadow(0 0 0px transparent)"],
                          } : {}}
                          transition={{ duration: 0.8 }}
                          style={{ transformOrigin: `${x}px ${y}px` }}
                        />
                        <motion.circle
                          cx={x} cy={y} r="4"
                          fill={isActive ? "hsl(43 90% 45%)" : "hsl(0 0% 0%)"}
                          animate={{ opacity: isActive ? [0.4, 1, 0.4] : 0.4 }}
                          transition={{ duration: 0.8 }}
                        />

                        {/* Traveling pulse dot */}
                        {isDispatching && (
                          <motion.circle
                            r="3"
                            fill="hsl(43 100% 55%)"
                            initial={{ cx: 160, cy: 160, opacity: 1 }}
                            animate={{ cx: x, cy: y, opacity: [1, 1, 0] }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            style={{ filter: "drop-shadow(0 0 6px hsl(43 100% 55% / 0.8))" }}
                          />
                        )}
                      </>
                    );
                  })()}
                </motion.g>
              );
            })}
          </svg>
        </motion.div>

        <div className="max-w-lg">
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="mb-4 font-display text-xs font-medium uppercase tracking-[0.3em] text-primary">
            {t("orch.tag")}
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 0.6 }} className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("orch.title1")}
            <br />
            {t("orch.title2")}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.6 }} className="mt-6 text-base leading-relaxed text-graphite-light font-body">
            {t("orch.body")}
          </motion.p>
        </div>
      </GlassPanel>
    </section>
  );
};

export default OrchestratorSection;
