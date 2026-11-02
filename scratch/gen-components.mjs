// scratch/gen-components.mjs
import fs from "node:fs";
import path from "node:path";

const root = "C:/Users/varun/Desktop/Buildora";
const compsDir = path.join(root, "packages/components/src");

const specs = [
  { slug: "portfolio-hero-entrance", name: "Portfolio Hero Entrance", desc: "Staggered hero entrance: eyebrow, headline, subcopy and CTA arrive in sequence with spring easing.", cat: ["motion","blocks"], tags: ["hero","entrance","stagger"], type: "stagger" },
  { slug: "scroll-fade-section", name: "Scroll Fade Section", desc: "Section that fades and lifts into view once, driven by IntersectionObserver and reduced-motion aware.", cat: ["motion","blocks"], tags: ["scroll","fade","reveal"], type: "fade-up" },
  { slug: "project-card-tilt", name: "Project Card Tilt", desc: "Project card with 3D perspective tilt following the pointer and a glare highlight that tracks.", cat: ["motion","blocks"], tags: ["card","tilt","hover"], type: "tilt" },
  { slug: "magnetic-nav-pill", name: "Magnetic Nav Pill", desc: "Floating nav pill that slides to the active item with a spring and attracts the cursor.", cat: ["navigation","motion"], tags: ["nav","pill","magnetic"], type: "magnetic" },
  { slug: "gradient-border-card", name: "Gradient Border Card", desc: "Card with an animated conic-gradient border that rotates and pauses on hover.", cat: ["motion","primitives"], tags: ["card","gradient","border"], type: "border-spin" },
  { slug: "spotlight-hover-card", name: "Spotlight Hover Card", desc: "Card lit by a radial spotlight that follows the pointer across its surface.", cat: ["motion","blocks"], tags: ["card","spotlight","hover"], type: "spotlight" },
  { slug: "marquee-logo-strip", name: "Marquee Logo Strip", desc: "Infinite horizontal logo marquee that pauses on hover and freezes under reduced motion.", cat: ["motion","blocks"], tags: ["marquee","logo","strip"], type: "marquee" },
  { slug: "number-counter-reveal", name: "Number Counter Reveal", desc: "Animated counter that counts to its value when scrolled into view, announced once.", cat: ["motion","data"], tags: ["number","counter","reveal"], type: "counter" },
  { slug: "parallax-image-layer", name: "Parallax Image Layer", desc: "Image layer that translates at a different rate than scroll for depth, rAF-throttled.", cat: ["motion","blocks"], tags: ["parallax","image","depth"], type: "parallax" },
  { slug: "cursor-trail-dot", name: "Cursor Trail Dot", desc: "Small trailing dot that follows the pointer with spring lag and fades when idle.", cat: ["motion"], tags: ["cursor","trail","dot"], type: "cursor-trail" },
  { slug: "section-divider-line", name: "Section Divider Line", desc: "Horizontal rule that draws itself from center on scroll into view.", cat: ["motion","primitives"], tags: ["divider","line","draw"], type: "draw-line" },
  { slug: "testimonial-carousel", name: "Testimonial Carousel", desc: "Auto-advancing testimonial carousel with spring snap and pause on hover.", cat: ["motion","blocks"], tags: ["carousel","testimonial","auto"], type: "carousel" },
  { slug: "contact-form-reveal", name: "Contact Form Reveal", desc: "Contact form whose fields stagger in on scroll with focus-driven lift.", cat: ["forms","motion"], tags: ["form","contact","reveal"], type: "form-reveal" },
  { slug: "blur-text-entrance", name: "Blur Text Entrance", desc: "Headline that resolves from a blurred, scaled state into sharp focus on view.", cat: ["motion"], tags: ["text","blur","entrance"], type: "blur-in" },
  { slug: "rotate-card-stack", name: "Rotate Card Stack", desc: "Stacked cards that fan out and rotate on hover with spring physics.", cat: ["motion","blocks"], tags: ["cards","stack","rotate"], type: "card-stack" },
  { slug: "scroll-progress-bar", name: "Scroll Progress Bar", desc: "Top reading-progress bar driven by scroll position, transform-scaled.", cat: ["motion","primitives"], tags: ["scroll","progress","bar"], type: "scroll-progress" },
  { slug: "hover-lift-image", name: "Hover Lift Image", desc: "Image that lifts with shadow and slight zoom on hover, with smooth easing.", cat: ["motion","blocks"], tags: ["image","hover","lift"], type: "hover-lift" },
  { slug: "animated-counter-badge", name: "Animated Counter Badge", desc: "Badge that increments a counter with a spring pop when its value changes.", cat: ["motion","primitives"], tags: ["badge","counter","pop"], type: "badge-pop" },
  { slug: "fade-stagger-list", name: "Fade Stagger List", desc: "List whose items fade and slide up in staggered sequence on view.", cat: ["motion","blocks"], tags: ["list","stagger","fade"], type: "stagger-list" },
  { slug: "reveal-mask-image", name: "Reveal Mask Image", desc: "Image revealed by an animated mask that wipes across on scroll.", cat: ["motion","blocks"], tags: ["image","mask","reveal"], type: "mask-reveal" },
];

function componentCode(spec) {
  const { slug, name, type } = spec;
  const pascal = slug.split("-").map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join("");
  // Common imports
  const base = `"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const ${pascal}Schema = z.object({
  className: z.string().optional(),
});

export type ${pascal}Props = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

`;

  let body = "";
  switch (type) {
    case "fade-up":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={reduced ? {} : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("text-[color:var(--b-text)]", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
export default ${pascal};
`;
      break;
    case "stagger":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = React.Children.toArray(children);
  return (
    <div ref={ref} className={cn("flex flex-col gap-4", className)} {...rest}>
      {items.map((c, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={reduced ? {} : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          {c}
        </motion.div>
      ))}
    </div>
  );
}
export default ${pascal};
`;
      break;
    case "tilt":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -8, y: px * 8 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      animate={reduced ? {} : { rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      className={cn("rounded-[var(--b-radius-lg)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-6 shadow-sm", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
export default ${pascal};
`;
      break;
    case "magnetic":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    setPos({ x: (e.clientX - cx) * 0.18, y: (e.clientY - cy) * 0.18 });
  };
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setPos({ x: 0, y: 0 })}
      animate={reduced ? {} : pos}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn("inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-4 py-2 text-sm text-[color:var(--b-text)]", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
export default ${pascal};
`;
      break;
    case "border-spin":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative rounded-[var(--b-radius-lg)] p-[1.5px] overflow-hidden", className)} {...rest}>
      {!reduced && (
        <motion.span
          aria-hidden
          className="absolute inset-[-40%] bg-[conic-gradient(from_0deg,var(--b-accent),var(--b-iris),var(--b-accent))]"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      )}
      <div className="relative rounded-[calc(var(--b-radius-lg)-1.5px)] bg-[color:var(--b-panel)] p-6 text-[color:var(--b-text)]">
        {children}
      </div>
    </div>
  );
}
export default ${pascal};
`;
      break;
    case "spotlight":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = React.useState({ x: 50, y: 50 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setPos({ x: 50, y: 50 })}
      className={cn("relative overflow-hidden rounded-[var(--b-radius-lg)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-6 text-[color:var(--b-text)]", className)}
      {...rest}
    >
      {!reduced && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 transition-opacity"
          style={{ background: \`radial-gradient(circle at \${pos.x}% \${pos.y}%, var(--b-accent-muted), transparent 55%)\` }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
export default ${pascal};
`;
      break;
    case "marquee":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("overflow-hidden border-y border-[color:var(--b-border)] py-6 text-[color:var(--b-text)]", className)} {...rest}>
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={reduced ? {} : { x: ["0%", "-50%"] }}
        transition={reduced ? {} : { duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <div className="flex gap-12">{children}</div>
        <div className="flex gap-12" aria-hidden>{children}</div>
      </motion.div>
    </div>
  );
}
export default ${pascal};
`;
      break;
    case "counter":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView || reduced) { if (inView) setVal(100); return; }
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1200);
      setVal(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]);
  return (
    <div ref={ref} className={cn("font-mono text-4xl font-bold text-[color:var(--b-accent)] tabular-nums", className)} {...rest}>
      {val}
      {children}
    </div>
  );
}
export default ${pascal};
`;
      break;
    case "parallax":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-8%", "8%"]);
  return (
    <motion.div ref={ref} style={{ y }} className={cn("overflow-hidden", className)} {...rest}>
      {children}
    </motion.div>
  );
}
export default ${pascal};
`;
      break;
    case "cursor-trail":
      body = `export function ${pascal}({ className, ...rest }: ${pascal}Props) {
  const reduced = useReducedMotion();
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (reduced) return;
    let raf = 0; let target = { x: 0, y: 0 }; let cur = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => { target = { x: e.clientX, y: e.clientY }; setVisible(true); };
    const onLeave = () => setVisible(false);
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.18;
      cur.y += (target.y - cur.y) * 0.18;
      setPos({ x: cur.x, y: cur.y });
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerleave", onLeave); cancelAnimationFrame(raf); };
  }, [reduced]);
  if (reduced) return null;
  return (
    <motion.span
      aria-hidden
      className={cn("pointer-events-none fixed left-0 top-0 z-50 h-3 w-3 rounded-full bg-[color:var(--b-accent)] mix-blend-difference", className)}
      style={{ x: pos.x - 6, y: pos.y - 6, opacity: visible ? 1 : 0 }}
      {...rest}
    />
  );
}
export default ${pascal};
`;
      break;
    case "draw-line":
      body = `export function ${pascal}({ className, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={cn("h-px w-full overflow-hidden", className)} {...rest}>
      <motion.div
        className="h-full w-full origin-center bg-[color:var(--b-border-hover)]"
        initial={reduced ? false : { scaleX: 0 }}
        animate={reduced ? {} : inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
export default ${pascal};
`;
      break;
    case "carousel":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const items = React.Children.toArray(children);
  const [i, setI] = React.useState(0);
  const reduced = useReducedMotion();
  React.useEffect(() => {
    if (reduced || items.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 4000);
    return () => clearInterval(id);
  }, [items.length, reduced]);
  return (
    <div className={cn("relative overflow-hidden", className)} {...rest}>
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={reduced ? {} : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? {} : { opacity: 0, x: -24 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[color:var(--b-text)]"
        >
          {items[i]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
export default ${pascal};
`;
      break;
    case "form-reveal":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLFormElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });
  const items = React.Children.toArray(children);
  return (
    <form ref={ref} className={cn("flex flex-col gap-4", className)} {...rest}>
      {items.map((c, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? {} : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {c}
        </motion.div>
      ))}
    </form>
  );
}
export default ${pascal};
`;
      break;
    case "blur-in":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, filter: "blur(12px)", scale: 0.96 }}
      animate={reduced ? {} : inView ? { opacity: 1, filter: "blur(0px)", scale: 1 } : { opacity: 0, filter: "blur(12px)", scale: 0.96 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn("text-[color:var(--b-text)]", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
export default ${pascal};
`;
      break;
    case "card-stack":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const items = React.Children.toArray(children);
  const [hover, setHover] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div
      className={cn("relative h-64 w-48", className)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      {...rest}
    >
      {items.map((c, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-[var(--b-radius-lg)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-4 shadow-sm text-[color:var(--b-text)]"
          animate={reduced ? {} : hover ? { rotate: (i - (items.length-1)/2) * 8, y: i * -6 } : { rotate: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          style={{ zIndex: items.length - i }}
        >
          {c}
        </motion.div>
      ))}
    </div>
  );
}
export default ${pascal};
`;
      break;
    case "scroll-progress":
      body = `export function ${pascal}({ className, ...rest }: ${pascal}Props) {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className={cn("fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-[color:var(--b-accent)]", className)}
      style={{ scaleX }}
      {...rest}
    />
  );
}
export default ${pascal};
`;
      break;
    case "hover-lift":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      whileHover={reduced ? {} : { y: -6, boxShadow: "0 12px 32px -12px var(--b-accent-glow)" }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn("overflow-hidden rounded-[var(--b-radius-lg)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] text-[color:var(--b-text)]", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
export default ${pascal};
`;
      break;
    case "badge-pop":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const reduced = useReducedMotion();
  const [key, setKey] = React.useState(0);
  React.useEffect(() => { setKey((k) => k + 1); }, [children]);
  return (
    <motion.span
      key={key}
      initial={reduced ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className={cn("inline-flex items-center rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--b-text)]", className)}
      {...rest}
    >
      {children}
    </motion.span>
  );
}
export default ${pascal};
`;
      break;
    case "stagger-list":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });
  const items = React.Children.toArray(children);
  return (
    <ul ref={ref} className={cn("flex flex-col gap-2", className)} {...rest}>
      {items.map((c, i) => (
        <motion.li
          key={i}
          initial={reduced ? false : { opacity: 0, x: -12 }}
          animate={reduced ? {} : inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-[color:var(--b-text)]"
        >
          {c}
        </motion.li>
      ))}
    </ul>
  );
}
export default ${pascal};
`;
      break;
    case "mask-reveal":
      body = `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} {...rest}>
      <motion.div
        initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
        animate={reduced ? {} : inView ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
export default ${pascal};
`;
      break;
  }

  fs.mkdirSync(path.join(compsDir, slug), { recursive: true });
  fs.writeFileSync(path.join(compsDir, slug, "index.tsx"), base + body);
}

for (const s of specs) componentCode(s);
console.log("Generated", specs.length, "components");
