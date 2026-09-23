-- Remove Google Drive/OAuth Integration
-- Drops the google_connections and oauth_states tables, along with the
-- Google-specific trigger function. These legacy objects may already be absent
-- on a clean migration replay, so every drop is idempotent.

-- Dropping the table automatically removes any trigger attached to it.
DROP TABLE IF EXISTS oauth_states;
DROP TABLE IF EXISTS google_connections CASCADE;

-- Drop the legacy trigger function after its table/trigger dependencies are gone.
DROP FUNCTION IF EXISTS update_google_connections_updated_at();
