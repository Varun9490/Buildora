// scratch/gen-catalog.mjs
import fs from "node:fs";

const specs = JSON.parse(process.argv[2] || "[]");
// We'll instead hardcode reading from gen list by redefining
const list = [
  { slug: "portfolio-hero-entrance", name: "Portfolio Hero Entrance", desc: "Staggered hero entrance: eyebrow, headline, subcopy and CTA arrive in sequence with spring easing.", cat: ["motion","blocks"], tags: ["hero","entrance","stagger"], diff: "intermediate" },
  { slug: "scroll-fade-section", name: "Scroll Fade Section", desc: "Section that fades and lifts into view once, driven by IntersectionObserver and reduced-motion aware.", cat: ["motion","blocks"], tags: ["scroll","fade","reveal"], diff: "beginner" },
  { slug: "project-card-tilt", name: "Project Card Tilt", desc: "Project card with 3D perspective tilt following the pointer and a glare highlight that tracks.", cat: ["motion","blocks"], tags: ["card","tilt","hover"], diff: "intermediate" },
  { slug: "magnetic-nav-pill", name: "Magnetic Nav Pill", desc: "Floating nav pill that slides to the active item with a spring and attracts the cursor.", cat: ["navigation","motion"], tags: ["nav","pill","magnetic"], diff: "intermediate" },
  { slug: "gradient-border-card", name: "Gradient Border Card", desc: "Card with an animated conic-gradient border that rotates and pauses on hover.", cat: ["motion","primitives"], tags: ["card","gradient","border"], diff: "beginner" },
  { slug: "spotlight-hover-card", name: "Spotlight Hover Card", desc: "Card lit by a radial spotlight that follows the pointer across its surface.", cat: ["motion","blocks"], tags: ["card","spotlight","hover"], diff: "beginner" },
  { slug: "marquee-logo-strip", name: "Marquee Logo Strip", desc: "Infinite horizontal logo marquee that pauses on hover and freezes under reduced motion.", cat: ["motion","blocks"], tags: ["marquee","logo","strip"], diff: "beginner" },
  { slug: "number-counter-reveal", name: "Number Counter Reveal", desc: "Animated counter that counts to its value when scrolled into view, announced once.", cat: ["motion","data"], tags: ["number","counter","reveal"], diff: "beginner" },
  { slug: "parallax-image-layer", name: "Parallax Image Layer", desc: "Image layer that translates at a different rate than scroll for depth, rAF-throttled.", cat: ["motion","blocks"], tags: ["parallax","image","depth"], diff: "intermediate" },
  { slug: "cursor-trail-dot", name: "Cursor Trail Dot", desc: "Small trailing dot that follows the pointer with spring lag and fades when idle.", cat: ["motion"], tags: ["cursor","trail","dot"], diff: "beginner" },
  { slug: "section-divider-line", name: "Section Divider Line", desc: "Horizontal rule that draws itself from center on scroll into view.", cat: ["motion","primitives"], tags: ["divider","line","draw"], diff: "beginner" },
  { slug: "testimonial-carousel", name: "Testimonial Carousel", desc: "Auto-advancing testimonial carousel with spring snap and pause on hover.", cat: ["motion","blocks"], tags: ["carousel","testimonial","auto"], diff: "intermediate" },
  { slug: "contact-form-reveal", name: "Contact Form Reveal", desc: "Contact form whose fields stagger in on scroll with focus-driven lift.", cat: ["forms","motion"], tags: ["form","contact","reveal"], diff: "intermediate" },
  { slug: "blur-text-entrance", name: "Blur Text Entrance", desc: "Headline that resolves from a blurred, scaled state into sharp focus on view.", cat: ["motion"], tags: ["text","blur","entrance"], diff: "beginner" },
  { slug: "rotate-card-stack", name: "Rotate Card Stack", desc: "Stacked cards that fan out and rotate on hover with spring physics.", cat: ["motion","blocks"], tags: ["cards","stack","rotate"], diff: "intermediate" },
  { slug: "scroll-progress-bar", name: "Scroll Progress Bar", desc: "Top reading-progress bar driven by scroll position, transform-scaled.", cat: ["motion","primitives"], tags: ["scroll","progress","bar"], diff: "beginner" },
  { slug: "hover-lift-image", name: "Hover Lift Image", desc: "Image that lifts with shadow and slight zoom on hover, with smooth easing.", cat: ["motion","blocks"], tags: ["image","hover","lift"], diff: "beginner" },
  { slug: "animated-counter-badge", name: "Animated Counter Badge", desc: "Badge that increments a counter with a spring pop when its value changes.", cat: ["motion","primitives"], tags: ["badge","counter","pop"], diff: "beginner" },
  { slug: "fade-stagger-list", name: "Fade Stagger List", desc: "List whose items fade and slide up in staggered sequence on view.", cat: ["motion","blocks"], tags: ["list","stagger","fade"], diff: "beginner" },
  { slug: "reveal-mask-image", name: "Reveal Mask Image", desc: "Image revealed by an animated mask that wipes across on scroll.", cat: ["motion","blocks"], tags: ["image","mask","reveal"], diff: "beginner" },
];

const lines = list.map(s => {
  const cats = JSON.stringify(s.cat);
  const tags = JSON.stringify(s.tags);
  return `  R("${s.slug}", fullWeb, { name: "${s.name}", description: "${s.desc}", categories: ${cats}, tags: ${tags}, difficulty: "${s.diff}" }),`;
}).join("\n");

fs.writeFileSync("C:/Users/varun/Desktop/Buildora/scratch/catalog-snippet.txt", lines + "\n");
console.log("written");
