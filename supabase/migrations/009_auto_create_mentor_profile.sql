-- 009: Create trigger to auto-create mentor_profile when role is set to mentor
-- This ensures mentor_profiles record exists when a user has role='mentor'

-- Function to create mentor_profile when user role is set to mentor
CREATE OR REPLACE FUNCTION public.handle_mentor_profile_creation()
RETURNS TRIGGER AS $$
BEGIN
    -- If role is being set to 'mentor' and mentor_profile doesn't exist, create it
    IF NEW.role = 'mentor' THEN
        INSERT INTO public.mentor_profiles (user_id, specialties, introduction, status)
        VALUES (NEW.id, '[]'::jsonb, NULL, 'active')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on profiles table
DROP TRIGGER IF EXISTS on_mentor_role_set ON public.profiles;
CREATE TRIGGER on_mentor_role_set
    AFTER INSERT OR UPDATE OF role ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_mentor_profile_creation();

-- Backfill: Create mentor_profiles for existing mentors who don't have one
INSERT INTO public.mentor_profiles (user_id, specialties, introduction, status)
SELECT p.id, '[]'::jsonb, NULL, 'active'
FROM public.profiles p
WHERE p.role = 'mentor'
  AND NOT EXISTS (
    SELECT 1 FROM public.mentor_profiles mp WHERE mp.user_id = p.id
  );
