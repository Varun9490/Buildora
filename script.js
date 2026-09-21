const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const registryDir = path.join(__dirname, 'registry/generated');
const componentsDir = path.join(__dirname, 'packages/components/src');

const items = fs.readdirSync(registryDir).filter(f => f.endsWith('.json') && f !== 'registry.json');
const lines = ['slug,category,has_use_client,external_imports,buildora_imports,uses_raf,uses_getBoundingClientRect,uses_framer_motion,hard_coded_colors,b_vars,reduced_motion,keyboard_handling,loc'];

for (const f of items) {
  const data = JSON.parse(fs.readFileSync(path.join(registryDir, f), 'utf-8'));
  const slug = data.name || f.replace('.json', '');
  const category = data.category || data.type || '';
  
  let source = '';
  try {
    const compPath = path.join(componentsDir, slug, 'index.tsx');
    if (fs.existsSync(compPath)) {
        source = fs.readFileSync(compPath, 'utf-8');
    }
  } catch(e) {}
  
  if (!source && data.files) {
     source = data.files.map(x => x.content).join('\n');
  }

  const has_use_client = source.includes('"use client"') || source.includes("'use client'");
  
  const imports = [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(m => m[1]);
  const external_imports = imports.filter(i => !i.startsWith('.') && !i.startsWith('@/') && !i.startsWith('@buildora/')).join(';');
  const buildora_imports = imports.filter(i => i.startsWith('@buildora/')).join(';');
  
  const uses_raf = source.includes('requestAnimationFrame');
  const uses_gBCR = source.includes('getBoundingClientRect');
  const uses_framer_motion = source.includes('framer-motion');
  
  const hard_coded_colors = (source.match(/#[0-9a-fA-F]{3,8}\b|\bwhite\/\[|\bblack\/\[|rgba?\(|\btext-white\b|\bbg-black\b/g) || []).length;
  const b_vars = (source.match(/\[--b-/g) || []).length;
  
  const reduced_motion = source.includes('useReducedMotion') || source.includes('prefers-reduced-motion');
  const keyboard_handling = source.includes('onKeyDown') || source.includes('onKeyUp');
  const loc = source.split('\n').length;
  
  lines.push([slug, category, has_use_client, external_imports, buildora_imports, uses_raf, uses_gBCR, uses_framer_motion, hard_coded_colors, b_vars, reduced_motion, keyboard_handling, loc].join(','));
}

fs.writeFileSync(path.join(__dirname, 'docs/audit/inventory.csv'), lines.join('\n'));
console.log('Done inventory');
