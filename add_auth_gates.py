#!/usr/bin/env python3
"""
Auth Gate Installer for Barber Study Pro
Adds authentication gates to all protected pages
"""

import os
import re

# Auth gate HTML to insert at beginning of body
AUTH_GATE_HTML = '''<!-- Auth Gate - Shows if not logged in -->
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
'''

# Auth gate CSS to add to style section
AUTH_GATE_CSS = '''/* Auth Gate Styles */
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
.protected-content.show { display: block; }
'''

# Auth check script to add before closing body tag
AUTH_CHECK_SCRIPT = '''</div><!-- End protected content -->

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
</body>'''

def add_auth_gate(filepath):
    """Add auth gate to a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has auth gate
        if 'auth-gate' in content or 'authGate' in content:
            print(f"  [SKIP] Already has auth gate: {os.path.basename(filepath)}")
            return True
        
        # Add CSS before closing </style> tag
        if '</style>' in content:
            content = content.replace('</style>', AUTH_GATE_CSS + '</style>')
        else:
            print(f"  [WARN] No </style> tag found: {os.path.basename(filepath)}")
        
        # Add auth gate HTML after opening <body> tag
        # Find the body tag and insert after it
        body_match = re.search(r'(<body[^>]*>)', content, re.IGNORECASE)
        if body_match:
            body_tag = body_match.group(1)
            content = content.replace(body_tag, body_tag + '\n' + AUTH_GATE_HTML)
        else:
            print(f"  [WARN] No <body> tag found: {os.path.basename(filepath)}")
            return False
        
        # Add closing div and auth script before closing </body> tag
        # Replace the last </body> tag with our auth check script
        if content.rstrip().endswith('</body>'):
            content = content.rstrip()[:-7] + AUTH_CHECK_SCRIPT
        elif '</body>' in content:
            # Find the last occurrence and replace it
            last_body_pos = content.rfind('</body>')
            content = content[:last_body_pos] + AUTH_CHECK_SCRIPT + content[last_body_pos+7:]
        else:
            print(f"  [WARN] No </body> tag found: {os.path.basename(filepath)}")
            return False
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  [OK] Added auth gate: {os.path.basename(filepath)}")
        return True
        
    except Exception as e:
        print(f"  [ERROR] {os.path.basename(filepath)}: {e}")
        return False

def main():
    base_dir = r'C:\Users\skyfl\.openclaw\workspace\barber-study-pro'
    
    # Files to protect
    files_to_protect = []
    
    # Chapter content files (02-21)
    for i in range(2, 22):
        files_to_protect.append(f'chapter-{i:02d}.html')
    
    # Quiz files (01-21)
    for i in range(1, 22):
        files_to_protect.append(f'chapter-{i:02d}-quiz.html')
    
    # Flashcard files (01-21)
    for i in range(1, 22):
        files_to_protect.append(f'chapter-{i:02d}-flashcards.html')
    
    # Other protected files
    files_to_protect.extend([
        'chapters.html',
        'oklahoma-board.html',
        'student-dashboard.html'
    ])
    
    print(f"Processing {len(files_to_protect)} files...")
    print("=" * 50)
    
    success_count = 0
    fail_count = 0
    skip_count = 0
    
    for i, filename in enumerate(files_to_protect, 1):
        filepath = os.path.join(base_dir, filename)
        if os.path.exists(filepath):
            if add_auth_gate(filepath):
                success_count += 1
            else:
                fail_count += 1
        else:
            print(f"  [MISSING] File not found: {filename}")
            fail_count += 1
        
        # Report progress every 10 files
        if i % 10 == 0:
            print(f"\n--- Progress: {i}/{len(files_to_protect)} files processed ---")
    
    print("=" * 50)
    print(f"\nComplete!")
    print(f"  Success: {success_count}")
    print(f"  Failed: {fail_count}")
    print(f"  Skipped (already protected): {skip_count}")

if __name__ == '__main__':
    main()
