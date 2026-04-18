# PowerShell script to add auth gates to remaining Barber Study Pro files
$baseDir = "C:\Users\skyfl\.openclaw\workspace\barber-study-pro"

# Auth gate CSS
$authGateCSS = @"
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
        .protected-content.show { display: block; }
"@

# Auth gate HTML
$authGateHTML = @"
    <!-- Auth Gate - Shows if not logged in -->
    <div class="auth-gate" id="authGate">
        <div class="auth-gate-content">
            <h2>Members Only</h2>
            <p>This content is exclusively for registered members. Create a free account to access all study materials.</p>
            <div class="auth-gate-buttons">
                <a href="login.html" class="auth-gate-btn primary">Create Free Account</a>
                <a href="index.html" class="auth-gate-btn secondary">Back to Home</a>
            </div>
        </div>
    </div>
    <div class="protected-content" id="protectedContent">
"@

# Auth check script
$authCheckScript = @"
    </div>
    <script>
        function checkAuth() {
            const session = localStorage.getItem('bsp_session');
            const authGate = document.getElementById('authGate');
            const protectedContent = document.getElementById('protectedContent');
            if (session) {
                authGate.style.display = 'none';
                protectedContent.classList.add('show');
            }
        }
        checkAuth();
    </script>
"@

# Files to process (chapters 3-21 quizzes and flashcards)
$files = @()
for ($i = 3; $i -le 21; $i++) {
    $num = $i.ToString().PadLeft(2, '0')
    $files += "chapter-$num-quiz.html"
    $files += "chapter-$num-flashcards.html"
}

$processed = 0
$errors = @()

foreach ($file in $files) {
    $filePath = Join-Path $baseDir $file
    
    if (-not (Test-Path $filePath)) {
        Write-Host "File not found: $file" -ForegroundColor Yellow
        continue
    }
    
    $content = Get-Content $filePath -Raw
    
    # Check if already has auth gate
    if ($content -match 'auth-gate|authGate') {
        Write-Host "Skipping $file - already has auth gate" -ForegroundColor Cyan
        continue
    }
    
    try {
        # Add CSS before </style>
        $content = $content -replace '(</style>)', "$authGateCSS`n    `$1"
        
        # Add auth gate HTML after <body>
        $content = $content -replace '(<body>)', "`$1`n$authGateHTML"
        
        # Add closing div and auth check script before </body>
        $content = $content -replace '(</body>)', "$authCheckScript`n`$1"
        
        Set-Content $filePath $content -NoNewline
        $processed++
        Write-Host "Processed: $file" -ForegroundColor Green
    } catch {
        $errors += $file
        Write-Host "Error processing $file`: $_" -ForegroundColor Red
    }
}

Write-Host "`nDone! Processed $processed files." -ForegroundColor Green
if ($errors.Count -gt 0) {
    Write-Host "Errors: $($errors.Count)" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}
