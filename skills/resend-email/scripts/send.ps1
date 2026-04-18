param(
    [string]$to,
    [string]$subject,
    [string]$body
)

$apiKey = "re_j12En4av_MAMvCLmJ3UnipqiFqVFMumvL"

$payload = @{
    from = "onboarding@resend.dev"
    to = @($to)
    subject = $subject
    text = $body
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.resend.com/emails" -Method POST -Headers @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
} -Body $payload
