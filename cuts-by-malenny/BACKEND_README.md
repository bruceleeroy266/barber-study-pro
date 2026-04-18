# Cuts by Malenny - Backend Setup Complete

## ✅ What's Been Built

### Backend API (`server.js`)
- **Customer Booking System** - Create and manage appointments
- **Real-time Availability** - Checks for booking conflicts
- **Payment Processing** - Stripe integration for $10 deposits
- **Admin Dashboard** - JWT-secured admin panel
- **Automated Reminders** - 24-hour and 3-week follow-up emails
- **Security** - Helmet, rate limiting, input validation

### API Endpoints

#### Customer Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/availability?date=YYYY-MM-DD&service=xxx` | Get available time slots |
| POST | `/api/bookings` | Create new booking |
| POST | `/api/create-deposit-intent` | Create Stripe payment |
| POST | `/api/webhook` | Stripe webhook handler |

#### Admin Routes (Require Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/appointments` | Get all appointments |
| PATCH | `/api/admin/appointments/:id` | Update appointment status |
| GET | `/api/admin/stats` | Dashboard statistics |

#### System Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/send-reminders` | Trigger reminder emails |

## 🚀 Setup Instructions

### 1. Install PostgreSQL
- Download from https://www.postgresql.org/download/windows/
- Create database: `cuts_by_malenny`
- Run the SQL from `DATABASE_SETUP.md`

### 2. Configure Environment
```bash
copy .env.example .env
# Edit .env with your values
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 5. Test the API
```bash
# Health check
curl http://localhost:3000/api/health

# Get availability
curl "http://localhost:3000/api/availability?date=2026-04-01&service=adult"
```

## 📧 Setting Up Email Reminders

### Option 1: Gmail
1. Enable 2-factor authentication on your Google account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Add to `.env`:
```
EMAIL_SERVICE=gmail
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
```

### Option 2: SendGrid (Recommended for production)
1. Sign up at https://sendgrid.com
2. Create an API key
3. Add to `.env`:
```
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
```

## 💳 Setting Up Stripe

1. Create account at https://stripe.com
2. Get your API keys from Dashboard
3. Add to `.env`:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Testing Payments
Use Stripe test card numbers:
- `4242 4242 4242 4242` - Success
- `4000 0000 0000 0002` - Declined

## 🔄 Automated Reminders

### Windows Task Scheduler Setup
1. Open Task Scheduler
2. Create Basic Task: "Barber Reminders"
3. Trigger: Daily at 9:00 AM
4. Action: Start a program
5. Program: `curl`
6. Arguments: `-X POST http://localhost:3000/api/send-reminders`

Or use the included npm script:
```bash
npm run reminders
```

## 🔒 Security Notes

- JWT tokens expire after 8 hours
- Passwords hashed with bcrypt (12 rounds)
- Rate limiting: 100 requests per 15 minutes
- All inputs validated and sanitized
- Stripe webhooks verified with signature

## 📱 Connecting Frontend

The frontend HTML files are already configured to call the API. Make sure:
1. Backend is running on port 3000
2. Frontend is served from the same origin or CORS is configured
3. Update `FRONTEND_URL` in `.env` if needed

## 🐛 Troubleshooting

### Database connection errors
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database `cuts_by_malenny` exists

### Stripe webhook errors
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhook`
- Or use ngrok to expose localhost

### Email not sending
- Check spam folders
- Verify email credentials
- For Gmail, ensure "Less secure app access" is enabled or use App Password

## 📞 Support

For issues with:
- **OpenClaw**: https://docs.openclaw.ai/troubleshooting
- **Stripe**: https://stripe.com/docs
- **PostgreSQL**: https://postgresql.org/docs

---

**Your barber booking system is ready!** 💈
