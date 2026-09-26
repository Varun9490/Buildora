"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Book, ChevronRight, FileText, ShieldCheck, History } from "lucide-react";
import { RichTextEditor, VersionHistory } from "@buildora/components";

export default function InteractiveDocsTemplate() {
  type DocId = "iso27001" | "soc2" | "gdpr";

  const docs: Record<DocId, { nav: string; breadcrumb: string; title: string; version: string; lead: string; content: string }> = {
    iso27001: {
      nav: "ISO 27001",
      breadcrumb: "ISO 27001",
      title: "Information Security",
      version: "v4.2",
      lead: "This document outlines the standard operating procedures and required controls to maintain ISO 27001 certification compliance across all organizational units.",
      content: `<h2>1. Access Control Policy</h2>
<p>All systems must enforce principle of least privilege. Access rights must be reviewed quarterly. Authentication requires multi-factor authentication (MFA) for all external facing systems.</p>
<br>
<h2>2. Data Encryption</h2>
<p>Data at rest must be encrypted using AES-256 or better. Data in transit must utilize TLS 1.3. Cryptographic keys must be rotated every 90 days.</p>
`,
    },
    soc2: {
      nav: "SOC 2 Type II",
      breadcrumb: "SOC 2 Type II",
      title: "Trust Services Criteria",
      version: "v3.8",
      lead: "Operating procedures and control activities mapped to the SOC 2 Trust Services Criteria for security, availability, and confidentiality.",
      content: `<h2>1. Security Controls</h2>
<p>Logical access is restricted to authorized users. Change management requires peer review and automated testing before production deployment.</p>
<br>
<h2>2. Availability Monitoring</h2>
<p>Uptime is monitored continuously with a 99.9% monthly target. Incidents trigger automated paging with defined escalation paths.</p>
`,
    },
    gdpr: {
      nav: "GDPR Guidelines",
      breadcrumb: "GDPR Guidelines",
      title: "Data Protection Guide",
      version: "v2.5",
      lead: "Internal guidelines for lawful processing, data subject rights, and cross-border transfers under the General Data Protection Regulation.",
      content: `<h2>1. Lawful Basis</h2>
<p>Every processing activity must record a lawful basis. Consent records include timestamp, purpose, and withdrawal mechanism.</p>
<br>
<h2>2. Subject Rights</h2>
<p>Access, rectification, and erasure requests are fulfilled within 30 days. A dedicated register tracks each request lifecycle.</p>
`,
    },
  };

  const [activeDoc, setActiveDoc] = React.useState<DocId>("iso27001");
  const doc = docs[activeDoc];

  const docItems: { id: DocId; icon: "shield" | "file" }[] = [
    { id: "iso27001", icon: "shield" },
    { id: "soc2", icon: "file" },
    { id: "gdpr", icon: "file" },
  ];

  const versions = [
    { id: "v4.2", label: "Annual Review - ISO 27001", at: "Today 10:42 AM", author: "S. Chan", current: true },
    { id: "v4.1", label: "Key Rotation Update", at: "Mar 12, 2026", author: "J. Doe" },
    { id: "v4.0", label: "Major Information Security Overhaul", at: "Jan 01, 2026", author: "Admin" },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] text-[#111827] font-sans selection:bg-[#002D56] selection:text-white flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-[#E5E0D8] bg-[#FDFBF7]">
        <div className="flex items-center gap-2 text-[#002D56] font-bold">
          <Book className="w-5 h-5" /> DocuFlow
        </div>
        <Link href="/templates" className="text-xs uppercase tracking-widest text-zinc-500 hover:text-[#002D56] transition-colors">
          Return
        </Link>
      </header>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 border-r border-[#E5E0D8] bg-[#F9F7F1] flex-col hidden md:flex h-[100dvh] sticky top-0">
        <div className="p-6 border-b border-[#E5E0D8]">
          <Link href="/templates" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-[#002D56] mb-8 w-fit transition-colors">
            <ArrowLeft className="w-3 h-3" /> Templates
          </Link>
          <div className="flex items-center gap-2 text-[#002D56] font-display font-black text-xl">
            <Book className="w-5 h-5" /> DocuFlow
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h4 className="font-serif text-[11px] text-zinc-500 uppercase tracking-widest mb-3 px-2">Compliance Standards</h4>
            <div className="space-y-1 text-sm" role="tablist" aria-label="Compliance documents">
              {docItems.map(({ id, icon }) => {
                const isActive = activeDoc === id;
                const Icon = icon === "shield" ? ShieldCheck : FileText;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveDoc(id)}
                    className={`flex w-full items-center justify-between px-2 py-1.5 rounded-md transition-colors ${isActive ? "bg-[#002D56] text-white" : "text-zinc-600 hover:text-[#002D56] hover:bg-zinc-200/50"}`}
                  >
                    <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {docs[id].nav}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden">
        
        {/* Document Header */}
        <header className="border-b border-[#E5E0D8] p-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#FDFBF7] shrink-0">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 uppercase tracking-widest mb-4 font-serif">
              Compliance Standards <ChevronRight className="w-3 h-3" /> {doc.breadcrumb}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-[#002D56]">{doc.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="px-3 py-1 bg-[#F0ECE1] text-[#002D56] rounded-full text-xs">{doc.version}</span>
            <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#B8860B] border border-[#D4AF37]/30 rounded-full text-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="max-w-[65ch] mx-auto xl:mx-0 xl:max-w-none xl:grid xl:grid-cols-12 xl:gap-12">
            
            {/* Main Article with RichTextEditor */}
            <article className="xl:col-span-8 flex flex-col h-full min-h-[500px]">
              <p className="lead text-xl text-zinc-600 leading-relaxed mb-8">
                {doc.lead}
              </p>
              
              <div className="flex-1 overflow-hidden rounded-2xl border-2 border-[#E5E0D8] bg-white shadow-sm">
                <RichTextEditor 
                  key={activeDoc}
                  initial={doc.content} 
                  className="h-full border-none bg-transparent"
                />
              </div>

              {/* Mobile / tablet version history fallback (rail is xl-only) */}
              <div className="mt-8 rounded-2xl border-2 border-[#E5E0D8] bg-white shadow-sm p-6 xl:hidden">
                <h3 className="font-serif text-[#002D56] text-lg mb-6 flex items-center gap-2">
                  <History className="w-5 h-5" /> Version History
                </h3>
                <VersionHistory 
                  versions={versions} 
                  className="[&_li]:bg-white [&_li]:border-[#E5E0D8] [&_button]:bg-[#F9F7F1] [&_button]:text-[#002D56]"
                />
              </div>
            </article>

            {/* Right Sidebar - Version History */}
            <aside className="hidden xl:block xl:col-span-4 space-y-8">
              <div className="p-6 rounded-2xl border-2 border-[#E5E0D8] bg-white shadow-sm">
                <h3 className="font-serif text-[#002D56] text-lg mb-6 flex items-center gap-2">
                  <History className="w-5 h-5" /> Version History
                </h3>
                
                <VersionHistory 
                  versions={versions} 
                  className="[&_li]:bg-white [&_li]:border-[#E5E0D8] [&_button]:bg-[#F9F7F1] [&_button]:text-[#002D56]"
                />
              </div>
            </aside>
            
          </div>
        </div>

      </main>
    </div>
  );
}
