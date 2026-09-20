import * as fs from "node:fs";
import * as path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "scripts/catalog.ts");
let catalogContent = fs.readFileSync(catalogPath, "utf8");

const baseItemsStr = `
const baseItems: CatalogItem[] = [
  R("utils", {}, { name: "utils", description: "Utility functions", registryType: "registry:lib", files: ["packages/components/src/utils/index.ts"] }),
  R("use-reduced-motion", {}, { name: "use-reduced-motion", description: "Hook for reduced motion", registryType: "registry:hook", files: ["packages/components/src/hooks/use-reduced-motion.ts"] }),
  R("use-pointer-proximity", {}, { name: "use-pointer-proximity", description: "Hook for pointer proximity", registryType: "registry:hook", files: ["packages/components/src/hooks/use-pointer-proximity.ts"] }),
  R("spring", {}, { name: "spring", description: "Spring animation utility", registryType: "registry:lib", files: ["packages/components/src/animations/spring.ts"] }),
  R("tokens", {}, { name: "tokens", description: "Design tokens", registryType: "registry:theme", files: ["packages/components/src/tokens/index.css"], cssVars: { light: {}, dark: {} } })
];
`;

if (!catalogContent.includes("const baseItems")) {
  catalogContent = catalogContent.replace(/export const catalog: CatalogItem\[\] = \[/g, baseItemsStr + "\nexport const catalog: CatalogItem[] = [\n  ...baseItems,");
}

// Ensure every item has utils and tokens in registryDependencies
// Also fixing the "target" property issue where targets end with index.tsx instead of proper component name.
// But Phase 0 says "targets: extra.targets". Wait, the prompt says:
// "Every file has a unique, human target (e.g. components/buildora/magnetic-button.tsx). Never index.tsx."
// If `targets` is missing in `R(...)`, it falls back to a default.
// Let's modify the `R` function in `catalog.ts` to automatically generate namespaced targets.

catalogContent = catalogContent.replace(
  /targets: extra\.targets,/g,
  `targets: extra.targets ?? extra.files?.map(f => f.endsWith('index.tsx') ? \`components/buildora/\${slug}.tsx\` : \`components/buildora/\${slug}/\${path.basename(f)}\`),`
);

// We need to make sure `path` is imported if not already. It is imported at the top of catalog.ts.

// Also, inject registryDependencies to all items. Instead of modifying each item, let's inject it into `R()` function.
// Replace: `registryDependencies: extra.registryDependencies,`
// With: `registryDependencies: Array.from(new Set([...(extra.registryDependencies ?? []), "utils", "tokens"])),`
catalogContent = catalogContent.replace(
  /registryDependencies: extra\.registryDependencies,/g,
  `registryDependencies: Array.from(new Set([...(extra.registryDependencies ?? []), "utils", "tokens"])),`
);

// We should also replace `buildora-{slug}` mismatch if it exists. 
// "Item name == filename == install id. Drop the buildora- prefix mismatch."
// Wait, the generated JSON in shadcn expects name to be the install ID.
// Currently `name: extra.name ?? slug`. This means name is slug, e.g. "magnetic-button".
// Where is `buildora-` prefix being added? Let's check `build-registry.ts`.
// I will not touch build-registry yet, just the above fixes.

fs.writeFileSync(catalogPath, catalogContent);
console.log("Catalog fixed.");
