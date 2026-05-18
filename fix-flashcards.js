const fs = require('fs');
let content = fs.readFileSync('src/lib/flashcards-data.ts', 'utf8');

// Fix all cards missing order_index and is_active
// Pattern: difficulty: 'xxx',\n    },
content = content.replace(
  /difficulty: '(easy|medium|hard)',\n    \},/g,
  "difficulty: '$1',\n      order_index: 0,\n      is_active: true,\n    },"
);

fs.writeFileSync('src/lib/flashcards-data.ts', content);
console.log('Fixed all flashcards');
