/**
 * Complete Content Extraction Script
 * Extracts quiz data AND flashcard data from HTML files
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'C:\\Users\\skyfl\\Desktop\\BarberStudyPro-Master';
const OUTPUT_DIR = 'C:\\Users\\skyfl\\Desktop\\barber-study-pro-v2\\migrated-content';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function extractQuizData(htmlContent, chapterNumber) {
  const questions = [];
  
  // Look for quizData array
  const quizMatch = htmlContent.match(/const quizData = ([\s\S]*?]);/);
  if (!quizMatch) return questions;
  
  try {
    // Find all question objects
    const qMatches = quizMatch[1].match(/\{[\s\S]*?question:[\s\S]*?explanation:[\s\S]*?\}/g);
    if (!qMatches) return questions;
    
    qMatches.forEach((qStr, idx) => {
      const question = qStr.match(/question:\s*"([^"]+)"/)?.[1] || '';
      const optionsMatch = qStr.match(/options:\s*\[([\s\S]*?)\]/);
      const options = [];
      
      if (optionsMatch) {
        const opts = optionsMatch[1].match(/"([^"]+)"/g);
        if (opts) {
          opts.forEach(opt => options.push(opt.replace(/"/g, '')));
        }
      }
      
      const answer = parseInt(qStr.match(/answer:\s*(\d+)/)?.[1] || '0');
      const difficulty = qStr.match(/difficulty:\s*"([^"]+)"/)?.[1] || 'medium';
      const explanation = qStr.match(/explanation:\s*"([^"]+)"/)?.[1] || '';
      
      if (question && options.length >= 4) {
        questions.push({
          chapterNumber,
          question,
          answerA: options[0],
          answerB: options[1],
          answerC: options[2],
          answerD: options[3],
          correctAnswer: ['a', 'b', 'c', 'd'][answer] || 'a',
          explanation,
          difficulty,
          orderIndex: idx
        });
      }
    });
  } catch (e) {
    console.error(`Quiz extraction error chapter ${chapterNumber}:`, e.message);
  }
  
  return questions;
}

function extractFlashcards(htmlContent, chapterNumber) {
  const flashcards = [];
  
  // Look for flashcards array with question/answer/detail structure
  const fcMatch = htmlContent.match(/const flashcards = ([\s\S]*?]);/);
  if (!fcMatch) return flashcards;
  
  try {
    // Find all card objects
    const cardMatches = fcMatch[1].match(/\{[^{}]*category:[^{}]*\}/g);
    if (!cardMatches) return flashcards;
    
    cardMatches.forEach((cardStr, idx) => {
      const category = cardStr.match(/category:\s*['"]([^'"]+)['"]/)?.[1] || 'general';
      const question = cardStr.match(/question:\s*['"]([^'"]+)['"]/)?.[1] || '';
      const answer = cardStr.match(/answer:\s*['"]([^'"]+)['"]/)?.[1] || '';
      const detail = cardStr.match(/detail:\s*['"]([^'"]+)['"]/)?.[1] || '';
      
      if (question && answer) {
        flashcards.push({
          chapterNumber,
          front: question,
          back: answer,
          detail: detail,
          category,
          difficulty: 'medium',
          orderIndex: idx
        });
      }
    });
  } catch (e) {
    console.error(`Flashcard extraction error chapter ${chapterNumber}:`, e.message);
  }
  
  return flashcards;
}

function processChapter(chapterNumber) {
  const num = String(chapterNumber).padStart(2, '0');
  const quizFile = path.join(SOURCE_DIR, `chapter-${num}-quiz-expanded.html`);
  const flashcardFile = path.join(SOURCE_DIR, `chapter-${num}-flashcards.html`);
  
  const result = {
    chapterNumber,
    quizQuestions: [],
    flashcards: [],
    errors: []
  };
  
  // Extract quiz data
  if (fs.existsSync(quizFile)) {
    try {
      const content = fs.readFileSync(quizFile, 'utf8');
      result.quizQuestions = extractQuizData(content, chapterNumber);
      console.log(`✓ Chapter ${chapterNumber}: ${result.quizQuestions.length} quiz questions`);
    } catch (e) {
      result.errors.push(`Quiz: ${e.message}`);
    }
  } else {
    result.errors.push(`Quiz file not found`);
  }
  
  // Extract flashcards
  if (fs.existsSync(flashcardFile)) {
    try {
      const content = fs.readFileSync(flashcardFile, 'utf8');
      result.flashcards = extractFlashcards(content, chapterNumber);
      console.log(`✓ Chapter ${chapterNumber}: ${result.flashcards.length} flashcards`);
    } catch (e) {
      result.errors.push(`Flashcards: ${e.message}`);
    }
  } else {
    result.errors.push(`Flashcard file not found`);
  }
  
  return result;
}

console.log('=== CONTENT EXTRACTION STARTED ===\n');

const allResults = [];
for (let i = 1; i <= 21; i++) {
  const result = processChapter(i);
  allResults.push(result);
}

// Save all results
const resultsFile = path.join(OUTPUT_DIR, 'all-content-extracted.json');
fs.writeFileSync(resultsFile, JSON.stringify(allResults, null, 2));

// Generate summary
const summary = {
  totalChapters: 21,
  chaptersWithQuizzes: allResults.filter(r => r.quizQuestions.length > 0).length,
  chaptersWithFlashcards: allResults.filter(r => r.flashcards.length > 0).length,
  totalQuizQuestions: allResults.reduce((sum, r) => sum + r.quizQuestions.length, 0),
  totalFlashcards: allResults.reduce((sum, r) => sum + r.flashcards.length, 0),
  quizQuestionsPerChapter: allResults.map(r => ({ chapter: r.chapterNumber, count: r.quizQuestions.length })),
  flashcardsPerChapter: allResults.map(r => ({ chapter: r.chapterNumber, count: r.flashcards.length })),
  chaptersWithErrors: allResults.filter(r => r.errors.length > 0).map(r => ({
    chapter: r.chapterNumber,
    errors: r.errors
  }))
};

const summaryFile = path.join(OUTPUT_DIR, 'extraction-summary.json');
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

// Generate Supabase seed SQL
let seedSQL = `-- Barber Study Pro v2.0 - Content Seed File
-- Generated: ${new Date().toISOString()}

`;

// Add quiz questions
allResults.forEach(result => {
  if (result.quizQuestions.length > 0) {
    seedSQL += `\n-- Chapter ${result.chapterNumber} Quiz Questions (${result.quizQuestions.length})\n`;
    result.quizQuestions.forEach(q => {
      seedSQL += `INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, '${q.question.replace(/'/g, "''")}', '${q.answerA.replace(/'/g, "''")}', '${q.answerB.replace(/'/g, "''")}', '${q.answerC.replace(/'/g, "''")}', '${q.answerD.replace(/'/g, "''")}', '${q.correctAnswer}', '${q.explanation.replace(/'/g, "''")}', '${q.difficulty}', ${q.orderIndex}
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = ${q.chapterNumber});
`;
    });
  }
});

// Add flashcards
allResults.forEach(result => {
  if (result.flashcards.length > 0) {
    seedSQL += `\n-- Chapter ${result.chapterNumber} Flashcards (${result.flashcards.length})\n`;
    result.flashcards.forEach(f => {
      seedSQL += `INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = ${f.chapterNumber}), '${f.front.replace(/'/g, "''")}', '${f.back.replace(/'/g, "''")}', '${f.category}', '${f.difficulty}', ${f.orderIndex});
`;
    });
  }
});

const seedFile = path.join(OUTPUT_DIR, 'supabase-content-seed.sql');
fs.writeFileSync(seedFile, seedSQL);

console.log('\n=== EXTRACTION COMPLETE ===');
console.log(`Quiz Questions: ${summary.totalQuizQuestions} across ${summary.chaptersWithQuizzes} chapters`);
console.log(`Flashcards: ${summary.totalFlashcards} across ${summary.chaptersWithFlashcards} chapters`);
console.log(`Chapters with errors: ${summary.chaptersWithErrors.length}`);
console.log(`\nFiles created:`);
console.log(`  - ${resultsFile}`);
console.log(`  - ${summaryFile}`);
console.log(`  - ${seedFile}`);
