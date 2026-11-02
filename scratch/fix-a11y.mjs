import fs from "node:fs";
// FloatingLabelInput
let p = "C:/Users/varun/Desktop/Buildora/packages/components/src/floating-label-input/index.tsx";
let s = fs.readFileSync(p, "utf8");
s = s.replace('className="w-full rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-3 text-[color:var(--b-text)] focus:border-[color:var(--b-accent)] focus:outline-none"',
            'className="w-full rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-3 text-[color:var(--b-text)] focus:border-[color:var(--b-accent)] focus:outline-none" aria-label="Full name"');
fs.writeFileSync(p, s);

// ToggleSwitchAnim
p = "C:/Users/varun/Desktop/Buildora/packages/components/src/toggle-switch-anim/index.tsx";
s = fs.readFileSync(p, "utf8");
s = s.replace('className={cn("relative h-7 w-12 rounded-full border border-[color:var(--b-border)] transition-colors", on ? "bg-[color:var(--b-accent)]" : "bg-[color:var(--b-surface)]", className)}',
            'className={cn("relative h-7 w-12 rounded-full border border-[color:var(--b-border)] transition-colors", on ? "bg-[color:var(--b-accent)]" : "bg-[color:var(--b-surface)]", className)} aria-label="Toggle"');
fs.writeFileSync(p, s);

// CheckboxBounce
p = "C:/Users/varun/Desktop/Buildora/packages/components/src/checkbox-bounce/index.tsx";
s = fs.readFileSync(p, "utf8");
s = s.replace('className={cn("flex h-5 w-5 items-center justify-center rounded border border-[color:var(--b-border)] bg-[color:var(--b-surface)]", checked && "bg-[color:var(--b-accent)] border-[color:var(--b-accent)]", className)}',
            'className={cn("flex h-5 w-5 items-center justify-center rounded border border-[color:var(--b-border)] bg-[color:var(--b-surface)]", checked && "bg-[color:var(--b-accent)] border-[color:var(--b-accent)]", className)} aria-label="Checkbox"');
fs.writeFileSync(p, s);

// FadeInImage
p = "C:/Users/varun/Desktop/Buildora/packages/components/src/fade-in-image/index.tsx";
s = fs.readFileSync(p, "utf8");
s = s.replace('className={cn("rounded-[var(--b-radius-lg)]", className)}', 'className={cn("rounded-[var(--b-radius-lg)]", className)} alt="Preview image"');
fs.writeFileSync(p, s);

console.log("done");
