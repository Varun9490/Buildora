"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BentoGrid, BentoItem, InfiniteMarquee, CursorFx, MagneticButton } from "@buildora/components";
import { motion } from "motion/react";

export default function SpatialPortfolioTemplate() {
  return (
    <div className="min-h-[100dvh] bg-[#F4F4F2] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#F4F4F2]">
      <CursorFx />

      {/* Navigation */}
      <nav className="fixed top-0 w-full p-8 md:p-12 z-50 flex items-center justify-between mix-blend-difference text-white">
        <Link href="/templates" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Index
        </Link>
        <span className="text-xs uppercase tracking-[0.2em] font-medium">B. STUDIO</span>
        <button className="text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">Menu</button>
      </nav>

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
            <MagneticButton className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-black transition-colors">
              Start a project
            </MagneticButton>
          </div>
        </motion.div>
      </section>

      {/* Marquee Divider */}
      <div className="py-12 border-y border-[#1A1A1A]/10 bg-white/50 backdrop-blur-sm">
        <InfiniteMarquee speed={20} className="text-[#1A1A1A]/30">
          <span className="text-4xl md:text-6xl font-medium tracking-tight px-8">INTERACTION</span>
          <span className="text-4xl md:text-6xl font-medium tracking-tight px-8 italic font-serif">MOTION</span>
          <span className="text-4xl md:text-6xl font-medium tracking-tight px-8">TYPOGRAPHY</span>
          <span className="text-4xl md:text-6xl font-medium tracking-tight px-8 italic font-serif">SPATIAL</span>
        </InfiniteMarquee>
      </div>

      {/* Selected Works - Bento Grid */}
      <section className="p-8 md:p-12 lg:p-24 bg-white">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-2xl md:text-4xl font-medium tracking-tight">Selected Works</h2>
          <span className="text-sm text-[#888] font-mono">( 2024 - 2026 )</span>
        </div>

        <BentoGrid columns={4} gap={24} className="md:auto-rows-[400px]">
          
          <BentoItem 
            colSpan={4} 
            rowSpan={1} 
            className="md:col-span-3 bg-[#F4F4F2] border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between group overflow-hidden relative"
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
            colSpan={4} 
            rowSpan={1} 
            className="md:col-span-1 bg-[#1A1A1A] text-white border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] flex flex-col justify-between"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#888]">Approach</p>
            <p className="text-xl font-light leading-relaxed">
              We believe in removing friction through obsessive attention to invisible details.
            </p>
          </BentoItem>

          <BentoItem 
            colSpan={4} 
            rowSpan={1} 
            className="md:col-span-2 bg-[#FAF9F6] border border-[#EAEAEA] shadow-sm flex items-center justify-center p-0 overflow-hidden"
          >
            {/* Minimal abstract visual */}
            <div className="w-full h-full bg-gradient-to-br from-[#EAEAEA] to-[#FAF9F6] flex items-center justify-center">
               <div className="w-32 h-32 rounded-full border border-[#CCC] shadow-inner flex items-center justify-center">
                 <div className="w-16 h-16 rounded-full bg-white shadow-xl" />
               </div>
            </div>
          </BentoItem>

          <BentoItem 
            colSpan={4} 
            rowSpan={1} 
            className="md:col-span-2 bg-[#F4F4F2] border-none shadow-sm flex flex-col justify-end group hover:bg-[#EAEAEA] transition-colors duration-500"
          >
            <h3 className="text-2xl font-medium mb-1">Slingshot Protocol</h3>
            <p className="text-[#555]">Identity & Authentication</p>
          </BentoItem>

        </BentoGrid>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-12 lg:px-24 py-16 bg-[#1A1A1A] text-[#888] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="text-white text-2xl font-serif italic">B.</div>
        <div className="flex gap-8 text-sm uppercase tracking-[0.1em]">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Dribbble</a>
          <a href="#" className="hover:text-white transition-colors">Email</a>
        </div>
      </footer>
    </div>
  );
}
