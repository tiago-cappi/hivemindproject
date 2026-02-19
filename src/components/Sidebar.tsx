import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hexagon, Zap, Database, Rocket, Shield, MessageSquare,
  Network, ChevronLeft, ChevronRight, Menu, X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { icon: Hexagon,       label: t("nav.hive"),         href: "#hero" },
    { icon: Network,       label: t("nav.analogy"),      href: "#analogy" },
    { icon: Zap,           label: t("nav.orchestrator"), href: "#orchestrator" },
    { icon: Database,      label: t("nav.expertise"),    href: "#pillars" },
    { icon: Rocket,        label: t("nav.solutions"),    href: "#solutions" },
    { icon: Shield,        label: t("nav.philosophy"),   href: "#philosophy" },
    { icon: MessageSquare, label: t("nav.contact"),      href: "#cta" },
  ];

  const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      {navItems.map((item, i) => (
        <a
          key={i}
          href={item.href}
          onClick={onLinkClick}
          className="group flex h-11 w-full items-center gap-3 rounded-sm px-2 transition-colors hover:bg-primary/10"
        >
          <item.icon
            className="h-5 w-5 shrink-0 text-foreground/60 transition-colors group-hover:text-primary"
            strokeWidth={1.5}
          />
          <span className="whitespace-nowrap font-display text-xs font-medium tracking-wide text-foreground/70 transition-colors group-hover:text-primary">
            {item.label}
          </span>
        </a>
      ))}
    </>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ width: collapsed ? 64 : 210 }}
        className="fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col justify-center border-r border-border/50 bg-background/80 backdrop-blur-sm transition-[width] duration-300 overflow-hidden"
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          className="absolute top-4 right-2 flex h-7 w-7 items-center justify-center rounded-sm text-foreground/35 transition-colors hover:bg-primary/10 hover:text-primary"
        >
          {collapsed
            ? <ChevronRight className="h-3.5 w-3.5" />
            : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        <div className="flex flex-col gap-0.5 w-full px-2">
          {navItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="group relative flex h-11 w-full items-center gap-3 rounded-sm px-2 transition-colors hover:bg-primary/10"
            >
              <item.icon
                className="h-5 w-5 shrink-0 text-foreground/60 transition-colors group-hover:text-primary"
                strokeWidth={1.5}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    key={`label-${i}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15, delay: i * 0.025 }}
                    className="whitespace-nowrap font-display text-xs font-medium tracking-wide text-foreground/70 transition-colors group-hover:text-primary"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {collapsed && (
                <span className="pointer-events-none absolute left-[52px] hidden group-hover:block whitespace-nowrap rounded-sm bg-foreground px-3 py-1.5 font-display text-xs font-medium tracking-wide text-primary z-50 shadow-md">
                  {item.label}
                </span>
              )}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* ── Mobile hamburger ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        className="fixed left-3 top-3 z-50 flex md:hidden h-10 w-10 items-center justify-center rounded-sm border border-border/60 bg-background/85 backdrop-blur-sm text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Menu className="h-5 w-5" />
      </motion.button>

      {/* ── Mobile slide-in drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              key="drawer"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="fixed left-0 top-0 z-50 flex h-screen w-60 flex-col justify-center border-r border-border/60 bg-background/95 backdrop-blur-md md:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-sm text-foreground/50 transition-colors hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-col gap-0.5 w-full px-3">
                <NavLinks onLinkClick={() => setMobileOpen(false)} />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
