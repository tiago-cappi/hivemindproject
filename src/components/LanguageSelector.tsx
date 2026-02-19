import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "en" as const, label: "English", flag: "🇺🇸" },
  { code: "pt" as const, label: "Português", flag: "🇧🇷" },
];

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === language)!;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="fixed right-3 top-3 z-50 sm:right-6 sm:top-5"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-border bg-background px-3 py-2 font-display text-xs uppercase tracking-widest text-foreground/70 transition-colors hover:border-primary hover:text-foreground"
      >
        <span className="text-sm">{current.flag}</span>
        {current.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 min-w-full border border-border bg-background shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 font-display text-xs uppercase tracking-widest transition-colors hover:bg-primary/10 hover:text-primary ${
                language === lang.code ? "text-primary" : "text-foreground/70"
              }`}
            >
              <span className="text-sm">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default LanguageSelector;
