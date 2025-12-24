-- ADR-005: Storage Buckets and Policies
-- Create storage buckets and apply RLS policies

-- ============================================================================
-- CREATE BUCKETS
-- ============================================================================

-- 1. avatars bucket (public, 1MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. chat-images bucket (private, 5MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'chat-images',
    'chat-images',
    false,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Avatars bucket policies
CREATE POLICY "Avatars are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Chat images bucket policies
CREATE POLICY "Chat images viewable by room participants"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'chat-images' AND
        EXISTS (
            SELECT 1 FROM chat_rooms
            WHERE (student_id = auth.uid() OR mentor_id = auth.uid())
            AND id::text = (storage.foldername(name))[1]
        )
    );

CREATE POLICY "Room participants can upload chat images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'chat-images' AND
        EXISTS (
            SELECT 1 FROM chat_rooms
            WHERE (student_id = auth.uid() OR mentor_id = auth.uid())
            AND id::text = (storage.foldername(name))[1]
        )
    );

CREATE POLICY "Users can delete own chat images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'chat-images' AND
        auth.uid()::text = (storage.foldername(name))[2]
    );
