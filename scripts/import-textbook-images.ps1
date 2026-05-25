param(
  [Parameter(Mandatory=$true)]
  [string]$Chapter
)

$source = "$env:USERPROFILE\.openclaw\media\inbound"
$dest = "$env:USERPROFILE\Desktop\barber-study-pro-v2\textbook-images\chapter-$Chapter"

New-Item -ItemType Directory -Force -Path $dest | Out-Null

Get-ChildItem $source -File -Include *.jpg,*.jpeg,*.png -Recurse |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 10 |
  Copy-Item -Destination $dest -Force

Write-Host "Copied latest images to: $dest"
Get-ChildItem $dest