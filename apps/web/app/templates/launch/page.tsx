"use client";

import * as React from "react";
import {
  Button,
  DynamicIsland,
  FeatureGrid,
  Input,
  PinnedSection,
  ScrollLinkedPath,
  SplitText,
} from "@buildora/components";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";

const PHASES = [
  { title: "Closed beta", body: "Thirty teams. One component each. A lot of notes." },
  { title: "Public beta", body: "The whole catalogue, installable, with the gates on." },
  { title: "General availability", body: "Every component stable, every report public." },
];

export default function LaunchTemplate() {
  return (
    <div className="min-h-screen bg-[color:var(--b-bg)] text-[color:var(--b-text)] font-sans">
      <nav className="sticky top-0 z-40 border-b border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_90%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest">
            Halcyon
          </span>
          <div className="flex items-center gap-3">
            <DynamicIsland status="think" className="hidden sm:block" />
            <ThemeCustomizer />
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-24 text-center sm:pt-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--b-accent)]">
            Shipping now
          </p>
          <h1 className="mt-6 font-display text-4xl font-black tracking-tight sm:text-6xl">
            <SplitText
              as="span"
              text="The thing we spent a year on"
              by="char"
              variant="blur"
              stagger={22}
            />
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[color:var(--b-text-secondary)]">
            One sentence about the product, the same number of times you would
            say it out loud. Then stop talking and let them use it.
          </p>
        </section>

        {/* The scroll through the phases */}
        <PinnedSection length={2} className="border-y border-[color:var(--b-border)] bg-[color:var(--b-surface)]">
          <div className="mx-auto flex min-h-screen max-w-5xl items-center gap-12 px-6">
            <div className="flex-1">
              {PHASES.map((p, i) => (
                <div key={p.title} className="mb-10 last:mb-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--b-accent)]">
                    Phase {i + 1}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold">{p.title}</h2>
                  <p className="mt-2 max-w-sm text-sm text-[color:var(--b-text-secondary)]">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="hidden flex-1 lg:block">
              <ScrollLinkedPath
                height={380}
                path="M40 340 C 140 300, 120 140, 220 120 S 340 40, 380 90"
              />
            </div>
          </div>
        </PinnedSection>

        {/* What is in the box */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            What is in the box
          </h2>
          <FeatureGrid
            className="mt-8"
            items={[
              {
                title: "The whole catalogue",
                body: "Every component installable on its own, with the tokens it needs.",
                tag: "127",
              },
              {
                title: "The evidence",
                body: "Contrast and accessibility reports committed next to the code.",
                tag: "0 violations",
              },
              {
                title: "The physics",
                body: "Springs with measured overshoot and settling time, documented.",
                tag: "260/22",
              },
            ]}
          />
        </section>

        {/* Waitlist */}
        <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
          <h2 className="font-display text-3xl font-black tracking-tight">
            Get the changelog
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[color:var(--b-text-secondary)]">
            One email per release. Nothing else, ever.
          </p>
          <form
            className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <Input
              id="waitlist-email"
              type="email"
              placeholder="you@company.com"
              className="flex-1"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </section>
      </main>

      <footer className="border-t border-[color:var(--b-border)] px-6 py-8 text-center text-xs text-[color:var(--b-muted)]">
        Halcyon — a Buildora template
      </footer>
    </div>
  );
}
