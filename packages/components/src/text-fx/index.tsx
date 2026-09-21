"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type TextFxKind = "typewriter" | "scramble" | "blur" | "gradient" | "glitch" | "morph";

export type TextFxProps = React.HTMLAttributes<HTMLSpanElement> & {
  kind?: TextFxKind;
  /** Final text (or rotating words for typewriter/morph). Screen readers hear this once. */
  text: string | string[];
  speed?: number;
};

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#";

/**
 * TextFx — one kinetic-text component with six kinds.
 * The wrapper carries aria-label with the final text and the animated
 * layer is aria-hidden, so screen readers announce it exactly once.
 * Static under prefers-reduced-motion. Replaces: typewriter, scrambled,
 * blur, gradient, glitch text + morphing typography.
 */
export function TextFx({ kind = "typewriter", text, speed = 55, className, ...rest }: TextFxProps) {
  const reduced = useReducedMotion();
  const words = React.useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const finalText = words.join(" ");

  if (reduced) {
    return (
      <span className={className} {...rest}>
        {Array.isArray(text) ? text[0] : text}
      </span>
    );
  }

  return (
    <span aria-label={finalText} className={cn("inline-flex", className)} {...rest}>
      <span aria-hidden className="inline-flex">
        {kind === "typewriter" && <TypewriterLayer words={words} speed={speed} />}
        {kind === "scramble" && <ScrambleLayer text={finalText} speed={Math.max(20, speed / 2)} />}
        {kind === "blur" && <BlurLayer text={finalText} />}
        {kind === "gradient" && <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, var(--b-accent), var(--b-iris, #9d8cff), var(--b-text), var(--b-accent))", backgroundSize: "200% auto", animation: "buildora-gradient-pan 8s linear infinite" }}>{finalText}</span>}
        {kind === "glitch" && <GlitchLayer text={finalText} />}
        {kind === "morph" && <MorphLayer words={words} />}
      </span>
    </span>
  );
}

function TypewriterLayer({ words, speed }: { words: string[]; speed: number }) {
  const [out, setOut] = React.useState("");
  const state = React.useRef({ wi: 0, ci: 0, del: false });
  React.useEffect(() => {
    let t = 0;
    let alive = true;
    const step = () => {
      if (!alive) return;
      const s = state.current;
      const word = words[s.wi] ?? "";
      if (!s.del) {
        s.ci += 1;
        setOut(word.slice(0, s.ci));
        if (s.ci >= word.length) {
          s.del = true;
          t = window.setTimeout(step, 1200);
          return;
        }
        t = window.setTimeout(step, speed);
      } else {
        s.ci -= 1;
        setOut(word.slice(0, Math.max(0, s.ci)));
        if (s.ci <= 0) {
          s.del = false;
          s.wi = (s.wi + 1) % words.length;
          t = window.setTimeout(step, 350);
          return;
        }
        t = window.setTimeout(step, speed / 2);
      }
    };
    t = window.setTimeout(step, 300);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [words, speed]);
  return (
    <span>
      {out}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function ScrambleLayer({ text, speed }: { text: string; speed: number }) {
  const [out, setOut] = React.useState(text);
  React.useEffect(() => {
    let iter = 0;
    const id = window.setInterval(() => {
      iter += 1 / 3;
      setOut(
        text
          .split("")
          .map((ch, i) => {
            if (i < iter) return text[i];
            if (ch === " ") return " ";
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );
      if (iter >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return <span>{out}</span>;
}

function BlurLayer({ text }: { text: string }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const id = window.requestAnimationFrame(() => setOn(true));
    return () => window.cancelAnimationFrame(id);
  }, []);
  return (
    <span className="inline-flex flex-wrap">
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-500"
          style={{
            opacity: on ? 1 : 0,
            filter: on ? "blur(0px)" : "blur(10px)",
            transform: on ? "translateY(0)" : "translateY(16px)",
            transitionDelay: `${Math.min(i * 60, 900)}ms`,
          }}
        >
          {w}
          {i < text.split(" ").length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

function GlitchLayer({ text }: { text: string }) {
  return (
    <span className="relative inline-block">
      <span className="relative">{text}</span>
      <span
        className="absolute inset-0 text-red-500 opacity-60"
        style={{ transform: "translateX(-2px)", animation: "buildora-glitch-a 2.4s infinite" }}
      >
        {text}
      </span>
      <span
        className="absolute inset-0 text-cyan-500 opacity-60"
        style={{ transform: "translateX(2px)", animation: "buildora-glitch-b 2.4s infinite" }}
      >
        {text}
      </span>
    </span>
  );
}

function MorphLayer({ words }: { words: string[] }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (words.length < 2) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), 1900);
    return () => window.clearInterval(id);
  }, [words.length]);
  return (
    <span key={i} className="inline-block" style={{ animation: "buildora-fade-in 0.5s ease" }}>
      {words[i]}
    </span>
  );
}

export default TextFx;
