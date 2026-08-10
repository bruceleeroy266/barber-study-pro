// BL-002 Color Migration Script
// Replaces hard-coded colors with design tokens

const fs = require('fs');
const path = require('path');

// Color mapping from hard-coded to tokens
const colorMap = {
  // Brand colors
  '#D4AF37': 'var(--color-brand-gold)',
  '#F4E4A6': 'var(--color-brand-gold-light)',
  '#B8941F': 'var(--color-brand-gold)', // darker gold variant
  '#C0C0C0': 'var(--color-brand-silver)',
  '#000000': 'var(--color-brand-black)',
  '#FFFFFF': 'var(--color-brand-white)',
  '#0a0a0a': 'var(--color-background-primary)',
  '#0A0A0A': 'var(--color-background-primary)',
  
  // Neutral colors
  '#1A1A1A': 'var(--color-brand-charcoal)',
  '#1a1a1a': 'var(--color-brand-charcoal)',
  '#2D2D2D': 'var(--color-brand-graphite)',
  '#8C8C8C': 'var(--color-brand-silver-gray)',
  '#E5E5E5': 'var(--color-brand-light-gray)',
  '#F5F5F5': 'var(--color-brand-off-white)',
  
  // Accent colors
  '#1B1F3B': 'var(--color-brand-deep-navy)',
  '#CD7F32': 'var(--color-brand-warm-bronze)',
  '#E5E4E2': 'var(--color-brand-cool-platinum)',
  
  // Semantic mappings
  '#111111': 'var(--color-background-secondary)',
  '#111827': 'var(--color-background-secondary)',
  '#1F2937': 'var(--color-background-tertiary)',
  '#374151': 'var(--color-border-primary)',
  '#4B5563': 'var(--color-border-secondary)',
  '#6B7280': 'var(--color-text-muted)',
  '#9CA3AF': 'var(--color-text-muted)',
  '#D1D5DB': 'var(--color-text-secondary)',
  '#F9FAFB': 'var(--color-text-primary)',
};

// Tailwind class mappings
const tailwindMap = {
  'bg-gray-800': 'bg-[var(--color-background-secondary)]',
  'bg-gray-900': 'bg-[var(--color-background-primary)]',
  'bg-gray-950': 'bg-[var(--color-background-primary)]',
  'text-gray-300': 'text-[var(--color-text-secondary)]',
  'text-gray-400': 'text-[var(--color-text-muted)]',
  'text-gray-500': 'text-[var(--color-text-muted)]',
  'border-gray-700': 'border-[var(--color-border-primary)]',
  'border-gray-800': 'border-[var(--color-border-primary)]',
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  
  // Replace hex colors in arbitrary values
  for (const [hex, token] of Object.entries(colorMap)) {
    // Match hex in arbitrary values: bg-[#D4AF37], text-[#D4AF37], etc.
    const arbitraryRegex = new RegExp(`\\[${hex.replace('#', '\\#')}\\]`, 'g');
    const matches = content.match(arbitraryRegex);
    if (matches) {
      content = content.replace(arbitraryRegex, `[${token}]`);
      count += matches.length;
    }
    
    // Match hex in style attributes: style={{ color: '#D4AF37' }}
    const styleRegex = new RegExp(`['"]${hex.replace('#', '\\#')}['"]`, 'g');
    const styleMatches = content.match(styleRegex);
    if (styleMatches) {
      content = content.replace(styleRegex, `'${token}'`);
      count += styleMatches.length;
    }
  }
  
  // Replace Tailwind gray classes
  for (const [twClass, tokenClass] of Object.entries(tailwindMap)) {
    const regex = new RegExp(`\\b${twClass}\\b`, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, tokenClass);
      count += matches.length;
    }
  }
  
  if (count > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  return count;
}

// Files to migrate (priority order)
const files = [
  'src/app/page.tsx',
  'src/app/demo/DemoClient.tsx',
  'src/app/(auth)/login/page.tsx',
  'src/app/(auth)/signup/page.tsx',
  'src/app/(auth)/reset-password/page.tsx',
  'src/app/(auth)/update-password/page.tsx',
  'src/app/(dashboard)/dashboard/page.tsx',
  'src/app/(dashboard)/dashboard/chapters/page.tsx',
  'src/app/(dashboard)/dashboard/assessments/page.tsx',
  'src/app/(dashboard)/dashboard/grades/page.tsx',
  'src/app/(dashboard)/dashboard/missed-questions/page.tsx',
  'src/app/(dashboard)/dashboard/profile/page.tsx',
  'src/app/(dashboard)/dashboard/progress/page.tsx',
  'src/app/(dashboard)/dashboard/compliance/page.tsx',
  'src/app/(dashboard)/dashboard/messages/page.tsx',
  'src/app/(dashboard)/dashboard/ai-tutor/page.tsx',
  'src/app/instructor/page.tsx',
  'src/app/instructor/students/page.tsx',
  'src/app/instructor/assessments/page.tsx',
  'src/app/instructor/attendance/page.tsx',
  'src/app/instructor/gradebook/page.tsx',
  'src/app/instructor/compliance/page.tsx',
  'src/app/instructor/messages/page.tsx',
  'src/app/instructor/rubrics/page.tsx',
  'src/app/admin/page.tsx',
  'src/app/admin/users/UserManagementClient.tsx',
  'src/components/QuizClient.tsx',
  'src/components/FlashcardClient.tsx',
  'src/components/ContactForm.tsx',
];

let totalCount = 0;
const results = [];

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const count = migrateFile(filePath);
    if (count > 0) {
      results.push({ file, count });
      totalCount += count;
    }
  }
}

console.log('BL-002 Color Migration Results:');
console.log('================================');
for (const { file, count } of results) {
  console.log(`${file}: ${count} replacements`);
}
console.log('================================');
console.log(`Total: ${totalCount} color values migrated`);
