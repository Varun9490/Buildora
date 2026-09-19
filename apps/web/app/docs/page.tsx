import Link from "next/link";

const docs = [
  { slug: "overview", title: "Overview", body: "Buildora is a registry-driven creative component ecosystem. One definition powers website, docs, playground, search, and install." },
  { slug: "installation", title: "Installation", body: "pnpm dlx shadcn@latest add @buildora/{component}. No custom domain required — GitHub-hosted registry + /r/{component}.json endpoint." },
  { slug: "usage", title: "Usage", body: "Import from @buildora/{component}. Tune props in the playground, copy the framework tab, keep semantic behavior intact." },
  { slug: "props-api", title: "Props API", body: "Clean, minimal props: strength, radius, intensity, spring, glow, scale. Every prop is documented on its component page with live controls." },
  { slug: "frameworks", title: "Framework implementations", body: "React is Full. JS/HTML/Tailwind are Full. Vue/Svelte/Angular are Partial ports. Native targets document hover/cursor alternatives or mark Unsupported honestly." },
  { slug: "accessibility", title: "Accessibility", body: "Keyboard + focus + SR + reduced-motion on every component. Creative layers never remove semantic behavior (e.g. Slingshot OTP keeps real inputs)." },
  { slug: "responsive", title: "Responsive behavior", body: "Desktop pointer physics → touch drag/press equivalents → simplified small-screen controls. Larger targets, no hover-only flows." },
  { slug: "customization", title: "Customization", body: "CSS vars (--b-accent, --b-iris), Tailwind variants, and tree-shakeable exports. Tokens live in @buildora/tokens." },
  { slug: "registry", title: "Registry", body: "Source: registry/components/*.json. Build: pnpm registry:build. Validate: pnpm registry:validate. shadcn items: registry/generated/*.json." }
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-3xl font-black">Docs</h1>
      <p className="mt-1 text-sm text-white/55">Concise, technically accurate, focused on shipping.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {docs.map((d) => (
          <article key={d.slug} id={d.slug} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <h2 className="font-display font-black">{d.title}</h2>
            <p className="mt-1 text-sm text-white/60">{d.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-[#d4ff4f]/25 bg-[#d4ff4f]/[0.05] p-4">
        <h2 className="font-display font-black">How it works (learning mode)</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-white/60">
          <li><strong className="text-white">Interaction logic:</strong> pointer proximity → eased target → spring steps → transform. Reduced-motion short-circuits to final state.</li>
          <li><strong className="text-white">Design principles:</strong> usefulness first, one memorable interaction per component, tactile feedback, no meaningless motion.</li>
          <li><strong className="text-white">Performance:</strong> rAF + DPR-aware canvas, lazy 3D (no Three.js unless the route needs it), code-split playgrounds.</li>
          <li><strong className="text-white">Framework differences:</strong> web hover/blur become press/haptics on native; canvas becomes Skia/CustomPainter/Canvas equivalents.</li>
        </ul>
        <Link href="/components/slingshot-otp" className="mt-2 inline-block text-sm text-[#d4ff4f] hover:underline">Study Slingshot OTP →</Link>
      </div>
    </div>
  );
}
