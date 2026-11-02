// scratch/gen-components3.mjs
import fs from "node:fs";
import path from "node:path";

const root = "C:/Users/varun/Desktop/Buildora";
const compsDir = path.join(root, "packages/components/src");

const specs = [
  { slug: "parallax-text", name: "Parallax Text", desc: "Headline that drifts at a different rate than scroll for depth.", type: "parallax-text" },
  { slug: "magnetic-cursor-ring", name: "Magnetic Cursor Ring", desc: "Ring that follows the cursor with magnetic lag and scales on click.", type: "cursor-ring" },
  { slug: "scroll-triggered-counter", name: "Scroll Triggered Counter", desc: "Counter that animates from zero to target on scroll into view.", type: "scroll-counter" },
  { slug: "hover-reveal-overlay", name: "Hover Reveal Overlay", desc: "Card with an overlay that slides up on hover to reveal details.", type: "hover-overlay" },
  { slug: "animated-gradient-text", name: "Animated Gradient Text", desc: "Text filled with an animated shifting gradient.", type: "gradient-text" },
  { slug: "staggered-grid", name: "Staggered Grid", desc: "Grid whose cells fade and scale in with stagger on view.", type: "stagger-grid" },
  { slug: "bounce-button", name: "Bounce Button", desc: "Button that bounces with a spring on click.", type: "bounce-btn" },
  { slug: "fade-in-image", name: "Fade In Image", desc: "Image that fades and scales in on load with blur placeholder.", type: "fade-image" },
  { slug: "scroll-snap-section", name: "Scroll Snap Section", desc: "Section that snaps into place on scroll with smooth easing.", type: "snap-section" },
  { slug: "animated-border", name: "Animated Border", desc: "Border that traces itself around the element on view.", type: "anim-border" },
];

const bodies = {
  "parallax-text": (p) => `export function ${p}({ className, children, ...rest }: ${p}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-12%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  return (
    <motion.div ref={ref} style={{ y, opacity }} className={cn("text-[color:var(--b-text)]", className)} {...rest}>
      {children}
    </motion.div>
  );
}
export default ${p};
`,
  "cursor-ring": (p) => `export function ${p}({ className, ...rest }: ${p}Props) {
  const reduced = useReducedMotion();
  const [pos, setPos] = React.useState({ x: 0, y: 0, down: false });
  React.useEffect(() => {
    if (reduced) return;
    let raf = 0; let target = { x: 0, y: 0 }; let cur = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => { target = { x: e.clientX, y: e.clientY }; };
    const onDown = () => setPos((v) => ({ ...v, down: true }));
    const onUp = () => setPos((v) => ({ ...v, down: false }));
    const loop = () => { cur.x += (target.x - cur.x) * 0.12; cur.y += (target.y - cur.y) * 0.12; setPos((v) => ({ ...v, x: cur.x, y: cur.y })); raf = requestAnimationFrame(loop); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerdown", onDown); window.removeEventListener("pointerup", onUp); cancelAnimationFrame(raf); };
  }, [reduced]);
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none fixed left-0 top-0 z-50 rounded-full border-2 border-[color:var(--b-accent)]", className)}
      style={{ x: pos.x - (pos.down ? 12 : 18), y: pos.y - (pos.down ? 12 : 18), width: pos.down ? 24 : 36, height: pos.down ? 24 : 36 }}
      {...rest}
    />
  );
}
export default ${p};
`,
  "scroll-counter": (p) => `export function ${p}({ className, ...rest }: ${p}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    if (reduced) { setVal(1234); return; }
    let raf = 0; const start = performance.now();
    const tick = (t: number) => { const pp = Math.min(1, (t - start) / 1400); setVal(Math.round(pp * 1234)); if (pp < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]);
  return <div ref={ref} className={cn("font-mono text-5xl font-bold tabular-nums text-[color:var(--b-accent)]", className)} {...rest}>{val.toLocaleString()}</div>;
}
export default ${p};
`,
  "hover-overlay": (p) => `export function ${p}({ className, children, ...rest }: ${p}Props) {
  const [hover, setHover] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative overflow-hidden rounded-[var(--b-radius-lg)]", className)} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} {...rest}>
      <div className="text-[color:var(--b-text)]">{children}</div>
      <motion.div
        className="absolute inset-0 flex items-end bg-[color:var(--b-accent)]/80 p-4 text-[color:var(--b-accent-foreground)]"
        initial={reduced ? { y: "100%" } : { y: "100%" }}
        animate={reduced ? {} : hover ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        Details
      </motion.div>
    </div>
  );
}
export default ${p};
`,
  "gradient-text": (p) => `export function ${p}({ className, children, ...rest }: ${p}Props) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{ backgroundImage: "linear-gradient(90deg, var(--b-accent), var(--b-iris), var(--b-accent))", backgroundSize: "200% 100%" }}
      animate={reduced ? {} : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={reduced ? {} : { duration: 4, repeat: Infinity, ease: "linear" }}
      {...rest}
    >
      {children}
    </motion.span>
  );
}
export default ${p};
`,
  "stagger-grid": (p) => `export function ${p}({ className, children, ...rest }: ${p}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });
  const items = React.Children.toArray(children);
  return (
    <div ref={ref} className={cn("grid grid-cols-2 gap-4 md:grid-cols-3", className)} {...rest}>
      {items.map((c, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={reduced ? {} : inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="text-[color:var(--b-text)]"
        >
          {c}
        </motion.div>
      ))}
    </div>
  );
}
export default ${p};
`,
  "bounce-btn": (p) => `export function ${p}({ className, children, ...rest }: ${p}Props) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      whileTap={reduced ? {} : { scale: 0.92 }}
      whileHover={reduced ? {} : { y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 14 }}
      className={cn("rounded-[var(--b-radius)] bg-[color:var(--b-accent)] px-5 py-2.5 text-sm font-semibold text-[color:var(--b-accent-foreground)]", className)}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
export default ${p};
`,
  "fade-image": (p) => `export function ${p}({ className, ...rest }: ${p}Props) {
  const [loaded, setLoaded] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <motion.img
      onLoad={() => setLoaded(true)}
      initial={reduced ? false : { opacity: 0, filter: "blur(8px)", scale: 1.02 }}
      animate={reduced ? {} : loaded ? { opacity: 1, filter: "blur(0px)", scale: 1 } : { opacity: 0, filter: "blur(8px)", scale: 1.02 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn("rounded-[var(--b-radius-lg)]", className)}
      {...rest}
    />
  );
}
export default ${p};
`,
  "snap-section": (p) => `export function ${p}({ className, children, ...rest }: ${p}Props) {
  return (
    <section className={cn("snap-start min-h-screen flex items-center justify-center text-[color:var(--b-text)]", className)} {...rest}>
      {children}
    </section>
  );
}
export default ${p};
`,
  "anim-border": (p) => `export function ${p}({ className, children, ...rest }: ${p}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  return (
    <div ref={ref} className={cn("relative rounded-[var(--b-radius-lg)] p-[2px]", className)} {...rest}>
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[var(--b-radius-lg)]"
        style={{ background: "linear-gradient(90deg, var(--b-accent), var(--b-iris), var(--b-accent))", backgroundSize: "200% 100%" }}
        initial={reduced ? {} : { opacity: 0 }}
        animate={reduced ? {} : inView ? { opacity: 1, backgroundPosition: ["0% 50%", "100% 50%"] } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="relative rounded-[calc(var(--b-radius-lg)-2px)] bg-[color:var(--b-panel)] p-6 text-[color:var(--b-text)]">
        {children}
      </div>
    </div>
  );
}
export default ${p};
`,
};

const base = (p) => `"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ${p}Props = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

`;

for (const s of specs) {
  const pascal = s.slug.split("-").map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join("");
  const body = bodies[s.type](pascal);
  fs.mkdirSync(path.join(compsDir, s.slug), { recursive: true });
  fs.writeFileSync(path.join(compsDir, s.slug, "index.tsx"), base(pascal) + body);
}
console.log("Generated", specs.length);
