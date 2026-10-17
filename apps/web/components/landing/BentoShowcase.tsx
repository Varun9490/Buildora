"use client";

import { BentoShell } from "./BentoShell";
import { SlingshotOtpStage } from "./bento/SlingshotOtpStage";
import { KineticButtons } from "./bento/KineticButtons";
import { HoloPass } from "./bento/HoloPass";
import { ParticleForceField } from "./bento/ParticleForceField";
import { MagnificationDock } from "./bento/MagnificationDock";
import { DynamicIsland } from "./bento/DynamicIsland";
import { RubberScrubber } from "./bento/RubberScrubber";
import { AiComposer } from "./bento/AiComposer";

/* ─────────────────────────────────────────────────────
   SIGNATURE SHOWCASE — eight interactive proof cards.
   Layout: 6/6 hero row · 4/4/4 · 4/4/4
   Every card is a real demo + its real source + CLI.
   ───────────────────────────────────────────────────── */

const CODE = {
  slingshot: `"use client";
import { motion, useSpring } from "motion/react";

const BOUNCE = { type: "spring", stiffness: 520, damping: 18 };

export function SlingshotOTP({ length = 6 }: { length?: number }) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const slots = useRef<(HTMLInputElement | null)[]>([]);

  // ArrowLeft/Right slingshot focus · Backspace ejects with carry
  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowLeft")  slots.current[i - 1]?.focus();
    if (e.key === "ArrowRight") slots.current[i + 1]?.focus();
    if (e.key === "Backspace")  eject(i);       // removed digit arcs out
  };

  return (
    <div role="group" aria-label="One-time passcode">
      {digits.map((d, i) => (
        <motion.input
          key={i}
          ref={(el) => void (slots.current[i] = el)}
          value={d}
          transition={BOUNCE}
          onKeyDown={(e) => onKeyDown(i, e)}
          className="h-12 w-11 rounded-xl text-center font-mono"
        />
      ))}
    </div>
  );
}`,

  kinetic: `"use client";
import { motion } from "motion/react";

export function RippleWaveButton({ children, ...rest }: ButtonProps) {
  const [waves, setWaves] = useState<Wave[]>([]);

  return (
    <button
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setWaves((w) => [...w, { id: uid(), x: e.clientX - r.left, y: e.clientY - r.top }]);
      }}
      className="relative overflow-hidden rounded-full px-6 py-3"
      {...rest}
    >
      {waves.map((w) => (
        <motion.span
          key={w.id}
          initial={{ scale: 0, opacity: 0.55 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ left: w.x, top: w.y, position: "absolute" }}
          className="pointer-events-none h-0 w-0 rounded-full"
        />
      ))}
      {children}
    </button>
  );
}`,

  holo: `const rx = useSpring(useMotionValue(0), { stiffness: 240, damping: 20 });
const ry = useSpring(useMotionValue(0), { stiffness: 240, damping: 20 });

<motion.div
  onPointerMove={track}          // edge = ±18° tilt
  onPointerLeave={release}       // springs back to rest
  style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
  className="relative aspect-[8/5] rounded-2xl bg-[#0c0c11]"
>
  <div className="absolute inset-0 iridescent mix-blend-color-dodge" />
  <div className="absolute inset-0 foil-noise opacity-[0.14] mix-blend-overlay" />
  <div className="absolute inset-0 specular" /> {/* radial hotspot follows tilt */}
  <span style={{ transform: "translateZ(46px)" }} className="parallax-badge">
    Tier · Mainnet
  </span>
</motion.div>`,

  field: `const nodes = seeded(140, viewport);   // deterministic, SSR-safe

function step(dt: number, cursor: Vec2, mode: Mode) {
  for (const n of nodes) {
    const d2 = dist2(n, cursor) + 120;
    const f = 1400 / d2;                   // inverse-square falloff
    n.v += unit(cursor, n) * f * dir(mode) // attract | repel | vortex
    n.v *= 0.965;                          // damping
    n.p += n.v * dt;
  }
  filaments(nodes, 90);                    // links under 90px
  shockwaves(dt);                          // impulse rings on click
}

useRafLoop(step, inView);                  // pauses off-screen`,

  dock: `const S = (d: number) => 1 + 0.9 * Math.exp(-(d * d) / (2 * 52 ** 2));

function magnify(x: number) {
  iconRefs.current.forEach((el, i) => {
    const d = Math.abs(x - (i * 58 + 23));
    el.style.transform =              // GPU transforms only
      \`translateY(\${(-18 * S(d)).toFixed(1)}px) scale(\${S(d).toFixed(3)})\`;
  });
}

<div onPointerMove={(e) => magnify(localX(e))} onPointerLeave={rest}>`,

  island: `const SIZES = {
  idle:   { width: 150, height: 44, borderRadius: 22 },
  listen: { width: 238, height: 44, borderRadius: 22 },
  deploy: { width: 216, height: 50, borderRadius: 25 },
  think:  { width: 258, height: 66, borderRadius: 33 },
};

<motion.div
  animate={SIZES[state]}                        // spring layout morph
  transition={{ type: "spring", stiffness: 360, damping: 28 }}
  className="overflow-hidden bg-black"
>
  <AnimatePresence mode="wait">{SCREENS[state]}</AnimatePresence>
</motion.div>`,

  scrubber: `// travel past the wall → diminishing rubber-band px
const overscroll = (px: number) =>
  (1 - 1 / (Math.abs(px) / 80 + 1)) * Math.sign(px) * 64;

<div style={{ transform: \`translateX(\${overscroll(raw)}px)\` }}>
  <input
    type="range"
    className="b-range"        // CSS var --range-fill drives fill
    onChange={(e) => setRaw(e.target.valueAsNumber)}
  />
</div>

<span style={{ rotate: \`\${velocity / 14}deg\` }}>{value}</span>`,

  composer: `const stream = useChatStream({ model, temperature: 0.4 });

<textarea
  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
  placeholder="Describe the motion you want…"
/>

{chips.map((c) => (
  <Chip key={c.name} layout exit={{ scale: 0.8, opacity: 0 }}>
    {c.name}
    <button onClick={() => detach(c)}>×</button>
  </Chip>
))}

<p aria-live="polite">
  {stream.tokens}
  {stream.active && <Caret />}
</p>`,
};

export function BentoShowcase() {
  return (
    <section id="showcase" className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      {/* section intro */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--b-accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent)] fx-pulse-soft" />
          Signature Showcase
        </span>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-[color:var(--b-text)] sm:text-4xl lg:text-5xl text-balance">
          Every card below is running. Touch anything.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--b-text-secondary)] sm:text-base">
          No screenshots. Each primitive is a live mini-app with its full source one toggle away,
          and its install command one click away.
        </p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--b-muted)]">
          8 primitives · all interactive · all keyboard-accessible
        </p>
      </div>

      {/* grid */}
      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <BentoShell
          span="lg:col-span-6"
          category="Kinetic Input"
          title="Slingshot OTP Field"
          description="Six ballistic slots: arrows slingshot focus, backspace ejects the digit with carry, paste scatters across the row — then confetti." 
          slug="slingshot-otp"
          demo={<SlingshotOtpStage />}
          code={CODE.slingshot}
          physics="Spring 520/18 · ballistic focus · paste scatter"
          stageClassName="min-h-[400px]"
        />

        <BentoShell
          span="lg:col-span-6"
          category="Tactile Feedback"
          title="Kinetic Button States"
          description="Hold-to-confirm with a conic force ring, liquid morph loading, specular beam tracking, and click-point ripple waves."
          slug="fx-button"
          demo={<KineticButtons />}
          code={CODE.kinetic}
          physics="Morph 900ms · hold-force 1.2s · pointer vars"
          stageClassName="min-h-[400px]"
        />

        <BentoShell
          span="lg:col-span-4"
          category="3D & Surfaces"
          title="Chromatic Holographic Pass"
          description="A preserve-3d artifact with iridescent dispersion, foil noise, and telemetry badges floating on their own Z planes."
          slug="fx-card"
          demo={<HoloPass />}
          code={CODE.holo}
          physics="Spring 240/20 · ±18° tilt · color-dodge"
        />

        <BentoShell
          span="lg:col-span-4"
          category="Ambient Canvas"
          title="Particle Force-Field Backdrop"
          description="140 seeded nodes on a single rAF loop. Your cursor is a gravity well; clicks detonate kinetic shockwaves through the lattice."
          slug="backdrop"
          demo={<ParticleForceField />}
          code={CODE.field}
          physics="140 nodes · rAF · shockwave impulse"
        />

        <BentoShell
          span="lg:col-span-4"
          category="Navigation"
          title="Gaussian Magnification Dock"
          description="Icons swell on a true Gaussian curve — scale and lift interpolated per distance, written straight to GPU transforms."
          slug="floating-navbar"
          demo={<MagnificationDock />}
          code={CODE.dock}
          physics="Gaussian σ=52 · GPU transforms · 7 icons"
        />

        <BentoShell
          span="lg:col-span-4"
          category="Overlays"
          title="Morphing Dynamic Island"
          description="One capsule, four states — compact clock, live audio EQ, deploy countdown ring, and an AI agent thinking out loud."
          slug="sheet"
          demo={<DynamicIsland />}
          code={CODE.island}
          physics="Spring 360/28 · 4-state machine · popLayout"
        />

        <BentoShell
          span="lg:col-span-4"
          category="Elastic Input"
          title="Rubber-Band Scrubber"
          description="Drag past the wall and feel real resistance — dimishing travel, springy return, and a value badge that tilts with velocity."
          slug="slider"
          demo={<RubberScrubber />}
          code={CODE.scrubber}
          physics="Overscroll ×64px · velocity tilt · wave viz"
        />

        <BentoShell
          span="lg:col-span-4"
          category="AI & Streaming"
          title="AI Composer Surface"
          description="Model pills with spring layoutId, removable attachment chips, and a token stream that types, stops, and runs again."
          slug="attachment-prompt"
          demo={<AiComposer />}
          code={CODE.composer}
          physics="Token stream 46ms · layoutId pills · aria-live"
        />
      </div>
    </section>
  );
}
