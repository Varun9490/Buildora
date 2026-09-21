"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MagneticButton,
  SlingshotOTP,
  FxCard,
  RippleButton,
  HoldButton,
  ShimmerButton,
  Switch,
  Slider,
  Badge,
} from "@buildora/components";
import { copyToClipboard } from "@buildora/utils";

type ConsoleTab = "magnetic" | "otp" | "card" | "controls";

export function HeroConsole() {
  const [activeTab, setActiveTab] = React.useState<ConsoleTab>("magnetic");
  const [magneticStrength, setMagneticStrength] = React.useState(0.45);
  const [switchActive, setSwitchActive] = React.useState(true);
  const [sliderVal, setSliderVal] = React.useState(68);
  const [copiedCode, setCopiedCode] = React.useState(false);

  const tabs: { id: ConsoleTab; label: string; icon: string }[] = [
    { id: "magnetic", label: "Magnetic", icon: "⌖" },
    { id: "otp", label: "Slingshot", icon: "✦" },
    { id: "card", label: "3D Hologram", icon: "⎔" },
    { id: "controls", label: "Tactile UI", icon: "⚡" },
  ];

  const getCodeSnippet = () => {
    switch (activeTab) {
      case "magnetic":
        return `<MagneticButton strength={${magneticStrength}}>Deploy Primitives</MagneticButton>`;
      case "otp":
        return `<SlingshotOTP length={4} onComplete={(v) => verify(v)} />`;
      case "card":
        return `<FxCard effect="holographic" className="p-6">Specular Glass</FxCard>`;
      case "controls":
        return `<HoldButton holdDuration={1200} onHoldComplete={fire}>Confirm Action</HoldButton>`;
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1.5 rounded-[2.5rem] bg-gradient-to-r from-[color-mix(in_oklab,var(--b-accent)_20%,transparent)] via-[color-mix(in_oklab,var(--b-iris)_15%,transparent)] to-transparent blur-2xl pointer-events-none opacity-70" />

      {/* DOUBLE-BEZEL (Doppelrand) ARCHITECTURE */}
      {/* Outer Shell */}
      <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-2 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* Inner Core */}
        <div className="relative overflow-hidden rounded-[calc(2rem-0.5rem)] border border-white/[0.08] bg-[color-mix(in_oklab,var(--b-panel)_95%,transparent)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
          {/* Header Status Bar */}
          <div className="flex items-center justify-between border-b border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-surface)_60%,transparent)] px-4 py-2.5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--b-accent)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--b-accent)]" />
              </span>
              <span className="font-mono text-[11px] font-medium tracking-wider text-[color:var(--b-text-secondary)] uppercase">
                Interactive Console
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-[color:var(--b-bg)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--b-muted)] border border-[color:var(--b-border)]">
                60 FPS PHYSICS
              </span>
            </div>
          </div>

          {/* Console Mode Selector Tabs */}
          <div className="flex border-b border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-surface)_30%,transparent)] p-1.5 gap-1">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 font-mono text-[11px] font-medium transition-all duration-300 ${
                    isSelected
                      ? "text-[color:var(--b-text)] font-semibold"
                      : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)] hover:bg-white/[0.02]"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeConsoleTab"
                      className="absolute inset-0 rounded-xl bg-[color:var(--b-panel)] border border-[color:var(--b-border)] shadow-sm"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 text-[10px] opacity-70">{tab.icon}</span>
                  <span className="relative z-10 truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Interactive Stage */}
          <div className="relative min-h-[260px] flex flex-col items-center justify-center p-6 bg-gradient-radial from-[color-mix(in_oklab,var(--b-surface)_40%,transparent)] to-transparent">
            <AnimatePresence mode="wait">
              {/* Tab 1: Magnetic Physics */}
              {activeTab === "magnetic" && (
                <motion.div
                  key="magnetic"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="flex w-full flex-col items-center justify-center gap-6"
                >
                  <div className="flex flex-col items-center text-center">
                    <p className="font-mono text-[11px] text-[color:var(--b-muted)] tracking-wide mb-1">
                      SPRING MASS POINTER PROXIMITY
                    </p>
                    <p className="text-xs text-[color:var(--b-text-secondary)]">
                      Hover cursor near the button to feel the magnetic attraction pull
                    </p>
                  </div>

                  <div className="flex items-center gap-4 py-3">
                    <MagneticButton
                      strength={magneticStrength}
                      className="shadow-[0_0_25px_var(--b-accent-muted)]"
                    >
                      <span>Deploy to Production</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-[10px]">
                        ↗
                      </span>
                    </MagneticButton>

                    <MagneticButton
                      strength={magneticStrength}
                      variant="ghost"
                    >
                      Ghost State
                    </MagneticButton>
                  </div>

                  {/* Physics tuning knob */}
                  <div className="flex w-full max-w-xs items-center justify-between gap-3 rounded-lg border border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-surface)_60%,transparent)] px-3 py-2 text-xs">
                    <span className="font-mono text-[10px] text-[color:var(--b-muted)]">Attraction Strength</span>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={magneticStrength}
                      onChange={(e) => setMagneticStrength(parseFloat(e.target.value))}
                      className="w-24 accent-[color:var(--b-accent)] cursor-pointer"
                    />
                    <span className="font-mono text-[10px] font-bold text-[color:var(--b-accent)]">
                      {Math.round(magneticStrength * 100)}%
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Slingshot OTP */}
              {activeTab === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="flex w-full flex-col items-center justify-center gap-5"
                >
                  <div className="flex flex-col items-center text-center">
                    <p className="font-mono text-[11px] text-[color:var(--b-muted)] tracking-wide mb-1">
                      GAMIFIED TACTILE VERIFICATION
                    </p>
                    <p className="text-xs text-[color:var(--b-text-secondary)]">
                      Type digits or drag tokens with spring-loaded physical snap
                    </p>
                  </div>

                  <div className="py-2">
                    <SlingshotOTP length={4} />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-[color:var(--b-muted)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent)]" />
                    <span>Autofocus on paste · Keyboard & touch accessible</span>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: 3D Holographic Card */}
              {activeTab === "card" && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="flex w-full flex-col items-center justify-center gap-3"
                >
                  <FxCard
                    effect="holographic"
                    className="w-full max-w-sm p-5 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white">
                        BUILDORA SPEC
                      </span>
                      <span className="font-mono text-[10px] text-white/60">01 / TITANIUM</span>
                    </div>
                    <div className="mt-6 space-y-1">
                      <h4 className="font-display text-lg font-bold text-white tracking-tight">
                        Specular Shimmer Engine
                      </h4>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Hardware-accelerated gyro tilt angle calculation with dynamic chromatic prism sheen.
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/10 text-white/80 font-mono text-[10px]">
                      <span>60 FPS SMOOTH</span>
                      <span className="text-[color:var(--b-accent)]">INTERACTION READY</span>
                    </div>
                  </FxCard>
                </motion.div>
              )}

              {/* Tab 4: Tactile Controls */}
              {activeTab === "controls" && (
                <motion.div
                  key="controls"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="flex w-full flex-col items-center justify-center gap-5"
                >
                  <div className="grid w-full grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2 rounded-xl border border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-surface)_40%,transparent)] p-3.5">
                      <span className="font-mono text-[10px] text-[color:var(--b-muted)]">Hold Physics</span>
                      <HoldButton
                        holdDuration={1000}
                        onHoldComplete={() => {}}
                        className="w-full text-xs py-2"
                      >
                        Press & Hold
                      </HoldButton>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl border border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-surface)_40%,transparent)] p-3.5">
                      <span className="font-mono text-[10px] text-[color:var(--b-muted)]">Ripple Feedback</span>
                      <RippleButton className="w-full text-xs py-2 bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)]">
                        Click for Ripple
                      </RippleButton>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-4 rounded-xl border border-[color:var(--b-border)] bg-[color-mix(in_oklab,var(--b-surface)_30%,transparent)] px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={switchActive}
                        onChange={(e) => setSwitchActive(e.target.checked)}
                      />
                      <span className="text-xs text-[color:var(--b-text)] font-medium">
                        Haptic feedback simulation
                      </span>
                    </div>
                    <Badge variant={switchActive ? "accent" : "secondary"}>
                      {switchActive ? "Active" : "Muted"}
                    </Badge>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Machine Code Dock */}
          <div className="flex items-center justify-between border-t border-[color:var(--b-border)] bg-[#08090C] px-4 py-2.5 font-mono text-xs">
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <span className="text-[color:var(--b-muted)] select-none">$</span>
              <code className="truncate text-[11px] text-[color:var(--b-text-secondary)]">
                {getCodeSnippet()}
              </code>
            </div>

            <button
              onClick={async () => {
                await copyToClipboard(getCodeSnippet());
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 1400);
              }}
              className="ml-3 shrink-0 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-mono text-[color:var(--b-text)] transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
            >
              {copiedCode ? "Copied ✓" : "Copy JSX"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
