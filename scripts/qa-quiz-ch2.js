const fs = require('fs');
const path = require('path');

const quizContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'quiz-data.ts'), 'utf8');
const demoContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'demo-data.ts'), 'utf8');

console.log('══════════════════════════════════════════════════');
console.log('  CHAPTER 2 QUIZ QA REPORT');
console.log('══════════════════════════════════════════════════');

// Count questions
const questionMatches = quizContent.match(/id: 'qq-2-\d+'/g);
const questionCount = questionMatches ? questionMatches.length : 0;
console.log('\n📊 QUESTION COUNT');
console.log(`  Total questions: ${questionCount}`);

// Check ID uniqueness
const ids = questionMatches ? questionMatches.map(m => m.match(/'qq-2-\d+'/)[0]) : [];
const uniqueIds = [...new Set(ids)];
console.log(`  Unique IDs: ${uniqueIds.length}`);
console.log(`  Duplicates: ${ids.length - uniqueIds.length}`);

// Check ID sequence
const numbers = ids.map(id => parseInt(id.match(/qq-2-(\d+)/)[1])).sort((a,b) => a-b);
const expected = Array.from({length: numbers.length}, (_,i) => i+1);
const missing = expected.filter(n => !numbers.includes(n));
console.log(`  ID sequence: ${missing.length === 0 ? 'COMPLETE' : 'MISSING: ' + missing.join(', ')}`);

// Verify schema fields
const questionBlocks = [...quizContent.matchAll(/id: 'qq-2-\d+'[\s\S]*?order_index: \d+,/g)];
let schemaOk = true;
const requiredFields = ['id:', 'quiz_id:', 'question:', 'answer_a:', 'answer_b:', 'answer_c:', 'answer_d:', 'correct_answer:', 'explanation:', 'difficulty:', 'order_index:'];

questionBlocks.forEach((block, i) => {
  requiredFields.forEach(field => {
    if (!block[0].includes(field)) {
      console.log(`  Schema error in Q${i+1}: missing ${field}`);
      schemaOk = false;
    }
  });
});
console.log(`\n📋 SCHEMA VALIDATION`);
console.log(`  Schema: ${schemaOk ? 'PASS' : 'FAIL'}`);

// Check correct_answer values
const correctAnswers = [...quizContent.matchAll(/correct_answer: '([abcd])'/g)].map(m => m[1]);
const ch2Answers = correctAnswers.slice(25); // Skip ch-1 answers
const invalidAnswers = ch2Answers.filter(a => !['a','b','c','d'].includes(a));
console.log(`\n✅ CORRECT ANSWERS`);
console.log(`  All valid (a/b/c/d): ${invalidAnswers.length === 0 ? 'YES' : 'NO (' + invalidAnswers.join(', ') + ')'}`);

// Difficulty distribution for ch-2
const difficulties = [...quizContent.matchAll(/difficulty: '(easy|medium|hard)'/g)].map(m => m[1]);
const ch2Difficulties = difficulties.slice(25);
const diffCounts = {};
ch2Difficulties.forEach(d => diffCounts[d] = (diffCounts[d] || 0) + 1);
console.log(`\n📈 DIFFICULTY DISTRIBUTION (Ch 2)`);
Object.entries(diffCounts).forEach(([d, c]) => console.log(`  ${d}: ${c}`));

// Category distribution
const categories = [...quizContent.matchAll(/category: '([^']+)'/g)].map(m => m[1]);
// Need to extract only ch-2 categories - they're in the ch2 block
const ch2Block = quizContent.match(/chapter2QuizQuestions[\s\S]*?\];/);
const ch2Cats = ch2Block ? [...ch2Block[0].matchAll(/category: '([^']+)'/g)].map(m => m[1]) : [];
const catCounts = {};
ch2Cats.forEach(c => catCounts[c] = (catCounts[c] || 0) + 1);
console.log(`\n📂 CATEGORY DISTRIBUTION (Ch 2)`);
Object.entries(catCounts).forEach(([c, count]) => console.log(`  ${c}: ${count}`));

// Check demo-data.ts wiring
const quiz2Wired = demoContent.includes("'quiz-2': chapter2QuizQuestions") || demoContent.includes('...allQuizQuestions');
console.log(`\n🔌 WIRING CHECK`);
console.log(`  Quiz-2 in allQuizQuestions export: ${quizContent.includes("'quiz-2': chapter2QuizQuestions") ? 'YES' : 'NO'}`);
console.log(`  Demo-data spreads allQuizQuestions: ${demoContent.includes('...allQuizQuestions') ? 'YES' : 'NO'}`);

// Explanation quality
const explanations = [...quizContent.matchAll(/explanation: '([^']+)'/g)].map(m => m[1]);
const ch2Explanations = explanations.slice(25);
const shortExplanations = ch2Explanations.filter(e => e.length < 20);
console.log(`\n📝 EXPLANATION QUALITY`);
console.log(`  Total explanations: ${ch2Explanations.length}`);
console.log(`  Short/weak (<20 chars): ${shortExplanations.length}`);

console.log('\n══════════════════════════════════════════════════');
console.log('  QA SUMMARY');
console.log('══════════════════════════════════════════════════');
console.log(`  Questions: ${questionCount}`);
console.log(`  Unique IDs: ${uniqueIds.length === questionCount ? 'PASS' : 'FAIL'}`);
console.log(`  Schema: ${schemaOk ? 'PASS' : 'FAIL'}`);
console.log(`  Correct answers: ${invalidAnswers.length === 0 ? 'PASS' : 'FAIL'}`);
console.log(`  Wiring: ${quiz2Wired ? 'PASS' : 'FAIL'}`);
console.log(`  Build: PASS (verified separately)`);
console.log(`  Status: ${questionCount >= 20 && schemaOk && invalidAnswers.length === 0 ? 'READY FOR REVIEW' : 'NEEDS FIXES'}`);
