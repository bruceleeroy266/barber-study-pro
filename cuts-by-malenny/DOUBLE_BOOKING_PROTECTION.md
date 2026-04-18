# Double-Booking Protection

This document explains the bulletproof double-booking protection implemented for the Cuts by Malenny booking system.

## Overview

Three layers of protection prevent the same time slot from being booked twice:

### Layer 1: Advisory Lock (Application Level)
- Uses PostgreSQL advisory locks to prevent concurrent transactions from booking the same slot
- Lock is tied to the specific date/time combination
- Automatically released when transaction completes (even on error)
- Returns a user-friendly error if another customer is currently booking that slot

### Layer 2: Row-Level Locking (Transaction Level)
- `SELECT FOR UPDATE` locks any existing rows for the date/time during the transaction
- Prevents race conditions where two transactions check availability simultaneously
- Ensures only one transaction can proceed with booking a given slot

### Layer 3: Database Constraint (Physical Level)
- Partial unique index: `UNIQUE (appointment_date, appointment_time) WHERE status = 'confirmed'`
- Makes it physically impossible to have two confirmed appointments at the same time
- PostgreSQL will reject any INSERT that violates this constraint
- Final safety net that catches anything the application layers miss

## Implementation Details

### Database Migration

Run the migration to add the unique constraint:

```bash
psql -U postgres -d cuts_by_malenny -f migrations/001_double_booking_protection.sql
```

Or run the SQL directly in pgAdmin.

### How It Works

1. Customer selects date/time and submits booking
2. Transaction begins with `BEGIN`
3. Advisory lock acquired for the slot (prevents concurrent bookings)
4. Check for existing confirmed booking with `FOR UPDATE` lock
5. If slot taken → rollback and return 409 error
6. If slot available → proceed with customer lookup/creation
7. Insert appointment (database constraint is final check)
8. If INSERT violates unique constraint → catch error and return 409
9. Commit transaction and release all locks

### Error Handling

The system returns appropriate HTTP status codes:

- **409 Conflict**: Slot is taken or being booked by another customer
- **400 Bad Request**: Missing required fields or invalid data
- **500 Internal Server Error**: Database or server error

### Why Three Layers?

| Layer | Purpose | Handles |
|-------|---------|---------|
| Advisory Lock | Prevent concurrent transaction starts | Two customers clicking "Book" at exact same millisecond |
| FOR UPDATE | Lock rows during transaction | One transaction checking while another is mid-insert |
| Unique Constraint | Physical database enforcement | Any edge cases missed by application logic |

## Testing

To verify the protection works:

1. Try booking the same slot from two different browsers/devices simultaneously
2. One should succeed, the other should get a 409 error
3. Check logs to see which layer caught the conflict

## Maintenance

The partial unique index only applies to `status = 'confirmed'`. This means:
- Cancelled appointments don't block the slot
- No-show appointments can be rebooked
- Completed appointments from the past don't affect future bookings

## Rollback

If you need to remove the protection:

```sql
DROP INDEX idx_unique_confirmed_slot;
```

The application-level locks (advisory and row-level) will still function without the database constraint.
