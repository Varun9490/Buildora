"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MagneticButton,
  SlingshotOTP,
  MorphingTypography,
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
          <MagneticButton strength={0.4}>
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
        <div className="w-full max-w-md overflow-hidden rounded-lg">
          <Terminal />
        </div>
      );
    case "ai":
      return (
        <div className="w-full max-w-sm overflow-hidden rounded-lg">
          <StreamingChat />
        </div>
      );
    case "kanban":
      return (
        <div className="w-full max-w-sm overflow-hidden rounded-lg">
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
      {/* macOS-style window chrome */}
      <div className="overflow-hidden rounded-lg border border-[--b-border] bg-[--b-panel]">
        <div className="flex items-center gap-2 border-b border-[--b-border] px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <p className="ml-2 font-mono text-[10px] text-[--b-muted]">
            {activeComponent.title}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[280px] items-center justify-center p-8"
          >
            <ShowcaseRenderer id={activeComponent.id} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {showcaseComponents.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActiveIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 bg-[--b-accent]"
                : "w-1.5 bg-white/10 hover:bg-white/20"
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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group b-card p-6"
    >
      <div
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: color || "var(--b-accent-muted)" }}
      >
        {icon}
      </div>
      <h4 className="font-display text-base font-bold tracking-tight">
        {title}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-[--b-muted]">
        {description}
      </p>
    </motion.div>
  );
}

export function StatsCounter({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[--b-border] bg-white/[0.02] px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-[--b-text-secondary]">
        {icon}
      </div>
      <div>
        <p className="font-display text-xl font-bold tracking-tight text-gradient">
          {value}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[--b-muted]">
          {label}
        </p>
      </div>
    </div>
  );
}
