// scratch/gen-catalog3.mjs
const list = [
  { slug: "parallax-text", name: "Parallax Text", desc: "Headline that drifts at a different rate than scroll for depth.", cat: ["motion"], tags: ["parallax","text","depth"], diff: "beginner" },
  { slug: "magnetic-cursor-ring", name: "Magnetic Cursor Ring", desc: "Ring that follows the cursor with magnetic lag and scales on click.", cat: ["motion"], tags: ["cursor","ring","magnetic"], diff: "beginner" },
  { slug: "scroll-triggered-counter", name: "Scroll Triggered Counter", desc: "Counter that animates from zero to target on scroll into view.", cat: ["motion","data"], tags: ["counter","scroll","number"], diff: "beginner" },
  { slug: "hover-reveal-overlay", name: "Hover Reveal Overlay", desc: "Card with an overlay that slides up on hover to reveal details.", cat: ["motion","blocks"], tags: ["hover","overlay","reveal"], diff: "beginner" },
  { slug: "animated-gradient-text", name: "Animated Gradient Text", desc: "Text filled with an animated shifting gradient.", cat: ["motion"], tags: ["text","gradient","animated"], diff: "beginner" },
  { slug: "staggered-grid", name: "Staggered Grid", desc: "Grid whose cells fade and scale in with stagger on view.", cat: ["motion","blocks"], tags: ["grid","stagger","fade"], diff: "beginner" },
  { slug: "bounce-button", name: "Bounce Button", desc: "Button that bounces with a spring on click.", cat: ["motion","primitives"], tags: ["button","bounce","spring"], diff: "beginner" },
  { slug: "fade-in-image", name: "Fade In Image", desc: "Image that fades and scales in on load with blur placeholder.", cat: ["motion","blocks"], tags: ["image","fade","load"], diff: "beginner" },
  { slug: "scroll-snap-section", name: "Scroll Snap Section", desc: "Section that snaps into place on scroll with smooth easing.", cat: ["motion","blocks"], tags: ["scroll","snap","section"], diff: "beginner" },
  { slug: "animated-border", name: "Animated Border", desc: "Border that traces itself around the element on view.", cat: ["motion","primitives"], tags: ["border","trace","animate"], diff: "beginner" },
];
const lines = list.map(s => {
  const cats = JSON.stringify(s.cat);
  const tags = JSON.stringify(s.tags);
  return `  R("${s.slug}", fullWeb, { name: "${s.name}", description: "${s.desc}", categories: ${cats}, tags: ${tags}, difficulty: "${s.diff}" }),`;
}).join("\n");
import fs from "node:fs";
fs.writeFileSync("C:/Users/varun/Desktop/Buildora/scratch/catalog-snippet3.txt", lines + "\n");
console.log("written");
