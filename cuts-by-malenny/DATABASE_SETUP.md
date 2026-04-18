# Local Database Setup Guide

## For Cuts by Malenny Booking System

---

## Overview

This guide sets up PostgreSQL on your Windows PC for the barber booking system. Your PC will run 24/7 to handle reminders and bookings.

---

## Step 1: Install PostgreSQL

### Download & Install
1. Go to: https://www.postgresql.org/download/windows/
2. Download the installer (latest version)
3. Run the installer
4. **Important settings during install:**
   - Password: Create a strong password (WRITE IT DOWN)
   - Port: Keep default 5432
   - Locale: Default
   - Components to install: PostgreSQL Server, pgAdmin 4, Command Line Tools

### Verify Installation
1. Open "pgAdmin 4" (installed with PostgreSQL)
2. It should open in your browser
3. Connect to server (enter the password you created)

---

## Step 2: Create Database

### Using pgAdmin 4
1. In pgAdmin, right-click on "Databases"
2. Click "Create" → "Database"
3. Database name: `cuts_by_malenny`
4. Owner: postgres (default)
5. Click "Save"

### Using Command Line (Alternative)
```bash
# Open SQL Shell (psql) from Start Menu
# Press Enter to accept defaults for Server, Database, Port, Username
# Enter your password when prompted

CREATE DATABASE cuts_by_malenny;
\c cuts_by_malenny
```

---

## Step 3: Create Tables

### Open Query Tool in pgAdmin
1. Click on `cuts_by_malenny` database
2. Click "Query Tool" (icon in top toolbar)
3. Copy and paste the SQL below
4. Click "Execute" (play button)

```sql
-- Customers Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    no_show_count INTEGER DEFAULT 0,
    total_visits INTEGER DEFAULT 0,
    reminder_email BOOLEAN DEFAULT true,
    reminder_sms BOOLEAN DEFAULT false,
    future_reminders BOOLEAN DEFAULT false
);

-- Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL,
    service_price DECIMAL(10,2) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'no_show', 'cancelled')),
    deposit_amount DECIMAL(10,2) DEFAULT 10.00,
    deposit_status VARCHAR(20) DEFAULT 'pending' CHECK (deposit_status IN ('pending', 'applied', 'forfeited', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table (Stripe Integration)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(100),
    stripe_payment_intent_id VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    last_four_digits VARCHAR(4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reminder Logs Table
CREATE TABLE reminder_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    reminder_type VARCHAR(20) CHECK (reminder_type IN ('email_24h', 'sms_24h', 'followup_3week')),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced'))
);

-- Admin Users Table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table (Security)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES admin_users(id),
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_reminder_logs_appointment ON reminder_logs(appointment_id);

-- Insert Default Admin User
-- Password: malenny2026 (CHANGE THIS AFTER FIRST LOGIN)
-- NOTE: This is bcrypt hash of 'malenny2026'
INSERT INTO admin_users (username, password_hash, email) 
VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G', 'admin@cutsbymalenny.com');
```

---

## Step 4: Connection Details for Claude Code

Give these details to Claude Code when setting up the backend:

```
Database Type: PostgreSQL
Host: localhost
Port: 5432
Database Name: cuts_by_malenny
Username: postgres
Password: [YOUR_POSTGRES_PASSWORD]
```

### Environment Variables (.env file)
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cuts_by_malenny
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# For Node.js/Express backend
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cuts_by_malenny
```

---

## Step 5: Set Up Automated Reminders

### Windows Task Scheduler (For 24/7 PC)

1. **Open Task Scheduler** (Start Menu → Search "Task Scheduler")

2. **Create Basic Task**
   - Name: "Barber Reminder Check"
   - Description: "Check for upcoming appointments and send reminders"

3. **Trigger**
   - Select: "Daily"
   - Start: 12:00:00 AM
   - Recur every: 1 days
   - Repeat task every: 1 hour (for 24 hours)

4. **Action**
   - Select: "Start a program"
   - Program: `node`
   - Arguments: `reminders.js` (or your script path)
   - Start in: `C:\path\to\your\booking-system`

5. **Conditions**
   - Uncheck "Start the task only if the computer is on AC power"
   - Check "Wake the computer to run this task"

6. **Settings**
   - Check "Allow task to be run on demand"
   - Check "Run task as soon as possible after a scheduled start is missed"

---

## Step 6: Backup Script

### Create Backup Script (backup.bat)
```batch
@echo off
set PGPASSWORD=your_postgres_password
set BACKUP_DIR=C:\Backups\CutsByMalenny
set DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%

if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

"C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -h localhost -U postgres -d cuts_by_malenny -f %BACKUP_DIR%\backup_%DATE%.sql

:: Keep only last 30 days of backups
forfiles /p %BACKUP_DIR% /s /m *.sql /d -30 /c "cmd /c del @path"

echo Backup completed: %DATE%
```

### Schedule Daily Backup
1. Open Task Scheduler
2. Create new task: "Database Backup"
3. Trigger: Daily at 2:00 AM
4. Action: Run `backup.bat`

---

## Step 7: Firewall Configuration

### Allow PostgreSQL Through Windows Firewall
1. Open Windows Defender Firewall
2. Click "Advanced Settings"
3. Inbound Rules → New Rule
4. Port → TCP → 5432
5. Allow the connection
6. Apply to all profiles
7. Name: "PostgreSQL Local"

**Note:** Only allow local connections (localhost) unless you need remote access.

---

## Database Maintenance

### Weekly Tasks (Manual or Scheduled)
```sql
-- Update statistics for query performance
ANALYZE;

-- Clean up old cancelled appointments (older than 90 days)
DELETE FROM appointments 
WHERE status = 'cancelled' 
AND created_at < CURRENT_DATE - INTERVAL '90 days';

-- Archive old reminder logs (older than 1 year)
DELETE FROM reminder_logs 
WHERE sent_at < CURRENT_DATE - INTERVAL '1 year';
```

### Monthly Tasks
- Check backup files exist
- Review audit logs for security
- Optimize database (VACUUM)

---

## Troubleshooting

### Can't Connect to Database
1. Check PostgreSQL service is running (Services app)
2. Verify password is correct
3. Check firewall isn't blocking port 5432
4. Try connecting via pgAdmin first

### Reminders Not Sending
1. Check PC didn't go to sleep
2. Verify Task Scheduler task is running
3. Check reminder script logs
4. Ensure database connection works

### Database Growing Too Large
1. Run cleanup queries above
2. Check if audit_logs table is too big
3. Archive old data if needed

---

## Security Notes

1. **Strong PostgreSQL Password** — Use 16+ characters
2. **Windows Account** — Use strong Windows password (PC is on 24/7)
3. **Physical Security** — Lock your PC room/office
4. **Regular Updates** — Keep Windows and PostgreSQL updated
5. **Antivirus** — Keep running and updated
6. **Backup Verification** — Test restore monthly

---

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database and tables
3. ✅ Test connection
4. ✅ Set up Task Scheduler for reminders
5. ✅ Configure backups
6. ⏳ Give connection details to Claude Code
7. ⏳ Test reminder system
8. ⏳ Go live!

---

**Questions?** Check PostgreSQL logs at: `C:\Program Files\PostgreSQL\15\data\log`
