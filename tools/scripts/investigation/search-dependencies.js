// Search node_modules for "Invalid path specified" in likely packages
const fs = require('fs');
const path = require('path');

const SEARCH_TERM = 'Invalid path specified';
const ROOT = process.cwd();
const NODE_MODULES = path.join(ROOT, 'node_modules');

// Packages most likely to produce this error
const PACKAGES_TO_SEARCH = [
  'next',
  '@supabase/ssr',
  '@supabase/supabase-js',
  '@supabase/auth-helpers-nextjs',
  'vercel',
  '@vercel/edge',
  '@vercel/node',
];

const results = [];

function searchInFile(filePath, pkgName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(SEARCH_TERM)) {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(SEARCH_TERM)) {
          results.push({
            package: pkgName,
            file: path.relative(ROOT, filePath),
            line: i + 1,
            content: lines[i].trim().slice(0, 300)
          });
        }
      }
    }
  } catch (e) {
    // Skip unreadable files
  }
}

function walkDir(dir, pkgName, depth = 0) {
  if (depth > 10) return; // Prevent infinite recursion
  
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip nested node_modules to avoid duplication
      if (entry.name === 'node_modules' && depth > 0) continue;
      walkDir(fullPath, pkgName, depth + 1);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (['.js', '.mjs', '.cjs', '.ts', '.tsx'].includes(ext)) {
        searchInFile(fullPath, pkgName);
      }
    }
  }
}

console.log('Searching node_modules for: "' + SEARCH_TERM + '"');
console.log('');

for (const pkg of PACKAGES_TO_SEARCH) {
  const pkgPath = path.join(NODE_MODULES, pkg);
  if (fs.existsSync(pkgPath)) {
    console.log('Searching ' + pkg + '...');
    walkDir(pkgPath, pkg);
  } else {
    console.log('Package not found: ' + pkg);
  }
}

console.log('');
if (results.length === 0) {
  console.log('NOT FOUND in any searched packages.');
  console.log('');
  console.log('The error may be:');
  console.log('1. Dynamically constructed at runtime');
  console.log('2. From a different package not searched');
  console.log('3. From Vercel edge runtime (not in node_modules)');
  console.log('4. From Next.js internal routing (compiled/bundled)');
} else {
  console.log('FOUND ' + results.length + ' match(es):');
  console.log('');
  for (const r of results) {
    console.log('Package: ' + r.package);
    console.log('File: ' + r.file);
    console.log('Line: ' + r.line);
    console.log('Code: ' + r.content);
    console.log('---');
  }
}
