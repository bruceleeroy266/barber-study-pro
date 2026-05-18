const fs = require('fs');

// Check demo-data.ts for chapter assignments
const content = fs.readFileSync('src/lib/demo-data.ts', 'utf8');

// Count chapters with real data
const realChapters = [];
for (let i = 1; i <= 21; i++) {
  const chId = 'ch-' + i;
  const hasBatch1 = content.includes("batch1Flashcards['" + chId + "']");
  const hasBatch2 = content.includes("batch2Flashcards['" + chId + "']");
  const hasBatch3 = content.includes("batch3Flashcards['" + chId + "']");
  const hasBatch4 = content.includes("batch4Flashcards['" + chId + "']");
  const hasReal = content.includes("realFlashcards['" + chId + "']");
  
  if (hasBatch1 || hasBatch2 || hasBatch3 || hasBatch4 || hasReal) {
    realChapters.push(i);
  }
}

console.log('Chapters with real flashcards:', realChapters.join(', '));
console.log('Total chapters with real data:', realChapters.length);
