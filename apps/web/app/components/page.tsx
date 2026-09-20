"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { allComponents, searchComponents } from "@/lib/registry";
import { cn } from "@buildora/utils";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ComponentsPage() {
  const [query, setQuery] = React.useState("");

  const results = React.useMemo(
    () =>
      searchComponents(allComponents, {
        query,
        category: "all",
        framework: "all",
        tag: "all",
        difficulty: "all",
        status: "all",
        sort: "featured",
      }),
    [query]
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans selection:bg-[#d4ff4f]/30">
      
      {/* Massive Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 border-b border-white/5">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,255,79,0.05)_0%,transparent_70%)]" />
         <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-7xl font-black tracking-tighter text-white"
            >
              The Component <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4ff4f] to-[#a8cc3f]">Registry</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-6 max-w-2xl text-lg text-white/40 leading-relaxed font-light"
            >
              Premium, production-ready React components. Copy, paste, and ship your next idea faster. Everything is open source.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 mx-auto max-w-md relative"
            >
               <input
                 type="text"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder="Search components..."
                 className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#d4ff4f]/50 focus:border-[#d4ff4f] transition-all"
               />
               <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
               </svg>
            </motion.div>
         </div>
      </section>

      {/* Components Grid */}
      <section className="mx-auto max-w-[1400px] px-6 py-24">
         <div className="mb-12 flex items-center justify-between border-b border-white/5 pb-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-white/30">
              {results.length} Components Available
            </h2>
         </div>

         <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
         >
            {results.map((c) => (
              <motion.div key={c.slug} variants={fadeUp}>
                <Link
                  href={`/components/${c.slug}`}
                  className="group flex flex-col h-full rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-white/10 transition-colors duration-500 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex h-40 items-center justify-center border-b border-white/5 bg-[#0a0a0a] relative overflow-hidden">
                     {/* Decorative background element for the card hero */}
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                     <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 group-hover:text-[#d4ff4f]/60 transition-colors duration-500">
                       {c.categories[0]}
                     </h3>
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative z-10">
                    <div className="flex items-center justify-between mb-2">
                       <h2 className="font-display text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#d4ff4f]">
                         {c.name}
                       </h2>
                       <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[9px] text-white/40">
                         v{c.version}
                       </span>
                    </div>
                    
                    <p className="line-clamp-2 text-sm leading-relaxed text-white/40 group-hover:text-white/60 transition-colors flex-1">
                      {c.description}
                    </p>
                    
                    <div className="mt-6 flex flex-wrap gap-2">
                       {c.tags.slice(0, 3).map(tag => (
                         <span key={tag} className="rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] text-white/30 transition-colors group-hover:border-white/10 group-hover:text-white/50">
                           {tag}
                         </span>
                       ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
         </motion.div>

         {results.length === 0 && (
           <div className="py-32 text-center">
             <p className="font-mono text-sm text-white/30 uppercase tracking-widest">No components found</p>
           </div>
         )}
      </section>
    </div>
  );
}
