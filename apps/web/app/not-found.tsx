import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="b-section-label">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">This page doesn&apos;t exist</h1>
      <p className="mt-3 text-sm leading-relaxed text-[--b-text-secondary]">
        The URL may be mistyped, or the component or page was renamed. Everything in the registry is one click away.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/components"
          className="rounded-[10px] bg-[--b-accent] px-5 py-2.5 text-sm font-semibold text-[--b-accent-foreground] transition-transform active:scale-[0.98]"
        >
          Browse components
        </Link>
        <Link
          href="/"
          className="rounded-[10px] border border-[--b-border] px-5 py-2.5 text-sm font-medium text-[--b-text-secondary] transition-colors hover:bg-[--b-surface]"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
