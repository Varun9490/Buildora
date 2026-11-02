import fs from "node:fs";
const p = "C:/Users/varun/Desktop/Buildora/apps/web/components/landing/ExplorerWorkspace.tsx";
let s = fs.readFileSync(p, "utf8");
const slugs = ["portfolio-hero-entrance","scroll-fade-section","project-card-tilt","magnetic-nav-pill","gradient-border-card","spotlight-hover-card","marquee-logo-strip","number-counter-reveal","parallax-image-layer","cursor-trail-dot","section-divider-line","testimonial-carousel","contact-form-reveal","blur-text-entrance","rotate-card-stack","scroll-progress-bar","hover-lift-image","animated-counter-badge","fade-stagger-list","reveal-mask-image","elastic-underline","image-zoom-pan","text-scramble-reveal","floating-label-input","accordion-smooth","tabs-sliding-indicator","tooltip-fade","modal-fade-scale","drawer-slide","popover-bounce","dropdown-cascade","toast-slide","skeleton-shimmer","progress-ring","toggle-switch-anim","checkbox-bounce","radio-pill","slider-glow","avatar-stack-hover","badge-pulse","parallax-text","magnetic-cursor-ring","scroll-triggered-counter","hover-reveal-overlay","animated-gradient-text","staggered-grid","bounce-button","fade-in-image","scroll-snap-section","animated-border"];
const newGroup = `  {
    id: "portfolio-motion",
    label: "Portfolio Motion",
    slugs: ${JSON.stringify(slugs)},
  },
`;
const anchor = "];\n\nconst SIGNATURE_DEMOS";
if (!s.includes(anchor)) { console.log("anchor missing"); process.exit(1); }
s = s.replace(anchor, newGroup + "];\n\nconst SIGNATURE_DEMOS");
fs.writeFileSync(p, s);
console.log("done");
