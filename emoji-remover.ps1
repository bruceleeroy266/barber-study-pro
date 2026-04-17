# Emoji removal script for Barber Study Pro
# This script removes all emojis from HTML files

$emojiMap = @{
    '🔒' = ''
    '⚡' = ''
    '🎯' = ''
    '💪' = ''
    '🧠' = ''
    '🎉' = ''
    '👏' = ''
    '👍' = ''
    '📊' = ''
    '💾' = ''
    '🌟' = ''
    '📋' = ''
    '💰' = ''
    '📅' = ''
    '📝' = ''
    '🔄' = ''
    '📞' = ''
    '✓' = ''
    '✗' = ''
    '✅' = ''
    '❌' = ''
    '📚' = ''
    '🪒' = ''
    '💈' = ''
    '✂️' = ''
    '✂' = ''
    '👤' = ''
    '👥' = ''
    '🏆' = ''
    '⭐' = ''
    '📖' = ''
    '🔍' = ''
    '💡' = ''
    '🔥' = ''
    '⚠️' = ''
    '⚠' = ''
    '🎓' = ''
    '⏱️' = ''
    '⏱' = ''
    '⏰' = ''
    '💯' = ''
    '🚀' = ''
    '📈' = ''
    '🏠' = ''
    '📧' = ''
    '🔑' = ''
    '👋' = ''
    '💬' = ''
    '🗣️' = ''
    '🗣' = ''
    '🧪' = ''
    '🔬' = ''
    '🦠' = ''
    '🧴' = ''
    '🧼' = ''
    '🧽' = ''
    '✨' = ''
    '🎨' = ''
    '🖌️' = ''
    '🖌' = ''
    '🏪' = ''
    '📍' = ''
    '🌍' = ''
    '🌎' = ''
    '🌏' = ''
    '👨' = ''
    '👩' = ''
    '👶' = ''
    '👴' = ''
    '👵' = ''
    '👱' = ''
    '👨‍' = ''
    '👩‍' = ''
    '→' = '→'  # Keep arrow
    '←' = '←'  # Keep arrow
    '↑' = '↑'  # Keep arrow
    '↓' = '↓'  # Keep arrow
}

function Remove-Emojis {
    param([string]$content)
    
    # Remove specific emojis from map
    foreach ($emoji in $emojiMap.Keys) {
        $content = $content.Replace($emoji, $emojiMap[$emoji])
    }
    
    # Remove any remaining emoji characters using regex
    # This covers the Unicode emoji ranges
    $content = $content -replace '[\x{1F600}-\x{1F64F}]', ''
    $content = $content -replace '[\x{1F300}-\x{1F5FF}]', ''
    $content = $content -replace '[\x{1F680}-\x{1F6FF}]', ''
    $content = $content -replace '[\x{1F1E0}-\x{1F1FF}]', ''
    $content = $content -replace '[\x{2600}-\x{26FF}]', ''
    $content = $content -replace '[\x{2700}-\x{27BF}]', ''
    $content = $content -replace '[\x{1F900}-\x{1F9FF}]', ''
    $content = $content -replace '[\x{1F018}-\x{1F270}]', ''
    
    return $content
}

Write-Host "Starting emoji removal process..."
