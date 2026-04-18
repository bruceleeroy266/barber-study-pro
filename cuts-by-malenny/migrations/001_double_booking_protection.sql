-- Migration: Add bulletproof double-booking protection
-- This makes it physically impossible to double-book at the database level

-- Step 1: Add a partial unique index for confirmed appointments only
-- This allows cancelled/no_show appointments to exist without blocking the slot
CREATE UNIQUE INDEX idx_unique_confirmed_slot 
ON appointments (appointment_date, appointment_time) 
WHERE status = 'confirmed';

-- Step 2: Add a function to acquire an advisory lock for the time slot
-- This prevents race conditions during the booking transaction
CREATE OR REPLACE FUNCTION acquire_slot_lock(p_date DATE, p_time TIME)
RETURNS BOOLEAN AS $$
DECLARE
    lock_id BIGINT;
BEGIN
    -- Generate a unique lock ID from date and time
    -- Using hash to convert date+time into a bigint
    lock_id := hashtextextended(p_date::text || p_time::text, 0);
    
    -- Try to acquire the lock (returns true if acquired, false if already held)
    RETURN pg_try_advisory_xact_lock(lock_id);
END;
$$ LANGUAGE plpgsql;

-- Step 3: Add comment explaining the protection
COMMENT ON INDEX idx_unique_confirmed_slot IS 
'Prevents double-booking: only one confirmed appointment per date/time slot';

-- Note: Run this migration when no bookings are being made
-- The partial index will fail if duplicate confirmed appointments already exist
