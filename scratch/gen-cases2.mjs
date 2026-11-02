import fs from "node:fs";
const slugs = ["portfolio-hero-entrance","scroll-fade-section","project-card-tilt","magnetic-nav-pill","gradient-border-card","spotlight-hover-card","marquee-logo-strip","number-counter-reveal","parallax-image-layer","cursor-trail-dot","section-divider-line","testimonial-carousel","contact-form-reveal","blur-text-entrance","rotate-card-stack","scroll-progress-bar","hover-lift-image","animated-counter-badge","fade-stagger-list","reveal-mask-image","elastic-underline","image-zoom-pan","text-scramble-reveal","floating-label-input","accordion-smooth","tabs-sliding-indicator","tooltip-fade","modal-fade-scale","drawer-slide","popover-bounce","dropdown-cascade","toast-slide","skeleton-shimmer","progress-ring","toggle-switch-anim","checkbox-bounce","radio-pill","slider-glow","avatar-stack-hover","badge-pulse","parallax-text","magnetic-cursor-ring","scroll-triggered-counter","hover-reveal-overlay","animated-gradient-text","staggered-grid","bounce-button","fade-in-image","scroll-snap-section","animated-border"];
const caseBlock = slugs.map(s=>{
  const p = s.split("-").map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join("");
  return `    case "${s}":
      return wrap(<${p} className="w-72" />);`;
}).join("\n");
fs.writeFileSync("C:/Users/varun/Desktop/Buildora/scratch/case-block.txt", caseBlock+"\n");
console.log("ok");
