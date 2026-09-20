"use client";
import * as React from "react";

export function usePointerProximity(ref: React.RefObject<HTMLElement | null>, radius: number) {
  const [proximity, setProximity] = React.useState(0);
  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      setProximity(Math.max(0, 1 - dist / radius));
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [ref, radius]);
  return proximity;
}
