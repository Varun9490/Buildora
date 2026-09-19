"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MagneticButton,
  SlingshotOTP,
  MorphingTypography,
  ParticleField,
  StreamingChat,
  Terminal,
  Kanban,
  Typewriter,
  GradientText,
} from "@buildora/components";

const showcaseComponents = [
  { id: "magnetic", title: "Magnetic Interactions", component: "magnetic-button" },
  { id: "otp", title: "Gamified OTP Input", component: "slingshot-otp" },
  { id: "text", title: "Text Effects", component: "text-effects" },
  { id: "terminal", title: "TUI Components", component: "terminal" },
  { id: "ai", title: "AI/LLM Interfaces", component: "streaming-chat" },
  { id: "kanban", title: "Interactive Data", component: "kanban" },
];

function ShowcaseRenderer({ id }: { id: string }) {
  switch (id) {
    case "magnetic":
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <MagneticButton strength={0.4} className="shadow-glow-sm">
            Ship it
            <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </MagneticButton>
          <MagneticButton variant="ghost" strength={0.4}>
            Ghost
          </MagneticButton>
          <MagneticButton variant="iris" strength={0.4}>
            Iris
          </MagneticButton>
        </div>
      );
    case "otp":
      return <SlingshotOTP length={6} />;
    case "text":
      return (
        <div className="text-center">
          <MorphingTypography words={["Build", "Remix", "Ship", "Create"]} className="text-2xl font-bold" />
          <div className="mt-4">
            <Typewriter text={["Creative", "Beautiful", "Accessible"]} speed={80} delay={1500} />
          </div>
        </div>
      );
    case "terminal":
      return (
        <div className="w-full max-w-md overflow-hidden rounded-xl">
          <Terminal />
        </div>
      );
    case "ai":
      return (
        <div className="w-full max-w-sm overflow-hidden rounded-xl">
          <StreamingChat />
        </div>
      );
    case "kanban":
      return (
        <div className="w-full max-w-sm overflow-hidden rounded-xl">
          <Kanban />
        </div>
      );
    default:
      return (
        <div className="text-center">
          <GradientText className="text-2xl font-bold">Buildora</GradientText>
        </div>
      );
  }
}

export function DynamicHeroShowcase() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseComponents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeComponent = showcaseComponents[activeIndex];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        key={activeComponent.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4 }}
        className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8"
      >
        <ShowcaseRenderer id={activeComponent.id} />
      </motion.div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <p className="mr-3 font-mono text-xs text-white/50">{activeComponent.title}</p>
        {showcaseComponents.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "bg-[#d4ff4f]"
                : "bg-white/10 hover:bg-white/20"
            }`}
            aria-label={`Show ${c.title}`}
          />
        ))}
      </div>
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-6 transition-all duration-300 hover:border-white/20"
    >
      <div
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
        style={{ backgroundColor: color || "rgba(212, 255, 79, 0.1)" }}
      >
        {icon}
      </div>
      <h4 className="font-display text-lg font-bold">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-white/50">{description}</p>
    </motion.div>
  );
}

export function StatsCounter({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-xl">
        {icon}
      </div>
      <div>
        <p className="font-display text-xl font-black text-gradient">{value}</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">{label}</p>
      </div>
    </div>
  );
}
