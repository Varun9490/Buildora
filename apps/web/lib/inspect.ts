"use client";

export const INSPECT_EVENT = "buildora:inspect";

export function requestInspect(slug: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(INSPECT_EVENT, { detail: slug }));
}

export function onInspect(handler: (slug: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(INSPECT_EVENT, listener);
  return () => window.removeEventListener(INSPECT_EVENT, listener);
}
