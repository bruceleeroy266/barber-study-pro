// Content Protection Script for Barber Study Pro
// This script adds content protection to all chapter files

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

// List of chapters to protect (excluding 01 and 02 which are already done)
const chapters = [
    'chapter-03.html', 'chapter-04.html', 'chapter-05.html',
    'chapter-06.html', 'chapter-07.html', 'chapter-08.html', 'chapter-09.html', 'chapter-10.html',
    'chapter-11.html', 'chapter-12.html', 'chapter-13.html',
    'chapter-14.html', 'chapter-15.html', 'chapter-16.html',
    'chapter-17.html', 'chapter-18.html',
    'chapter-19.html', 'chapter-20.html', 'chapter-21.html'
];

const fs = require('fs');
const path = require('path');

chapters.forEach(chapter => {
    const filePath = path.join(__dirname, chapter);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if already protected
        if (content.includes('Content Protection')) {
            console.log(`Skipping ${chapter} - already protected`);
            return;
        }
        
        // Replace closing tags with protection script
        content = content.replace(/<\/body>\s*<\/html>/, protectionScript + '</body>\n</html>');
        
        fs.writeFileSync(filePath, content);
        console.log(`Protected: ${chapter}`);
    } catch (err) {
        console.error(`Error processing ${chapter}:`, err.message);
    }
});

console.log('\nContent protection added to all chapters!');
