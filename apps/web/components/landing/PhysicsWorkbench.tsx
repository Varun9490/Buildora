"use client";

import * as React from "react";
import { motion, useMotionValue } from "motion/react";
import { cn } from "@buildora/utils";
import {
  springStep,
  gaussian,
  clamp,
  useRafLoop,
  useInView,
  useReducedMotionPref,
  createSeededRandom,
  type SpringConfig,
} from "@/lib/physics";

type DemoId = "magnetic" | "tether" | "gravity";

const DEMOS: { id: DemoId; label: string }[] = [
  { id: "magnetic", label: "Magnetic Pull" },
  { id: "tether", label: "Spring Tether" },
  { id: "gravity", label: "Gravity Orb" },
];

const DUST = Array.from({ length: 9 }, (_, i) => {
  const rand = createSeededRandom(4200 + i);
  return { x: rand(), y: rand(), r: 0.6 + rand() * 1.1 };
});

export function PhysicsWorkbench() {
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const fieldRef = React.useRef<HTMLDivElement | null>(null);
  const tetherRef = React.useRef<SVGPathElement | null>(null);
  const gravityRingRef = React.useRef<HTMLDivElement | null>(null);
  const pointer = React.useRef({ x: 0, y: 0, active: false });
  const state = React.useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const clock = React.useRef(0);
  const reduced = useReducedMotionPref();
  const reducedRef = React.useRef(reduced);
  reducedRef.current = reduced;
  const inView = useInView(stageRef);

  const [demo, setDemo] = React.useState<DemoId>("magnetic");
  const demoRef = React.useRef(demo);
  demoRef.current = demo;
  const [stiffness, setStiffness] = React.useState(220);
  const [damping, setDamping] = React.useState(18);
  const configRef = React.useRef<SpringConfig>({ stiffness: 220, damping: 18, mass: 1 });
  configRef.current = { stiffness, damping, mass: 1 };

  const posX = useMotionValue(0);
  const posY = useMotionValue(0);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
      active: true,
    };
  };

  const onPointerLeave = () => {
    pointer.current.active = false;
  };

  useRafLoop((dt) => {
    const stage = stageRef.current;
    if (!stage) return;
    const active = demoRef.current;
    const p = pointer.current;
    const cfg = configRef.current;

    let tx = 0;
    let ty = 0;
    let tension = 0;

    if (active === "magnetic") {
      if (p.active) {
        const d = Math.hypot(p.x, p.y);
        tension = clamp(1 - d / 170, 0, 1);
        tx = p.x * 0.32 * tension;
        ty = p.y * 0.32 * tension;
      }
    } else if (active === "tether") {
      if (p.active) {
        tx = p.x * 0.55;
        ty = p.y * 0.55;
        tension = clamp(Math.hypot(p.x, p.y) / 220, 0, 1);
      }
    } else {
      clock.current += dt * 0.55;
      const t = clock.current;
      const orbitX = Math.cos(t) * 130;
      const orbitY = Math.sin(t * 0.9) * 74;
      if (p.active) {
        const g = gaussian(Math.hypot(p.x, p.y), 160) * 0.3;
        tension = g / 0.3;
        tx = orbitX + p.x * g;
        ty = orbitY + p.y * g;
      } else {
        tx = orbitX;
        ty = orbitY;
      }
    }

    if (reducedRef.current) {
      state.current = { x: tx, y: ty, vx: 0, vy: 0 };
    } else {
      const sx = springStep(state.current.x, state.current.vx, tx, cfg);
      const sy = springStep(state.current.y, state.current.vy, ty, cfg);
      state.current = { x: sx.x, vx: sx.v, y: sy.x, vy: sy.v };
    }

    posX.set(state.current.x);
    posY.set(state.current.y);

    const w = stage.clientWidth;
    const h = stage.clientHeight;

    if (fieldRef.current) {
      const show = active === "magnetic" && p.active;
      fieldRef.current.style.opacity = show ? `${0.14 + tension * 0.4}` : "0";
      fieldRef.current.style.transform = `translate3d(${w / 2 + p.x - 170}px, ${h / 2 + p.y - 170}px, 0)`;
    }

    if (gravityRingRef.current) {
      gravityRingRef.current.style.opacity = active === "gravity" ? `${0.3 + tension * 0.5}` : "0";
    }

    if (tetherRef.current) {
      if (active === "tether") {
        const ax = w / 2;
        const ay = h / 2 - 150;
        const bx = w / 2 + state.current.x;
        const by = h / 2 + state.current.y;
        const sag = 46 + Math.min(Math.hypot(state.current.x, state.current.y) * 0.22, 70);
        tetherRef.current.setAttribute(
          "d",
          `M ${ax} ${ay} Q ${(ax + bx) / 2} ${(ay + by) / 2 + sag} ${bx} ${by}`
        );
        tetherRef.current.style.opacity = "0.85";
      } else {
        tetherRef.current.style.opacity = "0";
      }
    }
  }, inView);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        ref={stageRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        role="img"
        aria-label="Interactive spring console. Choose a demo and tune stiffness and damping."
        className="relative h-[420px] w-full touch-none overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)]"
        style={{
          backgroundImage: "radial-gradient(color-mix(in oklab, var(--b-text) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {DUST.map((d, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-[color:var(--b-muted)]"
            style={{ left: `${d.x * 100}%`, top: `${d.y * 100}%`, height: d.r, width: d.r, opacity: 0.28 }}
          />
        ))}

        <div
          className="absolute left-1/2 top-3 z-20 -translate-x-1/2"
          role="tablist"
          aria-label="Spring demo"
        >
          <div className="flex rounded-full border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_72%,transparent)] p-0.5 backdrop-blur-md">
            {DEMOS.map((d) => {
              const selected = demo === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setDemo(d.id)}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-[12px] transition-colors",
                    selected ? "font-medium text-[color:var(--b-text)]" : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="workbench-demo"
                      className="absolute inset-0 rounded-full bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)]"
                      transition={{ type: "spring", stiffness: 480, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{d.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={fieldRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-[340px] w-[340px] rounded-full opacity-0"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--b-accent) 26%, transparent), transparent 72%)",
            transition: "opacity 0.25s ease",
          }}
        />

        <div
          ref={gravityRingRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[color:var(--b-border-hover)] opacity-0"
          style={{ transition: "opacity 0.3s ease" }}
        />

        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="50%" cy="calc(50% - 150px)" r="3" fill="var(--b-muted)" opacity="0.7" />
          <path ref={tetherRef} fill="none" stroke="var(--b-accent)" strokeWidth="2" strokeLinecap="round" opacity="0" />
        </svg>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            style={{ x: posX, y: posY }}
            className="h-14 w-14 rounded-full"
          >
            <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_32%_28%,color-mix(in_oklab,var(--b-accent)_88%,white),var(--b-accent)_42%,color-mix(in_oklab,var(--b-accent)_30%,black)_80%)] shadow-[0_18px_44px_-14px_var(--b-accent-glow),inset_0_-8px_20px_rgba(0,0,0,0.35)]" />
          </motion.div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 px-1 sm:grid-cols-2">
        <WorkbenchSlider
          label="Stiffness"
          value={stiffness}
          min={80}
          max={400}
          step={5}
          onChange={setStiffness}
        />
        <WorkbenchSlider
          label="Damping"
          value={damping}
          min={8}
          max={40}
          step={1}
          onChange={setDamping}
        />
      </div>
    </div>
  );
}

function WorkbenchSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between text-[12px] text-[color:var(--b-text-secondary)]">
        {label}
        <span className="font-mono text-[11px] text-[color:var(--b-text)]">{value}</span>
      </span>
      <input
        type="range"
        className="b-range w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--range-fill": `${pct}%` } as React.CSSProperties}
        aria-label={label}
      />
    </label>
  );
}
