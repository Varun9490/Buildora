"use client";

import * as React from "react";

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * SSR-safe prefers-reduced-motion.
 * Uses useSyncExternalStore so server and first client render agree (no hydration mismatch),
 * unlike a useState(false) + useEffect Shoot that flashes motion before measuring.
 */
export function useReducedMotion() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
