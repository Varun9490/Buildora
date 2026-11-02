// scratch/gen-catalog2.mjs
const list = [
  { slug: "elastic-underline", name: "Elastic Underline", desc: "Link underline that stretches and snaps back on hover with spring physics.", cat: ["motion","primitives"], tags: ["underline","elastic","hover"], diff: "beginner" },
  { slug: "image-zoom-pan", name: "Image Zoom Pan", desc: "Image that zooms and pans toward the cursor on hover, clamped to bounds.", cat: ["motion","blocks"], tags: ["image","zoom","pan"], diff: "intermediate" },
  { slug: "text-scramble-reveal", name: "Text Scramble Reveal", desc: "Text that scrambles through glyphs and resolves on scroll into view.", cat: ["motion"], tags: ["text","scramble","reveal"], diff: "beginner" },
  { slug: "floating-label-input", name: "Floating Label Input", desc: "Input whose label floats up on focus with a spring, themed border.", cat: ["forms","motion"], tags: ["input","label","float"], diff: "beginner" },
  { slug: "accordion-smooth", name: "Smooth Accordion", desc: "Accordion with animated height transition and rotating chevron.", cat: ["primitives","motion"], tags: ["accordion","smooth","height"], diff: "beginner" },
  { slug: "tabs-sliding-indicator", name: "Tabs Sliding Indicator", desc: "Tab bar with a sliding pill indicator that springs between items.", cat: ["primitives","motion"], tags: ["tabs","indicator","slide"], diff: "beginner" },
  { slug: "tooltip-fade", name: "Tooltip Fade", desc: "Tooltip that fades and lifts in on hover with delay and reduced-motion support.", cat: ["primitives","motion"], tags: ["tooltip","fade","hover"], diff: "beginner" },
  { slug: "modal-fade-scale", name: "Modal Fade Scale", desc: "Modal dialog that fades and scales in with backdrop blur.", cat: ["overlays","motion"], tags: ["modal","fade","scale"], diff: "beginner" },
  { slug: "drawer-slide", name: "Drawer Slide", desc: "Side drawer that slides in from the edge with spring easing.", cat: ["overlays","motion"], tags: ["drawer","slide","spring"], diff: "beginner" },
  { slug: "popover-bounce", name: "Popover Bounce", desc: "Popover that pops in with a spring bounce and fades out.", cat: ["overlays","motion"], tags: ["popover","bounce","spring"], diff: "beginner" },
  { slug: "dropdown-cascade", name: "Dropdown Cascade", desc: "Dropdown menu whose items cascade in with staggered fade.", cat: ["overlays","motion"], tags: ["dropdown","cascade","stagger"], diff: "beginner" },
  { slug: "toast-slide", name: "Toast Slide", desc: "Toast notification that slides in from the side and auto-dismisses.", cat: ["feedback","motion"], tags: ["toast","slide","auto"], diff: "beginner" },
  { slug: "skeleton-shimmer", name: "Skeleton Shimmer", desc: "Skeleton placeholder with an animated shimmer sweep.", cat: ["feedback","motion"], tags: ["skeleton","shimmer","loading"], diff: "beginner" },
  { slug: "progress-ring", name: "Progress Ring", desc: "Circular progress ring that animates to value on view.", cat: ["feedback","motion"], tags: ["progress","ring","circle"], diff: "beginner" },
  { slug: "toggle-switch-anim", name: "Animated Toggle Switch", desc: "Toggle switch with a sliding knob and color transition.", cat: ["forms","motion"], tags: ["toggle","switch","animate"], diff: "beginner" },
  { slug: "checkbox-bounce", name: "Checkbox Bounce", desc: "Checkbox with a bouncing checkmark on toggle.", cat: ["forms","motion"], tags: ["checkbox","bounce","check"], diff: "beginner" },
  { slug: "radio-pill", name: "Radio Pill", desc: "Radio group rendered as a sliding pill selector.", cat: ["forms","motion"], tags: ["radio","pill","slide"], diff: "beginner" },
  { slug: "slider-glow", name: "Slider Glow", desc: "Range slider with a glowing thumb and value tooltip.", cat: ["forms","motion"], tags: ["slider","glow","range"], diff: "beginner" },
  { slug: "avatar-stack-hover", name: "Avatar Stack Hover", desc: "Stacked avatars that spread apart on hover with spring.", cat: ["primitives","motion"], tags: ["avatar","stack","hover"], diff: "beginner" },
  { slug: "badge-pulse", name: "Badge Pulse", desc: "Badge with a pulsing dot indicator for live status.", cat: ["primitives","motion"], tags: ["badge","pulse","status"], diff: "beginner" },
];

const lines = list.map(s => {
  const cats = JSON.stringify(s.cat);
  const tags = JSON.stringify(s.tags);
  return `  R("${s.slug}", fullWeb, { name: "${s.name}", description: "${s.desc}", categories: ${cats}, tags: ${tags}, difficulty: "${s.diff}" }),`;
}).join("\n");

import fs from "node:fs";
fs.writeFileSync("C:/Users/varun/Desktop/Buildora/scratch/catalog-snippet2.txt", lines + "\n");
console.log("written");
