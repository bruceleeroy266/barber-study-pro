const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\skyfl\\.openclaw\\workspace\\barber-study-pro';

// Auth gate CSS to add before </style>
const authGateCSS = `
        /* Auth Gate Styles */
        .auth-gate { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--dark); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .auth-gate-content { text-align: center; max-width: 500px; }
        .auth-gate h2 { font-size: 2rem; margin-bottom: 1rem; }
        .auth-gate p { color: var(--light-gray); margin-bottom: 2rem; }
        .auth-gate-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .auth-gate-btn { padding: 1rem 2rem; border-radius: 8px; font-weight: 600; text-decoration: none; transition: all 0.3s; }
        .auth-gate-btn.primary { background: var(--gold); color: var(--dark); }
        .auth-gate-btn.secondary { background: var(--medium-gray); color: var(--white); border: 1px solid var(--medium-gray); }
        .protected-content { display: none; }
        .protected-content.show { display: block; }`;

// Auth gate HTML to add after <body>
const authGateHTML = `    <!-- Auth Gate - Shows if not logged in -->
    <div class="auth-gate" id="authGate">
        <div class="auth-gate-content">
            <h2>🔒 Members Only</h2>
            <p>This study content is exclusively for registered members. Create a free account to access all 21 chapters, quizzes, flashcards, and the practice exam.</p>
            <div class="auth-gate-buttons">
                <a href="login.html" class="auth-gate-btn primary">Create Free Account</a>
                <a href="index.html" class="auth-gate-btn secondary">← Back to Home</a>
            </div>
        </div>
    </div>

    <!-- Protected Content - Only shows if logged in -->
    <div class="protected-content" id="protectedContent">`;

// Auth check script to add before </body>
const authCheckScript = `    </div><!-- End protected content -->

    <!-- Auth Check Script -->
    <script>
        function checkAuth() {
            const session = localStorage.getItem('bsp_session');
            const authGate = document.getElementById('authGate');
            const protectedContent = document.getElementById('protectedContent');
            if (session) {
                authGate.style.display = 'none';
                protectedContent.classList.add('show');
            } else {
                authGate.style.display = 'flex';
                protectedContent.classList.remove('show');
            }
        }
        checkAuth();
    </script>`;

// Files to process (already done: chapter-01-quiz, chapter-01-flashcards, chapter-02-quiz, chapter-02-flashcards, chapters, student-dashboard, oklahoma-board)
const filesToProcess = [];

// Add quiz files chapters 3-21
for (let i = 3; i <= 21; i++) {
    filesToProcess.push(`chapter-${i.toString().padStart(2, '0')}-quiz.html`);
}

// Add flashcard files chapters 3-21  
for (let i = 3; i <= 21; i++) {
    filesToProcess.push(`chapter-${i.toString().padStart(2, '0')}-flashcards.html`);
}

console.log('Files to process:', filesToProcess.length);
console.log(filesToProcess.join('\n'));

let processed = 0;
let errors = [];

filesToProcess.forEach(file => {
    const filePath = path.join(baseDir, file);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if already has auth gate
        if (content.includes('auth-gate') || content.includes('authGate')) {
            console.log(`Skipping ${file} - already has auth gate`);
            return;
        }
        
        // Add CSS before </style>
        content = content.replace(/<\/style>/, authGateCSS + '\n    </style>');
        
        // Add auth gate HTML after <body>
        content = content.replace(/<body>/, '<body>\n' + authGateHTML);
        
        // Add closing div and auth check script before </body>
        content = content.replace(/<\/body>/, authCheckScript + '\n</body>');
        
        fs.writeFileSync(filePath, content);
        processed++;
        console.log(`Processed: ${file}`);
    } catch (err) {
        errors.push({ file, error: err.message });
        console.error(`Error processing ${file}:`, err.message);
    }
});

console.log(`\nDone! Processed ${processed} files.`);
if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
}
