import { useState, useCallback } from "react";
import IntroAnimation from "@/components/IntroAnimation";
import Sidebar from "@/components/Sidebar";
import LanguageSelector from "@/components/LanguageSelector";
import HiveMindBackground from "@/components/HiveMindBackground";
import HeroSection from "@/components/sections/HeroSection";
import HiveAnalogySection from "@/components/sections/HiveAnalogySection";
import OrchestratorSection from "@/components/sections/OrchestratorSection";
import PillarsSection from "@/components/sections/PillarsSection";
import SolutionsSection from "@/components/sections/SolutionsSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import ImpactSection from "@/components/sections/ImpactSection";
import CTASection from "@/components/sections/CTASection";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const { t } = useLanguage();

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
      {!introComplete && <IntroAnimation onComplete={handleIntroComplete} />}

      {introComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-background"
        >
          <HiveMindBackground />
          <Sidebar />
          <LanguageSelector />
          <main className="relative z-10">
            <HeroSection />
            <HiveAnalogySection />
            <OrchestratorSection />
            <PillarsSection />
            <SolutionsSection />
            <PhilosophySection />
            <ImpactSection />
            <CTASection />
          </main>

          <footer className="relative z-10 border-t border-border py-6 pl-4 pr-4 md:pl-24 md:pr-8">
            <p className="text-center font-display text-xs uppercase tracking-[0.3em] text-graphite-light">
              {t("footer")}
            </p>
          </footer>
        </motion.div>
      )}
    </>
  );
};

export default Index;
