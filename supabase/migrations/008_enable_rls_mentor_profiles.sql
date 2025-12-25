-- 008: Enable RLS on mentor_profiles and ensure policies exist
-- This migration ensures mentor_profiles has RLS enabled and proper policies

-- Enable RLS on mentor_profiles (idempotent)
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Mentor profiles are viewable by authenticated users" ON mentor_profiles;
DROP POLICY IF EXISTS "Mentors can update own mentor profile" ON mentor_profiles;
DROP POLICY IF EXISTS "Mentors can create own mentor profile" ON mentor_profiles;

-- Recreate policies
-- Anyone authenticated can view mentor profiles
CREATE POLICY "Mentor profiles are viewable by authenticated users"
    ON mentor_profiles FOR SELECT
    TO authenticated
    USING (true);

-- Mentors can update their own mentor profile
CREATE POLICY "Mentors can update own mentor profile"
    ON mentor_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Mentors can create their own mentor profile
CREATE POLICY "Mentors can create own mentor profile"
    ON mentor_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
