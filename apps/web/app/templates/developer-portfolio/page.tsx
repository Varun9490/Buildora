"use client";

import * as React from "react";
import { motion } from "motion/react";
import { MagneticButton } from "@buildora/components";
import Link from "next/link";

/**
 * Developer Portfolio - reverse-engineered from brittanychiang.com
 * Theme: slate-900 surface, slate-400 body text, slate-200 headings,
 * amber/yellow-500 accent CTA, Inter sans-serif.
 * Motion: fade-up hero, restrained scroll reveals, magnetic CTAs.
 */
export default function DeveloperPortfolioTemplate() {
  const scrollTo = React.useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const projects = [
    { num: "01", name: "Aura Mobility", desc: "Brand identity & web platform for an EV startup.", stack: "Next.js, Tailwind, Framer Motion", year: "2025" },
    { num: "02", name: "NEXUS Financial", desc: "Design system & dashboard for a fintech platform.", stack: "React, Radix, Storybook", year: "2024" },
    { num: "03", name: "Helix Notes", desc: "Offline-first markdown editor with sync.", stack: "Tauri, Rust, React", year: "2024" },
    { num: "04", name: "Signal CLI", desc: "Developer tooling for API observability.", stack: "Node, Ink, TypeScript", year: "2023" },
  ];

  const experience = [
    { period: "2023 - Present", role: "Senior Frontend Engineer", org: "Vercel" },
    { period: "2021 - 2023", role: "Frontend Engineer", org: "Linear" },
    { period: "2019 - 2021", role: "UI Engineer", org: "Freelance" },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#94A3B8] selection:bg-[#EAB308] selection:text-[#0F172A] font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center bg-[#0F172A]/80 backdrop-blur-md">
        <Link href="/" className="font-semibold text-lg tracking-tight text-[#E2E8F0]">BC.</Link>
        <ul className="hidden md:flex gap-8 text-sm">
          <li><a href="#about" className="hover:text-[#EAB308] transition-colors">About</a></li>
          <li><a href="#experience" className="hover:text-[#EAB308] transition-colors">Experience</a></li>
          <li><a href="#work" className="hover:text-[#EAB308] transition-colors">Work</a></li>
          <li><a href="#contact" className="hover:text-[#EAB308] transition-colors">Contact</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <header className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-16 overflow-hidden">
        <div aria-hidden className="absolute inset-0 z-0 opacity-50 bg-[radial-gradient(ellipse_at_top_left,#1E293B_0%,#0F172A_70%)]" />
        <div className="relative z-10 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-mono uppercase tracking-[0.2em] text-[#EAB308] mb-6"
          >
            Frontend Engineer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] font-bold tracking-tight text-[#E2E8F0]"
          >
            I build accessible, fast interfaces for the modern web.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl text-lg leading-relaxed"
          >
            Currently crafting design systems and developer tools. Previously at
            Vercel and Linear. I care about performance budgets, keyboard
            navigation, and interfaces that feel inevitable.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <MagneticButton
              onClick={() => scrollTo("work")}
              variant="accent"
              className="bg-[#EAB308] text-[#0F172A] px-6 py-3 rounded-[8px] text-sm font-semibold"
            >
              View work
            </MagneticButton>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#334155] px-6 py-3 text-sm font-semibold text-[#E2E8F0] hover:border-[#EAB308] hover:text-[#EAB308] transition-colors"
            >
              Get in touch
            </a>
          </motion.div>
        </div>
      </header>

      {/* About */}
      <section id="about" className="px-6 md:px-12 py-24 scroll-mt-24 border-t border-[#1E293B]">
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#EAB308]">About</span>
          </div>
          <div className="md:col-span-8 max-w-2xl">
            <p className="text-2xl md:text-3xl font-medium leading-tight tracking-tight text-[#E2E8F0]">
              I focus on the intersection of design and engineering: tokens,
              accessibility, and motion that respects the user.
            </p>
            <p className="mt-6 text-base leading-relaxed">
              I build component libraries, design systems, and product interfaces
              with React, TypeScript, and Tailwind. I believe good defaults beat
              clever configuration, and that performance is a feature.
            </p>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="px-6 md:px-12 py-24 scroll-mt-24 border-t border-[#1E293B]">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#E2E8F0]">Experience</h2>
          <span className="font-mono text-xs text-[#64748B]">(2019 - 25)</span>
        </div>
        <ul className="divide-y divide-[#1E293B]">
          {experience.map((e, i) => (
            <motion.li
              key={e.org}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group py-6 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 cursor-default"
            >
              <div>
                <span className="text-xl font-semibold text-[#E2E8F0] group-hover:text-[#EAB308] transition-colors">{e.role}</span>
                <span className="ml-3 text-sm text-[#64748B]">{e.org}</span>
              </div>
              <span className="shrink-0 font-mono text-xs text-[#64748B]">{e.period}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Work */}
      <section id="work" className="px-6 md:px-12 py-24 scroll-mt-24 border-t border-[#1E293B]">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#E2E8F0]">Selected Work</h2>
          <span className="font-mono text-xs text-[#64748B]">(04)</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-[#1E293B] bg-[#111827] p-6 hover:border-[#EAB308]/40 transition-colors cursor-pointer"
            >
              <div className="flex items-baseline justify-between mb-4">
                <span className="font-mono text-xs text-[#64748B]">{p.num}</span>
                <span className="font-mono text-xs text-[#64748B]">{p.year}</span>
              </div>
              <h3 className="text-xl font-semibold text-[#E2E8F0] group-hover:text-[#EAB308] transition-colors mb-2">{p.name}</h3>
              <p className="text-sm leading-relaxed mb-4">{p.desc}</p>
              <p className="font-mono text-xs text-[#64748B]">{p.stack}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 md:px-12 py-24 scroll-mt-24 border-t border-[#1E293B]">
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#EAB308]">Contact</span>
          </div>
          <div className="md:col-span-8 max-w-2xl">
            <p className="text-2xl md:text-3xl font-medium leading-tight tracking-tight text-[#E2E8F0]">
              Have a project in mind or just want to say hi? My inbox is open.
            </p>
            <div className="mt-8">
              <MagneticButton
                onClick={() => { window.location.href = "mailto:hello@example.com"; }}
                variant="accent"
                className="bg-[#EAB308] text-[#0F172A] px-6 py-3 rounded-[8px] text-sm font-semibold"
              >
                Say hello
              </MagneticButton>
            </div>
            <div className="mt-10 flex gap-6 text-sm">
              <a href="https://github.com" className="hover:text-[#EAB308] transition-colors">GitHub</a>
              <a href="https://twitter.com" className="hover:text-[#EAB308] transition-colors">Twitter</a>
              <a href="https://linkedin.com" className="hover:text-[#EAB308] transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-12 border-t border-[#1E293B] text-sm text-[#64748B] flex flex-col md:flex-row justify-between gap-4">
        <span>(c) {new Date().getFullYear()} Brittany C. Built with Buildora.</span>
        <span className="font-mono text-xs">Designed &amp; built with care.</span>
      </footer>
    </div>
  );
}
