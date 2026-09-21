"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, X } from "lucide-react";
import { BentoGrid, BentoItem, InfiniteMarquee, CursorFx, MagneticButton } from "@buildora/components";
import { motion, AnimatePresence } from "motion/react";

const disciplines = ["INTERACTION", "MOTION", "TYPOGRAPHY", "SPATIAL"];

const services = [
  { index: "01", title: "Spatial Interfaces", body: "VisionOS, WebXR and depth-first layouts that feel physical." },
  { index: "02", title: "Design Engineering", body: "Motion-first React systems built on tokens, not one-offs." },
  { index: "03", title: "Identity & Type", body: "Editorial typography and brand systems with a technical edge." },
  { index: "04", title: "Prototyping", body: "Clickable, shippable prototypes in days — not slide decks." },
];

const menuLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
];

export default function SpatialPortfolioTemplate() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const scrollTo = React.useCallback((id: string) => {
    setMenuOpen(false);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="min-h-[100dvh] bg-[#F4F4F2] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#F4F4F2]">
      <CursorFx />

      {/* Navigation */}
      <nav className="fixed top-0 w-full p-8 md:p-12 z-50 flex items-center justify-between mix-blend-difference text-white">
        <Link href="/templates" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Index
        </Link>
        <span className="text-xs uppercase tracking-[0.2em] font-medium">B. STUDIO</span>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity inline-flex items-center gap-2"
        >
          {menuOpen ? <X className="w-4 h-4" /> : null}
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#1A1A1A] text-[#F4F4F2] flex flex-col justify-end p-8 md:p-12 lg:p-24"
          >
            <nav aria-label="Template sections">
              <ul className="space-y-2">
                {menuLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      onClick={() => scrollTo(link.href.slice(1))}
                      className="group inline-flex items-baseline gap-4 text-left"
                    >
                      <span className="font-mono text-xs text-white/40">0{i + 1}</span>
                      <span className="text-5xl md:text-7xl font-medium tracking-tight group-hover:italic group-hover:font-serif group-hover:font-light transition-all">
                        {link.label}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <p className="mt-12 text-sm text-white/40 font-mono">hello@bstudio.example — replies within 48h</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-end p-8 md:p-12 lg:p-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl"
        >
          <h1 className="text-6xl md:text-8xl lg:text-[11vw] font-medium tracking-tight leading-[0.85] mb-12 text-[#1A1A1A]">
            Designing the <br /> <span className="italic font-serif font-light text-[#555]">invisible.</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <p className="text-lg md:text-xl text-[#555] max-w-md leading-relaxed font-light">
              An independent digital design practice focused on highly technical tools and spatial interfaces.
            </p>
            <MagneticButton
              onClick={() => scrollTo("contact")}
              className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-black transition-colors"
            >
              Start a project
            </MagneticButton>
          </div>
        </motion.div>
      </section>

      {/* Marquee Divider */}
      <div className="py-12 border-y border-[#1A1A1A]/10 bg-white/50 backdrop-blur-sm overflow-hidden">
        <InfiniteMarquee speed="normal" gap={16} className="text-[#1A1A1A]/30">
          {disciplines.map((word, i) => (
            <span
              key={word}
              className={`text-4xl md:text-6xl font-medium tracking-tight px-8 whitespace-nowrap ${i % 2 === 1 ? "italic font-serif" : ""}`}
            >
              {word}
            </span>
          ))}
        </InfiniteMarquee>
      </div>

      {/* Selected Works - Bento Grid */}
      <section id="work" className="p-8 md:p-12 lg:p-24 bg-white scroll-mt-24">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-2xl md:text-4xl font-medium tracking-tight">Selected Works</h2>
          <span className="text-sm text-[#888] font-mono">( 2024 - 2026 )</span>
        </div>

        <BentoGrid columns={4} gap={24} className="md:auto-rows-[minmax(320px,auto)]">
          <BentoItem
            colSpan={3}
            rowSpan={1}
            className="bg-[#F4F4F2] border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between group overflow-hidden relative min-h-[320px]"
          >
            <div className="relative z-10 p-4">
              <span className="inline-block px-3 py-1 rounded-full border border-[#1A1A1A]/10 text-xs font-medium uppercase tracking-widest bg-white/50 backdrop-blur-md">Featured</span>
            </div>
            <div className="relative z-10 p-4">
              <h3 className="text-3xl font-medium mb-2">Buildora Ecosystem</h3>
              <p className="text-[#555] max-w-sm">A comprehensive toolkit for spatial and motion-first web experiences.</p>
            </div>
            <div className="absolute right-8 top-8 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-500">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <ArrowUpRight className="w-6 h-6 text-[#1A1A1A]" />
              </div>
            </div>
          </BentoItem>

          <BentoItem
            colSpan={1}
            rowSpan={1}
            className="bg-[#1A1A1A] text-white border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] flex flex-col justify-between min-h-[320px]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#888]">Approach</p>
            <p className="text-xl font-light leading-relaxed">
              We believe in removing friction through obsessive attention to invisible details.
            </p>
          </BentoItem>

          <BentoItem
            colSpan={2}
            rowSpan={1}
            className="bg-[#FAF9F6] border border-[#EAEAEA] shadow-sm flex items-center justify-center p-0 overflow-hidden min-h-[320px]"
          >
            <div className="w-full h-full bg-gradient-to-br from-[#EAEAEA] to-[#FAF9F6] flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-[#CCC] shadow-inner flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white shadow-xl" />
              </div>
            </div>
          </BentoItem>

          <BentoItem
            colSpan={2}
            rowSpan={1}
            className="bg-[#F4F4F2] border-none shadow-sm flex flex-col justify-end group hover:bg-[#EAEAEA] transition-colors duration-500 min-h-[320px]"
          >
            <h3 className="text-2xl font-medium mb-1">Slingshot Protocol</h3>
            <p className="text-[#555]">Identity &amp; Authentication</p>
          </BentoItem>
        </BentoGrid>
      </section>

      {/* Services */}
      <section id="services" className="p-8 md:p-12 lg:p-24 bg-[#F4F4F2] scroll-mt-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-4xl font-medium tracking-tight">Capabilities</h2>
          <span className="text-sm text-[#888] font-mono">( 04 )</span>
        </div>
        <ul className="divide-y divide-[#1A1A1A]/10 border-y border-[#1A1A1A]/10">
          {services.map((service) => (
            <li key={service.index} className="group py-8 grid md:grid-cols-12 gap-4 items-baseline hover:bg-white/60 transition-colors px-2 md:px-4 -mx-2 md:-mx-4">
              <span className="font-mono text-xs text-[#888] md:col-span-1">{service.index}</span>
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight md:col-span-5 group-hover:translate-x-2 transition-transform duration-300">
                {service.title}
              </h3>
              <p className="text-[#555] font-light leading-relaxed md:col-span-6">{service.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Studio / stats */}
      <section id="studio" className="px-8 md:px-12 lg:px-24 py-16 bg-[#1A1A1A] text-white scroll-mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "48+", label: "Projects shipped" },
            { value: "12", label: "Design awards" },
            { value: "09", label: "Years practicing" },
            { value: "04", label: "Time zones covered" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl md:text-5xl font-medium tracking-tight">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / contact */}
      <footer id="contact" className="px-8 md:px-12 lg:px-24 py-16 bg-[#1A1A1A] text-[#888] border-t border-white/10 scroll-mt-24">
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-white text-4xl md:text-6xl font-medium tracking-tight">Let&apos;s build the invisible.</h2>
            <div className="mt-8">
              <MagneticButton
                onClick={() => {
                  window.location.href = "mailto:hello@bstudio.example?subject=Project%20inquiry";
                }}
                className="bg-[#F4F4F2] text-[#1A1A1A] px-8 py-4 rounded-full text-sm font-medium hover:bg-white transition-colors"
              >
                hello@bstudio.example
              </MagneticButton>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pt-8 border-t border-white/10">
            <div className="text-white text-2xl font-serif italic">B.</div>
            <div className="flex gap-8 text-sm uppercase tracking-[0.1em]">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter</a>
              <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Dribbble</a>
              <a href="mailto:hello@bstudio.example" className="hover:text-white transition-colors">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
