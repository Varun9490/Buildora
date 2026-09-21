"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MagneticButton } from "@buildora/components";
import Link from "next/link";

export default function CreativePortfolioTemplate() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#F5F5F3]">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference text-white">
         <Link href="/" className="font-display font-black text-xl tracking-tighter">B—STUDIO</Link>
         <ul className="flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
            <li><a href="#work" className="hover:opacity-50 transition-opacity">Work</a></li>
            <li><a href="#about" className="hover:opacity-50 transition-opacity">About</a></li>
            <li><a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a></li>
         </ul>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col justify-end p-6 md:p-12 overflow-hidden">
        
        {/* Parallax Image Background */}
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0 bg-[#E8E8E6]"
        >
           {/* Placeholder for hero image/video */}
           <div className="w-full h-full opacity-30 mix-blend-multiply bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        </motion.div>

        <div className="relative z-10 grid md:grid-cols-12 gap-6 items-end pb-12">
          <div className="md:col-span-8">
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[12vw] leading-[0.85] font-black tracking-tighter uppercase"
            >
              Shaping<br/>Digital<br/>Matter.
            </motion.h1>
          </div>
          <div className="md:col-span-4 md:pb-4">
             <motion.p 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2, duration: 1 }}
               className="text-sm max-w-[280px] leading-relaxed opacity-70"
             >
               We are an independent design practice focusing on brand identity, digital experiences, and high-end aesthetics.
             </motion.p>
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="mt-8"
             >
                <MagneticButton className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold">
                  View Cases
                </MagneticButton>
             </motion.div>
          </div>
        </div>
      </header>

      {/* Work Grid */}
      <section id="work" className="py-32 px-6 md:px-12 bg-[#F5F5F3] relative z-20">
         <div className="flex justify-between items-end mb-16 border-b border-black/10 pb-6">
            <h2 className="font-display text-4xl font-bold tracking-tight">Selected Projects</h2>
            <span className="font-mono text-xs opacity-50">(24 — 26)</span>
         </div>

         <div className="grid md:grid-cols-2 gap-x-6 gap-y-24">
            {/* Project 1 */}
            <div className="group cursor-pointer">
               <div className="aspect-[4/5] bg-[#E8E8E6] rounded-sm overflow-hidden mb-6 relative">
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                 <img src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1200&auto=format&fit=crop" alt="Project" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
               </div>
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-xl font-bold">Aura Mobility</h3>
                    <p className="text-sm opacity-60 mt-1">Brand Identity, Web Design</p>
                  </div>
                  <span className="font-mono text-xs opacity-40 group-hover:opacity-100 transition-opacity">01</span>
               </div>
            </div>

            {/* Project 2 - Offset */}
            <div className="group cursor-pointer md:mt-32">
               <div className="aspect-[4/5] bg-[#E8E8E6] rounded-sm overflow-hidden mb-6 relative">
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                 <img src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop" alt="Project" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
               </div>
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-xl font-bold">NEXUS Financial</h3>
                    <p className="text-sm opacity-60 mt-1">Product Design, System</p>
                  </div>
                  <span className="font-mono text-xs opacity-40 group-hover:opacity-100 transition-opacity">02</span>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-32 px-6 md:px-12 rounded-t-[3rem] relative z-20">
         <div className="grid md:grid-cols-2 gap-12">
            <div>
               <h2 className="font-display text-[8vw] leading-none font-black uppercase tracking-tighter mb-8">Let's Talk.</h2>
               <MagneticButton className="bg-[var(--b-accent)] text-[var(--b-accent-foreground)] px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold">
                  hello@bstudio.com
               </MagneticButton>
            </div>
            <div className="flex md:justify-end items-end">
               <ul className="space-y-4 text-sm opacity-60">
                  <li><a href="#" className="hover:opacity-100 transition-opacity">Instagram</a></li>
                  <li><a href="#" className="hover:opacity-100 transition-opacity">Twitter</a></li>
                  <li><a href="#" className="hover:opacity-100 transition-opacity">LinkedIn</a></li>
                  <li className="pt-8 opacity-50 font-mono text-xs">© {new Date().getFullYear()} B—Studio. Built with Buildora.</li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
}
