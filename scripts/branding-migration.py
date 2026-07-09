#!/usr/bin/env python3
"""
ASCYN PRO Phase 1 Branding Migration
Replace user-facing Barber Study Pro branding with ASCYN PRO.
Skips documentation, archives, node_modules, .git, .next, and Supabase schemas.
"""

import os
import re
from pathlib import Path

ROOT = Path('/mnt/c/AI/ACTIVE/ASCYN-PRO/02-work/app')

# Directories to skip entirely
SKIP_DIRS = {
    '.git', '.next', 'node_modules', 'migrated-content',
    'barber-study-guide-website', 'barber-study-pro-v2',
    'supabase', 'textbook-images', 'scripts'
}

# File extensions to process
PROCESS_EXTENSIONS = {
    '.html', '.tsx', '.ts', '.jsx', '.js', '.json', '.css'
}

# Specific files to skip
SKIP_FILES = {
    'tsconfig.tsbuildinfo',
    'package-lock.json',
    'tsconfig.json',  # no branding expected, but safe to skip
    'next-env.d.ts',
}

# Replacements applied in order. Use exact strings or regex tuples.
REPLACEMENTS = [
    # Exact phrase branding
    ('Barber Study Pro', 'ASCYN PRO'),
    ('barber-study-pro', 'ascyn-pro'),
    ('BarberStudyPro', 'ASCYNPRO'),
    ('barberstudypro', 'ascynpro'),
    ('barber-study', 'ascyn'),  # careful: only in branding contexts

    # Console labels / log prefixes
    ('[Barber Study Pro]', '[ASCYN PRO]'),

    # Descriptive taglines (non-curriculum)
    ('Professional barbering education platform', 'Professional licensing education platform'),
]

# Regex replacements for HTML titles and meta descriptions
REGEX_REPLACEMENTS = [
    # Genericize Oklahoma-specific branding where appropriate
    (re.compile(r'Barber Study Pro \| Pass Your Oklahoma State Board Exam'), 'ASCYN PRO | Pass Your State Board Exam'),
    (re.compile(r'Pass Your Oklahoma State Board Exam \| Barber Study Pro'), 'Pass Your State Board Exam | ASCYN PRO'),
]

def should_process(path: Path) -> bool:
    if path.name in SKIP_FILES:
        return False
    if path.suffix.lower() not in PROCESS_EXTENSIONS:
        return False
    for part in path.relative_to(ROOT).parts:
        if part in SKIP_DIRS:
            return False
    return True

def migrate_file(path: Path) -> dict:
    original = path.read_text(encoding='utf-8')
    updated = original
    changes = []

    for old, new in REPLACEMENTS:
        if old in updated:
            count = updated.count(old)
            updated = updated.replace(old, new)
            changes.append(f"{old!r} -> {new!r} ({count})")

    for pattern, repl in REGEX_REPLACEMENTS:
        matches = pattern.findall(updated)
        if matches:
            updated = pattern.sub(repl, updated)
            changes.append(f"regex {pattern.pattern!r} -> {repl!r} ({len(matches)})")

    if updated != original:
        path.write_text(updated, encoding='utf-8')
        return {'path': str(path.relative_to(ROOT)), 'changes': changes}
    return None

def main():
    results = []
    for path in ROOT.rglob('*'):
        if path.is_file() and should_process(path):
            result = migrate_file(path)
            if result:
                results.append(result)

    # Print report
    print(f"Processed {len(results)} files with changes.")
    for r in results:
        print(f"\n{r['path']}")
        for c in r['changes']:
            print(f"  - {c}")

if __name__ == '__main__':
    main()
