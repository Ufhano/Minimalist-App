-- Optional: Run if you already have 001_initial_schema applied
-- Removes grayscale from theme constraint
ALTER TABLE users_profile DROP CONSTRAINT IF EXISTS users_profile_theme_check;
ALTER TABLE users_profile ADD CONSTRAINT users_profile_theme_check
  CHECK (theme IN ('light', 'dark'));
