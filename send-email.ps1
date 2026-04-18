$body = @{
    from = "onboarding@resend.dev"
    to = @("bruceleeroy266@gmail.com")
    subject = "Direct Test from Bruce"
    text = "This email was sent directly by me! If you see this, it worked. 🥋"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.resend.com/emails" -Method POST -Headers @{"Authorization" = "Bearer re_j12En4av_MAMvCLmJ3UnipqiFqVFMumvL"; "Content-Type" = "application/json"} -Body $body
