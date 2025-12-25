-- Seed: Insert test mentor profile
-- Run this after creating a mentor account via the app
-- Replace the user_id with the actual mentor's auth.uid

-- Example: Insert mentor profile for test mentor user
-- First, check if the mentor already has a profile
INSERT INTO mentor_profiles (user_id, specialties, introduction, status)
SELECT 
    '0ef4c72d-a448-4373-9281-09ee8a35b71f',  -- Replace with actual mentor user_id from profiles table
    '["数学", "英語"]'::jsonb,
    'よろしくお願いします。',
    'active'
WHERE NOT EXISTS (
    SELECT 1 FROM mentor_profiles 
    WHERE user_id = '0ef4c72d-a448-4373-9281-09ee8a35b71f'
);

-- To find mentor user_ids, run:
-- SELECT id, display_name, role FROM profiles WHERE role = 'mentor';
