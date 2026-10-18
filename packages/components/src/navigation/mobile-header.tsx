"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   MOBILE HEADER — the iOS screen header, productized:

   - Bar row: back control (real <a>/<button>), centered title,
     right action slot — the "Centered Page Title" pattern
   - `largeTitle` renders the "Large Page Title" block; the bar
     is sticky, and the bar title fades in only once the large
     title has been scrolled out (IntersectionObserver) — the
     exact choreography iOS apps ship
   - `subtitle` = the eyebrow/helper line under the large title
   - Everything collapses to a compact sticky bar when no
     largeTitle/subtitle is passed ("Top Navigation Bar")
   ───────────────────────────────────────────────────────────── */

export type MobileHeaderProps = React.HTMLAttributes<HTMLElement> & {
  title: string;
  /** large editorial title under the bar; bar title fades in when it scrolls away */
  largeTitle?: string;
  /** one-liner under the large title */
  subtitle?: string;
  /** renders the back control: string = link, true = button, false = hidden */
  back?: string | boolean;
  backLabel?: string;
  onBack?: () => void;
  /** top-right actions (icon buttons / text links) */
  actions?: React.ReactNode;
};

export const ChevronLeftIcon = (className?: string) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
);

const backCls = cn(
  "flex h-9 items-center gap-0.5 rounded-full pr-2.5 pl-1.5 -ml-1.5 text-sm font-medium text-[color:var(--b-accent)]",
  "transition-colors hover:bg-[color:color-mix(in_oklab,var(--b-text)_6%,transparent)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-ring)]"
);

export function MobileHeader({
  title,
  largeTitle,
  subtitle,
  back = false,
  backLabel,
  onBack,
  actions,
  className,
  ...props
}: MobileHeaderProps) {
  const reducedMotion = useReducedMotion();
  const [largeGone, setLargeGone] = React.useState(false);
  const bigRef = React.useRef<HTMLDivElement>(null);
  const hasBig = largeTitle !== undefined || subtitle !== undefined;

  React.useEffect(() => {
    if (!hasBig || typeof IntersectionObserver === "undefined" || !bigRef.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setLargeGone(!e.isIntersecting)),
      { rootMargin: "-56px 0px 0px 0px", threshold: 0 }
    );
    io.observe(bigRef.current);
    return () => io.disconnect();
  }, [hasBig]);

  const showBack = back !== false;
  const backIsLink = typeof back === "string";

  const backControl = showBack ? (
    backIsLink ? (
      <a href={back as string} className={backCls}>
        {ChevronLeftIcon("h-5 w-5")}
        {backLabel ? backLabel : null}
      </a>
    ) : (
      <button type="button" onClick={onBack} className={backCls}>
        {ChevronLeftIcon("h-5 w-5")}
        {backLabel ? backLabel : null}
      </button>
    )
  ) : null;

  return (
    <header
      aria-label={typeof props["aria-label"] === "string" ? props["aria-label"] : undefined}
      className={cn(
        "top-0 z-30 w-full bg-[color:var(--b-panel)]",
        hasBig ? "" : "sticky pt-[env(safe-area-inset-top)]",
        className
      )}
      {...props}
    >
      {/* bar row — sticky in both modes so it pins under scroll */}
      <div className="sticky top-0 z-30 bg-[color:var(--b-panel)]">
        <div className={cn("relative flex h-14 items-start gap-2 pl-3 pr-3", hasBig && "pt-[env(safe-area-inset-top)]")}>
          <div className="flex h-14 items-center">{backControl}</div>
          <h2
            aria-hidden={hasBig ? !largeGone : undefined}
            className={cn(
              "pointer-events-none absolute inset-x-16 top-0 flex h-14 items-center justify-center text-center text-[15px] font-semibold tracking-tight text-[color:var(--b-text)]",
              "transition-opacity duration-300",
              hasBig ?
                (largeGone || reducedMotion
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none")
                : "opacity-100"
            )}
          >
            {title}
          </h2>
          <div className="ml-auto flex h-14 items-center gap-1.5">{actions}</div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 border-b border-[color:var(--b-border)]" />
        </div>
      </div>

      {/* large title block */}
      {hasBig && (
        <div
          ref={bigRef}
          className={cn("border-b border-[color:var(--b-border)] px-4 pb-4")}>
          {largeTitle !== undefined && (
            <motion.h1
              className="pb-2 pt-1 text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-[color:var(--b-text)]"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {largeTitle}
            </motion.h1>
          )}
          {subtitle && (
            <p className={cn("text-sm leading-relaxed text-[color:var(--b-text-secondary)]", largeTitle !== undefined && "pt-0")}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </header>
  );
}

MobileHeader.displayName = "MobileHeader";

/* ─────────────────────────────────────────────────────────
   SECTION HEADER — the small gray eyebrow above grouped lists
   ("Section Headers" pattern): label reads like a caption,
   optional trailing link on the right
   ───────────────────────────────────────────────────────── */
export type MobileSectionHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  /** right-aligned link / button, e.g. "See all" */
  trailing?: React.ReactNode;
};

export function MobileSectionHeader({ label, trailing, className, ...props }: MobileSectionHeaderProps) {
  return (
    <div className={cn("flex items-baseline justify-between px-4 pb-2 pt-5", className)} {...props}>
      <span className="text-[13px] font-medium uppercase tracking-[0.06em] text-[color:var(--b-muted)]">{label}</span>
      {trailing && <div className="text-[13px] font-medium text-[color:var(--b-accent)]">{trailing}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SETTINGS GROUP — inset grouped list ("Settings Header"):
   captioned section with bordered group of chevron rows
   ───────────────────────────────────────────────────────── */
export type MobileGroupRowProps = React.HTMLAttributes<HTMLElement> & {
  href?: string;
  onClick?: () => void;
  leading?: React.ReactNode;
  title: React.ReactNode;
  trailing?: React.ReactNode;
  dangerous?: boolean;
};

export function MobileGroupRow({ href, onClick, leading, title, trailing, dangerous, className, ...props }: MobileGroupRowProps) {
  const inner = (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {leading}
        <span className={cn(
          "truncate text-[15px] leading-normal",
          dangerous ? "text-[color:var(--b-danger)]" : "text-[color:var(--b-text)]"
        )}>
          {title}
        </span>
      </div>
      {trailing != null && <span className="shrink-0 text-sm text-[color:var(--b-muted)]">{trailing}</span>}
      <svg className={cn("h-4 w-4 shrink-0 text-[color:color-mix(in_oklab,var(--b-text)_35%,transparent)]")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
    </>
  );
  const rowCls = cn(
    "flex w-full items-center gap-2 px-4 py-3",
    "transition-colors hover:bg-[color:color-mix(in_oklab,var(--b-text)_4%,transparent)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--b-ring)]",
    className
  );
  return (
    <li className="flex" {...props}>
      {href ? (
        <a href={href} className={rowCls}>{inner}</a>
      ) : onClick ? (
        <button type="button" onClick={onClick} className={rowCls}>{inner}</button>
      ) : (
        <div className={rowCls}>{inner}</div>
      )}
    </li>
  );
}

export type MobileGroupProps = React.HTMLAttributes<HTMLElement> & {
  label?: string;
  footer?: string;
  children: React.ReactNode;
};

export function MobileGroup({ label, footer, children, className, ...props }: MobileGroupProps) {
  return (
    <section className={cn("px-0", className)} {...props}>
      {label && (
        <h3 className="px-4 pb-1.5 text-[13px] font-medium uppercase tracking-[0.06em] text-[color:var(--b-muted)]">
          {label}
        </h3>
      )}
      <ul
        role="list"
        className={cn(
          "mx-0 flex list-none flex-col divide-y divide-[color:color-mix(in_oklab,var(--b-border)_70%,transparent)]",
          "border-y border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-text)_2%,transparent)]"
        )}
      >
        {children}
      </ul>
      {footer && <p className="px-4 pt-2 text-xs leading-relaxed text-[color:var(--b-muted)]">{footer}</p>}
    </section>
  );
}
