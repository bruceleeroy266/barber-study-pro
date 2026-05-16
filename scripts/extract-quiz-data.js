/**
 * Quiz Data Extraction Script
 * Extracts quiz questions from HTML files containing quizData arrays
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'C:\\Users\\skyfl\\Desktop\\BarberStudyPro-Master';
const OUTPUT_DIR = 'C:\\Users\\skyfl\\Desktop\\barber-study-pro-v2\\migrated-content';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function extractQuizDataFromHTML(htmlContent, chapterNumber) {
  const questions = [];
  
  // Look for quizData array pattern
  const quizDataMatch = htmlContent.match(/const quizData = ([\s\S]*?]);/);
  if (!quizDataMatch) {
    console.log(`Chapter ${chapterNumber}: No quizData found`);
    return null;
  }
  
  try {
    // Extract the array content
    let dataStr = quizDataMatch[1];
    
    // Parse individual question objects
    const questionMatches = dataStr.match(/\{[\s\S]*?question:[\s\S]*?\}/g);
    if (!questionMatches) {
      console.log(`Chapter ${chapterNumber}: No question objects found`);
      return null;
    }
    
    questionMatches.forEach((qStr, index) => {
      try {
        // Extract fields using regex
        const question = qStr.match(/question:\s*"([^"]+)"/)?.[1] || '';
        const options = [];
        
        // Extract options array
        const optionsMatch = qStr.match(/options:\s*\[([\s\S]*?)\]/);
        if (optionsMatch) {
          const opts = optionsMatch[1].match(/"([^"]+)"/g);
          if (opts) {
            opts.forEach(opt => {
              options.push(opt.replace(/"/g, ''));
            });
          }
        }
        
        const answer = parseInt(qStr.match(/answer:\s*(\d+)/)?.[1] || '0');
        const difficulty = qStr.match(/difficulty:\s*"([^"]+)"/)?.[1] || 'medium';
        const explanation = qStr.match(/explanation:\s*"([^"]+)"/)?.[1] || '';
        
        if (question && options.length >= 4) {
          questions.push({
            chapterNumber,
            question,
            answerA: options[0] || '',
            answerB: options[1] || '',
            answerC: options[2] || '',
            answerD: options[3] || '',
            correctAnswer: ['a', 'b', 'c', 'd'][answer] || 'a',
            explanation,
            difficulty,
            orderIndex: index
          });
        }
      } catch (e) {
        console.error(`Error parsing question ${index} in chapter ${chapterNumber}:`, e.message);
      }
    });
    
    return questions;
  } catch (e) {
    console.error(`Error extracting quiz data for chapter ${chapterNumber}:`, e.message);
    return null;
  }
}

function extractFlashcardsFromHTML(htmlContent, chapterNumber) {
  const flashcards = [];
  
  // Look for flashcard data in various patterns
  // Pattern 1: Direct flashcard objects
  const cardMatches = htmlContent.match(/\{[^}]*front:[^}]*back:[^}]*\}/g);
  
  if (cardMatches) {
    cardMatches.forEach((cardStr, index) => {
      try {
        const front = cardStr.match(/front:\s*"([^"]+)"/)?.[1] || '';
        const back = cardStr.match(/back:\s*"([^"]+)"/)?.[1] || '';
        const category = cardStr.match(/category:\s*"([^"]+)"/)?.[1] || 'general';
        const difficulty = cardStr.match(/difficulty:\s*"([^"]+)"/)?.[1] || 'medium';
        
        if (front && back) {
          flashcards.push({
            chapterNumber,
            front,
            back,
            category,
            difficulty,
            orderIndex: index
          });
        }
      } catch (e) {
        console.error(`Error parsing flashcard ${index}:`, e.message);
      }
    });
  }
  
  return flashcards;
}

function processChapter(chapterNumber) {
  const quizFile = path.join(SOURCE_DIR, `chapter-${String(chapterNumber).padStart(2, '0')}-quiz-expanded.html`);
  const flashcardFile = path.join(SOURCE_DIR, `chapter-${String(chapterNumber).padStart(2, '0')}-flashcards.html`);
  const chapterFile = path.join(SOURCE_DIR, `chapter-${String(chapterNumber).padStart(2, '0')}.html`);
  
  const result = {
    chapterNumber,
    quizQuestions: [],
    flashcards: [],
    notes: null,
    errors: []
  };
  
  // Extract quiz data
  if (fs.existsSync(quizFile)) {
    try {
      const quizContent = fs.readFileSync(quizFile, 'utf8');
      const questions = extractQuizDataFromHTML(quizContent, chapterNumber);
      if (questions && questions.length > 0) {
        result.quizQuestions = questions;
        console.log(`Chapter ${chapterNumber}: Extracted ${questions.length} quiz questions`);
      } else {
        result.errors.push('No quiz questions extracted');
      }
    } catch (e) {
      result.errors.push(`Quiz extraction error: ${e.message}`);
    }
  } else {
    result.errors.push(`Quiz file not found: ${quizFile}`);
  }
  
  // Extract flashcards
  if (fs.existsSync(flashcardFile)) {
    try {
      const flashcardContent = fs.readFileSync(flashcardFile, 'utf8');
      const cards = extractFlashcardsFromHTML(flashcardContent, chapterNumber);
      if (cards && cards.length > 0) {
        result.flashcards = cards;
        console.log(`Chapter ${chapterNumber}: Extracted ${cards.length} flashcards`);
      }
    } catch (e) {
      result.errors.push(`Flashcard extraction error: ${e.message}`);
    }
  }
  
  return result;
}

// Process all chapters
console.log('Starting content extraction...\n');

const allResults = [];
for (let i = 1; i <= 21; i++) {
  const result = processChapter(i);
  allResults.push(result);
}

// Save results
const outputFile = path.join(OUTPUT_DIR, 'extraction-results.json');
fs.writeFileSync(outputFile, JSON.stringify(allResults, null, 2));

// Generate summary
const summary = {
  totalChapters: 21,
  chaptersWithQuizzes: allResults.filter(r => r.quizQuestions.length > 0).length,
  chaptersWithFlashcards: allResults.filter(r => r.flashcards.length > 0).length,
  totalQuizQuestions: allResults.reduce((sum, r) => sum + r.quizQuestions.length, 0),
  totalFlashcards: allResults.reduce((sum, r) => sum + r.flashcards.length, 0),
  errors: allResults.filter(r => r.errors.length > 0).map(r => ({
    chapter: r.chapterNumber,
    errors: r.errors
  }))
};

const summaryFile = path.join(OUTPUT_DIR, 'extraction-summary.json');
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

console.log('\n=== EXTRACTION COMPLETE ===');
console.log(`Chapters with quizzes: ${summary.chaptersWithQuizzes}/21`);
console.log(`Chapters with flashcards: ${summary.chaptersWithFlashcards}/21`);
console.log(`Total quiz questions: ${summary.totalQuizQuestions}`);
console.log(`Total flashcards: ${summary.totalFlashcards}`);
console.log(`Chapters with errors: ${summary.errors.length}`);
console.log(`\nResults saved to: ${outputFile}`);
console.log(`Summary saved to: ${summaryFile}`);
