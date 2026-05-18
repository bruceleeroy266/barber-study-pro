// Count orphaned flashcards by reading source files directly
const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, '..', 'src', 'lib');

function countCardsInFile(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  const content = fs.readFileSync(filePath, 'utf8');
  // Count objects with front and back properties
  const fronts = content.match(/front:/g);
  return fronts ? fronts.length : 0;
}

function countCardsInFiles(files) {
  return files.reduce((sum, f) => sum + countCardsInFile(path.join(libDir, f)), 0);
}

console.log('══════════════════════════════════════════════════');
console.log('  ORPHANED FLASHCARD COUNTS (Source Files)');
console.log('══════════════════════════════════════════════════');

// Batch 1
const ch2Files = ['flashcard-expansion.ts'];
const ch5Files = ['flashcard-expansion.ts'];
const ch6Files = ['flashcard-expansion-part2.ts', 'chapter6-enhanced-flashcards.ts'];

// Batch 2
const ch7Files = ['chapter7-enhanced-flashcards.ts'];
const ch8Files = ['chapter8-enhanced-flashcards.ts'];
const ch9Files = ['chapter9-enhanced-flashcards.ts', 'chapter9-enhanced-flashcards-part2.ts'];

// Batch 3
const ch10Files = ['chapter10-enhanced-flashcards.ts', 'chapter10-enhanced-flashcards-part2.ts', 'chapter10-enhanced-flashcards-part3.ts'];
const ch11Files = ['chapter11-enhanced-flashcards.ts', 'chapter11-enhanced-flashcards-part2.ts'];
const ch12Files = ['chapter12-enhanced-flashcards-part1.ts', 'chapter12-enhanced-flashcards-part2.ts', 'chapter12-enhanced-flashcards-part3.ts', 'chapter12-enhanced-flashcards-part4.ts'];

// Batch 4
const ch13Files = ['flashcard-expansion-part4.ts'];
const ch14Files = ['flashcard-expansion-part4.ts'];
const ch15Files = ['chapter15-enhanced-flashcards-part1.ts', 'chapter15-enhanced-flashcards-part2.ts'];
const ch17Files = ['flashcard-expansion-part4.ts'];
const ch18Files = ['flashcard-expansion-part5.ts'];
const ch19Files = ['flashcard-expansion-part5.ts'];
const ch20Files = ['flashcard-expansion-part5.ts'];
const ch21Files = ['flashcard-expansion-part5.ts'];

// Read expansion files to split counts by chapter
const expContent = fs.readFileSync(path.join(libDir, 'flashcard-expansion.ts'), 'utf8');
const expPart4 = fs.readFileSync(path.join(libDir, 'flashcard-expansion-part4.ts'), 'utf8');
const expPart5 = fs.readFileSync(path.join(libDir, 'flashcard-expansion-part5.ts'), 'utf8');

function countInBlock(content, chapterNum) {
  const blockMatch = content.match(new RegExp(`chapter${chapterNum}Flashcards[\\s\\S]*?\\]`, 'g'));
  if (!blockMatch) return 0;
  const fronts = blockMatch[0].match(/front:/g);
  return fronts ? fronts.length : 0;
}

const ch2Count = countInBlock(expContent, 2);
const ch5Count = countInBlock(expContent, 5);

const ch13Count = countInBlock(expPart4, 13);
const ch14Count = countInBlock(expPart4, 14);
const ch17Count = countInBlock(expPart4, 17);

const ch18Count = countInBlock(expPart5, 18);
const ch19Count = countInBlock(expPart5, 19);
const ch20Count = countInBlock(expPart5, 20);
const ch21Count = countInBlock(expPart5, 21);

// Enhanced files
const ch6Enhanced = countCardsInFile(path.join(libDir, 'chapter6-enhanced-flashcards.ts'));
const ch6Part2 = countCardsInFile(path.join(libDir, 'flashcard-expansion-part2.ts'));
const ch6Count = ch6Enhanced + ch6Part2;

const ch7Count = countCardsInFile(path.join(libDir, 'chapter7-enhanced-flashcards.ts'));
const ch8Count = countCardsInFile(path.join(libDir, 'chapter8-enhanced-flashcards.ts'));

const ch9Master = countCardsInFile(path.join(libDir, 'chapter9-enhanced-flashcards.ts'));
const ch9Part2 = countCardsInFile(path.join(libDir, 'chapter9-enhanced-flashcards-part2.ts'));
const ch9Count = ch9Master + ch9Part2;

const ch10Master = countCardsInFile(path.join(libDir, 'chapter10-enhanced-flashcards.ts'));
const ch10Part2 = countCardsInFile(path.join(libDir, 'chapter10-enhanced-flashcards-part2.ts'));
const ch10Part3 = countCardsInFile(path.join(libDir, 'chapter10-enhanced-flashcards-part3.ts'));
const ch10Count = ch10Master + ch10Part2 + ch10Part3;

const ch11Master = countCardsInFile(path.join(libDir, 'chapter11-enhanced-flashcards.ts'));
const ch11Part2 = countCardsInFile(path.join(libDir, 'chapter11-enhanced-flashcards-part2.ts'));
const ch11Count = ch11Master + ch11Part2;

const ch12Part1 = countCardsInFile(path.join(libDir, 'chapter12-enhanced-flashcards-part1.ts'));
const ch12Part2 = countCardsInFile(path.join(libDir, 'chapter12-enhanced-flashcards-part2.ts'));
const ch12Part3 = countCardsInFile(path.join(libDir, 'chapter12-enhanced-flashcards-part3.ts'));
const ch12Part4 = countCardsInFile(path.join(libDir, 'chapter12-enhanced-flashcards-part4.ts'));
const ch12Count = ch12Part1 + ch12Part2 + ch12Part3 + ch12Part4;

const ch15Part1 = countCardsInFile(path.join(libDir, 'chapter15-enhanced-flashcards-part1.ts'));
const ch15Part2 = countCardsInFile(path.join(libDir, 'chapter15-enhanced-flashcards-part2.ts'));
const ch15Count = ch15Part1 + ch15Part2;

console.log('\n📦 BATCH 1 (Ch 2, 5, 6)');
console.log(`  Ch  2: ${String(ch2Count).padStart(3)} cards`);
console.log(`  Ch  5: ${String(ch5Count).padStart(3)} cards`);
console.log(`  Ch  6: ${String(ch6Count).padStart(3)} cards`);
console.log(`  ─────────────────`);
console.log(`  Batch 1 Total: ${ch2Count + ch5Count + ch6Count}`);

console.log('\n📦 BATCH 2 (Ch 7, 8, 9)');
console.log(`  Ch  7: ${String(ch7Count).padStart(3)} cards`);
console.log(`  Ch  8: ${String(ch8Count).padStart(3)} cards`);
console.log(`  Ch  9: ${String(ch9Count).padStart(3)} cards`);
console.log(`  ─────────────────`);
console.log(`  Batch 2 Total: ${ch7Count + ch8Count + ch9Count}`);

console.log('\n📦 BATCH 3 (Ch 10, 11, 12)');
console.log(`  Ch 10: ${String(ch10Count).padStart(3)} cards`);
console.log(`  Ch 11: ${String(ch11Count).padStart(3)} cards`);
console.log(`  Ch 12: ${String(ch12Count).padStart(3)} cards`);
console.log(`  ─────────────────`);
console.log(`  Batch 3 Total: ${ch10Count + ch11Count + ch12Count}`);

console.log('\n📦 BATCH 4 (Ch 13, 14, 15, 17-21)');
console.log(`  Ch 13: ${String(ch13Count).padStart(3)} cards`);
console.log(`  Ch 14: ${String(ch14Count).padStart(3)} cards`);
console.log(`  Ch 15: ${String(ch15Count).padStart(3)} cards`);
console.log(`  Ch 17: ${String(ch17Count).padStart(3)} cards`);
console.log(`  Ch 18: ${String(ch18Count).padStart(3)} cards`);
console.log(`  Ch 19: ${String(ch19Count).padStart(3)} cards`);
console.log(`  Ch 20: ${String(ch20Count).padStart(3)} cards`);
console.log(`  Ch 21: ${String(ch21Count).padStart(3)} cards`);
console.log(`  ─────────────────`);
console.log(`  Batch 4 Total: ${ch13Count + ch14Count + ch15Count + ch17Count + ch18Count + ch19Count + ch20Count + ch21Count}`);

const orphanedTotal = ch2Count + ch5Count + ch6Count + ch7Count + ch8Count + ch9Count + ch10Count + ch11Count + ch12Count + ch13Count + ch14Count + ch15Count + ch17Count + ch18Count + ch19Count + ch20Count + ch21Count;
console.log(`\n📊 ORPHANED GRAND TOTAL: ${orphanedTotal}`);

// Direct source
const fcContent = fs.readFileSync(path.join(libDir, 'flashcards-data.ts'), 'utf8');
const directMatches = [...fcContent.matchAll(/chapter_id: 'ch-(\d+)'/g)];
const directCounts = {};
directMatches.forEach(m => {
  const ch = parseInt(m[1]);
  directCounts[ch] = (directCounts[ch] || 0) + 1;
});
const directTotal = Object.values(directCounts).reduce((a,b) => a+b, 0);

console.log(`📊 DIRECT SOURCE TOTAL: ${directTotal}`);
console.log(`📊 PLATFORM GRAND TOTAL: ${orphanedTotal + directTotal}`);
