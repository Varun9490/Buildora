"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";

/**
 * Editorial Portfolio — reverse-engineered from leerob.io
 * Theme: warm dark brown bg (#1b1a19), cream text (#e8e5df),
 * serif headlines (Iowan Old Style / Georgia), muted secondary (#aaa59e).
 * Motion: gentle fade-up, no parallax gimmicks — editorial restraint.
 */
export default function EditorialPortfolioTemplate() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const scrollTo = React.useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div
      className="min-h-screen bg-[#1B1A19] text-[#E8E5DF] selection:bg-[#E8E5DF] selection:text-[#1B1A19]"
      style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, ui-serif, serif' }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center">
        <Link href="/" className="font-semibold text-lg tracking-tight">Lee R.</Link>
        <ul className="flex gap-6 text-sm text-[#AAA59E]">
          <li><a href="#writing" className="hover:text-[#E8E5DF] transition-colors">Writing</a></li>
          <li><a href="#work" className="hover:text-[#E8E5DF] transition-colors">Work</a></li>
          <li><a href="#about" className="hover:text-[#E8E5DF] transition-colors">About</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <header className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-16 overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0 opacity-40">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,#2A2826_0%,#1B1A19_70%)]" />
        </motion.div>

        <div className="relative z-10 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-mono uppercase tracking-[0.2em] text-[#AAA59E] mb-8"
          >
            Independent engineer &amp; writer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] font-semibold tracking-tight"
          >
            Building software, writing about the web, and sharing what I learn.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-[#AAA59E]"
          >
            A collection of essays, notes, and projects spanning performance,
            design systems, and developer experience.
          </motion.p>
        </div>
      </header>

      {/* Writing */}
      <section id="writing" className="px-6 md:px-12 py-24 scroll-mt-24 border-t border-white/5">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">Writing</h2>
          <span className="font-mono text-xs text-[#AAA59E]">(2023 — 25)</span>
        </div>
        <ul className="divide-y divide-white/5">
          {[
            { title: "On the speed of light and the speed of software", date: "Mar 2025", read: "8 min" },
            { title: "Designing for the long tail of devices", date: "Jan 2025", read: "12 min" },
            { title: "Notes on building a component registry", date: "Nov 2024", read: "6 min" },
            { title: "The quiet craft of good defaults", date: "Sep 2024", read: "10 min" },
          ].map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group py-6 flex items-baseline justify-between gap-6 cursor-pointer"
            >
              <span className="text-xl font-medium group-hover:text-[#AAA59E] transition-colors">{p.title}</span>
              <span className="shrink-0 font-mono text-xs text-[#AAA59E]">{p.date} · {p.read}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Work */}
      <section id="work" className="px-6 md:px-12 py-24 scroll-mt-24 border-t border-white/5">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">Selected Work</h2>
          <span className="font-mono text-xs text-[#AAA59E]">(03)</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Vercel", role: "Software Engineer", year: "2021 —" },
            { name: "Hyyper", role: "Founder", year: "2019 — 21" },
            { name: "Freelance", role: "Designer / Dev", year: "2016 — 19" },
          ].map((w, i) => (
            <motion.div
              key={w.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/5 bg-[#22211F] p-6 hover:border-white/15 transition-colors"
            >
              <div className="font-mono text-xs text-[#AAA59E] mb-6">{w.year}</div>
              <div className="text-2xl font-semibold mb-1">{w.name}</div>
              <div className="text-sm text-[#AAA59E]">{w.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 md:px-12 py-24 scroll-mt-24 border-t border-white/5">
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <span className="font-mono text-xs text-[#AAA59E] uppercase tracking-widest">About</span>
          </div>
          <div className="md:col-span-8 max-w-2xl">
            <p className="text-2xl md:text-3xl font-medium leading-tight tracking-tight">
              I care about the details: performance budgets, accessible defaults,
              and interfaces that feel inevitable rather than impressive.
            </p>
            <p className="mt-6 text-base leading-relaxed text-[#AAA59E]">
              Previously at Vercel. Now building tools for developers and writing
              about the craft of shipping software on the modern web.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-16 border-t border-white/5 text-sm text-[#AAA59E] flex flex-col md:flex-row justify-between gap-4">
        <span>© {new Date().getFullYear()} Lee R. Built with Buildora.</span>
        <div className="flex gap-6">
          <a href="https://twitter.com" className="hover:text-[#E8E5DF] transition-colors">Twitter</a>
          <a href="https://github.com" className="hover:text-[#E8E5DF] transition-colors">GitHub</a>
          <a href="mailto:hello@example.com" className="hover:text-[#E8E5DF] transition-colors">Email</a>
        </div>
      </footer>
    </div>
  );
}
