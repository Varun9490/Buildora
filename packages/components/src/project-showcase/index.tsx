"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type ProjectShowcaseCardProps = React.HTMLAttributes<HTMLElement> & {
  /** Project number (01, 02, etc.) */
  number?: string;
  /** Category tags */
  tags?: string[];
  /** Project title */
  title: string;
  /** Project description */
  description: string;
  /** Image source */
  imageSrc: string;
  /** Image alt text */
  imageAlt: string;
  /** Link URL for the live project */
  liveUrl?: string;
  /** Link URL for the source code */
  sourceUrl?: string;
  /** Image aspect ratio */
  aspectRatio?: string;
};

export function ProjectShowcaseCard({
  number,
  tags = [],
  title,
  description,
  imageSrc,
  imageAlt,
  liveUrl,
  sourceUrl,
  aspectRatio = "4/3",
  className,
  ...rest
}: ProjectShowcaseCardProps) {
  return (
    <article
      className={cn("buildora-project-showcase-card group", className)}
      {...rest}
    >
      {/* Image area */}
      <a
        href={liveUrl}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "block overflow-hidden border bg-[color-mix(in_oklab,var(--b-bg,#fafafa)_95%,var(--b-fg,#000))]",
          "border-[color-mix(in_oklab,var(--b-border,#e5e7eb)_80%,transparent)]"
        )}
        style={{ cursor: liveUrl ? "pointer" : "default" }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          width={1200}
          height={912}
          className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          style={{ aspectRatio }}
        />
      </a>

      {/* Info row */}
      <div className="mt-5 grid items-start gap-5" style={{ gridTemplateColumns: "minmax(0,1fr) auto" }}>
        <div className="min-w-0">
          {/* Number + tags */}
          {(number || tags.length > 0) && (
            <p
              className="text-xs"
              style={{ color: "color-mix(in oklab, var(--b-fg, #000) 55%, transparent)" }}
            >
              {number && <>{number} / </>}
              {tags.join(" · ")}
            </p>
          )}

          {/* Title */}
          <h3
            className="mt-1 text-4xl"
            style={{ fontFamily: "var(--b-font-serif, Georgia, serif)" }}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className="mt-2 max-w-xl"
            style={{ color: "color-mix(in oklab, var(--b-fg, #000) 55%, transparent)" }}
          >
            {description}
          </p>
        </div>

        {/* External link button */}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${title} source code`}
            className={cn(
              "inline-flex items-center justify-center border text-sm font-medium",
              "transition-[background-color,color,transform] duration-200",
              "hover:-translate-y-0.5 h-10 w-10 px-0",
              "border-[var(--b-fg,#000)] bg-[var(--b-bg,#fff)] text-[var(--b-fg,#000)]",
              "hover:bg-[color-mix(in_oklab,var(--b-bg,#fff)_90%,var(--b-fg,#000))]"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}

export type ProjectShowcaseProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Section heading subtitle */
  subtitle?: string;
  /** Section heading title */
  heading?: React.ReactNode;
  /** Heading description */
  headingDescription?: string;
  /** Filter categories (pass labels) */
  filters?: string[];
  /** Background watermark text */
  watermark?: string;
};

export function ProjectShowcase({
  subtitle,
  heading,
  headingDescription,
  filters = [],
  watermark = "WORKS",
  className,
  children,
  ...rest
}: ProjectShowcaseProps) {
  const [activeFilter, setActiveFilter] = React.useState("All");
  const allFilters = ["All", ...filters];

  return (
    <section
      className={cn(
        "buildora-project-showcase relative min-h-screen px-5 pb-24 pt-28 sm:px-8",
        "border-t border-[var(--b-border,#e5e7eb)]",
        className
      )}
      {...rest}
    >
      {/* Watermark */}
      {watermark && (
        <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden" aria-hidden>
          <p
            className="whitespace-nowrap font-semibold leading-none"
            style={{
              fontSize: "26vw",
              transform: "translateY(-38%)",
              color: "color-mix(in oklab, var(--b-fg, #000) 6%, transparent)",
            }}
          >
            {watermark}
          </p>
        </div>
      )}

      <div
        className="relative mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-[minmax(280px,0.65fr)_minmax(0,1.35fr)]"
        style={{ paddingTop: "18vw" }}
      >
        {/* Sidebar */}
        <aside className="h-fit lg:sticky lg:top-28">
          {subtitle && (
            <p
              className="text-sm"
              style={{ color: "color-mix(in oklab, var(--b-fg, #000) 55%, transparent)" }}
            >
              {subtitle}
            </p>
          )}
          {heading && (
            <h2
              className="mt-4 max-w-md text-5xl leading-none sm:text-6xl"
              style={{ fontFamily: "var(--b-font-serif, Georgia, serif)" }}
            >
              {heading}
            </h2>
          )}
          {headingDescription && (
            <p
              className="mt-8 max-w-sm"
              style={{ color: "color-mix(in oklab, var(--b-fg, #000) 55%, transparent)" }}
            >
              {headingDescription}
            </p>
          )}

          {/* Filters */}
          {filters.length > 0 && (
            <>
              <p className="mb-3 mt-10 text-sm">show me</p>
              <div className="flex flex-wrap gap-2">
                {allFilters.map((f) => (
                  <button
                    key={f}
                    data-active={activeFilter === f}
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                      "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium",
                      "transition-[background-color,color,transform] duration-200",
                      activeFilter === f
                        ? "border-[var(--b-fg,#000)] bg-[var(--b-fg,#000)] text-[var(--b-bg,#fff)]"
                        : "border-[var(--b-border,#e5e7eb)] bg-transparent text-[color-mix(in_oklab,var(--b-fg,#000)_55%,transparent)] hover:border-[var(--b-fg,#000)] hover:text-[var(--b-fg,#000)]"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* Project grid */}
        <div className="grid gap-20">{children}</div>
      </div>
    </section>
  );
}

export default ProjectShowcase;
