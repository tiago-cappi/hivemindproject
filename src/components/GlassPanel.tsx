import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className={`glass-panel ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassPanel;
