const fs = require('fs');
const path = require('path');

const baseDir = r'C:\Users\skyfl\.openclaw\workspace\barber-study-pro';

// Auth gate CSS
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
        .auth-gate-btn:hover { transform: translateY(-2px); }
        .protected-content { display: none; }
        .protected-content.show { display: block; }`;

// Auth gate HTML
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
    <div class="protected-content" id="protectedContent">
`;

// Auth check script
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
    </script>
`;

function processFile(filename) {
    const filepath = path.join(baseDir, filename);
    
    if (!fs.existsSync(filepath)) {
        console.log(`  [MISSING] ${filename}`);
        return false;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Check if already has auth gate
    if (content.includes('auth-gate') || content.includes('authGate')) {
        console.log(`  [SKIP] Already has auth gate: ${filename}`);
        return true;
    }
    
    // Add CSS before closing </style>
    content = content.replace(/<\/style>/, authGateCSS + '\n    </style>');
    
    // Add auth gate HTML after <body> tag
    content = content.replace(/(<body[^>]*>)\n/, '$1\n' + authGateHTML);
    
    // Add closing div and auth script before </body>
    content = content.replace(/<\/body>/, authCheckScript + '</body>');
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`  [OK] Added auth gate: ${filename}`);
    return true;
}

// Files to process
const files = [];

// Chapter content files (02-21)
for (let i = 2; i <= 21; i++) {
    files.push(`chapter-${String(i).padStart(2, '0')}.html`);
}

// Quiz files (01-21)
for (let i = 1; i <= 21; i++) {
    files.push(`chapter-${String(i).padStart(2, '0')}-quiz.html`);
}

// Flashcard files (01-21)
for (let i = 1; i <= 21; i++) {
    files.push(`chapter-${String(i).padStart(2, '0')}-flashcards.html`);
}

// Other protected files
files.push('chapters.html', 'oklahoma-board.html', 'student-dashboard.html');

console.log(`Processing ${files.length} files...`);
console.log('='.repeat(50));

let success = 0;
let failed = 0;

files.forEach((file, index) => {
    if (processFile(file)) {
        success++;
    } else {
        failed++;
    }
    
    if ((index + 1) % 10 === 0) {
        console.log(`\n--- Progress: ${index + 1}/${files.length} files processed ---`);
    }
});

console.log('='.repeat(50));
console.log(`\nComplete! Success: ${success}, Failed: ${failed}`);
