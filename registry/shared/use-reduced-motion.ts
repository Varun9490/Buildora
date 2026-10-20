"use client";

import * as React from "react";

/**
 * An app can force motion off for everyone, not just the people whose OS
 * asks for it. When the host sets `data-motion="reduced"` on the document
 * root, every Buildora component stops moving.
 */
function forcedOff() {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-motion") === "reduced";
}

function systemPrefersReduced() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  const observer =
    typeof MutationObserver === "undefined"
      ? null
      : new MutationObserver(cb);
  observer?.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
  return () => {
    mq.removeEventListener("change", cb);
    observer?.disconnect();
  };
}

function getSnapshot() {
  return forcedOff() || systemPrefersReduced();
}

function getServerSnapshot() {
  return false;
}

/**
 * SSR-safe prefers-reduced-motion.
 *
 * Uses useSyncExternalStore so server and first client render agree (no
 * hydration mismatch), unlike a useState(false) + useEffect that flashes
 * motion before measuring.
 *
 * Honours two things: the system setting, and a `data-motion="reduced"`
 * attribute on the document root, which is how an app pauses motion for
 * everyone at once.
 */
export function useReducedMotion() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
