"use client";

import Link from "next/link";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagneticButton,
  LiquidButton,
  MagneticCard,
  SlingshotOTP,
  AuroraBackground,
  ParticleField,
  CursorSpotlight,
  MorphingTypography,
  HolographicCard,
  Interactive3DCard,
  StreamingChat,
  Kanban,
  AdvancedTable,
  Terminal,
  TactileLoader,
} from "@buildora/components";
import { copyToClipboard } from "@buildora/utils";
import { allComponents, totalComponents } from "@/lib/registry";
import { cn } from "@buildora/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function SpotlightCard({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = React.useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const Card = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 transition-all duration-500",
        "hover:border-[#d4ff4f]/30 hover:shadow-[0_0_40px_-15px_rgba(212,255,79,0.3)]",
        className
      )}
      style={
        {
          "--mouse-x": `${position.x}%`,
          "--mouse-y": `${position.y}%`,
        } as React.CSSProperties
      }
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${position.x}% ${position.y}%, rgba(212, 255, 79, 0.12), transparent 50%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{Card}</Link>;
  }
  return Card;
}

function BentoGrid() {
  const showcaseItems = [
    { title: "Magnetic Button", desc: "Spring physics in your UI", component: "magnetic-button", size: "default" },
    { title: "Slingshot OTP", desc: "Gamified verification", component: "slingshot-otp", size: "lg" },
    { title: "Particle Field", desc: "Canvas-based animations", component: "particle-field", size: "default" },
    { title: "Physics Kanban", desc: "Drag with spring snap", component: "kanban", size: "lg" },
    { title: "Streaming Chat", desc: "Token-by-token LLM UI", component: "streaming-chat", size: "default" },
    { title: "Terminal", desc: "Developer-first CLI UI", component: "terminal", size: "default" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {showcaseItems.map((item, i) => (
        <motion.div
          key={item.component}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className={cn(
            i === 1 && "sm:col-span-2 lg:col-span-1",
            i === 3 && "sm:col-span-2 lg:col-span-1"
          )}
        >
          <SpotlightCard
            href={`/components/${item.component}`}
            className="h-[280px] flex flex-col"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-[#d4ff4f]/15 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#d4ff4f]">
                {item.component}
              </span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/40">
                interactive
              </span>
            </div>
            <h4 className="font-display text-lg font-bold tracking-tight">{item.title}</h4>
            <p className="mt-1 text-sm text-white/50">{item.desc}</p>
            <div className="mt-auto pt-4">
              <MagneticButton variant="ghost" strength={0.3} className="text-[#d4ff4f]">
                View component →
              </MagneticButton>
            </div>
          </SpotlightCard>
        </motion.div>
      ))}
    </div>
  );
}

function CopyInstall() {
  const [copied, setCopied] = React.useState(false);
  const cmd = "pnpm dlx shadcn@latest add @buildora/magnetic-button";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="group relative max-w-xl"
    >
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#d4ff4f]/20 via-[#9d8cff]/20 to-[#d4ff4f]/20 opacity-0 blur transition duration-500 group-hover:opacity-100" />
      <div className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d0f16] px-5 py-4">
        <span className="font-mono text-sm text-white/40 select-none">$</span>
        <code className="flex-1 truncate font-mono text-sm text-[#d4ff4f]">{cmd}</code>
        <button
          onClick={async () => {
            await copyToClipboard(cmd);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="shrink-0 rounded-lg bg-white/10 px-3 py-1.5 font-mono text-xs font-medium text-white/80 transition-all hover:bg-white/20 active:scale-95"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </motion.div>
  );
}

function StatsBar() {
  const stats = [
    { value: String(totalComponents), label: "Components", icon: "📦" },
    { value: "11", label: "Frameworks", icon: "⚡" },
    { value: "7", label: "Categories", icon: "📂" },
    { value: "MIT", label: "License", icon: "📜" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 text-center transition-all duration-300 hover:border-[#d4ff4f]/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4ff4f]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="text-2xl">{stat.icon}</span>
          <p className="mt-2 font-display text-3xl font-black tracking-tight text-gradient">
            {stat.value}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-white/40">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function FrameworkBadges() {
  const frameworks = [
    "React",
    "JavaScript",
    "Vue",
    "Svelte",
    "Angular",
    "HTML",
    "Tailwind",
    "React Native",
    "Flutter",
    "SwiftUI",
    "Compose",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {frameworks.map((f, i) => (
        <motion.span
          key={f}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
          className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-white/60 transition-all duration-300 hover:border-[#d4ff4f]/30 hover:bg-[#d4ff4f]/5 hover:text-[#d4ff4f]"
        >
          {f}
        </motion.span>
      ))}
    </div>
  );
}

function CreativeStrip() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={itemVariants}>
        <CursorSpotlight>
          <div className="p-6">
            <p className="b-section-label">Creative Effects</p>
            <p className="mt-3 font-display text-xl font-bold">Cursor Spotlight</p>
            <p className="mt-2 text-sm text-white/50">
              Spotlight follows your mouse with smooth transitions
            </p>
            <div className="mt-4">
              <MagneticButton strength={0.3} variant="ghost" className="text-[#d4ff4f]">
                Try it
              </MagneticButton>
            </div>
          </div>
        </CursorSpotlight>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MagneticCard className="h-full">
          <div className="p-6">
            <p className="b-section-label">3D Perspective</p>
            <p className="mt-3 font-display text-xl font-bold">Magnetic Card</p>
            <p className="mt-2 text-sm text-white/50">
              Tilt and spotlight effects on hover
            </p>
          </div>
        </MagneticCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <HolographicCard>
          <div className="p-6">
            <p className="b-section-label">Holographic</p>
            <MorphingTypography
              words={["Build", "Remix", "Ship"]}
              className="mt-3 font-display text-xl font-bold"
            />
            <p className="mt-2 text-sm text-white/50">
              Rainbow sheen that tracks the pointer
            </p>
          </div>
        </HolographicCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Interactive3DCard>
          <div className="p-6">
            <p className="b-section-label">Interactive 3D</p>
            <p className="mt-3 font-display text-xl font-bold">Flip Card</p>
            <p className="mt-2 text-sm text-white/50">
              Click to flip and reveal more info
            </p>
          </div>
        </Interactive3DCard>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute inset-0 bg-grid-scan opacity-50" />
        <div className="absolute inset-0 bg-dots opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:pb-24 sm:pt-12 lg:pb-32 lg:pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-12"
          >
            <div className="flex-1 space-y-8">
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2.5 rounded-full border border-[#d4ff4f]/20 bg-[#d4ff4f]/[0.05] px-4 py-1.5 font-mono text-[11px] tracking-[0.15em] text-[#d4ff4f] shadow-glow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d4ff4f] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4ff4f]" />
                  </span>
                  <span>OPEN SOURCE · {totalComponents} COMPONENTS</span>
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="font-display text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                <span className="text-gradient-animated">Creative</span>
                <br />
                <span className="text-white">components for</span>
                <br />
                <span className="text-white">modern devs.</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="max-w-lg text-base leading-relaxed text-white/50 sm:text-lg"
              >
                Production-ready React components with expressive interactions, spring
                physics, 11 framework ports, and full accessibility.{" "}
                <span className="text-white/70">Copy. Paste. Ship.</span>
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                <Link href="/components">
                  <MagneticButton className="shadow-glow-sm">
                    Explore Components
                    <svg
                      className="ml-1.5 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </MagneticButton>
                </Link>
                <a
                  href="https://github.com/buildora/buildora"
                  target="_blank"
                  rel="noreferrer"
                >
                  <LiquidButton>
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      Star on GitHub
                    </span>
                  </LiquidButton>
                </a>
              </motion.div>

              <CopyInstall />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="hidden w-full max-w-md lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#d4ff4f]/20 via-[#9d8cff]/20 to-[#d4ff4f]/20 opacity-20 blur-xl" />
                <div className="relative space-y-4">
                  <SpotlightCard className="p-5">
                    <p className="b-section-label mb-3">Live Demo</p>
                    <div className="flex flex-wrap gap-2">
                      <MagneticButton strength={0.4} className="shadow-glow-sm">
                        Ship it
                      </MagneticButton>
                      <MagneticButton strength={0.4} variant="ghost">
                        Ghost
                      </MagneticButton>
                      <MagneticButton strength={0.4} variant="iris">
                        Iris
                      </MagneticButton>
                    </div>
                  </SpotlightCard>

                  <SpotlightCard className="p-5">
                    <p className="b-section-label mb-3">Signature · OTP</p>
                    <SlingshotOTP length={4} />
                  </SpotlightCard>

                  <SpotlightCard className="p-5">
                    <p className="b-section-label mb-3">Morphing Text</p>
                    <MorphingTypography
                      words={["Build", "Remix", "Ship", "Create"]}
                      className="text-2xl font-bold"
                    />
                  </SpotlightCard>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="b-gradient-line" />

      <section className="bg-[#0a0c12]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <StatsBar />
        </div>
      </section>

      <div className="b-gradient-line" />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-10"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <span className="font-mono text-sm text-[#d4ff4f]/60">01</span>
            <h2 className="font-display text-2xl font-black sm:text-3xl lg:text-4xl">
              Interactive component showcase
            </h2>
          </motion.div>
          <motion.p variants={itemVariants} className="mt-3 max-w-2xl text-sm text-white/50 sm:text-base">
            Every component below is a real, live React implementation. Hover, click,
            drag, type — they're all interactive.
          </motion.p>
        </motion.div>

        <BentoGrid />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-10"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <span className="font-mono text-sm text-[#d4ff4f]/60">02</span>
            <h2 className="font-display text-2xl font-black sm:text-3xl lg:text-4xl">
              Creative atmosphere effects
            </h2>
          </motion.div>
        </motion.div>

        <CreativeStrip />
      </section>

      <div className="b-gradient-line" />

      <section className="bg-[#0a0c12]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <span className="font-mono text-sm text-[#d4ff4f]/60">03</span>
              <h2 className="font-display text-2xl font-black sm:text-3xl lg:text-4xl">
                One intent, eleven idioms
              </h2>
            </motion.div>
            <motion.p variants={itemVariants} className="mt-3 max-w-2xl text-sm text-white/50 sm:text-base">
              React is the source of truth. Every other framework gets an idiomatic
              port — honest status badges tell you exactly what's production-ready.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8">
              <FrameworkBadges />
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {allComponents.slice(0, 8).map((c) => (
                <Link
                  key={c.slug}
                  href={`/components/${c.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d4ff4f]/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4ff4f]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <p className="font-mono text-[10px] text-[#d4ff4f]">{c.categories[0]}</p>
                    <p className="mt-1 font-display font-bold group-hover:text-[#d4ff4f] transition-colors">
                      {c.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-white/45">{c.description}</p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="b-gradient-line" />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-10 flex items-center gap-4">
            <span className="font-mono text-sm text-[#d4ff4f]/60">04</span>
            <h2 className="font-display text-2xl font-black sm:text-3xl lg:text-4xl">
              Built for developers
            </h2>
          </motion.div>

          <motion.div variants={containerVariants} className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: "⚡",
                title: "Open source",
                desc: "MIT components, hooks, tokens, and tests. GitHub is the source of truth; this site is the polished playground.",
                link: { label: "Contribute", href: "https://github.com/buildora/buildora" },
                accent: "#d4ff4f",
              },
              {
                icon: "📦",
                title: "shadcn registry",
                desc: "Drop-in components via the shadcn CLI. No custom domain needed — GitHub-hosted registry.",
                link: { label: "Open registry →", href: "/registry" },
                accent: "#d4ff4f",
                featured: true,
              },
              {
                icon: "🧪",
                title: "Creative lab",
                desc: "Tune spring physics, magnetism, glow intensity in the live playground — then copy the exact production code.",
                link: { label: "Open playground →", href: "/playground" },
                accent: "#9d8cff",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-7 transition-all duration-500",
                  item.featured
                    ? "border-[#d4ff4f]/20 bg-[#d4ff4f]/[0.03]"
                    : "hover:border-[#d4ff4f]/20 hover:bg-[#d4ff4f]/[0.02]"
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{item.desc}</p>
                <Link
                  href={item.link.href}
                  className={cn(
                    "mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300",
                    item.featured
                      ? "bg-[#d4ff4f] text-black hover:shadow-glow-sm active:scale-95"
                      : "border border-white/15 hover:bg-white/10 hover:border-[#d4ff4f]/30"
                  )}
                >
                  {item.link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
