import os
import re

def process_file(filepath):
    if 'terminal-theme.ts' in filepath:
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. Colors mappings
    # text-white/N -> text-[color-mix(in_oklab,var(--b-text)_N%,transparent)]
    # border-white/N -> border-[color-mix(in_oklab,var(--b-border)_N%,transparent)]
    # bg-white/N -> bg-[color-mix(in_oklab,var(--b-text)_N%,transparent)]
    
    def repl_white_alpha(m):
        prefix = m.group(1)
        opacity = m.group(2)
        base = '--b-text'
        if prefix in ('border', 'ring', 'divide', 'outline'):
            base = '--b-border'
        elif prefix == 'bg':
            base = '--b-text'
        return f'{prefix}-[color-mix(in_oklab,var({base})_{opacity}%,transparent)]'

    content = re.sub(r'([a-z-]+)-white/(\d+)', repl_white_alpha, content)
    content = re.sub(r'([a-z-]+)-white/\[([0-9.]+)\]', lambda m: f"{m.group(1)}-[color-mix(in_oklab,var(--b-text)_{float(m.group(2))*100:g}%,transparent)]", content)

    content = re.sub(r'([a-z-]+)-white(?!\w|-)', r'\1-[color:var(--b-text)]', content)
    
    # bg-[#0d0f16] -> bg-[var(--b-bg)]
    content = content.replace('bg-[#0d0f16]', 'bg-[var(--b-bg)]')
    content = content.replace('bg-[#161614]', 'bg-[var(--b-panel)]')
    
    # #d4ff4f -> var(--b-accent)
    content = re.sub(r'ring-\[#d4ff4f\]/(\d+)', r'ring-[color-mix(in_oklab,var(--b-accent)_\1%,transparent)]', content)
    content = re.sub(r'border-\[#d4ff4f\]/(\d+)', r'border-[color-mix(in_oklab,var(--b-accent)_\1%,transparent)]', content)
    content = re.sub(r'bg-\[#d4ff4f\]/(\d+)', r'bg-[color-mix(in_oklab,var(--b-accent)_\1%,transparent)]', content)
    content = content.replace('text-[#d4ff4f]', 'text-[color:var(--b-accent)]')
    content = content.replace('[#d4ff4f]', 'var(--b-accent)')
    
    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')

for root, _, files in os.walk('packages/components/src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
