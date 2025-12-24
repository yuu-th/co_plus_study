-- ADR-005: Database Webhook for Badge Checking
-- Call check-badges Edge Function when a diary post is created

-- ============================================================================
-- WEBHOOK FOR BADGE CHECKING
-- ============================================================================

-- Note: This webhook needs to be configured in Supabase Dashboard
-- Path: Database → Webhooks → Create a new hook
-- 
-- Configuration:
-- - Name: check-badges-on-diary-post
-- - Table: diary_posts
-- - Events: INSERT
-- - HTTP Request:
--   - Method: POST
--   - URL: https://<your-project-ref>.supabase.co/functions/v1/check-badges
--   - HTTP Headers:
--     - Authorization: Bearer <your-anon-key>
-- 
-- This file serves as documentation only.
-- Actual webhook must be created via Supabase Dashboard or API.

-- Alternative: PostgreSQL Function + Trigger (if webhooks not available)
-- Uncomment below if you want to use pg_net for HTTP calls from PostgreSQL

/*
CREATE OR REPLACE FUNCTION trigger_check_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- Make async HTTP call to Edge Function
  -- Requires pg_net extension
  PERFORM
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/check-badges',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_anon_key')
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_badges_after_diary_post
  AFTER INSERT ON diary_posts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_check_badges();
*/
