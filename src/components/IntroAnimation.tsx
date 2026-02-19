import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import introVideo from "@/assets/hive-mind-intro.mp4";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"playing" | "transitioning" | "done">("playing");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setPhase("transitioning");
      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 1200);
    };

    video.addEventListener("ended", handleEnded);
    video.play().catch(() => {
      // Autoplay blocked — skip intro
      setPhase("done");
      onComplete();
    });

    return () => video.removeEventListener("ended", handleEnded);
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={
            phase === "transitioning"
              ? {
                  scale: 0.15,
                  x: "-42vw",
                  y: "-42vh",
                  opacity: 0,
                }
              : {}
          }
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            ref={videoRef}
            src={introVideo}
            muted
            playsInline
            className="max-w-[500px] w-[80vw]"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IntroAnimation;
