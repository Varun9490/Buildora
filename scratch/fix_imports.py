import os, re
def fix(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    c2 = re.sub(r'from "\.\./@buildora/([^"]+)"', r'from "@buildora/\1"', content)
    c2 = re.sub(r'from "\.\./\.\./@buildora/([^"]+)"', r'from "@buildora/\1"', c2)
    if c2 != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(c2)
        print(f'Fixed {f}')

for root, _, files in os.walk('packages/components/src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix(os.path.join(root, file))
