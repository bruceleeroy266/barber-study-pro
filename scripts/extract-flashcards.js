/**
 * Flashcard Extraction Script
 * Extracts flashcard data from HTML files
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'C:\\Users\\skyfl\\Desktop\\BarberStudyPro-Master';
const OUTPUT_DIR = 'C:\\Users\\skyfl\\Desktop\\barber-study-pro-v2\\migrated-content';

function extractFlashcardsAdvanced(htmlContent, chapterNumber) {
  const flashcards = [];
  
  // Pattern 1: Look for flashcardData or similar arrays
  const dataPatterns = [
    /const flashcardData = ([\s\S]*?]);/,
    /const flashcards = ([\s\S]*?]);/,
    /let flashcards = ([\s\S]*?]);/,
    /var flashcards = ([\s\S]*?]);/
  ];
  
  for (const pattern of dataPatterns) {
    const match = htmlContent.match(pattern);
    if (match) {
      try {
        // Extract objects from the array
        const objMatches = match[1].match(/\{[^{}]*\}/g);
        if (objMatches) {
          objMatches.forEach((objStr, idx) => {
            const front = objStr.match(/front:\s*["']([^"']+)["']/)?.[1] || 
                         objStr.match(/front:\s*`([^`]+)`/)?.[1] || '';
            const back = objStr.match(/back:\s*["']([^"']+)["']/)?.[1] || 
                        objStr.match(/back:\s*`([^`]+)`/)?.[1] || '';
            
            if (front && back) {
              flashcards.push({
                chapterNumber,
                front: front.trim(),
                back: back.trim(),
                category: objStr.match(/category:\s*["']([^"']+)["']/)?.[1] || 'general',
                difficulty: objStr.match(/difficulty:\s*["']([^"']+)["']/)?.[1] || 'medium',
                orderIndex: idx
              });
            }
          });
        }
      } catch (e) {
        console.error(`Pattern error for chapter ${chapterNumber}:`, e.message);
      }
    }
  }
  
  // Pattern 2: Look for HTML flashcard structures
  const htmlCardPattern = /<div[^>]*class="[^"]*flashcard[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
  const htmlMatches = htmlContent.match(htmlCardPattern);
  
  if (htmlMatches && flashcards.length === 0) {
    htmlMatches.forEach((cardHtml, idx) => {
      const front = cardHtml.match(/class="[^"]*front[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ||
                   cardHtml.match(/data-front="([^"]+)"/)?.[1] || '';
      const back = cardHtml.match(/class="[^"]*back[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ||
                  cardHtml.match(/data-back="([^"]+)"/)?.[1] || '';
      
      if (front && back) {
        flashcards.push({
          chapterNumber,
          front: front.replace(/<[^>]+>/g, '').trim(),
          back: back.replace(/<[^>]+>/g, '').trim(),
          category: 'general',
          difficulty: 'medium',
          orderIndex: idx
        });
      }
    });
  }
  
  return flashcards;
}

function processChapter(chapterNumber) {
  const flashcardFile = path.join(SOURCE_DIR, `chapter-${String(chapterNumber).padStart(2, '0')}-flashcards.html`);
  
  const result = {
    chapterNumber,
    flashcards: [],
    errors: []
  };
  
  if (fs.existsSync(flashcardFile)) {
    try {
      const content = fs.readFileSync(flashcardFile, 'utf8');
      const cards = extractFlashcardsAdvanced(content, chapterNumber);
      if (cards.length > 0) {
        result.flashcards = cards;
        console.log(`Chapter ${chapterNumber}: Extracted ${cards.length} flashcards`);
      } else {
        result.errors.push('No flashcards found - may need manual extraction');
      }
    } catch (e) {
      result.errors.push(`Extraction error: ${e.message}`);
    }
  } else {
    result.errors.push(`Flashcard file not found`);
  }
  
  return result;
}

console.log('Starting flashcard extraction...\n');

const allResults = [];
for (let i = 1; i <= 21; i++) {
  const result = processChapter(i);
  allResults.push(result);
}

// Save results
const outputFile = path.join(OUTPUT_DIR, 'flashcard-extraction.json');
fs.writeFileSync(outputFile, JSON.stringify(allResults, null, 2));

const summary = {
  totalChapters: 21,
  chaptersWithFlashcards: allResults.filter(r => r.flashcards.length > 0).length,
  totalFlashcards: allResults.reduce((sum, r) => sum + r.flashcards.length, 0),
  chaptersNeedingManual: allResults.filter(r => r.errors.length > 0).map(r => r.chapterNumber)
};

const summaryFile = path.join(OUTPUT_DIR, 'flashcard-summary.json');
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

console.log('\n=== FLASHCARD EXTRACTION COMPLETE ===');
console.log(`Chapters with flashcards: ${summary.chaptersWithFlashcards}/21`);
console.log(`Total flashcards: ${summary.totalFlashcards}`);
console.log(`Chapters needing manual extraction: ${summary.chaptersNeedingManual.join(', ') || 'None'}`);
console.log(`\nResults saved to: ${outputFile}`);
