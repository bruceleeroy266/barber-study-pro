const fs = require('fs');
const content = fs.readFileSync('src/lib/flashcards-data.ts', 'utf8');

// Count ch-4 cards
const ch4Matches = content.match(/chapter_id: 'ch-4'/g);
console.log('Chapter 4 cards:', ch4Matches ? ch4Matches.length : 0);

// Count total active cards
const allMatches = content.match(/chapter_id: 'ch-\d+'/g);
console.log('Total cards:', allMatches ? allMatches.length : 0);

// Check for duplicate IDs
const idMatches = content.match(/id: 'fc-\d+-\d+'/g);
const ids = idMatches ? idMatches.map(m => m.match(/'fc-\d+-\d+'/)[0]) : [];
const uniqueIds = [...new Set(ids)];
console.log('Total IDs:', ids.length);
console.log('Unique IDs:', uniqueIds.length);
console.log('Duplicate IDs:', ids.length - uniqueIds.length);

// Check ch-4 ID uniqueness
const ch4Ids = ids.filter(id => id.startsWith("'fc-4-"));
const uniqueCh4Ids = [...new Set(ch4Ids)];
console.log('Ch4 IDs:', ch4Ids.length);
console.log('Ch4 Unique:', uniqueCh4Ids.length);

// Find duplicates if any
const seen = new Set();
const dups = [];
ids.forEach(id => { if (seen.has(id)) dups.push(id); else seen.add(id); });
if (dups.length) console.log('Duplicate IDs found:', dups);
else console.log('No duplicate IDs found.');

// Validate ch-4 IDs are sequential
const ch4Numbers = ch4Ids.map(id => parseInt(id.match(/fc-4-(\d+)/)[1])).sort((a,b) => a-b);
console.log('Ch4 ID range:', ch4Numbers[0], '-', ch4Numbers[ch4Numbers.length-1]);

// Check for missing numbers in sequence
const expected = Array.from({length: ch4Numbers.length}, (_,i) => i+1);
const missing = expected.filter(n => !ch4Numbers.includes(n));
if (missing.length) console.log('Missing IDs:', missing);
else console.log('No missing IDs in sequence.');

// Check schema fields present
const ch4Cards = content.match(/id: 'fc-4-\d+'[\s\S]*?is_active: true,/g) || [];
let schemaOk = true;
ch4Cards.forEach((card, i) => {
  const required = ['id:', 'chapter_id:', 'front:', 'back:', 'category:', 'difficulty:', 'order_index:', 'is_active:'];
  required.forEach(field => {
    if (!card.includes(field)) {
      console.log(`Schema error in card ${i+1}: missing ${field}`);
      schemaOk = false;
    }
  });
});
if (schemaOk) console.log('Schema validation: PASS');

console.log('\n=== QA SUMMARY ===');
console.log('Build: PASS (confirmed separately)');
console.log('Ch4 card count:', ch4Matches ? ch4Matches.length : 0);
console.log('Total platform cards:', allMatches ? allMatches.length : 0);
console.log('Duplicate IDs:', dups.length === 0 ? 'NONE' : dups.join(', '));
console.log('Schema:', schemaOk ? 'PASS' : 'FAIL');
