import fs from "node:fs";
const p = "C:/Users/varun/Desktop/Buildora/packages/components/src/fixtures.ts";
let s = fs.readFileSync(p, "utf8");
const insert = `  FloatingLabelInput: { "aria-label": "Full name" },
  ToggleSwitchAnim: { "aria-label": "Toggle notifications" },
  CheckboxBounce: { "aria-label": "Accept terms" },
  SliderGlow: { "aria-label": "Volume" },
  BounceButton: { children: "Press" },
  FadeInImage: { src: "", alt: "Preview image" },
`;
const anchor = "  // The popover trigger is a button; it needs a name of its own.\n  Popover: { anchor: \"Open\" },\n};";
if (!s.includes(anchor)) { console.log("anchor missing"); process.exit(1); }
s = s.replace(anchor, insert + anchor);
fs.writeFileSync(p, s);
console.log("done");
