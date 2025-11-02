-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updates table
CREATE TABLE IF NOT EXISTS updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  week_start_date DATE NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_updates_user_id ON updates(user_id);
CREATE INDEX IF NOT EXISTS idx_updates_created_at ON updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_updates_week_start_date ON updates(week_start_date);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read all user data" ON users
  FOR SELECT
  USING (true);

-- Policies for updates table
CREATE POLICY "Users can read all updates" ON updates
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own updates" ON updates
  FOR INSERT
  WITH CHECK (true);
