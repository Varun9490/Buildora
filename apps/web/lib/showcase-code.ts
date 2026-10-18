export const SIGNATURE_CODE: Record<string, string> = {
  "slingshot-otp": `"use client";
import { motion } from "motion/react";

const FOCUS = { type: "spring", stiffness: 500, damping: 28 };

export function SlingshotOTP({ length = 6 }: { length?: number }) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const [active, setActive] = useState(0);
  const slots = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div role="group" aria-label="One-time passcode" className="flex items-center gap-2.5">
      {digits.map((d, i) => (
        <span key={i} className="relative">
          {active === i && (
            <motion.span layoutId="otp-focus" transition={FOCUS}
              className="absolute -inset-px rounded-xl border-2 border-[var(--b-accent)]" />
          )}
          <input
            ref={(el) => void (slots.current[i] = el)}
            value={d}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => e.key === "Backspace" && eject(i)}
            className="relative h-14 w-12 rounded-xl bg-white/[0.03] text-center font-mono text-2xl"
          />
        </span>
      ))}
    </div>
  );
}`,

  "fx-button": `"use client";
import { motion, AnimatePresence } from "motion/react";

const MORPH = { type: "spring", stiffness: 450, damping: 30 };

export function KineticButton({ mode }: { mode: "liquid" | "hold" | "magnet" }) {
  const [phase, setPhase] = useState<"idle" | "working" | "done">("idle");
  const progress = useSpring(0, { stiffness: 320, damping: 26 });

  return (
    <motion.button
      layout
      transition={MORPH}
      onPointerDown={() => mode === "hold" ? animate(progress, 1, { duration: 1.2 }) : setPhase("working")}
      onPointerUp={() => mode === "hold" && animate(progress, 0, { type: "spring", stiffness: 420, damping: 24 })}
      whileTap={{ scale: 0.96 }}
      className="relative h-12 overflow-hidden rounded-full px-7 font-mono text-sm"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={phase}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
        >
          {mode === "hold" ? "Hold to confirm" : phase === "idle" ? "Deploy" : "Deployed"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}`,

  "fx-card": `const rx = useSpring(0, { stiffness: 260, damping: 22 });
const ry = useSpring(0, { stiffness: 260, damping: 22 });
const [hover, setHover] = useState(false);

const track = (e: React.PointerEvent<HTMLDivElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  ry.set(((e.clientX - r.left) / r.width - 0.5) * 24);
  rx.set(-((e.clientY - r.top) / r.height - 0.5) * 24);
};

<motion.div
  onPointerMove={track}
  onPointerEnter={() => setHover(true)}
  onPointerLeave={() => { setHover(false); rx.set(0); ry.set(0); }}
  style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
  className="relative aspect-[8/5] w-full max-w-sm rounded-2xl bg-[#0c0c11]"
>
  <motion.div
    animate={{ opacity: hover ? 0.35 : 0 }}
    transition={{ duration: 0.3 }}
    className="absolute inset-0 rounded-2xl mix-blend-plus-lighter"
    style={{ background: "linear-gradient(115deg, rgba(255,0,128,.5), rgba(255,200,0,.4), rgba(0,255,190,.45), rgba(90,140,255,.5))" }}
  />
  <div className="absolute inset-0 specular-glare rounded-2xl" />
</motion.div>`,

  backdrop: `const nodes = seeded(65, viewport);
const LINK = 90;
const EDGE = 24;

function step(dt: number, cursor: Vec2) {
  for (const n of nodes) {
    const d2 = dist2(n, cursor) + 120;
    n.v += unit(cursor, n) * (1400 / d2);
    n.v *= 0.965;
    if (n.p.x < EDGE) n.v.x += (EDGE - n.p.x) * 0.08;
    if (n.p.x > width - EDGE) n.v.x -= (n.p.x - (width - EDGE)) * 0.08;
    n.p += n.v * dt;
  }
  for (const [a, b] of pairs(nodes)) {
    const d = dist(a, b);
    if (d < LINK) line(a, b, (1 - d / LINK) * 0.32);
  }
}

useRafLoop(step, inView);`,

  "gaussian-dock": `const mouseX = useMotionValue(0);

function DockIcon({ index, center }: { index: number; center: number }) {
  const size = useSpring(
    useTransform(mouseX, (mx: number) => {
      const d = Math.abs(mx - center);
      const t = Math.max(0, 1 - d / 140);
      return 44 + 32 * t;
    }),
    { mass: 0.1, stiffness: 170, damping: 12 }
  );

  return (
    <motion.button
      style={{ width: size, height: size }}
      className="flex shrink-0 items-end justify-center rounded-xl"
    />
  );
}

<div
  onPointerMove={(e) => mouseX.set(e.clientX - e.currentTarget.getBoundingClientRect().left)}
  onPointerLeave={() => mouseX.set(-999)}
  className="flex h-[60px] items-end gap-2"
/>`,

  "dynamic-island": `const SIZES = {
  idle: { width: 172, height: 44, borderRadius: 22 },
  timer: { width: 228, height: 50, borderRadius: 25 },
  wave: { width: 214, height: 44, borderRadius: 22 },
  think: { width: 262, height: 62, borderRadius: 31 },
} as const;

<motion.div
  animate={SIZES[state]}
  transition={{ type: "spring", stiffness: 380, damping: 28 }}
  style={{ transformOrigin: "top center" }}
  className="overflow-hidden bg-black"
>
  <AnimatePresence mode="popLayout" initial={false}>
    <motion.div
      key={state}
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(6px)" }}
      transition={{ duration: 0.18 }}
    />
  </AnimatePresence>
</motion.div>`,

  slider: `let raw = 0;
let over = 0;

const rubber = (px: number) => Math.sign(px) * Math.pow(Math.abs(px), 0.65) * 3.5;

function onPointerMove(e: PointerEvent) {
  const x = e.clientX - track.getBoundingClientRect().left;
  over = x < 0 ? x : x > width ? x - width : 0;
  raw = Math.min(Math.max(x, 0), width);
  track.style.transform = \`translateX(\${rubber(over).toFixed(2)}px)\`;
  track.style.transformOrigin = over > 0 ? "left" : "right";
  track.style.scale = \`\${1 + Math.min(Math.abs(over) / width, 1) * 0.08} \${1 - Math.min(Math.abs(over) / width, 1) * 0.18}\`;
  fill.style.width = \`\${(raw / width) * 100}%\`;
}

function onPointerUp() {
  animate(track, { x: 0, scale: 1 }, { type: "spring", stiffness: 420, damping: 24 });
}`,

  "attachment-prompt": `const areaRef = useRef<HTMLDivElement>(null);
const streamRef = useRef<HTMLParagraphElement>(null);

useEffect(() => {
  const el = areaRef.current;
  if (!el) return;
  const ro = new ResizeObserver(() => {
    animate(el, { height: el.scrollHeight }, { type: "spring", stiffness: 380, damping: 32 });
  });
  ro.observe(streamRef.current!);
  return () => ro.disconnect();
}, []);

<textarea onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()} />

<motion.div ref={areaRef} className="overflow-hidden">
  <p ref={streamRef} aria-live="polite">
    {stream.tokens}
    {stream.active && <Caret />}
  </p>
  <AnimatePresence mode="popLayout">
    {chips.map((c) => (
      <motion.span key={c.name} layout exit={{ scale: 0.8, opacity: 0 }}>{c.name}</motion.span>
    ))}
  </AnimatePresence>
</motion.div>`,

  "kinetic-type": `import { MatrixDecode, RgbGlitchText, EchoStack, PeriodDrop, SelectionSnap, NumberWheel, InlineWordRoll, TypeWall } from "@/components/buildora";

<h1><MatrixDecode text="Build with motion" /></h1>
<p><RgbGlitchText text="Break the grid" intensity={1} /></p>
<h2><PeriodDrop text="Motion that lands" delay={300} /></h2>

<EchoStack text="Echo" layers={2} spread={14} />
<SelectionSnap text="Snap to black" weightFrom={250} weightTo={900} />

<NumberWheel value={93480} countUp prefix="" suffix=" installs" />
<span><InlineWordRoll prefix="Deploy in " words={["seconds", "one line"]} /></span>

<TypeWall rows={4} speed={60} words={["Momentum", "Material", "Method", "Motion"]} />`,
};
