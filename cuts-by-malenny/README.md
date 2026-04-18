# Cuts by Malenny - Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed
- npm or yarn package manager

## Installation

### 1. Install Dependencies

```bash
cd cuts-by-malenny
npm install
```

### 2. Set Up Database

1. Create a PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE cuts_by_malenny;
\q
```

2. Run the schema:
```bash
psql -U postgres -d cuts_by_malenny -f database/schema.sql
```

3. Run migrations:
```bash
psql -U postgres -d cuts_by_malenny -f database/migrations/001_double_booking_protection.sql
```

### 3. Configure Environment

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your values:
   - Database credentials
   - JWT secret (generate a random string)
   - Stripe keys (if using payments)
   - Twilio credentials (if using SMS)

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 3000 (or the PORT specified in .env).

## Default Login

After running the schema, a default admin user is created:
- **Username:** `admin`
- **Password:** `admin123`

**IMPORTANT:** Change this password immediately after first login!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Create new user (admin only)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Services
- `GET /api/services` - List all services

### Appointments
- `GET /api/appointments/available-slots?date=YYYY-MM-DD` - Get available time slots
- `POST /api/appointments/book` - Book appointment (public)
- `GET /api/appointments` - List appointments (auth required)
- `GET /api/appointments/today` - Today's appointments
- `GET /api/appointments/upcoming` - Upcoming appointments
- `GET /api/appointments/:id` - Get appointment details
- `POST /api/appointments` - Create appointment (admin)
- `PATCH /api/appointments/:id/status` - Update status
- `PATCH /api/appointments/:id/deposit` - Update deposit status

### Customers
- `GET /api/customers/search?q=query` - Search customers
- `GET /api/customers/:id` - Get customer with full profile
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `POST /api/customers/:id/hair-profile` - Create/update hair profile
- `POST /api/customers/:id/allergies` - Add allergy
- `POST /api/customers/:id/hair-goals` - Add hair goal
- `POST /api/customers/:id/consultations` - Add consultation
- `POST /api/customers/:id/chemical-services` - Add chemical service

## Double-Booking Protection

The system uses three layers of protection:

1. **Advisory Locks** - Prevents concurrent booking attempts on the same slot
2. **Row-Level Locking** - Uses `SELECT FOR UPDATE` during transactions
3. **Database Constraint** - Unique index prevents confirmed appointments at the same time

## Frontend Integration

The frontend files are served statically. Access the site at:
- Customer site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin-login.html`

## Production Deployment

### Environment Variables
Set `NODE_ENV=production` and configure all production values in `.env`.

### Database
Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.) for production.

### Security
- Change default admin password
- Use strong JWT secret
- Enable HTTPS
- Set up firewall rules
- Regular database backups

### Process Management
Use PM2 or similar to keep the server running:
```bash
npm install -g pm2
pm2 start server.js --name "cuts-by-malenny"
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure database exists

### Port Already in Use
- Change PORT in `.env`
- Or kill the process using port 3000

### CORS Errors
- Update FRONTEND_URL in `.env` to match your frontend URL

## Support

For issues or questions, contact support or check the documentation.
