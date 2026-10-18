"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@buildora/utils";
import { clamp, clamp01, springStep, useInView, useRafLoop, useReducedMotionPref } from "@/lib/physics";

export const EXTRA_PREVIEW_SLUGS: string[] = [
  "utils",
  "use-reduced-motion",
  "use-pointer-proximity",
  "spring",
  "tokens",
  "floating-object",
  "horizontal-scroll",
  "thread-line",
  "project-showcase",
  "reveal-on-scroll",
  "handwritten-annotation",
  "vertical-timeline",
  "speech-bubble-cursor",
  "comment-thread",
];

const STAGE = "mx-auto w-full max-w-[520px]";

function UtilsPreview() {
  const reduced = useReducedMotionPref();
  const [wide, setWide] = React.useState(false);
  const [pill, setPill] = React.useState(false);
  const merged = cn("rounded-lg px-3 py-2", wide && "px-6", pill && "rounded-full");
  const toggles = [
    { label: "px-6", on: wide, set: setWide },
    { label: "rounded-full", on: pill, set: setPill },
  ];
  return (
    <div className={cn(STAGE, "flex flex-col items-center gap-4")}>
      <div className={cn("bg-[color:var(--b-accent-muted)] font-mono text-xs text-[color:var(--b-accent)]", !reduced && "transition-all duration-300", merged)}>
        cn()
      </div>
      <div className="flex gap-2" role="group" aria-label="Class toggles">
        {toggles.map((t) => (
          <button key={t.label} type="button" aria-pressed={t.on} aria-label={`Toggle ${t.label}`} onClick={() => t.set((v) => !v)}
            className={cn("rounded-lg border px-3 py-1.5 font-mono text-[10px] transition-colors", t.on ? "border-[color:var(--b-accent)] bg-[color:var(--b-accent-muted)] text-[color:var(--b-accent)]" : "border-[color:var(--b-border)] text-[color:var(--b-muted)] hover:border-[color:var(--b-border-hover)]")}>
            {t.label}
          </button>
        ))}
      </div>
      <code className="w-full truncate rounded-lg border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_92%,transparent)] px-3 py-2 font-mono text-[10px] text-[color:var(--b-text-secondary)]">
        {merged}
      </code>
    </div>
  );
}

function ReducedMotionPreview() {
  const reduced = useReducedMotionPref();
  return (
    <div className={cn(STAGE, "flex flex-col items-center gap-6")}>
      <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-1 text-xs text-[color:var(--b-text-secondary)]">
        <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", reduced ? "bg-[color:var(--b-muted)]" : "bg-[color:var(--b-success)]")} />
        {reduced ? "Reduced" : "Full motion"}
      </span>
      <div className="flex h-16 w-64 items-center rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_92%,transparent)] px-7">
        <span aria-hidden="true" className="h-8 w-8 rounded-full bg-[color:var(--b-accent)] shadow-[0_0_24px_var(--b-accent-glow)]" style={{ animation: reduced ? "none" : "fx-spring-dot 1.6s ease-in-out infinite" }} />
      </div>
      <code className="font-mono text-[10px] text-[color:var(--b-muted)]">useReducedMotionPref() → {String(reduced)}</code>
    </div>
  );
}

function PointerProximityPreview() {
  const reduced = useReducedMotionPref();
  const zoneRef = React.useRef<HTMLDivElement | null>(null);
  const dotRef = React.useRef<HTMLDivElement | null>(null);
  const readoutRef = React.useRef<HTMLSpanElement | null>(null);
  const pointer = React.useRef({ x: 0, y: 0, active: false });
  const reducedRef = React.useRef(reduced);
  reducedRef.current = reduced;

  useRafLoop(() => {
    const zone = zoneRef.current;
    const dot = dotRef.current;
    const readout = readoutRef.current;
    if (!zone || !dot || !readout) return;
    const rect = zone.getBoundingClientRect();
    const dx = pointer.current.x - (rect.left + rect.width / 2);
    const dy = pointer.current.y - (rect.top + rect.height / 2);
    const p = pointer.current.active ? clamp01(1 - Math.hypot(dx, dy) / (rect.width / 2)) : 0;
    const visual = reducedRef.current ? 0 : p;
    dot.style.transform = `scale(${(1 + visual * 0.85).toFixed(3)})`;
    dot.style.boxShadow = visual > 0.01 ? `0 0 ${(14 + visual * 34).toFixed(1)}px color-mix(in oklab, var(--b-accent) ${Math.round(visual * 55)}%, transparent)` : "none";
    readout.textContent = `p = ${p.toFixed(2)}`;
  });

  return (
    <div className={cn(STAGE, "flex flex-col items-center gap-3")}>
      <div ref={zoneRef} onPointerMove={(e) => { pointer.current = { x: e.clientX, y: e.clientY, active: true }; }} onPointerLeave={() => { pointer.current.active = false; }}
        className="relative h-[220px] w-full overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_92%,transparent)]">
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div ref={dotRef} aria-hidden="true" className="h-8 w-8 rounded-full bg-[color:var(--b-accent)]" style={{ transform: "scale(1)" }} />
        </div>
        <span ref={readoutRef} className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] text-[color:var(--b-muted)]">p = 0.00</span>
      </div>
      <p className="font-mono text-[10px] text-[color:var(--b-muted)]">move your pointer inside</p>
    </div>
  );
}

const SPRING_CFG = { stiffness: 260, damping: 14, mass: 1 };

function SpringPreview() {
  const reduced = useReducedMotionPref();
  const puckRef = React.useRef<HTMLButtonElement | null>(null);
  const sim = React.useRef({ x: 0, v: 0 });
  const reducedRef = React.useRef(reduced);
  reducedRef.current = reduced;

  const ping = () => {
    if (reducedRef.current) return;
    sim.current.v += 240;
  };

  useRafLoop((dt) => {
    const puck = puckRef.current;
    const s = sim.current;
    if (reducedRef.current) {
      s.x = 0;
      s.v = 0;
      if (puck) puck.style.transform = "translateX(0px)";
      return;
    }
    const next = springStep(s.x, s.v, 0, SPRING_CFG, dt);
    s.x = next.x;
    s.v = next.v;
    if (puck) puck.style.transform = `translateX(${next.x.toFixed(2)}px)`;
  });

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    sim.current.v += 180;
  }, []);

  return (
    <div className={cn(STAGE, "flex flex-col items-center gap-5")}>
      <div className="relative grid h-[180px] w-full place-items-center rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_92%,transparent)]">
        <span aria-hidden="true" className="absolute bottom-6 left-1/2 top-6 w-px -translate-x-1/2 bg-[color:var(--b-border)]" />
        <button ref={puckRef} type="button" aria-label="Shake the spring puck" onClick={ping} style={{ transform: "translateX(0px)" }}
          className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--b-accent)] shadow-[0_0_30px_var(--b-accent-glow)]">
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[color:var(--b-accent-foreground)]" />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Ping the spring" onClick={ping}
          className="rounded-lg border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-4 py-1.5 text-xs text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-accent)] hover:text-[color:var(--b-accent)]">
          Ping
        </button>
        <code className="font-mono text-[10px] text-[color:var(--b-muted)]">x&apos; = x + v·Δt</code>
      </div>
    </div>
  );
}

const TOKEN_NAMES = ["--b-bg", "--b-panel", "--b-elevated", "--b-text", "--b-accent", "--b-iris"];

function TokensPreview() {
  const [values, setValues] = React.useState<Record<string, string>>({});
  React.useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const name of TOKEN_NAMES) next[name] = styles.getPropertyValue(name).trim() || "—";
    setValues(next);
  }, []);
  return (
    <div className={cn(STAGE, "grid grid-cols-3 gap-4")}>
      {TOKEN_NAMES.map((name) => (
        <div key={name} className="flex flex-col items-center gap-1.5">
          <div className="h-16 w-full rounded-xl border border-[color:var(--b-border)]" style={{ background: `var(${name})` }} />
          <code className="font-mono text-[10px] text-[color:var(--b-text-secondary)]">{values[name] ?? "—"}</code>
          <span className="font-mono text-[9px] text-[color:var(--b-muted)]">{name}</span>
        </div>
      ))}
    </div>
  );
}

function FloatingObjectPreview() {
  const reduced = useReducedMotionPref();
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const reducedRef = React.useRef(reduced);
  reducedRef.current = reduced;

  const reset = () => {
    if (cardRef.current) cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div ref={stageRef} onPointerLeave={reset} style={{ perspective: "900px" }}
      onPointerMove={(e) => {
        const stage = stageRef.current;
        const card = cardRef.current;
        if (!stage || !card || reducedRef.current) return;
        const rect = stage.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        card.style.transform = `rotateX(${(-dy * 7).toFixed(2)}deg) rotateY(${(dx * 9).toFixed(2)}deg)`;
      }}
      className={cn(STAGE, "grid h-[250px] place-items-center")}>
      <div className={cn(!reduced && "fx-float")}>
        <div ref={cardRef} style={{ transform: "rotateX(0deg) rotateY(0deg)" }}
          className="flex h-[150px] w-[220px] flex-col justify-between rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-elevated)_92%,transparent)] p-4 shadow-xl transition-transform duration-200">
          <span aria-hidden="true" className="h-9 w-9 rounded-full bg-[color:var(--b-accent)] shadow-[0_0_20px_var(--b-accent-glow)]" />
          <div>
            <p className="font-display text-sm font-bold text-[color:var(--b-text)]">Floating object</p>
            <p className="font-mono text-[10px] text-[color:var(--b-muted)]">bob + pointer tilt</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const SCROLL_SLIDES = ["01", "02", "03", "04", "05", "06"];

function HorizontalScrollPreview() {
  return (
    <div className={STAGE}>
      <div tabIndex={0} aria-label="Numbered slides"
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_92%,transparent)] p-3">
        {SCROLL_SLIDES.map((n) => (
          <div key={n} className="flex h-40 w-36 shrink-0 snap-center flex-col items-center justify-center gap-2 rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)]">
            <span className="font-display text-3xl font-bold text-[color:var(--b-text)]">{n}</span>
            <span className="font-mono text-[10px] text-[color:var(--b-muted)]">slide {n}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center font-mono text-[10px] text-[color:var(--b-muted)]">scroll or swipe → snap-center</p>
    </div>
  );
}

const THREAD_NODES = [
  { x: 58, y: 100, label: "collect" },
  { x: 220, y: 40, label: "weave" },
  { x: 382, y: 100, label: "ship" },
];

function ThreadLinePreview() {
  const reduced = useReducedMotionPref();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef);
  const drawing = inView && !reduced;
  return (
    <div ref={containerRef} className={cn(STAGE, "px-2")}>
      <svg viewBox="0 0 440 140" role="img" aria-label="A thread connecting collect, weave and ship" className="w-full">
        <motion.path d="M58 100 C 118 100 150 40 220 40 C 290 40 322 100 382 100" fill="none" stroke="var(--b-accent)" strokeWidth={2} strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: drawing ? [0, 1] : reduced ? 1 : 0 }}
          transition={drawing ? { duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.7 } : { duration: reduced ? 0 : 0.25 }}
        />
        {THREAD_NODES.map((node, i) => (
          <motion.g key={node.label} animate={{ opacity: reduced || drawing ? 1 : 0.35 }} transition={{ duration: 0.4, delay: drawing ? i * 0.25 : 0 }}>
            <circle cx={node.x} cy={node.y} r={5} fill="var(--b-panel)" stroke="var(--b-text-secondary)" strokeWidth={1.5} />
            <text x={node.x} y={node.y + 24} textAnchor="middle" fontSize={11} fill="var(--b-text-secondary)" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

const SHOWCASE = [
  { title: "Orbital", tag: "01 / storefront", caption: "Realtime storefront, shipped in a week." },
  { title: "Ledger", tag: "02 / analytics", caption: "Audit-grade analytics with zero dashboards." },
];

function ProjectShowcasePreview() {
  return (
    <div className={cn(STAGE, "grid grid-cols-2 gap-4")}>
      {SHOWCASE.map((project, i) => (
        <div key={project.title} className="group">
          <div className="relative h-32 overflow-hidden rounded-2xl border border-[color:var(--b-border)] transition-transform duration-300 group-hover:-translate-y-1.5 group-focus-within:-translate-y-1.5">
            <div className="absolute inset-0" style={{ background: i === 0 ? "linear-gradient(135deg, color-mix(in oklab, var(--b-accent) 42%, var(--b-panel)), var(--b-panel))" : "linear-gradient(135deg, color-mix(in oklab, var(--b-iris) 42%, var(--b-panel)), var(--b-panel))" }} />
            <span className="absolute bottom-2 left-2 font-display text-sm font-bold text-[color:var(--b-text)]">{project.title}</span>
            <span className="absolute right-2 top-2 font-mono text-[9px] text-[color:var(--b-text-secondary)]">{project.tag}</span>
          </div>
          <p className="mt-2 truncate text-[11px] text-[color:var(--b-text-secondary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            {project.caption}
          </p>
        </div>
      ))}
    </div>
  );
}

function useScrollRootInView(
  rootRef: React.RefObject<HTMLDivElement | null>,
  itemRef: React.RefObject<HTMLDivElement | null>
): boolean {
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const item = itemRef.current;
    if (!item || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      { root: rootRef.current, threshold: 0.4 }
    );
    obs.observe(item);
    return () => obs.disconnect();
  }, [rootRef, itemRef]);
  return inView;
}

function RevealTile({ rootRef, index, reduced }: { rootRef: React.RefObject<HTMLDivElement | null>; index: number; reduced: boolean }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useScrollRootInView(rootRef, ref);
  const visible = inView || reduced;
  return (
    <div ref={ref} className={cn("rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-4 py-3", !reduced && "transition-all duration-500", visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[color:var(--b-text)]">Chapter {String(index + 1).padStart(2, "0")}</span>
        <span className="font-mono text-[10px] text-[color:var(--b-muted)]">{visible ? "revealed" : "hidden"}</span>
      </div>
    </div>
  );
}

function RevealOnScrollPreview() {
  const reduced = useReducedMotionPref();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  return (
    <div className={cn(STAGE, "max-w-[420px]")}>
      <div ref={rootRef} tabIndex={0} aria-label="Reveal demo scroller"
        className="h-[260px] space-y-2 overflow-y-auto rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_92%,transparent)] p-3">
        {Array.from({ length: 8 }, (_, i) => (
          <RevealTile key={i} rootRef={rootRef} index={i} reduced={reduced} />
        ))}
      </div>
      <p className="mt-2 text-center font-mono text-[10px] text-[color:var(--b-muted)]">scroll inside the frame</p>
    </div>
  );
}

function HandwrittenAnnotationPreview() {
  const reduced = useReducedMotionPref();
  const loop = !reduced;
  return (
    <div className={cn(STAGE, "grid h-[220px] place-items-center")}>
      <div className="relative h-[110px] w-[240px]">
        <p className="absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap font-display text-2xl font-bold text-[color:var(--b-text)]">ship it</p>
        <svg viewBox="0 0 240 110" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <motion.path d="M180 42 C 192 22 156 10 118 11 C 70 12 40 22 38 40 C 36 58 76 68 122 67 C 168 66 196 54 184 38 C 178 30 162 21 140 18"
            fill="none" stroke="var(--b-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: loop ? [0, 1] : 1 }}
            transition={loop ? { duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.1 } : { duration: 0 }}
          />
          <motion.path d="M116 74 C 122 88 142 98 168 99 M168 99 L156 94 M168 99 L158 104"
            fill="none" stroke="var(--b-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: loop ? [0, 1] : 1 }}
            transition={loop ? { duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.1, delay: 0.3 } : { duration: 0 }}
          />
        </svg>
      </div>
    </div>
  );
}

const TIMELINE_ENTRIES = [
  { title: "Scaffold", detail: "Registry and CLI wired up." },
  { title: "Animate", detail: "Physics kernel lands everywhere." },
  { title: "Ship", detail: "Docs, tokens, and OG cards live." },
];

function VerticalTimelinePreview() {
  const reduced = useReducedMotionPref();
  return (
    <div className={cn(STAGE, "max-w-[380px]")}>
      <ul className="flex flex-col">
        {TIMELINE_ENTRIES.map((entry, i) => (
          <li key={entry.title} className="flex gap-4">
            <div className="relative flex w-4 shrink-0 justify-center">
              <motion.span aria-hidden="true" className="z-10 mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 border-[color:var(--b-accent)] bg-[color:var(--b-panel)]"
                initial={reduced ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={reduced ? { duration: 0.2, delay: i * 0.06 } : { type: "spring", stiffness: 320, damping: 20, delay: i * 0.16 }}
              />
              {i < TIMELINE_ENTRIES.length - 1 && (
                <motion.span aria-hidden="true" className="absolute bottom-0 top-5 w-px bg-[color:color-mix(in_oklab,var(--b-accent)_45%,transparent)]"
                  style={{ transformOrigin: "top" }}
                  initial={{ scaleY: reduced ? 1 : 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: reduced ? 0 : 0.7, ease: "easeOut", delay: reduced ? 0 : 0.12 + i * 0.16 }}
                />
              )}
            </div>
            <div className={cn("pb-9", i === TIMELINE_ENTRIES.length - 1 && "pb-1")}>
              <p className="text-sm font-semibold text-[color:var(--b-text)]">{entry.title}</p>
              <p className="mt-0.5 text-xs text-[color:var(--b-text-secondary)]">{entry.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SpeechBubbleCursorPreview() {
  const reduced = useReducedMotionPref();
  const zoneRef = React.useRef<HTMLDivElement | null>(null);
  const bubbleRef = React.useRef<HTMLDivElement | null>(null);
  const pointer = React.useRef({ x: 0, y: 0, inside: false });

  useRafLoop(() => {
    const zone = zoneRef.current;
    const bubble = bubbleRef.current;
    if (!zone || !bubble) return;
    const p = pointer.current;
    if (!p.inside) {
      if (bubble.style.opacity !== "0") bubble.style.opacity = "0";
      return;
    }
    const rect = zone.getBoundingClientRect();
    const x = clamp(p.x - rect.left + 16, 8, Math.max(8, rect.width - 84));
    const y = clamp(p.y - rect.top - 42, 8, Math.max(8, rect.height - 48));
    bubble.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    bubble.style.opacity = "1";
  });

  return (
    <div className={STAGE}>
      <div ref={zoneRef} onPointerMove={(e) => { pointer.current = { x: e.clientX, y: e.clientY, inside: true }; }} onPointerLeave={() => { pointer.current.inside = false; }}
        className="relative h-[240px] w-full overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_92%,transparent)]">
        <p className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-[10px] text-[color:var(--b-muted)]">move your pointer</p>
        <div ref={bubbleRef} aria-hidden="true" style={{ opacity: 0 }}
          className={cn("pointer-events-none absolute left-0 top-0 rounded-2xl rounded-bl-sm border border-[color:var(--b-border)] bg-[color:var(--b-elevated)] px-3 py-1.5 text-xs text-[color:var(--b-text)] shadow-lg", !reduced && "transition-opacity duration-200")}>
          hello
        </div>
      </div>
    </div>
  );
}

function CommentThreadPreview() {
  const reduced = useReducedMotionPref();
  const [showReply, setShowReply] = React.useState(true);
  const count = showReply ? 2 : 1;
  return (
    <div className={cn(STAGE, "max-w-[420px] rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_92%,transparent)] p-4")}>
      <div className="flex gap-3">
        <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--b-accent-muted)] font-mono text-[10px] font-semibold text-[color:var(--b-accent)]">AL</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-semibold text-[color:var(--b-text)]">Ada</p>
            <span className="font-mono text-[10px] text-[color:var(--b-muted)]">2h</span>
          </div>
          <p className="mt-0.5 truncate text-xs text-[color:var(--b-text-secondary)]">Motion tokens look right in both themes now.</p>
          <AnimatePresence initial={false}>
            {showReply && (
              <motion.div key="reply" className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}>
                <div className="mt-3 flex gap-3 border-l border-[color:var(--b-border)] pl-3">
                  <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold text-[color:var(--b-iris)]" style={{ background: "color-mix(in oklab, var(--b-iris) 18%, transparent)" }}>GH</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[color:var(--b-text)]">Grace</p>
                    <p className="mt-0.5 truncate text-xs text-[color:var(--b-text-secondary)]">Agreed — reduced motion behaves the same everywhere.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-3 flex items-center gap-3">
            <button type="button" aria-label="Toggle reply" aria-expanded={showReply} onClick={() => setShowReply((v) => !v)}
              className="rounded-lg border border-[color:var(--b-border)] px-3 py-1 font-mono text-[10px] text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-accent)] hover:text-[color:var(--b-accent)]">
              Reply
            </button>
            <span className="font-mono text-[10px] text-[color:var(--b-muted)]">{count} {count === 1 ? "reply" : "replies"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const PREVIEW_MAP: Record<string, React.ComponentType> = {
  utils: UtilsPreview,
  "use-reduced-motion": ReducedMotionPreview,
  "use-pointer-proximity": PointerProximityPreview,
  spring: SpringPreview,
  tokens: TokensPreview,
  "floating-object": FloatingObjectPreview,
  "horizontal-scroll": HorizontalScrollPreview,
  "thread-line": ThreadLinePreview,
  "project-showcase": ProjectShowcasePreview,
  "reveal-on-scroll": RevealOnScrollPreview,
  "handwritten-annotation": HandwrittenAnnotationPreview,
  "vertical-timeline": VerticalTimelinePreview,
  "speech-bubble-cursor": SpeechBubbleCursorPreview,
  "comment-thread": CommentThreadPreview,
};

export function ExtraPreview({ slug }: { slug: string }): React.ReactNode {
  const Preview = PREVIEW_MAP[slug];
  return Preview ? <Preview /> : null;
}

export const EXTRA_CODE: Record<string, string> = {
  utils: `import { useState } from "react";
import { cn } from "@/registry/shared/utils";

export function MergeDemo() {
  const [wide, setWide] = useState(false);
  const classes = cn("px-3 py-2 rounded-lg", wide && "px-6");
  return (
    <button className={classes} onClick={() => setWide((v) => !v)}>
      {classes}
    </button>
  );
}`,
  "use-reduced-motion": `import { useReducedMotion } from "@/registry/shared/use-reduced-motion";

export function MotionStatus() {
  const reduced = useReducedMotion();
  return (
    <div className="flex items-center gap-3">
      <span className={reduced ? "h-3 w-3 rounded-full bg-zinc-400" : "h-3 w-3 rounded-full bg-emerald-400 animate-bounce"} />
      <span className="text-sm">{reduced ? "Reduced" : "Full motion"}</span>
    </div>
  );
}`,
  "use-pointer-proximity": `import { usePointerProximity } from "@/registry/shared/use-pointer-proximity";

export function ProximityDot() {
  const { ref, proximity } = usePointerProximity<HTMLDivElement>(240);
  const scale = 1 + proximity.t;
  return (
    <div ref={ref} className="relative grid h-56 place-items-center rounded-2xl border">
      <div className="h-4 w-4 rounded-full bg-[var(--b-accent)]" style={{ transform: "scale(" + scale + ")" }} />
      <code className="font-mono text-[10px]">p = {proximity.t.toFixed(2)}</code>
    </div>
  );
}`,
  spring: `import * as React from "react";
import { rafLoop, springStep } from "@/registry/shared/spring";

export function SpringPuck({ puckRef }: { puckRef: React.RefObject<HTMLButtonElement> }) {
  const ping = () => {
    let x = 0;
    let v = 220;
    rafLoop((dt) => {
      const next = springStep(x, v, 0, { stiffness: 260, damping: 14, mass: 1 }, dt);
      [x, v] = [next.x, next.v];
      if (puckRef.current) puckRef.current.style.transform = "translateX(" + x.toFixed(1) + "px)";
      if (Math.abs(x) < 0.1 && Math.abs(v) < 0.1) return false;
    });
  };
  return <button ref={puckRef} onClick={ping}>Ping</button>;
}`,
  tokens: `import "@/registry/shared/tokens.css";

const swatches = ["--b-bg", "--b-panel", "--b-accent"];

export function TokenSwatches() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {swatches.map((name) => (
        <div key={name} className="h-14 rounded-xl border" style={{ background: "var(" + name + ")" }} />
      ))}
    </div>
  );
}`,
  "floating-object": `import { FloatingObject } from "@buildora/components";

export function FloatingCard() {
  return (
    <div className="grid h-72 place-items-center">
      <FloatingObject src="/orb.png" alt="Gradient orb" size="11rem" maxTilt={14} bubbleText="pointer parallax" />
    </div>
  );
}`,
  "horizontal-scroll": `import { HorizontalScroll } from "@buildora/components";

const slides = ["First light", "Cobalt", "Drift"];

export function Gallery() {
  return (
    <HorizontalScroll widthMultiplier={4} scrollHeight="400vh">
      <div className="flex items-center gap-10 px-12">
        {slides.map((slide) => (
          <section key={slide} className="w-[80vw] shrink-0">{slide}</section>
        ))}
      </div>
    </HorizontalScroll>
  );
}`,
  "thread-line": `import { ThreadLine } from "@buildora/components";

export function Thread() {
  return (
    <div className="grid h-64 place-items-center">
      <ThreadLine
        path="M80 640 C 560 120, 1220 860, 1740 420 S 2860 140, 3380 560 S 4460 860, 4860 420"
        viewBox="0 0 5700 1000"
        strokeColor="var(--b-accent)"
        strokeWidth={3}
      />
    </div>
  );
}`,
  "project-showcase": `import { ProjectShowcase, ProjectShowcaseCard } from "@buildora/components";

export function Works() {
  return (
    <ProjectShowcase subtitle="Selected work" heading="Recent projects">
      <div className="grid gap-10 sm:grid-cols-2">
        <ProjectShowcaseCard number="01" title="Orbital" description="Realtime 3D storefront" imageSrc="/works/orbital.jpg" imageAlt="Orbital interface" />
      </div>
    </ProjectShowcase>
  );
}`,
  "reveal-on-scroll": `import { RevealOnScroll } from "@buildora/components";

export function Sections() {
  return (
    <section className="space-y-24 py-24">
      <RevealOnScroll variant="fade-up" delay={0.05}>
        <h2 className="text-3xl font-bold">Scaffolded</h2>
        <p className="text-sm">Fades up as it enters the viewport.</p>
      </RevealOnScroll>
      <RevealOnScroll variant="blur">
        <h2 className="text-3xl font-bold">Polished</h2>
      </RevealOnScroll>
    </section>
  );
}`,
  "handwritten-annotation": `import { HandwrittenAnnotation } from "@buildora/components";

export function Note() {
  return (
    <div className="relative grid h-64 place-items-center">
      <p className="max-w-xs text-sm">Every interaction ends in a shipped artifact.</p>
      <HandwrittenAnnotation text="ship it" arrowDirection="down-left" rotation={-12} className="absolute right-2 top-6" />
    </div>
  );
}`,
  "vertical-timeline": `import { VerticalTimeline } from "@buildora/components";

const entries = [
  { title: "Audit", date: "Q1", description: "Map every primitive." },
  { title: "Build", date: "Q2", description: "Ship the registry." },
  { title: "Launch", date: "Q3", description: "Open the CLI." },
];

export function Roadmap() {
  return <VerticalTimeline entries={entries} staggerDelay={0.1} animated />;
}`,
  "speech-bubble-cursor": `import { SpeechBubbleCursor } from "@buildora/components";

export function Stage() {
  return (
    <SpeechBubbleCursor defaultText="hello">
      <section className="grid h-80 place-items-center rounded-2xl border">
        <button data-cursor="copy" className="rounded-full border px-4 py-2">Hover me</button>
        <p data-cursor="read more" className="text-sm">Every hover speaks.</p>
      </section>
    </SpeechBubbleCursor>
  );
}`,
  "comment-thread": `import { CommentThread } from "@/components/buildora/comment-thread";

export function Review() {
  const threads = [
    { id: "1", author: "Ada", body: "Motion tokens are locked in.", time: "2h" },
    { id: "2", author: "Grace", body: "Shipping the CLI this week.", time: "1h" },
  ];
  return (
    <CommentThread threads={threads} onReply={(id) => console.log("reply", id)} onResolve={(id) => console.log("resolve", id)} />
  );
}`,
};
