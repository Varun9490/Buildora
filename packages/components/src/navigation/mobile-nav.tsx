"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   MOBILE NAV — the bottom tab bar, made honest:

   - position="fixed" (default) is the real app bar: viewport
     pinned, safe-area padded
   - position="static" renders the SAME bar inline so previews
     and storybooks can stage it inside a phone frame
   - items are real links (href) or real buttons; the active
     tab keeps an aria-current page marker, a drifting pill,
     and an accent-tinted icon
   ───────────────────────────────────────────────────────────── */

const MobileNavContext = React.createContext<{
  id: string;
  activeItem: string;
  setActiveItem: (value: string) => void;
} | null>(null);

export type MobileNavPosition = "fixed" | "static";

export type MobileNavProps = React.HTMLAttributes<HTMLElement> & {
  defaultActiveItem?: string;
  activeItem?: string;
  onActiveItemChange?: (value: string) => void;
  /** fixed = pinned to viewport (app usage); static = inline rendering (preview/phone frame) */
  position?: MobileNavPosition;
};

const MobileNav = React.forwardRef<HTMLElement, MobileNavProps>(
  ({ className, defaultActiveItem, activeItem: controlledActiveItem, onActiveItemChange, position = "fixed", children, ...props }, ref) => {
    const id = React.useId();
    const [activeItem, setActiveItem] = React.useState(controlledActiveItem ?? defaultActiveItem ?? "");

    React.useEffect(() => {
      if (controlledActiveItem !== undefined) {
        setActiveItem(controlledActiveItem);
      }
    }, [controlledActiveItem]);

    const handleChange = (value: string) => {
      setActiveItem(value);
      onActiveItemChange?.(value);
    };

    return (
      <MobileNavContext.Provider value={{ id, activeItem, setActiveItem: handleChange }}>
        <nav
          ref={ref}
          aria-label="Primary"
          className={cn(
            position === "fixed"
              ? "fixed inset-x-0 bottom-0 z-50 md:hidden"
              : "w-full",
            "border-t border-[color:var(--b-border)] bg-[color:var(--b-panel)]/95 backdrop-blur-xl",
            position === "fixed" && "pb-[env(safe-area-inset-bottom)]",
            className
          )}
          {...props}
        >
          <ul className="flex items-stretch justify-around px-2 py-2">
            {children}
          </ul>
        </nav>
      </MobileNavContext.Provider>
    );
  }
);

MobileNav.displayName = "MobileNav";

export type MobileNavItemProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "value" | "href"> & {
  value: string;
  icon?: React.ReactNode;
  label: string;
  href?: string;
  /** circular notification count / dot rendered over the icon */
  badge?: React.ReactNode;
};

const MobileNavItem = React.forwardRef<HTMLAnchorElement, MobileNavItemProps>(
  ({ className, value, icon, label, href, badge, ...props }, ref) => {
    const context = React.useContext(MobileNavContext);
    if (!context) throw new Error("MobileNavItem must be used within MobileNav");
    const reducedMotion = useReducedMotion();
    const isActive = context.activeItem === value;
    const layoutId = `${context.id}-mobile-nav-active`;

    const commonProps = {
      "aria-current": isActive ? ("page" as const) : undefined,
      onClick: () => context.setActiveItem(value),
      className: cn(
        "relative z-10 flex h-full flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 min-w-14",
        "text-[11px] font-medium tracking-[0.01em] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-ring)]",
        isActive
          ? "text-[color:var(--b-text)]"
          : "text-[color:color-mix(in_oklab,var(--b-text)_48%,transparent)] hover:text-[color:var(--b-text)]",
        !reducedMotion && "duration-200",
        className
      ),
      ...props,
    };

    return (
      <li className="relative flex flex-1">
        <AnimatePresence>
          {!reducedMotion && isActive && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-x-1 inset-y-0.5 rounded-xl bg-[color:color-mix(in_oklab,var(--b-accent)_16%,transparent)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", bounce: 0.18, duration: 0.55 }}
            />
          )}
        </AnimatePresence>
        {href ? (
          <a ref={ref} href={href} {...commonProps}>
            <ItemBody icon={icon} label={label} badge={badge} isActive={isActive} reducedMotion={reducedMotion} />
          </a>
        ) : (
          <button type="button" ref={ref as unknown as React.Ref<HTMLButtonElement>} {...(commonProps as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
            <ItemBody icon={icon} label={label} badge={badge} isActive={isActive} reducedMotion={reducedMotion} />
          </button>
        )}
      </li>
    );
  }
);

function ItemBody({ icon, label, badge, isActive, reducedMotion }: { icon?: React.ReactNode; label: string; badge?: React.ReactNode; isActive: boolean; reducedMotion: boolean }) {
  return (
    <>
      {icon ? (
        <span className="relative" aria-hidden="true">
          <motion.span
            className={cn("flex h-6 w-6 items-center justify-center", isActive && "text-[color:var(--b-accent)]")}
            animate={{ y: isActive && !reducedMotion ? -2 : 0, scale: isActive && !reducedMotion ? 1.12 : 1 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.45 }}
          >
            {icon}
          </motion.span>
          {badge != null && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--b-danger)] px-1 text-[9px] font-semibold text-white">
              {badge}
            </span>
          )}
        </span>
      ) : badge != null ? (
        <span className="relative leading-none">
          {badge && (
            <span className="absolute -right-2 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--b-danger)] px-1 text-[9px] font-semibold text-white">
              {badge}
            </span>
          )}
        </span>
      ) : null}
      <motion.span animate={{ opacity: isActive ? 1 : 0.72 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}>
        {label}
      </motion.span>
    </>
  );
}

MobileNavItem.displayName = "MobileNavItem";

export { MobileNav, MobileNavItem };
