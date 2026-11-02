import fs from "node:fs";
const p = "C:/Users/varun/Desktop/Buildora/apps/web/components/ComponentRenderer.tsx";
let s = fs.readFileSync(p, "utf8");
const imp = fs.readFileSync("C:/Users/varun/Desktop/Buildora/scratch/import-block.txt", "utf8");
const anchor = 'import type { FxCardEffect, FxButtonEffect } from "@buildora/components";';
if (!s.includes(anchor)) { console.log("anchor missing"); process.exit(1); }
s = s.replace(anchor, anchor + "\n" + imp);
const caseBlock = fs.readFileSync("C:/Users/varun/Desktop/Buildora/scratch/case-block.txt", "utf8");
const defAnchor = "    default:";
if (!s.includes(defAnchor)) { console.log("default missing"); process.exit(1); }
s = s.replace(defAnchor, caseBlock + "\n" + defAnchor);
fs.writeFileSync(p, s);
console.log("done");
