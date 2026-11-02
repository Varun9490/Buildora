// scratch/gen-components2.mjs
import fs from "node:fs";
import path from "node:path";

const root = "C:/Users/varun/Desktop/Buildora";
const compsDir = path.join(root, "packages/components/src");

const specs = [
  { slug: "elastic-underline", name: "Elastic Underline", desc: "Link underline that stretches and snaps back on hover with spring physics.", type: "elastic-underline" },
  { slug: "image-zoom-pan", name: "Image Zoom Pan", desc: "Image that zooms and pans toward the cursor on hover, clamped to bounds.", type: "zoom-pan" },
  { slug: "text-scramble-reveal", name: "Text Scramble Reveal", desc: "Text that scrambles through glyphs and resolves on scroll into view.", type: "scramble" },
  { slug: "floating-label-input", name: "Floating Label Input", desc: "Input whose label floats up on focus with a spring, themed border.", type: "float-label" },
  { slug: "accordion-smooth", name: "Smooth Accordion", desc: "Accordion with animated height transition and rotating chevron.", type: "accordion" },
  { slug: "tabs-sliding-indicator", name: "Tabs Sliding Indicator", desc: "Tab bar with a sliding pill indicator that springs between items.", type: "sliding-tabs" },
  { slug: "tooltip-fade", name: "Tooltip Fade", desc: "Tooltip that fades and lifts in on hover with delay and reduced-motion support.", type: "tooltip" },
  { slug: "modal-fade-scale", name: "Modal Fade Scale", desc: "Modal dialog that fades and scales in with backdrop blur.", type: "modal" },
  { slug: "drawer-slide", name: "Drawer Slide", desc: "Side drawer that slides in from the edge with spring easing.", type: "drawer" },
  { slug: "popover-bounce", name: "Popover Bounce", desc: "Popover that pops in with a spring bounce and fades out.", type: "popover" },
  { slug: "dropdown-cascade", name: "Dropdown Cascade", desc: "Dropdown menu whose items cascade in with staggered fade.", type: "dropdown" },
  { slug: "toast-slide", name: "Toast Slide", desc: "Toast notification that slides in from the side and auto-dismisses.", type: "toast" },
  { slug: "skeleton-shimmer", name: "Skeleton Shimmer", desc: "Skeleton placeholder with an animated shimmer sweep.", type: "shimmer" },
  { slug: "progress-ring", name: "Progress Ring", desc: "Circular progress ring that animates to value on view.", type: "ring" },
  { slug: "toggle-switch-anim", name: "Animated Toggle Switch", desc: "Toggle switch with a sliding knob and color transition.", type: "toggle" },
  { slug: "checkbox-bounce", name: "Checkbox Bounce", desc: "Checkbox with a bouncing checkmark on toggle.", type: "checkbox" },
  { slug: "radio-pill", name: "Radio Pill", desc: "Radio group rendered as a sliding pill selector.", type: "radio-pill" },
  { slug: "slider-glow", name: "Slider Glow", desc: "Range slider with a glowing thumb and value tooltip.", type: "slider-glow" },
  { slug: "avatar-stack-hover", name: "Avatar Stack Hover", desc: "Stacked avatars that spread apart on hover with spring.", type: "avatar-stack" },
  { slug: "badge-pulse", name: "Badge Pulse", desc: "Badge with a pulsing dot indicator for live status.", type: "badge-pulse" },
];

function code(spec) {
  const { slug, name, type } = spec;
  const pascal = slug.split("-").map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join("");
  const base = `"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ${pascal}Props = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

`;

  const bodies = {
    "elastic-underline": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const reduced = useReducedMotion();
  return (
    <span className={cn("relative inline-block cursor-pointer text-[color:var(--b-text)]", className)} {...rest}>
      {children}
      <motion.span
        aria-hidden
        className="absolute left-0 -bottom-0.5 h-[2px] w-full origin-left bg-[color:var(--b-accent)]"
        initial={{ scaleX: 0.4 }}
        whileHover={reduced ? {} : { scaleX: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </span>
  );
}
export default ${pascal};
`,
    "zoom-pan": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const reduced = useReducedMotion();
  const [pos, setPos] = React.useState({ x: 50, y: 50, scale: 1 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, scale: 1.15 });
  };
  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={() => setPos({ x: 50, y: 50, scale: 1 })}
      className={cn("overflow-hidden rounded-[var(--b-radius-lg)]", className)}
      {...rest}
    >
      <motion.div
        animate={reduced ? {} : pos}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        style={{ transformOrigin: \`\${pos.x}% \${pos.y}%\` }}
        className="text-[color:var(--b-text)]"
      >
        {children}
      </motion.div>
    </div>
  );
}
export default ${pascal};
`,
    "scramble": `const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const text = typeof children === "string" ? children : "HELLO";
  const [out, setOut] = React.useState(text.split("").map(() => " "));
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  React.useEffect(() => {
    if (!inView || reduced) { setOut(text.split("")); return; }
    let frame = 0; const total = 24;
    const id = setInterval(() => {
      frame++;
      setOut(text.split("").map((ch, i) => (frame / total > i / text.length ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])));
      if (frame >= total) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [inView, reduced, text]);
  return <span ref={ref} className={cn("font-mono text-[color:var(--b-text)]", className)} {...rest}>{out.join("")}</span>;
}
export default ${pascal};
`,
    "float-label": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const [focused, setFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const reduced = useReducedMotion();
  const up = focused || hasValue;
  return (
    <label className={cn("relative block", className)} {...rest}>
      <motion.span
        animate={reduced ? {} : { y: up ? -22 : 0, scale: up ? 0.85 : 1, color: up ? "var(--b-accent)" : "var(--b-muted)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="absolute left-3 top-3 origin-left text-sm pointer-events-none"
      >
        {children}
      </motion.span>
      <input
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(!!e.target.value); }}
        onChange={(e) => setHasValue(!!e.target.value)}
        className="w-full rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-3 text-[color:var(--b-text)] focus:border-[color:var(--b-accent)] focus:outline-none"
      />
    </label>
  );
}
export default ${pascal};
`,
    "accordion": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={cn("border border-[color:var(--b-border)] rounded-[var(--b-radius)] bg-[color:var(--b-panel)]", className)} {...rest}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-[color:var(--b-text)]"
      >
        <span>{children}</span>
        <motion.span animate={reduced ? {} : { rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>▾</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? {} : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden px-4 pb-3 text-sm text-[color:var(--b-text-secondary)]"
          >
            Details
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ${pascal};
`,
    "sliding-tabs": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const items = React.Children.toArray(children);
  const [active, setActive] = React.useState(0);
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative inline-flex rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-1", className)} {...rest}>
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-[color:var(--b-accent)]"
        animate={reduced ? {} : { left: \`\${(active / items.length) * 100}%\`, width: \`\${100 / items.length}%\` }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      />
      {items.map((c, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          className={cn("relative z-10 px-4 py-1.5 text-sm", active === i ? "text-[color:var(--b-accent-foreground)]" : "text-[color:var(--b-text-secondary)]")}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
export default ${pascal};
`,
    "tooltip": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const [show, setShow] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <span className={cn("relative inline-block", className)} {...rest}>
      <span onPointerEnter={() => setShow(true)} onPointerLeave={() => setShow(false)} onFocus={() => setShow(true)} onBlur={() => setShow(false)} tabIndex={0} className="text-[color:var(--b-text)]">
        {children}
      </span>
      <AnimatePresence>
        {show && (
          <motion.span
            role="tooltip"
            initial={reduced ? {} : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] px-2 py-1 text-xs text-[color:var(--b-text)] shadow-lg"
          >
            Tooltip
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
export default ${pascal};
`,
    "modal": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={className} {...rest}>
      <button onClick={() => setOpen(true)} className="rounded-[var(--b-radius-sm)] bg-[color:var(--b-accent)] px-4 py-2 text-sm text-[color:var(--b-accent-foreground)]">Open</button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Dialog"
            initial={reduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? {} : { opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={reduced ? {} : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduced ? {} : { scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[var(--b-radius-lg)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-6 text-[color:var(--b-text)]"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ${pascal};
`,
    "drawer": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={className} {...rest}>
      <button onClick={() => setOpen(true)} className="rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] px-4 py-2 text-sm text-[color:var(--b-text)]">Open drawer</button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? {} : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduced ? {} : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-80 border-l border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-6 text-[color:var(--b-text)] shadow-xl"
          >
            <button onClick={() => setOpen(false)} className="mb-4 text-sm text-[color:var(--b-muted)]">Close</button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ${pascal};
`,
    "popover": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative inline-block", className)} {...rest}>
      <button onClick={() => setOpen((v) => !v)} className="rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] px-3 py-1.5 text-sm text-[color:var(--b-text)]">Toggle</button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? {} : { opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, scale: 0.9, y: 6 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="absolute left-0 top-full z-50 mt-2 w-64 rounded-[var(--b-radius)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-4 text-sm text-[color:var(--b-text)] shadow-lg"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ${pascal};
`,
    "dropdown": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  const items = React.Children.toArray(children);
  return (
    <div className={cn("relative inline-block", className)} {...rest}>
      <button onClick={() => setOpen((v) => !v)} className="rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] px-3 py-1.5 text-sm text-[color:var(--b-text)]">Menu</button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={reduced ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-50 mt-2 w-52 rounded-[var(--b-radius)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-1 shadow-lg"
          >
            {items.map((c, i) => (
              <motion.li
                key={i}
                initial={reduced ? {} : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-[var(--b-radius-sm)] px-3 py-1.5 text-sm text-[color:var(--b-text)] hover:bg-[color:var(--b-surface)]"
              >
                {c}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ${pascal};
`,
    "toast": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const [show, setShow] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={className} {...rest}>
      <button onClick={() => { setShow(true); setTimeout(() => setShow(false), 2500); }} className="rounded-[var(--b-radius-sm)] bg-[color:var(--b-accent)] px-4 py-2 text-sm text-[color:var(--b-accent-foreground)]">Show toast</button>
      <AnimatePresence>
        {show && (
          <motion.div
            role="status"
            initial={reduced ? {} : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? {} : { opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="fixed bottom-4 right-4 z-50 rounded-[var(--b-radius)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] px-4 py-3 text-sm text-[color:var(--b-text)] shadow-lg"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ${pascal};
`,
    "shimmer": `export function ${pascal}({ className, ...rest }: ${pascal}Props) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative overflow-hidden rounded-[var(--b-radius)] bg-[color:var(--b-surface)]", className)} {...rest}>
      <div className="h-4 w-3/4 rounded bg-[color:var(--b-border)]" />
      {!reduced && (
        <motion.div
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[color:var(--b-panel)] to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
export default ${pascal};
`,
    "ring": `export function ${pascal}({ className, ...rest }: ${pascal}Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    if (reduced) { setPct(75); return; }
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1000);
      setPct(Math.round(p * 75));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]);
  const r = 40; const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div ref={ref} className={cn("inline-flex items-center justify-center", className)} {...rest}>
      <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--b-border)" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke="var(--b-accent)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={\`\${dash} \${c}\`} transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="absolute font-mono text-sm text-[color:var(--b-text)]">{pct}%</span>
    </div>
  );
}
export default ${pascal};
`,
    "toggle": `export function ${pascal}({ className, ...rest }: ${pascal}Props) {
  const [on, setOn] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={cn("relative h-7 w-12 rounded-full border border-[color:var(--b-border)] transition-colors", on ? "bg-[color:var(--b-accent)]" : "bg-[color:var(--b-surface)]", className)}
      {...rest}
    >
      <motion.span
        className="absolute top-0.5 h-6 w-6 rounded-full bg-[color:var(--b-panel)] shadow"
        animate={reduced ? {} : { x: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      />
    </button>
  );
}
export default ${pascal};
`,
    "checkbox": `export function ${pascal}({ className, ...rest }: ${pascal}Props) {
  const [checked, setChecked] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      onClick={() => setChecked((v) => !v)}
      className={cn("flex h-5 w-5 items-center justify-center rounded border border-[color:var(--b-border)] bg-[color:var(--b-surface)]", checked && "bg-[color:var(--b-accent)] border-[color:var(--b-accent)]", className)}
      {...rest}
    >
      <AnimatePresence>
        {checked && (
          <motion.svg
            initial={reduced ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            exit={reduced ? {} : { scale: 0 }}
            className="h-3.5 w-3.5 text-[color:var(--b-accent-foreground)]"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
          >
            <motion.path d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.2 }} />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
export default ${pascal};
`,
    "radio-pill": `export function ${pascal}({ className, ...rest }: ${pascal}Props) {
  const items = ["One", "Two", "Three"];
  const [active, setActive] = React.useState(0);
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative inline-flex rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-1", className)} {...rest}>
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-[color:var(--b-accent)]"
        animate={reduced ? {} : { left: \`\${(active / items.length) * 100}%\`, width: \`\${100 / items.length}%\` }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      />
      {items.map((it, i) => (
        <button
          key={it}
          onClick={() => setActive(i)}
          className={cn("relative z-10 px-4 py-1.5 text-sm", active === i ? "text-[color:var(--b-accent-foreground)]" : "text-[color:var(--b-text-secondary)]")}
        >
          {it}
        </button>
      ))}
    </div>
  );
}
export default ${pascal};
`,
    "slider-glow": `export function ${pascal}({ className, ...rest }: ${pascal}Props) {
  const [val, setVal] = React.useState(50);
  return (
    <div className={cn("w-full", className)} {...rest}>
      <input
        type="range"
        min={0} max={100} value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full accent-[color:var(--b-accent)]"
      />
      <div className="mt-2 text-center font-mono text-sm text-[color:var(--b-text)]">{val}</div>
    </div>
  );
}
export default ${pascal};
`,
    "avatar-stack": `export function ${pascal}({ className, ...rest }: ${pascal}Props) {
  const [hover, setHover] = React.useState(false);
  const reduced = useReducedMotion();
  const items = [1, 2, 3, 4];
  return (
    <div className={cn("flex", className)} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} {...rest}>
      {items.map((n, i) => (
        <motion.div
          key={n}
          className="h-10 w-10 -ml-3 first:ml-0 rounded-full border-2 border-[color:var(--b-panel)] bg-[color:var(--b-surface)] flex items-center justify-center text-xs text-[color:var(--b-text)]"
          animate={reduced ? {} : hover ? { x: i * 6 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {n}
        </motion.div>
      ))}
    </div>
  );
}
export default ${pascal};
`,
    "badge-pulse": `export function ${pascal}({ className, children, ...rest }: ${pascal}Props) {
  const reduced = useReducedMotion();
  return (
    <span className={cn("relative inline-flex items-center gap-1.5 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2.5 py-0.5 text-xs text-[color:var(--b-text)]", className)} {...rest}>
      <span className="relative flex h-2 w-2">
        {!reduced && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--b-accent)] opacity-60" />}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--b-accent)]" />
      </span>
      {children}
    </span>
  );
}
export default ${pascal};
`,
  };

  fs.mkdirSync(path.join(compsDir, slug), { recursive: true });
  fs.writeFileSync(path.join(compsDir, slug, "index.tsx"), base + (bodies[type] || bodies["elastic-underline"]));
}

for (const s of specs) code(s);
console.log("Generated", specs.length, "components");
