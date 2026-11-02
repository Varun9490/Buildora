import fs from "node:fs";
const slugs = ["portfolio-hero-entrance","scroll-fade-section","project-card-tilt","magnetic-nav-pill","gradient-border-card","spotlight-hover-card","marquee-logo-strip","number-counter-reveal","parallax-image-layer","cursor-trail-dot","section-divider-line","testimonial-carousel","contact-form-reveal","blur-text-entrance","rotate-card-stack","scroll-progress-bar","hover-lift-image","animated-counter-badge","fade-stagger-list","reveal-mask-image","elastic-underline","image-zoom-pan","text-scramble-reveal","floating-label-input","accordion-smooth","tabs-sliding-indicator","tooltip-fade","modal-fade-scale","drawer-slide","popover-bounce","dropdown-cascade","toast-slide","skeleton-shimmer","progress-ring","toggle-switch-anim","checkbox-bounce","radio-pill","slider-glow","avatar-stack-hover","badge-pulse","parallax-text","magnetic-cursor-ring","scroll-triggered-counter","hover-reveal-overlay","animated-gradient-text","staggered-grid","bounce-button","fade-in-image","scroll-snap-section","animated-border"];
for (const s of slugs) {
  const p = `C:/Users/varun/Desktop/Buildora/packages/components/src/${s}/index.tsx`;
  let c = fs.readFileSync(p, "utf8");
  // remove lines that are just {...rest} (with any indentation)
  c = c.replace(/^\s*\{\.\.\.rest\}\s*\n/gm, "");
  fs.writeFileSync(p, c);
}
console.log("done");
