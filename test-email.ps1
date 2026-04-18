$body = @{
    from = "onboarding@resend.dev"
    to = @("bruceleeroy266@gmail.com")
    subject = "Test Email from Bruce Leeroy"
    text = "This is a test email! If you received this, email is working. 🥋"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.resend.com/emails" -Method POST -Headers @{"Authorization" = "Bearer re_j12En4av_MAMvCLmJ3UnipqiFqVFMumvL"; "Content-Type" = "application/json"} -Body $body
