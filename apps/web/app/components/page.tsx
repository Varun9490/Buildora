"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { allComponents, searchComponents } from "@/lib/registry";
import { useBuildora } from "@/lib/store";
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
        sort: "popular",
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl font-black tracking-tighter md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
            >
              Crafted Components
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-6 max-w-2xl text-lg text-white/40 md:text-xl"
            >
              A curated library of premium, animated, and highly functional React components designed for modern web applications.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-10 max-w-md relative"
            >
               <input
                 type="text"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder="Search components..."
                 className="w-full rounded-2xl border border-white/10 bg-white/[0.02] py-4 pl-12 pr-6 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-[#d4ff4f]/50 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(212,255,79,0.1)]"
               />
               <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
               </svg>
            </motion.div>
         </div>
      </section>

      {/* Component Grid */}
      <section className="mx-auto max-w-7xl px-6 py-20">
         <motion.div
           variants={staggerContainer}
           initial="hidden"
           animate="visible"
           className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
         >
            {results.map((c) => (
              <motion.div key={c.slug} variants={fadeUp}>
                <Link
                  href={`/components/${c.slug}`}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] transition-all duration-500 hover:border-[#d4ff4f]/20 hover:bg-white/[0.03] hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  <div className="flex h-40 items-center justify-center border-b border-white/5 bg-[#0a0a0a] relative overflow-hidden">
                     {/* Decorative background element for the card hero */}
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                     <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 group-hover:text-[#d4ff4f]/60 transition-colors duration-500">
                       {c.categories[0]}
                     </h3>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                       <h2 className="font-display text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#d4ff4f]">
                         {c.name}
                       </h2>
                       <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[9px] text-white/40">
                         v{c.version}
                       </span>
                    </div>
                    
                    <p className="line-clamp-2 text-sm leading-relaxed text-white/40 group-hover:text-white/60 transition-colors">
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
