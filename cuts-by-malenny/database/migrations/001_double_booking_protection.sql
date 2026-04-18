-- Migration: Double-booking protection
-- This migration adds three layers of protection against double-booking

-- Layer 1: Advisory locks (application level)
-- Advisory locks are used in the application code to prevent concurrent bookings

-- Layer 2: Row-level locking
-- The application uses SELECT FOR UPDATE to lock rows during transactions

-- Layer 3: Database constraint (this file)
-- Partial unique index prevents multiple confirmed appointments at the same time

-- Drop existing index if it exists (for idempotency)
DROP INDEX IF EXISTS idx_unique_appointment_slot;

-- Create partial unique index
-- This ensures no two confirmed appointments can exist at the same date/time
CREATE UNIQUE INDEX idx_unique_appointment_slot 
ON appointments (appointment_date, appointment_time) 
WHERE status = 'confirmed';

-- Add comment explaining the constraint
COMMENT ON INDEX idx_unique_appointment_slot IS 
'Prevents double-booking: only one confirmed appointment allowed per time slot';

-- Create function to check availability with advisory lock
CREATE OR REPLACE FUNCTION check_slot_availability(
    p_date DATE,
    p_time TIME
) RETURNS BOOLEAN AS $$
DECLARE
    v_is_available BOOLEAN;
BEGIN
    -- Check if slot is already booked
    SELECT NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE appointment_date = p_date 
        AND appointment_time = p_time 
        AND status = 'confirmed'
    ) INTO v_is_available;
    
    RETURN v_is_available;
END;
$$ LANGUAGE plpgsql;

-- Create function to safely book appointment with all protections
CREATE OR REPLACE FUNCTION book_appointment_safe(
    p_customer_id UUID,
    p_service_id UUID,
    p_date DATE,
    p_time TIME,
    p_notes TEXT DEFAULT NULL
) RETURNS TABLE (
    success BOOLEAN,
    appointment_id UUID,
    error_message TEXT
) AS $$
DECLARE
    v_appointment_id UUID;
    v_advisory_lock_id BIGINT;
BEGIN
    -- Generate advisory lock ID from date and time
    v_advisory_lock_id := (EXTRACT(EPOCH FROM p_date)::BIGINT * 1000000) + 
                          (EXTRACT(EPOCH FROM p_time)::BIGINT);
    
    -- Try to acquire advisory lock (prevents concurrent bookings)
    IF NOT pg_try_advisory_lock(v_advisory_lock_id) THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Slot is currently being booked by another user'::TEXT;
        RETURN;
    END IF;
    
    BEGIN
        -- Check if slot is available
        IF NOT check_slot_availability(p_date, p_time) THEN
            RETURN QUERY SELECT FALSE, NULL::UUID, 'Slot is already booked'::TEXT;
            RETURN;
        END IF;
        
        -- Create appointment
        INSERT INTO appointments (
            customer_id, service_id, appointment_date, appointment_time, 
            status, notes
        ) VALUES (
            p_customer_id, p_service_id, p_date, p_time, 
            'confirmed', p_notes
        ) RETURNING id INTO v_appointment_id;
        
        -- Release advisory lock
        PERFORM pg_advisory_unlock(v_advisory_lock_id);
        
        RETURN QUERY SELECT TRUE, v_appointment_id, NULL::TEXT;
        
    EXCEPTION 
        WHEN unique_violation THEN
            -- Release advisory lock on error
            PERFORM pg_advisory_unlock(v_advisory_lock_id);
            RETURN QUERY SELECT FALSE, NULL::UUID, 'Slot is already booked (constraint violation)'::TEXT;
        WHEN OTHERS THEN
            -- Release advisory lock on error
            PERFORM pg_advisory_unlock(v_advisory_lock_id);
            RETURN QUERY SELECT FALSE, NULL::UUID, SQLERRM::TEXT;
    END;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comments
COMMENT ON FUNCTION check_slot_availability IS 
'Checks if a time slot is available for booking';

COMMENT ON FUNCTION book_appointment_safe IS 
'Books an appointment with triple protection: advisory lock, availability check, and unique constraint';
