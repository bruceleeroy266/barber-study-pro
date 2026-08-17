-- Remove Google Drive/OAuth Integration
-- Drops the google_connections and oauth_states tables, along with the
-- Google-specific trigger function. These tables were created for a Google
-- Drive integration that has been removed from the product roadmap.
--
-- Tables dropped:
--   - google_connections (20260816000000_google_connections.sql)
--   - oauth_states (20260816000001_oauth_states.sql)
-- Function dropped:
--   - update_google_connections_updated_at() (created by google_connections migration)

-- Drop trigger first (depends on table and function)
DROP TRIGGER IF EXISTS trigger_google_connections_updated_at ON google_connections;

-- Drop function
DROP FUNCTION IF EXISTS update_google_connections_updated_at();

-- Drop tables (order matters: oauth_states references auth.users, google_connections references auth.users)
DROP TABLE IF EXISTS oauth_states;
DROP TABLE IF EXISTS google_connections;
