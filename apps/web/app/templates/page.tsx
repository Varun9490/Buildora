import Link from "next/link";

const templates = [
  { slug: "dev-dashboard", name: "Developer Dashboard", uses: ["advanced-table", "terminal", "log-viewer", "usage-dashboard"], blurb: "Tables + terminal + logs for internal tools." },
  { slug: "ai-support", name: "AI Support Console", uses: ["streaming-chat", "tool-call-viz", "token-meter", "comment-thread"], blurb: "Streaming chat with tool transparency." },
  { slug: "onboarding", name: "Team Onboarding", uses: ["onboarding-checklist", "team-switcher", "invite-flow", "pricing-table"], blurb: "Invite, switch teams, track setup." },
  { slug: "creative-landing", name: "Creative Landing", uses: ["aurora-background", "morphing-typography", "magnetic-button", "particle-field"], blurb: "Aurora + motion + magnetic CTAs." }
];

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-black">Templates</h1>
      <p className="mt-1 text-sm text-white/55">Composable starters built from registry components. Copy the pattern, remix freely (MIT).</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {templates.map((t) => (
          <div key={t.slug} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h2 className="font-display text-xl font-black">{t.name}</h2>
            <p className="mt-1 text-sm text-white/55">{t.blurb}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">{t.uses.map((u) => <Link key={u} href={`/components/${u}`} className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/60 hover:text-[#d4ff4f]">{u}</Link>)}</div>
            <p className="mt-3 font-mono text-xs text-white/40">pnpm dlx shadcn@latest add {t.uses.slice(0, 2).map((u) => `@buildora/${u}`).join(" ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
