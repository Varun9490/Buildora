"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

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
  state: "falling" | "loaded" | "shot" | "done";
  el?: HTMLDivElement | null;
};

/**
 * SlingshotOTP — An Angry Birds style mini-game.
 * Rocks (numbers) fall from the sky. Click one to load it into the slingshot at the bottom.
 * Drag and release to shoot it into the OTP boxes at the top!
 */
export function SlingshotOTP({ length = 6, value, onChange, onComplete, label = "Shoot the rocks into the boxes!", className }: SlingshotOTPProps) {
  const [internal, setInternal] = React.useState<string[]>(() => Array.from({ length }, () => ""));
  const controlled = value !== undefined;
  const digits = controlled ? value!.padEnd(length).slice(0, length).split("") : internal;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const targetsRef = React.useRef<Array<HTMLDivElement | null>>([]);
  
  // Game state (refs for performance, avoid 60fps renders)
  const rocksRef = React.useRef<Rock[]>([]);
  const nextId = React.useRef(0);
  const loadedRockId = React.useRef<number | null>(null);
  const dragStart = React.useRef<{ x: number; y: number } | null>(null);
  const slingshotPos = React.useRef({ x: 0, y: 0 }); // Anchor point
  
  // To trigger occasional renders (e.g. for digit updates)
  const [, forceRender] = React.useState({});
  
  const commit = (next: string[]) => {
    const joined = next.join("");
    if (!controlled) setInternal(next);
    onChange?.(joined);
    if (joined.length === length && next.every((d) => d !== "")) onComplete?.(joined);
    forceRender({});
  };

  // Physics loop
  React.useEffect(() => {
    let frameId: number;
    let lastSpawn = 0;
    
    const loop = (time: number) => {
      frameId = requestAnimationFrame(loop);
      const container = containerRef.current;
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      slingshotPos.current = { x: width / 2, y: height - 40 };

      // Spawn falling rocks
      if (time - lastSpawn > 1200) {
        lastSpawn = time;
        if (rocksRef.current.filter(r => r.state === "falling").length < 5) {
          rocksRef.current.push({
            id: nextId.current++,
            digit: Math.floor(Math.random() * 10).toString(),
            x: Math.random() * (width - 40) + 20,
            y: -30,
            vx: 0,
            vy: 1 + Math.random() * 1.5, // Fall speed
            state: "falling"
          });
          forceRender({}); // Need to render the new DOM element so we can grab its ref
        }
      }

      // Physics update
      let changed = false;
      const currentDigits = [...digits]; // snapshot for collision

      rocksRef.current.forEach((rock) => {
        if (rock.state === "falling") {
          rock.y += rock.vy;
          if (rock.y > height + 30) rock.state = "done"; // fell out of bounds
        } else if (rock.state === "shot") {
          rock.x += rock.vx;
          rock.y += rock.vy;
          rock.vy += 0.4; // gravity
          
          // Check collision with targets
          for (let i = 0; i < length; i++) {
            const target = targetsRef.current[i];
            if (!target || currentDigits[i] !== "") continue;
            
            const rect = target.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            const tx = rect.left - containerRect.left;
            const ty = rect.top - containerRect.top;
            const tw = rect.width;
            const th = rect.height;
            
            // Simple bounding box collision
            if (rock.x > tx && rock.x < tx + tw && rock.y > ty && rock.y < ty + th) {
              rock.state = "done";
              currentDigits[i] = rock.digit;
              changed = true;
              break;
            }
          }
          
          if (rock.y > height + 30 || rock.x < -30 || rock.x > width + 30) rock.state = "done";
        }
        
        // Update DOM directly for performance
        if (rock.el) {
          rock.el.style.transform = `translate(${rock.x}px, ${rock.y}px)`;
          if (rock.state === "done") rock.el.style.display = "none";
        }
      });
      
      // Cleanup done rocks
      const originalCount = rocksRef.current.length;
      rocksRef.current = rocksRef.current.filter(r => r.state !== "done");
      if (rocksRef.current.length !== originalCount) forceRender({});
      
      if (changed) commit(currentDigits);
    };
    
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [length, digits, controlled]);

  // Interactions
  const onRockClick = (id: number) => {
    const rock = rocksRef.current.find(r => r.id === id);
    if (!rock || rock.state !== "falling") return;
    
    // Only one loaded at a time
    if (loadedRockId.current !== null) {
       const prev = rocksRef.current.find(r => r.id === loadedRockId.current);
       if (prev) prev.state = "falling";
    }
    
    rock.state = "loaded";
    rock.x = slingshotPos.current.x;
    rock.y = slingshotPos.current.y;
    loadedRockId.current = id;
    if (rock.el) rock.el.style.transform = `translate(${rock.x}px, ${rock.y}px)`;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (loadedRockId.current === null) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current || loadedRockId.current === null) return;
    const rock = rocksRef.current.find(r => r.id === loadedRockId.current);
    if (!rock) return;
    
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    // Constrain pull distance
    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxPull = 80;
    const scale = dist > maxPull ? maxPull / dist : 1;
    
    rock.x = slingshotPos.current.x + dx * scale;
    rock.y = slingshotPos.current.y + dy * scale;
    
    if (rock.el) rock.el.style.transform = `translate(${rock.x}px, ${rock.y}px)`;
  };

  const onPointerUp = () => {
    if (!dragStart.current || loadedRockId.current === null) return;
    const rock = rocksRef.current.find(r => r.id === loadedRockId.current);
    if (rock) {
       const dx = slingshotPos.current.x - rock.x;
       const dy = slingshotPos.current.y - rock.y;
       rock.vx = dx * 0.15;
       rock.vy = dy * 0.15;
       rock.state = "shot";
    }
    dragStart.current = null;
    loadedRockId.current = null;
  };

  return (
    <div className={cn("select-none flex flex-col items-center", className)}>
      <label className="mb-4 block text-xs font-medium uppercase tracking-[0.14em] text-white/50">{label}</label>
      
      <div 
        ref={containerRef} 
        className="relative h-[320px] w-[360px] max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#08090d]/50"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Targets (OTP Boxes) */}
        <div className="absolute top-4 left-0 w-full flex justify-center gap-2">
          {Array.from({ length }, (_, i) => (
            <div 
              key={i} 
              ref={(el) => { targetsRef.current[i] = el; }}
              className={cn(
                "flex h-12 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] font-mono text-xl text-white shadow-lg",
                digits[i] ? "border-[#d4ff4f] bg-[#d4ff4f]/10 text-[#d4ff4f]" : ""
              )}
            >
              {digits[i]}
            </div>
          ))}
        </div>

        {/* Slingshot Base */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
           <div className="h-6 w-1 rounded-t-full bg-white/20"></div>
           <div className="h-8 w-6 rounded-b-xl border-b-4 border-l-4 border-r-4 border-white/20"></div>
        </div>

        {/* Rocks */}
        {rocksRef.current.map((rock) => (
          <div
            key={rock.id}
            ref={(el) => { rock.el = el; }}
            onPointerDown={(e) => {
               if (rock.state === "falling") onRockClick(rock.id);
               else if (rock.state === "loaded") onPointerDown(e);
            }}
            className={cn(
              "absolute top-0 left-0 -ml-4 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white font-mono text-lg font-black text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] cursor-pointer transition-colors",
              rock.state === "loaded" ? "cursor-grab active:cursor-grabbing bg-[#d4ff4f] shadow-[0_0_20px_rgba(212,255,79,0.5)]" : ""
            )}
            style={{ transform: `translate(${rock.x}px, ${rock.y}px)` }}
          >
            {rock.digit}
          </div>
        ))}
      </div>
      
      <p className="mt-4 text-[11px] text-white/40">Tip: Click a falling number to load it. Drag down and release to shoot!</p>
    </div>
  );
}

export default SlingshotOTP;
