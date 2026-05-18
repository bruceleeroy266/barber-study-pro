const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, '..', 'src', 'lib');

function countCardsByChapterInFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const results = {};

  // Find all chapter exports
  const chapterMatches = [...content.matchAll(/export const chapter(\d+)Flashcards[\s\S]*?\n\]/g)];
  chapterMatches.forEach(match => {
    const chNum = parseInt(match[1]);
    const block = match[0];
    const fronts = block.match(/front:/g);
    results[chNum] = fronts ? fronts.length : 0;
  });

  return results;
}

function countCardsInFile(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  const content = fs.readFileSync(filePath, 'utf8');
  const fronts = content.match(/front:/g);
  return fronts ? fronts.length : 0;
}

console.log('══════════════════════════════════════════════════');
console.log('  ORPHANED FLASHCARD COUNTS (Corrected)');
console.log('══════════════════════════════════════════════════');

// flashcard-expansion.ts
const expCounts = countCardsByChapterInFile(path.join(libDir, 'flashcard-expansion.ts'));

// flashcard-expansion-part4.ts
const exp4Counts = countCardsByChapterInFile(path.join(libDir, 'flashcard-expansion-part4.ts'));

// flashcard-expansion-part5.ts
const exp5Counts = countCardsByChapterInFile(path.join(libDir, 'flashcard-expansion-part5.ts'));

// Individual enhanced files
const ch6Enhanced = countCardsInFile(path.join(libDir, 'chapter6-enhanced-flashcards.ts'));
const ch6Part2 = countCardsInFile(path.join(libDir, 'flashcard-expansion-part2.ts'));
const ch7Count = countCardsInFile(path.join(libDir, 'chapter7-enhanced-flashcards.ts'));
const ch8Count = countCardsInFile(path.join(libDir, 'chapter8-enhanced-flashcards.ts'));
const ch9Master = countCardsInFile(path.join(libDir, 'chapter9-enhanced-flashcards.ts'));
const ch9Part2 = countCardsInFile(path.join(libDir, 'chapter9-enhanced-flashcards-part2.ts'));
const ch10Master = countCardsInFile(path.join(libDir, 'chapter10-enhanced-flashcards.ts'));
const ch10Part2 = countCardsInFile(path.join(libDir, 'chapter10-enhanced-flashcards-part2.ts'));
const ch10Part3 = countCardsInFile(path.join(libDir, 'chapter10-enhanced-flashcards-part3.ts'));
const ch11Master = countCardsInFile(path.join(libDir, 'chapter11-enhanced-flashcards.ts'));
const ch11Part2 = countCardsInFile(path.join(libDir, 'chapter11-enhanced-flashcards-part2.ts'));
const ch12Part1 = countCardsInFile(path.join(libDir, 'chapter12-enhanced-flashcards-part1.ts'));
const ch12Part2 = countCardsInFile(path.join(libDir, 'chapter12-enhanced-flashcards-part2.ts'));
const ch12Part3 = countCardsInFile(path.join(libDir, 'chapter12-enhanced-flashcards-part3.ts'));
const ch12Part4 = countCardsInFile(path.join(libDir, 'chapter12-enhanced-flashcards-part4.ts'));
const ch15Part1 = countCardsInFile(path.join(libDir, 'chapter15-enhanced-flashcards-part1.ts'));
const ch15Part2 = countCardsInFile(path.join(libDir, 'chapter15-enhanced-flashcards-part2.ts'));

const allCounts = {
  2: expCounts[2] || 0,
  5: expCounts[5] || 0,
  6: ch6Enhanced + ch6Part2,
  7: ch7Count,
  8: ch8Count,
  9: ch9Master + ch9Part2,
  10: ch10Master + ch10Part2 + ch10Part3,
  11: ch11Master + ch11Part2,
  12: ch12Part1 + ch12Part2 + ch12Part3 + ch12Part4,
  13: exp4Counts[13] || 0,
  14: exp4Counts[14] || 0,
  15: ch15Part1 + ch15Part2,
  17: exp4Counts[17] || 0,
  18: exp5Counts[18] || 0,
  19: exp5Counts[19] || 0,
  20: exp5Counts[20] || 0,
  21: exp5Counts[21] || 0,
};

console.log('\n📦 ORPHANED CARDS BY CHAPTER');
Object.entries(allCounts).sort((a,b) => a[0]-b[0]).forEach(([ch, count]) => {
  console.log(`  Ch ${String(ch).padStart(2)}: ${String(count).padStart(3)} cards`);
});

const orphanedTotal = Object.values(allCounts).reduce((a,b) => a+b, 0);
console.log(`  ─────────────────`);
console.log(`  ORPHANED TOTAL:  ${orphanedTotal}`);

// Direct source counts
const fcContent = fs.readFileSync(path.join(libDir, 'flashcards-data.ts'), 'utf8');
const directMatches = [...fcContent.matchAll(/chapter_id: 'ch-(\d+)'/g)];
const directCounts = {};
directMatches.forEach(m => {
  const ch = parseInt(m[1]);
  directCounts[ch] = (directCounts[ch] || 0) + 1;
});

console.log('\n📚 DIRECT SOURCE CARDS BY CHAPTER');
Object.entries(directCounts).sort((a,b) => a[0]-b[0]).forEach(([ch, count]) => {
  console.log(`  Ch ${String(ch).padStart(2)}: ${String(count).padStart(3)} cards`);
});
const directTotal = Object.values(directCounts).reduce((a,b) => a+b, 0);
console.log(`  ─────────────────`);
console.log(`  DIRECT TOTAL:    ${directTotal}`);

// Combined
console.log('\n══════════════════════════════════════════════════');
console.log('  COMBINED PLATFORM TOTALS');
console.log('══════════════════════════════════════════════════');

const combined = {};
for (let i = 1; i <= 21; i++) combined[i] = 0;
Object.entries(allCounts).forEach(([ch, count]) => combined[ch] = count);
Object.entries(directCounts).forEach(([ch, count]) => combined[ch] = (combined[ch] || 0) + count);

let realChapters = 0;
Object.entries(combined).sort((a,b) => a[0]-b[0]).forEach(([ch, count]) => {
  const status = count > 3 ? '✅' : '⏳';
  if (count > 3) realChapters++;
  console.log(`  Ch ${String(ch).padStart(2)}: ${String(count).padStart(3)} cards ${status}`);
});

const grandTotal = Object.values(combined).reduce((a,b) => a+b, 0);
console.log(`  ─────────────────`);
console.log(`  GRAND TOTAL:     ${grandTotal}`);
console.log(`  REAL CHAPTERS:   ${realChapters}/21`);
