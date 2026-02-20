-- Minimalist App: Initial Database Schema
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS_PROFILE
-- Extended profile for auth.users
-- ============================================
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  motivation_anchor TEXT,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROFILES (Launcher profiles: Work, Personal, etc.)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  schedule_start TIME,
  schedule_end TIME,
  days_active TEXT[] DEFAULT ARRAY['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- APPS
-- User's app list with category and limits
-- ============================================
CREATE TABLE apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  package_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('allowed', 'restricted', 'blocked')),
  daily_limit_minutes INT,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, package_name)
);

-- ============================================
-- USAGE_LOGS
-- Tracks app opens, intentions, reflections
-- ============================================
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id UUID REFERENCES apps(id) ON DELETE SET NULL,
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  intention TEXT,
  reflection TEXT,
  duration_seconds INT,
  app_name TEXT,
  package_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FOCUS_SESSIONS
-- Pomodoro / deep work sessions
-- ============================================
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_minutes INT,
  session_type TEXT CHECK (session_type IN ('pomodoro', 'deep', 'custom')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STREAKS
-- Daily screen time goals and streaks
-- ============================================
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_screen_time_minutes INT DEFAULT 0,
  goal_met BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_apps_user_id ON apps(user_id);
CREATE INDEX idx_apps_profile_id ON apps(profile_id);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_opened_at ON usage_logs(opened_at);
CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX idx_streaks_user_date ON streaks(user_id, date);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "users_profile_select" ON users_profile FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_profile_insert" ON users_profile FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_profile_update" ON users_profile FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "profiles_delete" ON profiles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "apps_select" ON apps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "apps_insert" ON apps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "apps_update" ON apps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "apps_delete" ON apps FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "usage_logs_select" ON usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usage_logs_insert" ON usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "usage_logs_update" ON usage_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "usage_logs_delete" ON usage_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "focus_sessions_select" ON focus_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "focus_sessions_insert" ON focus_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "focus_sessions_update" ON focus_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "focus_sessions_delete" ON focus_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "streaks_select" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "streaks_insert" ON streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "streaks_update" ON streaks FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users_profile (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
