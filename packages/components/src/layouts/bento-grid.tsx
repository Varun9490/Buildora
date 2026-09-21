"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type BentoGridProps = React.HTMLAttributes<HTMLDivElement> & {
  columns?: number;
  gap?: number;
  autoFill?: boolean;
};

export type BentoItemProps = React.HTMLAttributes<HTMLDivElement> & {
  rowSpan?: number;
  colSpan?: number;
};

function BentoGrid({
  columns = 4,
  gap = 16,
  autoFill = false,
  className,
  children,
  ...rest
}: BentoGridProps) {
  const rawId = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const scope = `bento-grid-${rawId}`;
  const desktopColumns = autoFill
    ? `repeat(auto-fill, minmax(280px, 1fr))`
    : `repeat(${columns}, minmax(0, 1fr))`;
  // Injected via dangerouslySetInnerHTML so server and client emit byte-identical
  // CSS. A plain <style> text child gets HTML-escaped on the server (`>` -> `&gt;`)
  // but not on the client, which triggers a hydration mismatch.
  const css = `.${scope}{display:grid;gap:${gap}px;grid-template-columns:1fr}.${scope}>.bento-item{grid-column:span 1/span 1;grid-row:span 1/span 1}@media(min-width:768px){.${scope}{grid-template-columns:${desktopColumns}}.${scope}>.bento-item{grid-column:span var(--bento-col,1)/span var(--bento-col,1);grid-row:span var(--bento-row,1)/span var(--bento-row,1)}}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className={cn(scope, className)} {...rest}>
        {children}
      </div>
    </>
  );
}

function BentoItem({
  rowSpan = 1,
  colSpan = 1,
  className,
  style,
  children,
  ...rest
}: BentoItemProps) {
  return (
    <div
      className={cn(
        "bento-item rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[#12141d] p-6",
        "transition-all duration-200 hover:border-[color-mix(in_oklab,var(--b-border)_20%,transparent)] hover:shadow-xl",
        className
      )}
      style={
        {
          ...style,
          "--bento-col": colSpan,
          "--bento-row": rowSpan,
        } as React.CSSProperties
      }
      {...rest}
    >
      {children}
    </div>
  );
}

BentoGrid.displayName = "BentoGrid";
BentoItem.displayName = "BentoGrid.Item";

export { BentoGrid, BentoItem };
