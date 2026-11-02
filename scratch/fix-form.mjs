import fs from "node:fs";
const p = "C:/Users/varun/Desktop/Buildora/packages/components/src/contact-form-reveal/index.tsx";
let s = fs.readFileSync(p, "utf8");
s = s.replace('<form ref={ref} className={cn("flex flex-col gap-4", className)} {...rest}>', '<form ref={ref} className={cn("flex flex-col gap-4", className)}>');
fs.writeFileSync(p, s);
console.log("done");
