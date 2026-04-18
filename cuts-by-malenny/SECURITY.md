# Data Security Implementation Guide

## For Claude Code Backend Development

---

## Overview

This document outlines the security requirements for implementing the backend of the Cuts by Malenny booking system. All customer data must be handled securely and in compliance with industry standards.

---

## 1. Authentication & Authorization

### Admin Login System
- **Password Hashing:** Use bcrypt with salt rounds ≥ 12
- **Session Management:** Implement JWT tokens or secure session cookies
- **Rate Limiting:** Limit login attempts (5 attempts per 15 minutes)
- **HTTPS Only:** All authentication traffic must be over HTTPS
- **Password Requirements:** Minimum 12 characters, mixed case, numbers, symbols
- **Two-Factor Authentication (Optional):** SMS or TOTP for added security

### Session Security
```javascript
// Example secure session configuration
{
  secret: process.env.SESSION_SECRET, // Strong random string
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JavaScript access
    maxAge: 3600000,   // 1 hour
    sameSite: 'strict'
  }
}
```

---

## 2. Database Security

### Customer Data Storage
**Fields to Store:**
- `id` (UUID, primary key)
- `first_name` (encrypted at rest)
- `last_name` (encrypted at rest)
- `phone` (encrypted at rest)
- `email` (encrypted at rest)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `no_show_count` (integer)
- `total_visits` (integer)

**Encryption at Rest:**
- Use AES-256 encryption for sensitive fields
- Store encryption keys separately (environment variables or key management service)
- Never store encryption keys in the database

### Appointment Data
**Fields to Store:**
- `id` (UUID)
- `customer_id` (foreign key)
- `service_type` (string)
- `service_price` (decimal)
- `appointment_date` (date)
- `appointment_time` (time)
- `duration_minutes` (integer)
- `status` (enum: confirmed, completed, no_show, cancelled)
- `deposit_amount` (decimal)
- `deposit_status` (enum: pending, applied, forfeited, refunded)
- `notes` (text, encrypted)
- `reminder_preferences` (JSON)
- `created_at` (timestamp)

### Payment Data (PCI Compliance)
**CRITICAL:** Never store full credit card numbers
- Use Stripe for all payment processing
- Store only:
  - `stripe_customer_id` (token from Stripe)
  - `stripe_payment_intent_id` (for reference)
  - `amount` (decimal)
  - `status` (enum: pending, completed, failed, refunded)
  - `last_four_digits` (for display only)
  - `created_at` (timestamp)

---

## 3. API Security

### Input Validation
```javascript
// Validate all inputs
const Joi = require('joi');

const bookingSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\d{10}$/).required(),
  email: Joi.string().email().required(),
  service: Joi.string().valid('vip', 'adult', 'adult-beard', ...).required(),
  date: Joi.date().min('now').required(),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
});
```

### SQL Injection Prevention
- Use parameterized queries or ORM (Sequelize, TypeORM)
- Never concatenate user input into SQL strings

### XSS Prevention
- Sanitize all user inputs before display
- Use Content Security Policy (CSP) headers
- Escape HTML in all user-generated content

### CSRF Protection
- Implement CSRF tokens for all state-changing operations
- Use SameSite cookie attribute

---

## 4. Data Retention & Deletion

### Retention Policy
- **Active Customers:** Keep data while actively booking
- **Inactive Accounts:** Delete after 2 years of no activity
- **Payment Records:** Keep for 7 years (tax/legal requirement)
- **No-Show Records:** Keep for 1 year, then anonymize
- **Cancelled Appointments:** Delete after 90 days

### Customer Data Deletion
- Provide "Right to be Forgotten" functionality
- Anonymize data rather than delete if legal requirements exist
- Log all deletion requests

---

## 5. Logging & Monitoring

### Security Events to Log
- All login attempts (success and failure)
- Password changes
- Admin actions (view, modify, delete customer data)
- Payment transactions
- Data export events
- Failed authentication attempts

### Log Format
```json
{
  "timestamp": "2026-03-24T10:30:00Z",
  "event": "admin_login",
  "user_id": "uuid",
  "ip_address": "xxx.xxx.xxx.xxx",
  "user_agent": "...",
  "success": true/false,
  "details": {...}
}
```

### Alerts
- Email/SMS alerts for:
  - Multiple failed login attempts
  - Unusual access patterns
  - Data export events
  - Admin account changes

---

## 6. Third-Party Services

### Stripe Integration
- Use Stripe.js for client-side tokenization
- Webhook verification with signature
- Store only Stripe tokens, never raw card data
- Implement idempotency keys for payment operations

### Email/SMS Services
- Use authenticated SMTP (SendGrid, Mailgun)
- Implement unsubscribe mechanisms
- Don't include sensitive data in emails
- Use HTTPS for all unsubscribe links

---

## 7. Environment Variables

### Required Secrets (Never commit to git)
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cuts_by_malenny
DB_USER=db_user
DB_PASSWORD=strong_random_password

# Session/Auth
SESSION_SECRET=random_64_char_string
JWT_SECRET=random_64_char_string
BCRYPT_ROUNDS=12

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Encryption
ENCRYPTION_KEY=32_byte_hex_key

# Email/SMS
SENDGRID_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=bcrypt_hash
```

---

## 8. Security Headers

### Required Headers
```javascript
// Express.js example
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src https://js.stripe.com https://hooks.stripe.com;");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

---

## 9. Backup & Recovery

### Backup Strategy
- Daily automated database backups
- Encrypted backup storage
- Test restore procedures monthly
- Offsite backup storage
- 30-day backup retention

### Disaster Recovery
- Documented recovery procedures
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 24 hours

---

## 10. Compliance Checklist

### PCI DSS (Payment Card Industry)
- [ ] Use Stripe for all card processing (reduces compliance scope)
- [ ] Never store full card numbers
- [ ] Use HTTPS for all payment pages
- [ ] Implement access controls
- [ ] Regular security scans

### State Privacy Laws (Oklahoma)
- [ ] Privacy Policy posted on website
- [ ] Customer right to access their data
- [ ] Customer right to delete their data
- [ ] Data breach notification procedures

### GDPR (if serving EU customers)
- [ ] Explicit consent for data processing
- [ ] Right to data portability
- [ ] Privacy by design principles
- [ ] Data Protection Officer (if applicable)

---

## 11. Implementation Priority

### Phase 1 (Critical)
1. Secure admin login with bcrypt
2. HTTPS enforcement
3. Input validation on all forms
4. Stripe integration (PCI compliance)
5. Basic audit logging

### Phase 2 (Important)
1. Database encryption at rest
2. Rate limiting
3. CSRF protection
4. Security headers
5. Automated backups

### Phase 3 (Enhanced)
1. Two-factor authentication
2. Advanced monitoring
3. Penetration testing
4. Security audit
5. Incident response plan

---

## 12. Security Contacts

- **Security Issues:** Contact immediately if breach suspected
- **Stripe Issues:** support@stripe.com
- **Hosting Provider:** [Your hosting provider support]

---

## Notes for Claude Code

1. **Never hardcode secrets** - Always use environment variables
2. **Validate all inputs** - Client-side and server-side
3. **Use parameterized queries** - Prevent SQL injection
4. **Encrypt sensitive data** - At rest and in transit
5. **Log security events** - But never log passwords or full card numbers
6. **Test thoroughly** - Especially authentication and payment flows
7. **Document everything** - Security decisions and configurations

---

**Remember:** Security is not a feature, it's a process. Regularly review and update security measures.
