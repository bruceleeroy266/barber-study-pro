# Batch emoji remover for Barber Study Pro HTML files
$files = Get-ChildItem -Path "C:\Users\skyfl\.openclaw\workspace\barber-study-pro" -Filter "*.html"

$replacements = @(
    @{ Find = '🔒 '; Replace = '' },
    @{ Find = '🔒'; Replace = '' },
    @{ Find = '⚡ '; Replace = '' },
    @{ Find = '⚡'; Replace = '' },
    @{ Find = '🎯 '; Replace = '' },
    @{ Find = '💪 '; Replace = '' },
    @{ Find = '🧠 '; Replace = '' },
    @{ Find = '🎉'; Replace = '' },
    @{ Find = '👏'; Replace = '' },
    @{ Find = '👍'; Replace = '' },
    @{ Find = '📊'; Replace = '' },
    @{ Find = '💾'; Replace = '' },
    @{ Find = '🌟'; Replace = '' },
    @{ Find = '📋'; Replace = '' },
    @{ Find = '💰'; Replace = '' },
    @{ Find = '📅'; Replace = '' },
    @{ Find = '📝 '; Replace = '' },
    @{ Find = '🔄'; Replace = '' },
    @{ Find = '📞'; Replace = '' },
    @{ Find = '✓ '; Replace = '' },
    @{ Find = '✗ '; Replace = '' },
    @{ Find = '✅'; Replace = '' },
    @{ Find = '❌'; Replace = '' },
    @{ Find = '📚 '; Replace = '' },
    @{ Find = '🪒 '; Replace = '' },
    @{ Find = '💈 '; Replace = '' },
    @{ Find = '✂️ '; Replace = '' },
    @{ Find = '✂ '; Replace = '' },
    @{ Find = '👤'; Replace = '' },
    @{ Find = '👥'; Replace = '' },
    @{ Find = '🏆'; Replace = '' },
    @{ Find = '⭐'; Replace = '' },
    @{ Find = '📖'; Replace = '' },
    @{ Find = '🔍'; Replace = '' },
    @{ Find = '💡'; Replace = '' },
    @{ Find = '🔥'; Replace = '' },
    @{ Find = '⚠️ '; Replace = '' },
    @{ Find = '⚠ '; Replace = '' },
    @{ Find = '🎓'; Replace = '' },
    @{ Find = '⏱️'; Replace = '' },
    @{ Find = '⏱'; Replace = '' },
    @{ Find = '⏰ '; Replace = '' },
    @{ Find = '💯'; Replace = '' },
    @{ Find = '🚀'; Replace = '' },
    @{ Find = '📈'; Replace = '' },
    @{ Find = '🏠'; Replace = '' },
    @{ Find = '📧'; Replace = '' },
    @{ Find = '🔑'; Replace = '' },
    @{ Find = '👋'; Replace = '' },
    @{ Find = '💬'; Replace = '' },
    @{ Find = '🗣️'; Replace = '' },
    @{ Find = '🗣'; Replace = '' },
    @{ Find = '🧪'; Replace = '' },
    @{ Find = '🔬'; Replace = '' },
    @{ Find = '🦠'; Replace = '' },
    @{ Find = '🧴'; Replace = '' },
    @{ Find = '🧼'; Replace = '' },
    @{ Find = '🧽'; Replace = '' },
    @{ Find = '✨'; Replace = '' },
    @{ Find = '🎨 '; Replace = '' },
    @{ Find = '🖌️'; Replace = '' },
    @{ Find = '🖌'; Replace = '' },
    @{ Find = '🏪'; Replace = '' },
    @{ Find = '📍'; Replace = '' },
    @{ Find = '🌍'; Replace = '' },
    @{ Find = '🌎'; Replace = '' },
    @{ Find = '🌏'; Replace = '' },
    @{ Find = '👨'; Replace = '' },
    @{ Find = '👩'; Replace = '' },
    @{ Find = '👶'; Replace = '' },
    @{ Find = '👴'; Replace = '' },
    @{ Find = '👵'; Replace = '' },
    @{ Find = '👱'; Replace = '' },
    @{ Find = '🎴 '; Replace = '' },
    @{ Find = '❓ '; Replace = '' },
    @{ Find = '🔊 '; Replace = '' },
    @{ Find = '⚖️ '; Replace = '' },
    @{ Find = '😊 '; Replace = '' }
)

$processed = 0
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    foreach ($replacement in $replacements) {
        $content = $content.Replace($replacement.Find, $replacement.Replace)
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.Name)"
        $processed++
    }
}

Write-Host ""
Write-Host "Processing complete. $processed files were modified."
