// Add content protection to all quiz files
const protectionScript = `

<!-- Content Protection -->
<script>
    // Disable right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showProtectionMessage('Content is protected. Right-click is disabled.');
        return false;
    });

    // Disable copy
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        showProtectionMessage('Copying is disabled to protect our content.');
        return false;
    });

    // Disable cut
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        showProtectionMessage('Cutting is disabled to protect our content.');
        return false;
    });

    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable drag
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable print
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            showProtectionMessage('Printing is disabled.');
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            showProtectionMessage('Saving is disabled.');
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            showProtectionMessage('View source is disabled.');
            return false;
        }
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
            e.preventDefault();
            showProtectionMessage('Developer tools are disabled.');
            return false;
        }
    });

    // Show protection message
    function showProtectionMessage(message) {
        const existing = document.querySelector('.protection-message');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.className = 'protection-message';
        div.style.cssText = 'position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #ef4444; color: white; padding: 1rem 2rem; border-radius: 8px; font-weight: 600; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
        div.textContent = '⚠️ ' + message;
        document.body.appendChild(div);

        setTimeout(() => {
            div.style.opacity = '0';
            div.style.transition = 'opacity 0.5s';
            setTimeout(() => div.remove(), 500);
        }, 3000);
    }

    // Console warning
    console.log('%c⚠️ CONTENT PROTECTION', 'color: #ef4444; font-size: 24px; font-weight: bold;');
    console.log('%cThis content is copyrighted and protected. Unauthorized copying, distribution, or reproduction is prohibited.', 'color: #888; font-size: 14px;');
    console.log('%c© 2026 Barber Study Pro. All rights reserved.', 'color: #D4AF37; font-size: 12px;');

    // Prevent viewing source via right-click on images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
    });
</script>
`;

const fs = require('fs');
const path = require('path');

// Get all quiz files
const quizFiles = fs.readdirSync(__dirname)
    .filter(f => f.match(/chapter-\d{2}-quiz\.html$/))
    .sort();

console.log(`Found ${quizFiles.length} quiz files to protect\n`);

quizFiles.forEach((file, index) => {
    const filePath = path.join(__dirname, file);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if already protected
        if (content.includes('Content Protection')) {
            console.log(`${index + 1}. Skipping ${file} - already protected`);
            return;
        }
        
        // Replace closing tags with protection script
        content = content.replace(/<\/body>\s*<\/html>/, protectionScript + '</body>\n</html>');
        
        fs.writeFileSync(filePath, content);
        console.log(`${index + 1}. ✅ Protected: ${file}`);
    } catch (err) {
        console.error(`${index + 1}. ❌ Error with ${file}:`, err.message);
    }
});

console.log('\n✅ All quiz files processed!');
