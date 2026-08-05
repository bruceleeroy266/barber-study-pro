// Search entire repo for "Invalid path specified" error string
const fs = require('fs');
const path = require('path');

const SEARCH_TERM = 'Invalid path specified';
const ROOT = process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'backups', '.vercel']);
const SEARCH_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json']);

const results = [];

function walkDir(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        walkDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SEARCH_EXTENSIONS.has(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(SEARCH_TERM)) {
              results.push({
                file: path.relative(ROOT, fullPath),
                line: i + 1,
                content: lines[i].trim()
              });
            }
          }
        } catch (e) {
          // Skip unreadable files
        }
      }
    }
  }
}

console.log('Searching for: "' + SEARCH_TERM + '"');
console.log('Root: ' + ROOT);
console.log('');

walkDir(ROOT);

if (results.length === 0) {
  console.log('NOT FOUND in application source code.');
  console.log('');
  console.log('Checking if it comes from a dependency...');
  
  // Check node_modules for the error
  const nodeModulesPath = path.join(ROOT, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log('Searching node_modules (this may take a moment)...');
    
    // Only search packages that are likely to produce this error
    const likelyPackages = ['next', '@supabase', 'vercel', '@vercel'];
    
    for (const pkg of likelyPackages) {
      const pkgPath = path.join(nodeModulesPath, pkg);
      if (fs.existsSync(pkgPath)) {
        console.log('Checking ' + pkg + '...');
        walkNodeModules(pkgPath, pkg);
      }
    }
  }
} else {
  console.log('FOUND ' + results.length + ' match(es):');
  console.log('');
  for (const r of results) {
    console.log('  File: ' + r.file);
    console.log('  Line: ' + r.line);
    console.log('  Code: ' + r.content);
    console.log('');
  }
}

function walkNodeModules(dir, pkgName) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' || dir.endsWith('node_modules')) {
        walkNodeModules(fullPath, pkgName);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SEARCH_EXTENSIONS.has(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes(SEARCH_TERM)) {
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes(SEARCH_TERM)) {
                console.log('  FOUND in dependency:');
                console.log('  Package: ' + pkgName);
                console.log('  File: ' + path.relative(ROOT, fullPath));
                console.log('  Line: ' + (i + 1));
                console.log('  Code: ' + lines[i].trim().slice(0, 200));
                console.log('');
              }
            }
          }
        } catch (e) {
          // Skip
        }
      }
    }
  }
}

console.log('Search complete.');
