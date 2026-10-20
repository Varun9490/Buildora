"use client";

import * as React from "react";
import { MagneticButton, MagnificationDock, TextFx } from "@buildora/components";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";

const LINKS = [
  { label: "Writing", hint: "Essays on interface physics", href: "#writing" },
  { label: "Speaking", hint: "Talks, mostly about springs", href: "#speaking" },
  { label: "Source", hint: "Everything here is MIT", href: "#source" },
  { label: "Elsewhere", hint: "One link, honestly", href: "#elsewhere" },
];

const DOCK: Array<{ label: string; path: string }> = [
  { label: "GitHub", path: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
  { label: "Mail", path: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" },
  { label: "RSS", path: "M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" },
  { label: "Bluesky", path: "M12 10.8c-1.4-2.6-4.6-5-6.4-3.4-1.6 1.5-.3 4.6 1.6 6.8 1.9 2.1 3.9 3.6 4.8 2.4.6-.8 1-2 1-3.6 0-1.6-.4-2.8-1-3.6" },
];

export default function LinkInBioTemplate() {
  return (
    <div className="min-h-screen bg-[color:var(--b-bg)] text-[color:var(--b-text)] font-sans">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center px-6 py-10">
        <div className="flex w-full justify-end">
          <ThemeCustomizer />
        </div>

        <div className="mt-12 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)]">
            <TextFx kind="scramble" text="J" speed={45} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-black tracking-tight">
            <TextFx kind="typewriter" text="Robin Ainsworth" speed={45} />
          </h1>
          <p className="mt-2 max-w-xs text-sm text-[color:var(--b-muted)]">
            Interface engineer. I write about motion, and occasionally ship it.
          </p>
        </div>

        <nav aria-label="Links" className="mt-10 w-full">
          <ul className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <li key={l.label}>
                <MagneticButton
                  strength={0.22}
                  radius={120}
                  variant="ghost"
                  className="w-full justify-between border border-[color:var(--b-border)] bg-[color:var(--b-panel)] px-5 py-3.5"
                >
                  <span className="font-medium">{l.label}</span>
                  <span className="text-xs font-normal text-[color:var(--b-muted)]">
                    {l.hint}
                  </span>
                </MagneticButton>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 w-full">
          <MagnificationDock items={DOCK} />
        </div>

        <footer className="mt-auto pt-12 text-center text-xs text-[color:var(--b-muted)]">
          Link in bio — a Buildora template
        </footer>
      </div>
    </div>
  );
}
