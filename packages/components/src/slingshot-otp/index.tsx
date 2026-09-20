"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { motion, AnimatePresence } from "framer-motion";

export type SlingshotOTPProps = {
  length?: number;
  value?: string;
  onChange?: (v: string) => void;
  onComplete?: (v: string) => void;
  label?: string;
  className?: string;
};

type Rock = {
  id: number;
  digit: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: "ground" | "loaded" | "shot" | "done";
  el?: HTMLDivElement | null;
  baseX: number;
  baseY: number;
};

export function SlingshotOTP({ length = 6, value, onChange, onComplete, label = "Enter Verification Code", className }: SlingshotOTPProps) {
  const [internal, setInternal] = React.useState<string>("");
  const controlled = value !== undefined;
  const val = controlled ? value : internal;
  const digits = val.padEnd(length, " ").split("").slice(0, length);

  const [mode, setMode] = React.useState<"standard" | "game">("game");

  const commit = (next: string) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="mb-4 flex w-full max-w-[360px] items-center justify-between px-2">
        <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-[--b-muted]">{label}</label>
        <button
          onClick={() => {
            setMode(mode === "standard" ? "game" : "standard");
            commit(""); // reset on mode switch
          }}
          className="rounded-md border border-[--b-border] bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-[--b-text-secondary] transition-colors hover:bg-white/[0.06]"
        >
          {mode === "standard" ? "Play Game" : "Standard Mode"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "standard" ? (
          <motion.div
            key="standard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <StandardOTP length={length} value={val} onChange={commit} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <GameOTP length={length} digits={digits} onHit={(d) => commit((val + d).slice(0, length))} onClear={() => commit("")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StandardOTP({ length, value, onChange }: { length: number; value: string; onChange: (v: string) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const digits = value.padEnd(length, " ").split("");

  return (
    <div className="relative flex gap-2" onClick={() => inputRef.current?.focus()}>
      {digits.map((d, i) => (
        <div
          key={i}
          className={cn(
            "flex h-14 w-11 items-center justify-center rounded-xl border font-mono text-2xl shadow-sm transition-all",
            d !== " "
              ? "border-[--b-accent] bg-[--b-accent]/5 text-[--b-accent]"
              : value.length === i
              ? "border-[--b-text] bg-white/[0.05] ring-2 ring-[--b-accent]/20" // Focus state
              : "border-[--b-border] bg-white/[0.02] text-[--b-muted]"
          )}
        >
          {d !== " " ? d : ""}
          {value.length === i && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="absolute h-6 w-0.5 bg-[--b-text]"
            />
          )}
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        className="absolute inset-0 z-10 cursor-text opacity-0"
      />
    </div>
  );
}

function GameOTP({ length, digits, onHit, onClear }: { length: number; digits: string[]; onHit: (d: string) => void; onClear: () => void }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const targetsRef = React.useRef<Array<HTMLDivElement | null>>([]);
  const rocksRef = React.useRef<Rock[]>([]);
  const slingshotPos = React.useRef({ x: 0, y: 0 });
  const dragStart = React.useRef<{ x: number; y: number } | null>(null);
  const loadedId = React.useRef<number | null>(null);
  const [, forceRender] = React.useState({});
  const bandRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    const rocks: Rock[] = [];
    for (let i = 0; i <= 9; i++) {
      const row = i < 5 ? 0 : 1;
      const col = i % 5;
      const baseX = 80 + col * 45;
      const baseY = 240 + row * 40;
      rocks.push({
        id: i,
        digit: i.toString(),
        x: baseX,
        y: baseY,
        vx: 0,
        vy: 0,
        state: "ground",
        baseX,
        baseY,
      });
    }
    rocksRef.current = rocks;
    forceRender({});
  }, []);

  React.useEffect(() => {
    let frameId: number;
    const loop = () => {
      frameId = requestAnimationFrame(loop);
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      slingshotPos.current = { x: width / 2, y: height - 120 };

      let changed = false;

      if (bandRef.current) {
        const loaded = rocksRef.current.find((r) => r.state === "loaded");
        if (loaded) {
          const sx = slingshotPos.current.x;
          const sy = slingshotPos.current.y;
          bandRef.current.setAttribute("d", `M ${sx - 15} ${sy} Q ${loaded.x} ${loaded.y} ${sx + 15} ${sy}`);
          bandRef.current.style.opacity = "1";
        } else {
          bandRef.current.style.opacity = "0";
        }
      }

      rocksRef.current.forEach((rock) => {
        if (rock.state === "shot") {
          rock.x += rock.vx;
          rock.y += rock.vy;
          rock.vy += 0.5;

          for (let i = 0; i < length; i++) {
            if (digits[i] !== " ") continue;
            const target = targetsRef.current[i];
            if (!target) continue;

            const rect = target.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const tx = rect.left - containerRect.left;
            const ty = rect.top - containerRect.top;

            if (rock.x > tx && rock.x < tx + rect.width && rock.y > ty && rock.y < ty + rect.height) {
              rock.state = "done";
              onHit(rock.digit);
              changed = true;
              break;
            }
          }

          if (rock.y > rock.baseY && rock.vy > 0) {
             rock.y = rock.baseY;
             rock.vy = -rock.vy * 0.4;
             rock.vx *= 0.8;
             if (Math.abs(rock.vy) < 1 && Math.abs(rock.x - rock.baseX) < 10) {
               rock.state = "ground";
               rock.x = rock.baseX;
             }
          }
        }

        if (rock.el) {
          rock.el.style.transform = `translate(${rock.x}px, ${rock.y}px) translate(-50%, -50%)`;
          if (rock.state === "done") rock.el.style.display = "none";
          else rock.el.style.display = "flex";
        }
      });

      if (changed) forceRender({});
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [length, digits, onHit]);

  const onPointerDown = (e: React.PointerEvent, rockId: number) => {
    const rock = rocksRef.current.find((r) => r.id === rockId);
    if (!rock || (rock.state !== "ground" && rock.state !== "shot")) return;

    if (loadedId.current !== null) {
      const prev = rocksRef.current.find((r) => r.id === loadedId.current);
      if (prev) prev.state = "ground";
    }

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    rock.state = "loaded";
    rock.x = slingshotPos.current.x;
    rock.y = slingshotPos.current.y;
    loadedId.current = rockId;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current || loadedId.current === null) return;
    const rock = rocksRef.current.find((r) => r.id === loadedId.current);
    if (!rock) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxPull = 100;
    const scale = dist > maxPull ? maxPull / dist : 1;

    rock.x = slingshotPos.current.x + dx * scale;
    rock.y = slingshotPos.current.y + dy * scale;
  };

  const onPointerUp = () => {
    if (loadedId.current === null) return;
    const rock = rocksRef.current.find((r) => r.id === loadedId.current);
    if (rock) {
      const dx = slingshotPos.current.x - rock.x;
      const dy = slingshotPos.current.y - rock.y;
      rock.vx = dx * 0.25;
      rock.vy = dy * 0.25;
      rock.state = "shot";
    }
    loadedId.current = null;
    dragStart.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[360px] w-[360px] max-w-full overflow-hidden rounded-2xl border border-[--b-border] bg-[#050505] shadow-xl"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      <button onClick={onClear} className="absolute right-3 top-3 z-10 text-[10px] uppercase tracking-wider text-[--b-muted] hover:text-[--b-accent]">
        Clear
      </button>

      <div className="absolute top-10 flex w-full justify-center gap-2">
        {Array.from({ length }, (_, i) => (
          <div
            key={i}
            ref={(el) => { targetsRef.current[i] = el; }}
            className={cn(
              "flex h-12 w-10 items-center justify-center rounded-lg border font-mono text-xl shadow-lg transition-colors",
              digits[i] !== " "
                ? "border-[--b-accent] bg-[--b-accent]/10 text-[--b-accent]"
                : "border-white/10 bg-white/5 text-white/20"
            )}
          >
            {digits[i] !== " " ? digits[i] : "-"}
          </div>
        ))}
      </div>

      <svg className="pointer-events-none absolute inset-0 h-full w-full">
         <path d="M 180 240 L 180 320" stroke="rgba(255,255,255,0.2)" strokeWidth="8" strokeLinecap="round" />
         <path d="M 160 210 L 180 240 L 200 210" stroke="rgba(255,255,255,0.2)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
         <path ref={bandRef} stroke="var(--b-accent, #d4ff4f)" strokeWidth="3" fill="none" style={{ opacity: 0 }} />
      </svg>

      {rocksRef.current.map((rock) => (
        <div
          key={rock.id}
          ref={(el) => { rock.el = el; }}
          onPointerDown={(e) => onPointerDown(e, rock.id)}
          className={cn(
            "absolute left-0 top-0 flex h-10 w-10 touch-none select-none items-center justify-center rounded-full border border-white/10 bg-[#111] font-mono text-lg font-bold text-white shadow-lg transition-colors",
            rock.state === "loaded" ? "cursor-grabbing border-[--b-accent] bg-[--b-accent] text-[--b-accent-foreground] shadow-[0_0_20px_rgba(212,255,79,0.3)]" : "cursor-grab hover:bg-white/10"
          )}
          style={{ transform: `translate(${rock.x}px, ${rock.y}px) translate(-50%, -50%)` }}
        >
          {rock.digit}
        </div>
      ))}
      
      <div className="absolute bottom-4 w-full text-center font-mono text-[9px] text-[--b-muted]">
        Drag a rock into the slingshot and fire
      </div>
    </div>
  );
}

export default SlingshotOTP;
